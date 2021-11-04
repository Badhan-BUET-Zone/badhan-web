<template>
  <v-card width="100vw" height="100vh" style="z-index: 90;position: fixed;left: 0px;top: 0px;overflow-y: scroll;">
    <PageTitle></PageTitle>
    <PersonDetails :donorId="$route.query.id"></PersonDetails>
  </v-card>
</template>
<script>
import ShareProfileButton from "../../components/ShareProfileButton";
import PersonDetails from "../../components/Home/PersonDetails";
import PageTitle from "../../components/PageTitle";

export default {
  name: "DuplicateDetails",
  components: {
    PageTitle,
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