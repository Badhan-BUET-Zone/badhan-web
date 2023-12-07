<template>
  <div>
    Name: {{ dateLog.name }} <br>
    Hall: {{ dateLog.hall | getHallName }} <br>
    Count: {{ dateLog.group.length }}
    <br>
    <v-btn :id="`personLogExpandButtonId_${dateLog.name}`" @click="getPersonActivities" v-if="!personLogLoaded" x-small
      rounded color="primary">Expand
    </v-btn>
    <div v-else>
      <div v-for="(log, i) in dateLog.group" :key="i">
        {{ i + 1 }}) Time:
        {{ new Date(log.date).toDateString({ timeZone: 'Asia/Dhaka'}) + ' ' + new Date(log.date).toLocaleTimeString({ timeZone: 'Asia/Dhaka'}) }} <br>
        Operation: {{ log.operation }} <br>
      </div>
    </div>
    <hr>
  </div>
</template>

<script>
export default {
  name: 'PersonLog',
  props: ['dateLog'],
  data: function () {
    return {
      personLogLoaded: false
    }
  },
  methods: {
    async getPersonActivities() {
      this.personLogLoaded = true
    }
  }
}
</script>

<style scoped></style>
