<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>

    <v-card max-width="500" class="pa-2 rounded-xl" v-if="!isNative">
      <v-card-text>
        Select a JSON file

        <HelpTooltip>
            <div style="max-width: 300px">
              Upload a JSON file from your device storage. The format of the JSON file should be an array of donor objects. A sample json file is shown below
              <v-img max-width="300px" src="https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/misc%2Fsamplejson.png?alt=media" lazy-src="../assets/loadingimage.png">
                <template v-slot:placeholder>
                  <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                  >
                    <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </div>
        </HelpTooltip>

        <v-file-input
            v-model="jsonFile"
            accept=".json"
            label="Donor Data Input"
            @blur="$v.jsonFile.$touch()"
            :error-messages="jsonFileErrors"
            id="fileUpload"
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="$v.$anyError" color="primary" rounded  @click="fileUploadClicked">
          <v-icon left>
            mdi-upload
          </v-icon>
          Upload JSON data
        </v-btn>
      </v-card-actions>
      <v-alert type="error" dense v-if="invalidJSONError!==null">{{invalidJSONError}}</v-alert>
    </v-card>
    <v-card max-width="500" class="pa-2 mt-2 rounded-xl" v-if="(isNative || $isDevelopmentEnv()) && !isGuestEnabled">
      <v-card-text>
        <v-icon left>
          mdi-upload
        </v-icon>
        Select a JSON file
        <HelpTooltip>
            <div>
              Redirect to website and upload the JSON file from browser
            </div>
        </HelpTooltip>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" rounded @click="redirectFileUpload">
          <v-icon left>
            mdi-upload
          </v-icon>
          Upload JSON data from web
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-btn class="ma-5" color="secondary" rounded @click="resetClicked">
      <v-icon left>
        mdi-refresh
      </v-icon>
      Reset
    </v-btn>

    <br>
    <span class="ma-5 h5">Donor Information</span>
    <HelpTooltip>
        <div>
          Input information of new donor as specified below
          <ul>
            <li><b>Name: </b>String of non-zero length</li>
            <li><b>Phone: </b>Numeric string of 11 characters</li>
            <li><b>Student ID: </b>Input data type is a 7 digit number. E.g. 1605011. If department code is unknown, use 00</li>
            <li><b>Blood Group: </b>Blood group of donor from dropdown</li>
            <li><b>Room: </b>Field can be null but must be a string if not null</li>
            <li><b>Address: </b>Field can be null but must be a string if not null</li>
            <li><b>Comment: </b>Field can be null but must be a string if not null</li>
            <li><b>Donation count: </b>Must be an integer number and minimum value should be 0.</li>
            <li><b>Select Hall: </b>If the hall name is unknown, the donor will be editable and accessible to members of all halls.</li>
            <li><b>Public Data: </b>If the information of the donor needs to be accessible by member of other halls, please put a tick here. Otherwise the donor will be restricted to be accessed only from the specified hall.</li>
            <li><b>Pick Last Donation Date: </b>If the donation count is non-zero, please specify the last donation date from the date picker.</li>
          </ul>
        </div>
    </HelpTooltip>

    <v-container>
      <v-row no-gutters>
        <v-col v-for="(donor) in listOfDonors.slice(4 * (donorPage - 1), 4 * donorPage)" :key="donor.key" cols="12" sm="3">
          <NewPersonCard :donor="donor" :discard-donor="discardDonor"></NewPersonCard>
        </v-col>
      </v-row>
    </v-container>
    <v-card flat class="mt-1">
      <v-pagination
          color="secondary"
          circle
          v-if="listOfDonors.length>4"
          v-model="donorPage"
          class="mx-auto"
          :length="Math.ceil(listOfDonors.length/4) "
      ></v-pagination>
    </v-card>

  </div>

</template>

<script>
import PageTitle from "../components/PageTitle";
import {maxLength, minLength, required} from 'vuelidate/lib/validators'
import {mapActions, mapGetters} from "vuex";
import {isNative} from '@/plugins/android_support';
import HelpTooltip from "../components/UI Components/HelpTooltip";


import NewPersonCard from "../components/BatchInsertion/NewPersonCard";
import {isGuestEnabled} from "../api";

export default {
  name: "BatchInsertion",
  data: () => {
    return {
      jsonFile: null,
      invalidJSONError: null,
      listOfDonors: [],
      donorPage: 1,
    }
  },

  validations: {
    jsonFile: {
      required
    }
  },
  computed: {
    ...mapGetters(['getHall', 'getDesignation']),
    isGuestEnabled(){
      return isGuestEnabled();
    },
    jsonFileErrors() {
      const errors = []
      if (!this.$v.jsonFile.$dirty) return errors
      !this.$v.jsonFile.required && errors.push('JSON file is required.')
      return errors
    },
    isNative(){
      return isNative();
    }
  },
  methods: {
    ...mapActions('notification', ['notifyError', 'notifySuccess', 'notifyInfo']),
    ...mapActions(['requestRedirectionToken']),
    async fileUploadClicked() {
      await this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }
      const reader = new FileReader();
      reader.readAsText(this.jsonFile);
      this.donorPage = 1;
      reader.onload = evt => {
        try {
          this.listOfDonors = JSON.parse(evt.target.result);

          for (let i = 0; i < this.listOfDonors.length; i++) {
            this.listOfDonors[i].key = i;
          }
        }catch (e){
          this.invalidJSONError = e;
        }
      }
    },
    discardDonor(key){
      this.listOfDonors = this.listOfDonors.filter((donor)=>donor.key!==key);
    },
    resetClicked() {
      this.$v.$reset();
      this.jsonFile = null;
      this.resetForms();
      this.invalidJSONError=null;
    },
    resetForms(){
      this.listOfDonors = [{
        name:null,
        phone:null,
        studentId:null,
        bloodGroup : null,

        hall : this.getHall,

        address : null,
        roomNumber : null,
        comment : null,
        donationCount : null,
        lastDonation: null,

        availableToAll: false,

        key: new Date().getTime(),
      }];
    },
    async redirectFileUpload(){
      let redirectionToken = await this.requestRedirectionToken();
      let routeData;
      routeData = this.$router.resolve({
        name: 'Redirection',
        query: {token: redirectionToken, payload: this.$route.fullPath}
      });
      window.open(process.env.VUE_APP_FRONTEND_BASE+routeData.href, '_blank');
    }
  },
  mounted() {
    this.resetForms();
  },
  components: {
    NewPersonCard,
    PageTitle,
    HelpTooltip
  }
}
</script>

<style scoped>

</style>
