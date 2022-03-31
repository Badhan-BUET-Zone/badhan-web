<template>
  <div>
    <PageTitle></PageTitle>
    <ContainerFlat>
      <v-card-text>
      <v-bottom-sheet
          v-model="filterListMenu"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              color="secondary"
              rounded
              small
              v-bind="attrs"
              v-on="on"
          >
            <v-icon left>
              mdi-filter-outline
            </v-icon>
            Filters
          </v-btn>
        </template>
        <v-sheet
            class="text-center"
        >
          <Button :icon="'mdi-close'" :text="'Close'" :click="()=>{this.filterListMenu = false}"
                  :color="'secondary'"></Button>
          <div style="height: 75vh;overflow-y: scroll;">
            <Filters :reset-clicked="resetClicked" :search-clicked="searchClicked"></Filters>
          </div>
        </v-sheet>
      </v-bottom-sheet>
      <Button :icon="'mdi-refresh'" :text="'Reload'" :click="getAllActiveDonors" :color="'primary'"></Button>
      <v-checkbox @change="checkBoxChanged" v-model="markedByMe" label="Show donors marked by me"></v-checkbox>
      </v-card-text>
    </ContainerFlat>

    <div ref="noPostFoundHolder" id="noPostFoundHolder">

    </div>

    <div style="max-width: 700px" class="mx-auto" v-if="activeDonorsLoader">
      <PersonCardNewSkeleton></PersonCardNewSkeleton>
      <PersonCardNewSkeleton></PersonCardNewSkeleton>
      <PersonCardNewSkeleton></PersonCardNewSkeleton>
    </div>

    <div style="max-width: 700px" class="mx-auto" v-else>
      <PersonCardNew v-for="donor in activeDonors" :key="donor._id" :donor="donor">

      </PersonCardNew>
    </div>
    <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import PageTitle from '../components/PageTitle'
import ContainerFlat from '../components/Wrappers/ContainerFlat'
import { mapActions, mapGetters } from 'vuex'
import PersonCardNew from '../components/PersonCardNew'
import Filters from '../components/Filters'
import { bloodGroups, halls } from '../mixins/constants'
import PersonCardNewSkeleton from '../components/PersonCardNewSkeleton'
import Button from '../components/UI Components/Button'
import NoticeCard from '../components/UI Components/NoticeCard'
import Vue from 'vue'
export default {
  name: 'ActiveDonors',
  components: { PersonCardNewSkeleton, Filters, PersonCardNew, PageTitle, ContainerFlat, Button },
  methods: {
    ...mapActions('activeDonors', ['fetchActiveDonors']),
    ...mapActions('activeDonors', ['fetchActiveDonors']),
    async checkBoxChanged (lastValueOfCheckbox) {
      await this.search({
        ...this.lastSearched,
        markedByMe: lastValueOfCheckbox
      })
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
    },

    createNoDonorComponent () {
      const NoticeCardClass = Vue.extend(NoticeCard)
      const instance = new NoticeCardClass()
      instance.$mount() // pass nothing
      this.$refs.noPostFoundHolder.appendChild(instance.$el)
    },
    clearNoDonorComponent () {
      if (this.$refs.noPostFoundHolder.children.length !== 0) {
        this.$refs.noPostFoundHolder.removeChild(this.$refs.noPostFoundHolder.children[0])
      }
    },
    async getAllActiveDonors () {
      this.markedByMe = false
      const payloadForGetActiveDonors = {
        bloodGroup: -1,
        hall: 5,
        batch: '',
        name: '',
        address: '',
        isAvailable: true,
        isNotAvailable: true,
        availableToAll: true,
        markedByMe: false,
        availableToAllOrHall: true
      }
      this.lastSearched = payloadForGetActiveDonors
      await this.search(payloadForGetActiveDonors)
    },
    async searchClicked (searchQueries) {
      let inputBatch = 0

      if (searchQueries.batch === null) {
        searchQueries.batch = ''
      }

      inputBatch = parseInt(searchQueries.batch)
      if (searchQueries.batch.length === 0) {
        inputBatch = ''
      }

      // name input validation
      let inputName = this.processName(searchQueries.name)
      if (inputName.length === 0) {
        inputName = ''
      }

      let inputAddress = this.processName(searchQueries.address)
      if (inputAddress.length === 0) {
        inputAddress = ''
      }
      const payloadForGetActiveDonors = {
        name: inputName,
        bloodGroup: bloodGroups.indexOf(searchQueries.bloodGroup),
        batch: inputBatch.toString(),
        hall: halls.indexOf(searchQueries.hall),
        isAvailable: searchQueries.availability,
        isNotAvailable: searchQueries.notAvailability,
        address: inputAddress,
        availableToAll: searchQueries.availableToAll === 'AvailableToAll',
        markedByMe: this.markedByMe,
        availableToAllOrHall: false
      }
      this.lastSearched = payloadForGetActiveDonors
      this.filterListMenu = false
      await this.search(payloadForGetActiveDonors)
    },
    async search (payloadForGetActiveDonors) {
      this.activeDonorsLoader = true
      this.clearNoDonorComponent()
      await this.fetchActiveDonors(payloadForGetActiveDonors)
      this.activeDonors = this.getActiveDonors
      if (this.activeDonors.length === 0) {
        this.createNoDonorComponent()
      }
      this.activeDonorsLoader = false
    },
    resetClicked () {}
  },
  computed: {
    ...mapGetters('activeDonors', ['getActiveDonors'])

  },
  mounted () {
    this.getAllActiveDonors()
  },
  data: () => {
    return {
      activeDonors: [],
      activeDonorsLoader: false,
      filterListMenu: false,
      markedByMe: false,
      lastSearched: null
    }
  }
}
</script>

<style scoped>

</style>
