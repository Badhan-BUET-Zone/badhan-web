<template>
  <v-card flat>
    <v-card-subtitle>
      <b>Time: {{new Date(log.time).toLocaleString()}}</b>
    </v-card-subtitle>
    <v-card-text>
      <span v-for="(singleText,index) in log.text" :key="index">{{singleText}} || </span>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'MyConsoleLog',
  props: ['log'],
  data () {
    return {
      showStack: false
    }
  }
}
</script>

<style scoped>

</style>
