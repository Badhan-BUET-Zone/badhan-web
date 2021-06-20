<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <div>
      <v-row>
        <v-col cols="12" sm="4">
          <div
              style="height: fit-content"
          >
            <div class="ml-5">
              <v-row>
                <!--      Filter title-->
                <v-col><h5>Filters</h5></v-col>

                <v-col>
                  <v-btn color="secondary" small @click="toggleFilterClicked()" rounded>
                    <v-icon left>
                      mdi-filter
                    </v-icon>
                    <span v-if="!isFilterShown">Show Filters</span>
                    <span v-else>Hide Filters</span>
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <!--    Main Filters-->

            <v-form v-if="isFilterShown">
              <v-container>
                <!--        Input field for name-->
                <v-text-field
                    rounded
                    v-model="name"
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
                <v-select
                    rounded
                    v-model="hall"
                    :items="availableHalls"
                    label="Select Hall"
                    outlined
                    dense
                    @blur="$v.hall.$touch()" :error-messages="hallErrors"
                ></v-select>

                <v-text-field
                    rounded
                    outlined
                    label="Address"
                    clearable
                    v-model="address"
                    dense
                ></v-text-field>

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
          </div>
        </v-col>
        <v-col cols="12" sm="8">
          <div
              style="height: fit-content"
          >
            <div v-if="isSearchResultShown">
              <v-alert dense class="rounded-xl" color="accent lighten-4">
                <div>
                  Found {{ getNumberOfDonors }} donors
                </div>

              </v-alert>
            </div>

            <div v-if="isSearchResultShown">
              <div>
                <json-excel
                    v-if="!isNative"
                    :data="getPersons"
                    type="csv"
                    :name="'badhan_'+getSearchedHall+'.csv'"
                    worksheet="Badhan"
                    :fields="{
                    name:'name',
                    studentId:'studentId',
                    lastDonation:{
                        field: 'lastDonation',
                        callback: (value) => {
                            let date = new Date(value);
                            return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
                        }
                    },
                    bloodGroup:{
                        field: 'bloodGroup',
                        callback: (value) => {
                            return bloodGroups[parseInt(value)];
                        },
                    },
                    address:'address',
                    roomNumber: 'roomNumber',
                    donationCount: 'donationCount'
                }" ref="jsonDownload" :escapeCsv="false"

                >
                  <v-btn small color="secondary" rounded class="mb-4" style="width: 100%">
                    <v-icon left>
                      mdi-download
                    </v-icon>
                    Download Data
                  </v-btn>
                </json-excel>
                <v-btn v-if="(isNative || $isDevelopmentEnv())&& !isGuestEnabled" @click="downloadInMobileClicked" small color="secondary" rounded class="mb-4" style="width: 100%">
                  <v-icon left>
                    mdi-web
                  </v-icon>
                  Download From Web
                </v-btn>
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
              </div>
              <div v-for="(obj, index) in getPersonGroups" :key="index">
                <v-alert dense class="rounded-xl" color="accent lighten-4">
                  <div>
                    Batch {{ obj.batch }}:
                  </div>
                </v-alert>

                <person-card
                    v-for="(person, personIndex) in obj.people"
                    :phone="person.phone"
                    :name="person.name"
                    :availableIn="person.availableIn"
                    :bloodGroup="person.bloodGroup"
                    :studentID="person.studentID"
                    :lastDonation="person.lastDonation"
                    :comment="person.comment"
                    :address="person.address"
                    :key="personIndex"
                    :roomNumber="person.roomNumber"
                    :id="person._id"
                ></person-card>
              </div>
              <v-btn x-small rounded disabled v-if="getDesignation ===3 || getDesignation ===2">Archive these donors
              </v-btn>
            </div>
          </div>
        </v-col>
        <!--        <person-details></person-details>-->
      </v-row>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import PersonDetails from "@/components/Home/SearchPanel/PersonDetails/PersonDetails";
import PageTitle from "../components/PageTitle";
import PersonCard from "../components/Home/SearchPanel/SearchResults/PersonCard";
import JsonExcel from "vue-json-excel";
import {isNative} from '@/plugins/android_support';
import {bloodGroups, halls} from "@/mixins/constants";
import {mapActions, mapGetters, mapMutations} from "vuex";
import {minLength, maxLength, numeric, required} from 'vuelidate/lib/validators'
import {isGuestEnabled} from "../api";

export default {
  name: "ActiveSearch",
  computed: {
    ...mapGetters(['getPersonGroups', 'isSearchResultShown', 'getNumberOfDonors', 'getPersons', 'getSearchedHall', 'getDesignation', 'getHall', 'isSearchLoading', 'isFilterShown']),
    isGuestEnabled(){
      return isGuestEnabled();
    },
    isNative() {
      return isNative();
    },
    availableHalls() {
      if (this.getDesignation !== null) {
        if (this.getDesignation === 3) {
          return halls;
        } else {
          //covid support
          //return [halls[this.getHall], halls[7]];
          return [halls[this.getHall], halls[7], halls[8]];
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
    "json-excel": JsonExcel
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

      showTooltip: false
    };
  },
  validations:()=>{return{
    batch: {
      minLength: minLength(2),
      maxLength: maxLength(2),
      numeric
    },
    hall: {
      required,
      permission(hall){
        //COVID DATABASE
        return !(this.getHall !== this.halls.indexOf(hall) && this.halls.indexOf(hall) !== 7 && this.halls.indexOf(hall) !== 8 && this.getDesignation!==3);
      }
    },
  }},
  mounted() {
    let query = this.$route.query;

    this.name = query.name? query.name:"";
    this.bloodGroup = query.bloodGroup? query.bloodGroup:-1;
    this.batch = query.batch?query.batch:"";
    this.address = query.address?query.address:"";
    this.hall = query.hall?query.hall:halls[this.$store.getters.getHall];
    this.availability = query.availability!=="false";
    this.notAvailability = query.notAvailability==="true";

    if(Object.keys(this.$route.query).length===7){
      this.searchClicked();
    }
  },
  methods: {
    ...mapActions(['search']),
    ...mapActions('notification', ['notifyError']),
    ...mapMutations(['hideSearchResults', 'showFilter', 'hideFilter', 'toggleFilter']),
    ...mapActions(['logout', 'logoutAll','requestRedirectionToken']),
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

      await this.search({
        inputName: inputName,
        bloodGroup: this.bloodGroup,
        inputBatch: inputBatch,
        hall: this.hall,
        availability: this.availability,
        notAvailability: this.notAvailability,
        inputAddress: inputAddress
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
          notAvailability: this.notAvailability
        }
      });
      // navigator.clipboard.writeText(process.env.VUE_APP_FRONTEND_BASE+routeData.href);
      this.$copyText(process.env.VUE_APP_FRONTEND_BASE+routeData.href).then((e)=>{
        this.showTooltip=true;
        setTimeout(()=>{this.showTooltip=false},2000);
      },(e)=>{
      })
    },

    async downloadInMobileClicked(){
      let redirectionToken = await this.requestRedirectionToken();
      let searchRouteData = this.$router.resolve({
        name: 'Home',
        query: {
          name: this.name,
          bloodGroup: this.bloodGroup,
          batch: this.batch,
          address: this.address,
          hall: this.hall,
          availability: this.availability,
          notAvailability: this.notAvailability
        }
      });
      let redirectionURL = searchRouteData.href.substr(1,searchRouteData.href.length-1)
      let routeData;
      routeData = this.$router.resolve({
        name: 'Redirection',
        query: {token: redirectionToken, payload: redirectionURL}
      });
      window.open(process.env.VUE_APP_FRONTEND_BASE+routeData.href, '_blank');
    },

    clearFields() {
      this.$v.$reset();
      this.batch = "";
      if (this.getDesignation === 3) {
        this.hall = -1;
      }
      this.bloodGroup = -1;
      this.name = "";
      this.error = "";
      this.address = "";
      this.hideSearchResults();
    },
    showFilterClicked() {
      this.showFilter();
    },
    hideFilterClicked() {
      this.hideFilter();
    },
    toggleFilterClicked() {
      this.toggleFilter();
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
