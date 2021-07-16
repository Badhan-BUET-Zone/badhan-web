<template>
  <v-card flat>
    <v-card-title>
      {{ error.name }}
    </v-card-title>
    <v-card-subtitle v-if="error.time">
      {{ error.message }}. Occured at {{new Date(error.time).toLocaleString()}}
    </v-card-subtitle>
    <v-card-actions>
      <v-btn rounded depressed x-small @click="showStack = !showStack">Toggle Stack</v-btn>
    </v-card-actions>
    <v-card-text v-if="showStack && error.stack">
      {{error.stack}}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
name: "FrontendErrors",
  props:["error"],
  data(){
    return{
      showStack: false,
    }
  }
}
</script>

<style scoped>

</style>
