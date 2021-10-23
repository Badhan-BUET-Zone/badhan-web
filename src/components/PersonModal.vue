<template>
  <v-dialog
      v-model="showPersonModal"
      persistent
      max-width="700"
  >
    <v-btn @click="()=>{$store.commit('personModal/setPersonModalFlag',false)}">Close</v-btn>
    <PersonDetails :donor-id="$store.getters['personModal/getPersonId']"></PersonDetails>

<!--    <v-card>-->
<!--      <v-card-title class="text-h5">-->
<!--        Use Google's location service?-->
<!--      </v-card-title>-->
<!--      <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>-->
<!--      <v-card-actions>-->
<!--        <v-spacer></v-spacer>-->
<!--        <v-btn-->
<!--            color="green darken-1"-->
<!--            text-->
<!--            @click="()=>{this.$store.commit('personModal/setPersonModalFlag',false)}"-->
<!--        >-->
<!--          Disagree-->
<!--        </v-btn>-->
<!--        <v-btn-->
<!--            color="green darken-1"-->
<!--            text-->
<!--            @click="()=>{this.$store.commit('personModal/setPersonModalFlag',false)}"-->
<!--        >-->
<!--          Agree-->
<!--        </v-btn>-->
<!--      </v-card-actions>-->
<!--    </v-card>-->
  </v-dialog>
</template>

<script>
import PersonDetails from "./Home/PersonDetails";
export default {
  name: "PersonModal",
  components: {PersonDetails},
  computed:{
    showPersonModal:{
      get:  function (){
        return this.$store.getters["personModal/getPersonModalFlag"];
      },
      // setter
      set: function (newValue){
        this.$store.commit("personModal/setPersonModalFlag",newValue);
      }
    }
  }
}
</script>

<style scoped>

</style>