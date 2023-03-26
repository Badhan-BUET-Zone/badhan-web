<template>
  <div :key="'home'">
    <v-fab-transition >
      <v-btn
          v-scroll="onScroll"
          v-show="showFab"
          color="secondary"
          dark
          fixed
          bottom
          right
          fab
          @click="fabClicked"
      >
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-fab-transition>
    <div>
      <v-row>
        <v-col cols="12" lg="4">
          <Filters :reset-clicked="clearFields" :search-clicked="searchClickedFromFilterComponent"></Filters>
        </v-col>
        <v-col cols="12" lg="8" id="results">
          <div v-if="isSearchLoading" :key="'searchLoading'">
            <LoadingMessage/>
          </div>
          <div style="height: fit-content" v-if="isSearchResultShown">
            <div >
              <v-alert dense class="rounded-xl" color="tertiary">
                <div>
                  Found {{ getNumberOfDonors }} donors
                </div>
              </v-alert>
            </div>
            <div>
              <div>
                <v-row no-gutters>
                  <v-col>
                    <v-btn @click="downloadInWeb" small
                           color="secondary" rounded class="mb-4" style="width: 100%">
                      <v-icon left>
                        mdi-download
                      </v-icon>
                      Download Report
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-tooltip
                        v-model="showTooltip"
                        top
                    >
                      <template v-slot:activator="{ attrs }">
                        <v-btn small color="secondary" rounded class="mb-4" style="width: 100%" v-bind="attrs"
                               @click="shareClicked">
                          <v-icon left>
                            mdi-share
                          </v-icon>
                          Share Search Results
                        </v-btn>
                      </template>
                      <span>Copied to clipboard</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </div>
              <div v-for="(obj, index) in getPersonGroups" :key="index">
                <v-alert dense class="rounded-xl" color="tertiary">
                    Batch {{ obj.batch }}:
                </v-alert>

                <person-card
                    :id="'personCardId_'+person._id"
                    v-for="(person) in obj.people"
                    :key="person._id"
                    :person="person"
                ></person-card>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import PersonCard from '../components/Home/PersonCard'
import { bloodGroups, halls } from '@/mixins/constants'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { minLength, maxLength, numeric, required } from 'vuelidate/lib/validators'
import { isGuestEnabled } from '@/api'
import { convertObjectToCSV, textFileDownloadInWeb, processPersonsForReport } from '@/mixins/helpers'
import Filters from '../components/Filters'
import { environmentService } from '@/mixins/environment'
import LoadingMessage from '@/components/LoadingMessage.vue'

export default {
  name: 'HomePage',
  computed: {
    ...mapGetters(['getPersonGroups', 'isSearchResultShown', 'getNumberOfDonors', 'getPersons', 'getSearchedHall', 'getDesignation', 'getHall', 'isSearchLoading']),
    isGuestEnabled () {
      return isGuestEnabled()
    },
    availableHalls () {
      if (this.getDesignation !== null) {
        if (this.getDesignation === 3) {
          return halls.slice(0, 7)
        } else {
          return [halls[this.getHall]]
        }
      }
      return halls
    },
    batchErrors () {
      const errors = []
      if (!this.$v.batch.$dirty) return errors
      !this.$v.batch.minLength && errors.push('Batch number must be of 2 digits')
      !this.$v.batch.maxLength && errors.push('Batch number must be of 2 digits')
      !this.$v.batch.numeric && errors.push('Batch number must be numeric')
      return errors
    },
    hallErrors () {
      const errors = []
      if (!this.$v.hall.$dirty) return errors
      !this.$v.hall.required && errors.push('Hall is required')
      !this.$v.hall.permission && errors.push('You are not allowed to create donor for this hall')
      return errors
    }

  },
  components: {
    LoadingMessage,
    Filters,
    'person-card': PersonCard,
  },
  data: function () {
    return {
      name: '',
      bloodGroup: -1,
      batch: '',
      address: '',
      hall: halls[this.$store.getters.getHall],
      availability: true,
      notAvailability: false,
      download: false,

      // GUI flags
      filterShown: true,

      // imported constants
      halls,
      bloodGroups,

      showTooltip: false,
      showFilterHelpTooltip: false,

      radios: 'AvailableToAll',
      showFab: false,

      downloadCSVMessageFlag: false,
      downloadCSVLoader: false
    }
  },
  validations: () => {
    return {
      batch: {
        minLength: minLength(2),
        maxLength: maxLength(2),
        numeric
      },
      hall: {
        required,
        permission (hall) {
          // COVID DATABASE
          return !(this.getHall !== this.halls.indexOf(hall) && this.halls.indexOf(hall) !== 7 && this.halls.indexOf(hall) !== 8 && this.getDesignation !== 3)
        }
      }
    }
  },
  async mounted () {
    const query = this.$route.query

    this.name = query.name ? query.name : ''
    this.bloodGroup = query.bloodGroup ? query.bloodGroup : -1
    this.batch = query.batch ? query.batch : ''
    this.address = query.address ? query.address : ''
    this.hall = query.hall ? query.hall : halls[this.$store.getters.getHall]
    this.availability = query.availability !== 'false'
    this.notAvailability = query.notAvailability === 'true'
    this.radios = query.radios === 'SpecifyHall' ? 'SpecifyHall' : 'AvailableToAll'
    this.download = query.download === 'true'

    if (Object.keys(this.$route.query).length === 9) {
      await this.searchClicked()
      if (this.download) {
        this.downloadInWeb()
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    this.resetSearchResults()
    next()
  },
  methods: {
    ...mapActions(['search']),
    ...mapActions('notification', ['notifyError']),
    ...mapMutations(['hideSearchResults', 'resetSearchResults']),
    ...mapActions(['logout', 'logoutAll', 'requestRedirectionToken']),
    ...mapMutations('messageBox', ['setMessage']),
    async searchClickedFromFilterComponent (filterValues) {
      this.name = filterValues.name
      this.batch = filterValues.batch
      this.address = filterValues.address
      this.bloodGroup = filterValues.bloodGroup
      this.hall = filterValues.hall
      this.radios = filterValues.availableToAll
      this.availability = filterValues.availability
      this.notAvailability = filterValues.notAvailability
      await this.searchClicked()
    },
    downloadInWeb () {
      const processedPersons = processPersonsForReport(this.getPersons)
      const keys = ['name', 'Hall', 'studentId', 'Last Donation', 'Blood Group', 'address', 'roomNumber', 'Donation Count']
      if (this.getDesignation === 3) {
        keys.push('comment')
        keys.push('phone')
      }
      const csv = convertObjectToCSV(processedPersons, keys, ',')
      textFileDownloadInWeb(csv, 'badhan_' + this.getSearchedHall + '.csv')
      this.setMessage('CSV downloaded')
    },

    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.showFab = top > 20
    },
    async searchClicked () {
      await this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }

      let inputBatch = 0
      if (this.batch === null) {
        this.batch = ''
      }

      inputBatch = parseInt(this.batch)
      if (this.batch.length === 0) {
        inputBatch = ''
      }

      // name input validation
      let inputName = this.processName(this.name)
      if (inputName.length === 0) {
        inputName = ''
      }

      let inputAddress = this.processName(this.address)
      if (inputAddress.length === 0) {
        inputAddress = ''
      }

      this.$vuetify.goTo('#results')
      this.showFab = true

      await this.search({
        inputName: inputName,
        bloodGroup: this.bloodGroup,
        inputBatch: inputBatch,
        hall: this.hall,
        availability: this.availability,
        notAvailability: this.notAvailability,
        inputAddress: inputAddress,
        availableToAll: this.radios === 'AvailableToAll'
      })
    },

    shareClicked () {
      const routeData = this.$router.resolve({
        name: 'Home',
        query: {
          name: this.name,
          bloodGroup: this.bloodGroup,
          batch: this.batch,
          address: this.address,
          hall: this.hall,
          availability: this.availability,
          notAvailability: this.notAvailability,
          radios: this.radios,
          download: false
        }
      })
      // navigator.clipboard.writeText(process.env.VUE_APP_FRONTEND_BASE+routeData.href);
      this.$copyText(environmentService.getFrontendBaseURL()+ '/' + routeData.href).then((_e) => {
        this.showTooltip = true
        setTimeout(() => {
          this.showTooltip = false
        }, 2000)
      })
    },

    async downloadInMobileClicked () {
      this.downloadCSVLoader = true
      const redirectionTokenResponse = await this.requestRedirectionToken()
      this.downloadCSVLoader = false
      if (redirectionTokenResponse.status !== 201) return
      const searchRouteData = this.$router.resolve({
        name: 'Home',
        query: {
          name: this.name,
          bloodGroup: this.bloodGroup,
          batch: this.batch,
          address: this.address,
          hall: this.hall,
          availability: this.availability,
          notAvailability: this.notAvailability,
          radios: this.radios,
          download: true
        }
      })
      const redirectionURL = searchRouteData.href.substr(1, searchRouteData.href.length - 1)
      const routeData = this.$router.resolve({
        name: 'RedirectionPage',
        query: { token: redirectionTokenResponse.data.token, payload: redirectionURL }
      })
      window.open(environmentService.getFrontendBaseURL() + '/' + routeData.href, '_blank')
    },

    clearFields () {
      this.$v.$reset()
      this.batch = ''
      this.hall = halls[this.getHall]
      this.bloodGroup = -1
      this.name = ''
      this.error = ''
      this.address = ''
      this.hideSearchResults()
      this.showFab = false
    },

    fabClicked () {
      this.$vuetify.goTo(0)
      this.showFab = false
    },

    processName (name) {
      if (name === null) {
        return ''
      }
      const newName = name.toLowerCase()
      let nameWithoutWs = ''
      for (let i = 0; i < newName.length; i++) {
        const currentChar = newName.charAt(i)
        if (currentChar < 'a' || currentChar > 'z') {
          continue
        }
        nameWithoutWs += currentChar
      }
      return nameWithoutWs
    }
  }

}
</script>

<style scoped>

</style>
