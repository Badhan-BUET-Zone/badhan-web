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
      <v-col v-for="(donor, index) in listOfDonors" :key="index" cols="12" sm="3">
        <v-card rounded class="ma-1">
          <v-card-text>
            <p><b>Name: </b>{{donor.name}}</p>
            <p><b>Phone: </b>{{donor.phone}}</p>
            <p><b>Student ID: </b>{{donor.studentId}}</p>
            <p><b>Blood Group: </b>{{bloodGroups[donor.bloodGroup]}}</p>
            <p><b>Hall: </b>{{halls[donor.hall]}}</p>
            <p><b>Address: </b>{{donor.address}}</p>
            <p><b>Room Number: </b>{{donor.roomNumber}}</p>
            <p><b>Comment: </b>{{donor.comment}}</p>
            <p><b>Donation Count: </b>{{donor.donationCount}}</p>
            <p>
              <b>Last Donation: </b>
              <span v-if="donor.lastDonation!==0">
                {{new Date(donor.lastDonation).toDateString()}}
              </span>
              <span v-else>None</span>
            </p>
          </v-card-text>
          <v-card-actions>
              <v-btn small color="secondary" rounded>Discard</v-btn>
              <v-btn small color="primary" rounded>Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </div>

</template>

<script>
import PageTitle from "../components/PageTitle";
import {maxLength, minLength, required} from 'vuelidate/lib/validators'
import {mapActions} from "vuex";
import {halls,bloodGroups} from "../mixins/constants";

export default {
  name: "BatchInsertion",
  data: () => {
    return {
      jsonFile: null,
      listOfDonors: [],
      halls,
      bloodGroups
    }
  },
  validations: {
    jsonFile: {
      required
    }
  },
  computed:{
    jsonFileErrors(){
      const errors = []
      if (!this.$v.jsonFile.$dirty) return errors
      !this.$v.jsonFile.required && errors.push('JSON file is required.')
      return errors
    }
  },
  methods:{
    ...mapActions('notification', ['notifyError', 'notifySuccess', 'notifyInfo']),
    async fileUploadClicked(){
      await this.$v.$touch();
      if(this.$v.$anyError){
        return;
      }
      const reader = new FileReader();
      reader.readAsText(this.jsonFile);
      reader.onload =  evt => {
        this.listOfDonors = JSON.parse(evt.target.result);
      }
      },
    resetClicked(){
      this.$v.$reset();
      this.jsonFile=null;
          this.listOfDonors=[];
    }
  },
  mounted(){
    this.notifyInfo('Page under construction');
  },
  components: {
    PageTitle
  }
}
</script>

<style scoped>

</style>
