<template>
  <div>
    <v-container fluid>
      <v-row dense>
        <!-- <carousel> -->
          <v-col :cols="12" lg="4">
            <v-card>
              <v-img
                class="white--text align-end"
                height="300px"
                src="https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Frahat.jpg?alt=media"
              >
                <v-card-title>MH Rahat</v-card-title>
              </v-img>

              <v-card-subtitle class="pb-0">Platform Manager </v-card-subtitle>

              <v-card-text class="text--primary">
                <div>Initiator of Badhan Website and Android App</div>
                <div>Test and Bug Report</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col :cols="12" lg="4">
            <v-card>
              <v-img
                class="white--text align-end"
                height="300px"
                src="https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Fmahathir.jpg?alt=media"
              >
                <v-card-title>Mir Mahathir Mohammad</v-card-title>
              </v-img>

              <v-card-subtitle class="pb-0">Frontend Developer</v-card-subtitle>

              <v-card-text class="text--primary">
                <div>UX Design</div>
                <div>Web Frontend Development</div>
                <div>Hybrid Android App Development</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col :cols="12" lg="4">
            <v-card>
              <v-img
                class="white--text align-end"
                height="300px"
                src="https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Faniruddha.jpg?alt=media"
              >
                <v-card-title>Aniruddha GS</v-card-title>
              </v-img>

              <v-card-subtitle class="pb-0">Backend Developer</v-card-subtitle>

              <v-card-text class="text--primary">
                <div>API Development</div>
                <div>Database Administration</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col :cols="12" lg="4">
            <v-card>
              <v-img
                class="white--text align-end"
                height="300px"
                src="https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Fpriyeta.jpg?alt=media"
              >
                <v-card-title>Priyeta Saha</v-card-title>
              </v-img>

              <v-card-subtitle class="pb-0">Android App Developer </v-card-subtitle>

              <v-card-text class="text--primary">
                <div>Flutter Android App Development</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col :cols="12" lg="4">
            <v-card>
              <v-img
                class="white--text align-end"
                height="300px"
                src="https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Fanisha.jpg?alt=media"
              >
                <v-card-title>Anisha Islam</v-card-title>
              </v-img>

              <v-card-subtitle class="pb-0">Backend Developer</v-card-subtitle>

              <v-card-text class="text--primary">
                <div>API Development</div>
              </v-card-text>
            </v-card>
          </v-col>
        <!-- </carousel> -->
      </v-row>
    </v-container>
  </div>
</template>

<script>
import carousel from "vue-owl-carousel";
export default {
  name: "Credits",
  components: { carousel },
};
</script>

<style scoped>
</style>