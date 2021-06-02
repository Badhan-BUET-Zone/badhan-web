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
        <NewPersonCard :donor="donor"></NewPersonCard>
      </v-col>
    </v-row>

  </div>

</template>

<script>
import PageTitle from "../components/PageTitle";
import {maxLength, minLength, required} from 'vuelidate/lib/validators'
import {mapActions} from "vuex";

import NewPersonCard from "../components/BatchInsertion/NewPersonCard";
export default {
  name: "BatchInsertion",
  data: () => {
    return {
      jsonFile: null,
      listOfDonors: [],

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
    NewPersonCard,
    PageTitle
  }
}
</script>

<style scoped>

</style>
