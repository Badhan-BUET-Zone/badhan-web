<template>
  <div style="z-index: 90;position: fixed;left: 0px;top: 0px;height: 100vh;width: 100vw;overflow-y: scroll;">
    <PersonDetails :donorId="$route.query.id"></PersonDetails>
  </div>
</template>

<script>
import PersonDetails from "../../components/Home/PersonDetails";
export default {
name: "Details",
  components:{
  PersonDetails,
  }
}
</script>

<style scoped>

</style>
