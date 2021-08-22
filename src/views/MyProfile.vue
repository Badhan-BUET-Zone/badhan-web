<template>
  <div>
<PersonDetails :donorId="getID"></PersonDetails>
  <v-card max-width="500" class="pa-4 ma-2 rounded-xl">
    <v-card-title>Settings</v-card-title>
    <v-card-text>
      <v-switch
          v-model="darkTheme"
          inset
          label="Switch to dark theme"
      ></v-switch>
    </v-card-text>
  </v-card>
  </div>
</template>

<script>
import PersonDetails from "../components/Home/PersonDetails";
import {mapGetters} from "vuex";
export default {
name: "MyProfile",
  computed:{
  ...mapGetters(['getID']),
    darkTheme: {
      // getter
      get(){
        return this.$vuetify.theme.dark;
      },
      // setter
      set(newValue){
        this.$vuetify.theme.dark = newValue
        localStorage.setItem('darkTheme',newValue);
      }
    },
  },

components:{
  PersonDetails
}
}
</script>

<style scoped>

</style>
