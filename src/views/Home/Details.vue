<template>
<!--/*  <v-card style="z-index: 90;position: fixed;left: 0px;top: 0px;height: 100vh;width: 100vw;overflow-y: scroll;">*/-->
    <v-dialog
        v-model="dialog"
        persistent
        max-width="800"
    >
    <v-app-bar class="rounded-xl">
      <v-btn icon @click="$router.push('/home')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Person Details</v-toolbar-title>
      <ShareProfileButton :id="$route.query.id"></ShareProfileButton>
    </v-app-bar>
    <PersonDetails :donorId="$route.query.id"></PersonDetails>
    </v-dialog>
<!--  </v-card>-->

</template>

<script>
import PersonDetails from "../../components/Home/PersonDetails";
import ShareProfileButton from "../../components/ShareProfileButton";

export default {
  name: "Details",
  components: {
    ShareProfileButton,
    PersonDetails,
  },
  data:()=>{
    return{
      dialog: true
    }
  }
}
</script>

<style scoped>

</style>
