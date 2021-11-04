<template>
<ContainerFlat>
  <v-card
      style="width: 100%; height: 100%;" rounded
  >
    <v-row no-gutters>
      <v-col align-self="center" cols="4">
        <v-card
            class="text-center"
            color="successLight"
            flat rounded
        >
          <v-card-text>
            <span>B+</span><br>
            <span>2 donations</span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
          cols="8"
          align-self="center"
          class="d-flex align-content-center"
      >
        <div style="font-size: small; width: 100%" class="text-wrap pa-2">
          <b style="width: 100%">Mir Mahathir</b>
          <br/>
          <b>Phone: </b>
          <span>01521438557</span>
          <br>
          <b>Hall: </b>
          <span>Suhrawardi</span>
        </div>
      </v-col>
    </v-row>
  </v-card>
  <v-card class="mt-2 rounded-xl" >
    <v-card-text>
    <v-row no-gutters>
      <v-col cols="10">
        <span><b>Hall: </b>Suhrawardi</span><br>
        <span><b>Department: </b>CSE</span><br>
        <span><b>Comment: </b>Need to stay in bed for 4 weeks (Last updated: 09:00 AM 12/5/2021)</span><br>
        <span><b>Marked by: </b>Hasan Masum (On 09:00 AM 12/5/2021)</span><br>
        <span><b>Last called: </b>On 09:00 AM 12/5/2021</span><br>
        <span>Called 3 times in last 3 days</span>
      </v-col>
      <v-col cols="2">
        <v-btn icon color="green"><v-icon>mdi-phone</v-icon></v-btn>
        <v-btn icon color="blue"><v-icon>mdi-account-details</v-icon></v-btn>
        <v-btn icon color="red"><v-icon>mdi-close</v-icon></v-btn>
      </v-col>
    </v-row>
    </v-card-text>
  </v-card>
</ContainerFlat>
</template>

<script>
import Container from "../../components/Wrappers/Container";
import ContainerFlat from "../../components/Wrappers/ContainerFlat";
export default {
  name: "PublicBookmarks",
  components: {ContainerFlat, Container}
}
</script>

<style scoped>

</style>