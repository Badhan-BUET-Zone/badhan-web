<template>
<PersonDetails :donorId="getID"></PersonDetails>
</template>

<script>
import PersonDetails from "../components/Home/PersonDetails";
import {mapGetters} from "vuex";
export default {
name: "MyProfile",
  computed:{
  ...mapGetters(['getID']),
  },
components:{
  PersonDetails
}
}
</script>

<style scoped>

</style>
