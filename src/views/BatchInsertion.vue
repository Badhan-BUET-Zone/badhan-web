<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <v-card max-width="500" class="pa-2 rounded-xl">
      <v-card-text>
        Select a JSON file

        <v-file-input
            v-model="jsonFile"
            accept=".json"
            label="Donor Data Input"
            @blur="$v.jsonFile.$touch()"
            :error-messages="jsonFileErrors"
        ></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" rounded @click="resetClicked">Reset</v-btn>
        <v-btn :disabled="$v.$anyError" color="primary" rounded @click="fileUploadClicked">Upload JSON data</v-btn>
      </v-card-actions>
    </v-card>

    <v-row no-gutters>
      <v-col v-for="(donor) in listOfDonors.slice(4 * (donorPage - 1), 4 * donorPage)" :key="donor.key" cols="12" sm="3">
        <NewPersonCard :donor="donor" :discard-donor="discardDonor"></NewPersonCard>
      </v-col>
    </v-row>


    <v-card flat class="mt-1">
      <v-pagination
          color="secondary"
          circle
          v-if="listOfDonors.length>1"
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

import NewPersonCard from "../components/BatchInsertion/NewPersonCard";

export default {
  name: "BatchInsertion",
  data: () => {
    return {
      jsonFile: null,
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
    jsonFileErrors() {
      const errors = []
      if (!this.$v.jsonFile.$dirty) return errors
      !this.$v.jsonFile.required && errors.push('JSON file is required.')
      return errors
    },
  },
  methods: {
    ...mapActions('notification', ['notifyError', 'notifySuccess', 'notifyInfo']),
    async fileUploadClicked() {
      await this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }
      const reader = new FileReader();
      reader.readAsText(this.jsonFile);
      this.donorPage = 1;
      reader.onload = evt => {
        this.listOfDonors = JSON.parse(evt.target.result);
        for (let i = 0; i < this.listOfDonors.length; i++) {
          this.listOfDonors[i].key = i;
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
    }
  },
  mounted() {
    this.notifyInfo('Page under construction');
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
