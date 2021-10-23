<template>
  <v-card width="100vw" height="100vh" style="z-index: 90;position: fixed;left: 0px;top: 0px;overflow-y: scroll;">
    <v-app-bar class="rounded-xl">
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Person Details</v-toolbar-title>
      <ShareProfileButton :id="$route.query.id"></ShareProfileButton>
    </v-app-bar>
    <PersonDetails :donorId="$route.query.id"></PersonDetails>
  </v-card>
</template>
<script>
import ShareProfileButton from "../../components/ShareProfileButton";
import PersonDetails from "../../components/Home/PersonDetails";

export default {
  name: "DuplicateDetails",
  components: {
    ShareProfileButton,
    PersonDetails,
  },
  data: () => {
    return {
      dialog: true
    }
  }
}
</script>

<style scoped>

</style>