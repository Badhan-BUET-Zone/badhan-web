<template>
  <v-card style="z-index: 90;position: fixed;left: 0px;top: 0px;height: 100vh;width: 100vw;overflow-y: scroll;">

    <v-app-bar class="rounded-b-xl">
      <v-btn icon @click="$router.push('/home')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Person Details</v-toolbar-title>
      <ShareProfileButton :id="$route.query.id"></ShareProfileButton>
    </v-app-bar>
    <PersonDetails :donorId="$route.query.id"></PersonDetails>
  </v-card>
</template>

<script>
import PersonDetails from "../../components/Home/PersonDetails";
import ShareProfileButton from "../../components/ShareProfileButton";

export default {
  name: "Details",
  components: {
    ShareProfileButton,
    PersonDetails,
  }
}
</script>

<style scoped>

</style>
