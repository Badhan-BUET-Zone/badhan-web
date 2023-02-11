<template>
  <v-card
      class="d-flex justify-center"
      style="z-index: 90;position: fixed;left: 0px;top: 0px;height: 100vh;width: 100vw;"
  >
    <v-container>
      <v-row
          class="fill-height"
          align-content="center"
          justify="center"
      >
        <v-col
            class="text-center primary--text"
            cols="12"
        >
          <img src="../assets/images/badhanlogo.png" alt="Badhan" style="height: 50px; width: 50px">
        </v-col>
        <v-col cols="3">
          <v-progress-linear
              color="primary"
              indeterminate
              rounded
              height="10"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-container>

  </v-card>

</template>

<script>
/* eslint-disable */
export default {
  props: ['dialog'],
  data () {
    return {
      // dialog: false,
      notifications: false,
      sound: true,
      widgets: false
    }
  }
}
</script>

<style scoped>

</style>
