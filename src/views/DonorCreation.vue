<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>

    <v-card max-width="500" class="pa-2 rounded-xl" v-if="!isNative">
      <v-card-text>
        Select a JSON file

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
    <v-card max-width="500" class="pa-2 rounded-xl" v-if="(isNative || $isDevelopmentEnv()) && !isGuestEnabled">
      <v-card-text>
        <v-icon left>
          mdi-upload
        </v-icon>
        Select a JSON file
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

    <v-btn class="ma-2" color="secondary" rounded @click="resetClicked">
      <v-icon left>
        mdi-refresh
      </v-icon>
      Reset
    </v-btn>

    <v-row no-gutters>
      <v-col v-for="(donor) in listOfDonors.slice(4 * (donorPage - 1), 4 * donorPage)" :key="donor.key" cols="12" sm="3">
        <NewPersonCard :donor="donor" :discard-donor="discardDonor"></NewPersonCard>
      </v-col>
    </v-row>


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
    PageTitle
  }
}
</script>

<style scoped>

</style>
