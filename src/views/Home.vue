<template>
  <div :key="'home'">
<!--    <PageTitle :title="$route.meta.title"></PageTitle>-->
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
        <v-col cols="12" sm="4">
          <v-card class="rounded-xl">
            <v-card-title>
              Filters
              <HelpTooltip>
                <div>
                  You may choose any one of the following options.
                  <ul>
                    <li><b>Name: </b>Search any donor by name</li>
                    <li><b>Blood group: </b>Search any donor by blood group</li>
                    <li><b>Batch: </b>Donors from the specified batch will be fetched. Please enter a valid numeric two digit batch number (e.g. 16, 17 etc.)</li>
                    <li><b>Address/ Comment: </b>Those donors will be shown whose comment or address field consists your written text</li>
                    <li><b>Public Data: </b>If you choose this option, donors who are marked as public data will be fetched. Donors who were previously in "Attached/Covid" database are in this search criteria</li>
                    <li><b>Specify Hall: </b>If you choose this option, donors of specified hall will be fetched. You can only search your own hall for donors in such case.</li>
                    <li><b>Available: </b>If you specify this option, donors who have given blood before 120 days will be fetched. These donors are basically available for donations.</li>
                    <li><b>Not Available: </b>If you specify this option, donors who have given blood in a span of 120 days will be shown</li>
                  </ul>
                </div>
              </HelpTooltip>
            </v-card-title>

            <!--    Main Filters-->

            <v-form>
              <v-container>
                <!--        Input field for name-->
                <v-text-field
                    rounded
                    v-model="name"
                    :hint="'Search any donor by name'"
                    outlined
                    label="Name of Donor"
                    clearable
                    dense
                ></v-text-field>

                <v-select
                    rounded
                    v-model="bloodGroup"
                    :items="bloodGroups"
                    label="Blood Group"
                    outlined
                    dense
                ></v-select>

                <!--        Input field for batch-->
                <v-text-field
                    rounded
                    v-model="batch"
                    outlined
                    label="Batch"
                    clearable
                    dense
                    @blur="$v.batch.$touch()"
                    :error-messages="batchErrors"
                ></v-text-field>


                <!--        Input field for hall-->
                <v-text-field
                    rounded
                    outlined
                    label="Address/ Comment"
                    clearable
                    v-model="address"
                    dense
                ></v-text-field>

                <v-radio-group row v-model="radios" dense>
                  <v-radio value="AvailableToAll">
                    <template v-slot:label>
                      Public Data
                    </template>
                  </v-radio>
                  <v-radio value="SpecifyHall">
                    <template v-slot:label>
                      Specify hall
                    </template>
                  </v-radio>
                </v-radio-group>
                <v-select
                    :disabled="radios!== 'SpecifyHall'"
                    rounded
                    v-model="hall"
                    :items="availableHalls"
                    label="Select Hall"
                    outlined
                    dense
                    @blur="$v.hall.$touch()" :error-messages="hallErrors"
                ></v-select>
                <v-row>
                  <v-col>
                    <v-checkbox
                        dense
                        v-model="availability"
                        :label="'Available'"
                    ></v-checkbox>
                  </v-col>
                  <v-col>
                    <v-checkbox
                        dense
                        v-model="notAvailability"
                        :label="'Not Available'"
                    ></v-checkbox>
                  </v-col>
                </v-row>

                <!--        A button to reset the form fields-->
                <v-btn rounded color="secondary" @click="clearFields">
                  <v-icon left>
                    mdi-refresh
                  </v-icon>
                  Reset
                </v-btn>

                <!--        The button for executing search-->
                <v-btn
                    rounded
                    color="primary"
                    :disabled="isSearchLoading || $v.$anyError"
                    :loading="isSearchLoading"
                    @click="searchClicked()"
                    class="ml-2"
                >
                  <v-icon left>
                    mdi-magnify
                  </v-icon>

                  Search
                </v-btn>
              </v-container>
            </v-form>
          </v-card>
        </v-col>
        <v-col cols="12" sm="8" id="results">
          <div v-if="isSearchLoading" :key="'searchLoading'">
            <div>
              <v-alert dense class="rounded-xl" color="grey">
                <div>
                  <v-skeleton-loader type="text"></v-skeleton-loader>
                </div>
              </v-alert>
            </div>
            <v-row no-gutters>
              <v-col>
                <v-btn small
                       color="secondary" disabled rounded class="mb-4" style="width: 100%">
                  <v-icon left>
                    mdi-download
                  </v-icon>
                  Download Report
                </v-btn>
              </v-col>
              <v-col>
                <v-btn small
                       color="secondary" disabled rounded class="mb-4" style="width: 100%">
                  <v-icon left>
                    mdi-download
                  </v-icon>
                  Share Search Results
                </v-btn>
              </v-col>
            </v-row>

            <div>
            <v-alert dense class="rounded-xl" color="grey">
              <div>
                <v-skeleton-loader type="text"></v-skeleton-loader>
              </div>
            </v-alert>
            </div>
            <SkeletonPersonCard
                v-for="i in 4"
                :key="i"
            ></SkeletonPersonCard>
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
<!--                <v-btn v-if="(isNative || $isDevelopmentEnv())&& !isGuestEnabled" @click="downloadInMobileClicked" small-->
<!--                       color="secondary" rounded class="mb-4" style="width: 100%">-->
<!--                  <v-icon left>-->
<!--                    mdi-web-->
<!--                  </v-icon>-->
<!--                  Download From Web-->
<!--                </v-btn>-->
                <v-row no-gutters>
                  <v-col>
                    <v-btn @click="downloadInAndroid" small
                           v-if="isNative"
                           color="secondary" rounded class="mb-4" style="width: 100%">
                      <v-icon left>
                        mdi-download
                      </v-icon>
                      Download Report
                    </v-btn>
                    <v-btn v-else @click="downloadInWeb" small
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
                      <template v-slot:activator="{ on, attrs }">
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
                    v-for="(person, personIndex) in obj.people"
                    :key="person._id"
                    :person="person"
                ></person-card>
              </div>
<!--              <v-btn x-small rounded disabled v-if="getDesignation ===3 || getDesignation ===2">Archive these donors-->
<!--              </v-btn>-->
            </div>
          </div>
        </v-col>
        <!--        <person-details></person-details>-->
      </v-row>
      <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import PersonDetails from "@/components/Home/PersonDetails";
import PageTitle from "@/components/PageTitle";
import PersonCard from "@/components/Home/PersonCard";
import {isNative} from '@/plugins/android_support';
import {bloodGroups, halls} from "@/mixins/constants";
import {mapActions, mapGetters, mapMutations} from "vuex";
import {minLength, maxLength, numeric, required} from 'vuelidate/lib/validators'
import {isGuestEnabled} from "../api";
import HelpTooltip from "@/components/UI Components/HelpTooltip";
import SkeletonPersonCard from "../components/Home/SkeletonPersonCard";
import {convertObjectToCSV, textFileDownloadInWeb,processPersonsForReport} from "../mixins/helpers";
import {downloadTextFile} from "../plugins/android_support";

export default {
  name: "ActiveSearch",
  computed: {
    ...mapGetters(['getPersonGroups', 'isSearchResultShown', 'getNumberOfDonors', 'getPersons', 'getSearchedHall', 'getDesignation', 'getHall', 'isSearchLoading']),
    showScroll(){
      return window.screenY>1000;
    },
    isGuestEnabled() {
      return isGuestEnabled();
    },
    isNative() {
      return isNative();
    },
    availableHalls() {
      if (this.getDesignation !== null) {
        if (this.getDesignation === 3) {
          return halls.slice(0, 7);
        } else {
          //covid support
          //return [halls[this.getHall], halls[7]];
          return [halls[this.getHall]];
        }
      }
    },
    batchErrors() {
      const errors = []
      if (!this.$v.batch.$dirty) return errors
      !this.$v.batch.minLength && errors.push('Batch number must be of 2 digits')
      !this.$v.batch.maxLength && errors.push('Batch number must be of 2 digits')
      !this.$v.batch.numeric && errors.push('Batch number must be numeric')
      return errors
    },
    hallErrors() {
      const errors = []
      if (!this.$v.hall.$dirty) return errors
      !this.$v.hall.required && errors.push('Hall is required');
      !this.$v.hall.permission && errors.push('You are not allowed to create donor for this hall')
      return errors
    },

  },
  components: {
    'person-details': PersonDetails,
    PageTitle,
    "person-card": PersonCard,
    HelpTooltip,
    SkeletonPersonCard
  },
  data: function () {
    return {
      name: "",
      bloodGroup: -1,
      batch: "",
      address: "",
      hall: halls[this.$store.getters.getHall],
      availability: true,
      notAvailability: false,

      //GUI flags
      filterShown: true,

      //imported constants
      halls,
      bloodGroups,

      showTooltip: false,
      showFilterHelpTooltip: false,

      radios: 'AvailableToAll',
      showFab: false,
    };
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
        permission(hall) {
          //COVID DATABASE
          return !(this.getHall !== this.halls.indexOf(hall) && this.halls.indexOf(hall) !== 7 && this.halls.indexOf(hall) !== 8 && this.getDesignation !== 3);
        }
      },
    }
  },
  mounted() {
    let query = this.$route.query;

    this.name = query.name ? query.name : "";
    this.bloodGroup = query.bloodGroup ? query.bloodGroup : -1;
    this.batch = query.batch ? query.batch : "";
    this.address = query.address ? query.address : "";
    this.hall = query.hall ? query.hall : halls[this.$store.getters.getHall];
    this.availability = query.availability !== "false";
    this.notAvailability = query.notAvailability === "true";
    this.radios = query.radios==="SpecifyHall"?"SpecifyHall":"AvailableToAll";

    if (Object.keys(this.$route.query).length === 8) {
      this.searchClicked();
    }
  },
  beforeRouteLeave(to,from,next){
    this.resetSearchResults();
    next();
  },
  methods: {
    ...mapActions(['search']),
    ...mapActions('notification', ['notifyError']),
    ...mapMutations(['hideSearchResults','resetSearchResults']),
    ...mapActions(['logout', 'logoutAll', 'requestRedirectionToken']),
    ...mapMutations('errorStore', ['addError',]),
    async downloadInAndroid(){
      let processedPersons = processPersonsForReport(this.getPersons)
      let csv = convertObjectToCSV(processedPersons,["name","studentId","Last Donation","Blood Group","address","roomNumber","Donation Count"],',');
      try{
        await downloadTextFile(csv,'badhan_'+this.getSearchedHall+'.csv');
        await this.$bvModal.msgBoxOk("CSV downloaded to Documents folder", {
          centered:true
        });
      }catch (e) {
        this.addError({name:"Download CSV Failure",message:"Count not save csv file to android storage",stack:e});
      }
    },
    downloadInWeb(){
      // console.log(jsonToCSV(this.getPersons));
      let processedPersons = processPersonsForReport(this.getPersons)
      let csv = convertObjectToCSV(processedPersons,["name","studentId","Last Donation","Blood Group","address","roomNumber","Donation Count"],',');
      textFileDownloadInWeb(csv,'badhan_'+this.getSearchedHall+'.csv');
    },

    onScroll (e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset ||   e.target.scrollTop || 0
      this.showFab = top > 20
    },
    async searchClicked() {
      await this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }

      let inputBatch = 0;
      if (this.batch === null) {
        this.batch = "";
      }

      inputBatch = parseInt(this.batch);
      if (this.batch.length === 0) {
        inputBatch = "";
      }

      //name input validation
      let inputName = this.processName(this.name);
      if (inputName.length === 0) {
        inputName = "";
      }


      let inputAddress = this.processName(this.address);
      if (inputAddress.length === 0) {
        inputAddress = "";
      }

      this.$vuetify.goTo('#results');
      this.showFab=true;

      this.search({
        inputName: inputName,
        bloodGroup: this.bloodGroup,
        inputBatch: inputBatch,
        hall: this.hall,
        availability: this.availability,
        notAvailability: this.notAvailability,
        inputAddress: inputAddress,
        availableToAll: this.radios === "AvailableToAll"
      });
    },

    shareClicked() {
      let routeData = this.$router.resolve({
        name: 'Home',
        query: {
          name: this.name,
          bloodGroup: this.bloodGroup,
          batch: this.batch,
          address: this.address,
          hall: this.hall,
          availability: this.availability,
          notAvailability: this.notAvailability,
          radios:this.radios,

        }
      });
      // navigator.clipboard.writeText(process.env.VUE_APP_FRONTEND_BASE+routeData.href);
      this.$copyText(process.env.VUE_APP_FRONTEND_BASE + routeData.href).then((e) => {
        this.showTooltip = true;
        setTimeout(() => {
          this.showTooltip = false
        }, 2000);
      }, (e) => {
      })
    },

    // async downloadInMobileClicked() {
    //   let redirectionToken = await this.requestRedirectionToken();
    //   let searchRouteData = this.$router.resolve({
    //     name: 'Home',
    //     query: {
    //       name: this.name,
    //       bloodGroup: this.bloodGroup,
    //       batch: this.batch,
    //       address: this.address,
    //       hall: this.hall,
    //       availability: this.availability,
    //       notAvailability: this.notAvailability,
    //       radios:this.radios,
    //     }
    //   });
    //   let redirectionURL = searchRouteData.href.substr(1, searchRouteData.href.length - 1)
    //   let routeData;
    //   routeData = this.$router.resolve({
    //     name: 'Redirection',
    //     query: {token: redirectionToken, payload: redirectionURL}
    //   });
    //   window.open(process.env.VUE_APP_FRONTEND_BASE + routeData.href, '_blank');
    // },

    clearFields() {
      this.$v.$reset();
      this.batch = "";
      this.hall = halls[this.getHall];
      this.bloodGroup = -1;
      this.name = "";
      this.error = "";
      this.address = "";
      this.hideSearchResults();
      this.showFab=false;
    },

    fabClicked(){
      this.$vuetify.goTo(0);
      this.showFab = false;
    },

    processName(name) {
      if (name === null) {
        return "";
      }
      let newName = name.toLowerCase();
      let nameWithoutWs = "";
      for (let i = 0; i < newName.length; i++) {
        let currentChar = newName.charAt(i);
        if (currentChar < "a" || currentChar > "z") {
          continue;
        }
        nameWithoutWs += currentChar;
      }
      return nameWithoutWs;
    },
  },

}
</script>


<style scoped>

</style>
