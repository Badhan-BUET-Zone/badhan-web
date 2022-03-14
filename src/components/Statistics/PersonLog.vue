<template>
  <div>
    Name: {{ dateLog.name }} <br>
    Hall: {{ dateLog.hall | getHallName }} <br>
    Count: {{ dateLog.count }}
    <br>
    <v-btn @click="getPersonActivities" v-if="personLogs.length===0 && !personLogLoading" x-small rounded
           color="primary">Expand
    </v-btn>
    <v-skeleton-loader type="text@3" v-if="personLogLoading"></v-skeleton-loader>

    <div v-for="(personLog,i) in personLogs" :key="i">
      {{ i + 1 }}) Time:
      {{ new Date(personLog.date).toDateString() + ' ' + new Date(personLog.date).toLocaleTimeString() }} <br>
      Operation: {{ personLog.operation }} <br>
      Details:
      <LogObject :object="personLog.details"></LogObject>
    </div>
    <hr>
  </div>
</template>

<script>
import { handleGETLogsByDateAndDonor } from '../../api'
import LogObject from './LogObject'

export default {
  name: 'PersonLog',
  props: ['dateLog', 'dateString'],
  components: {
    LogObject
  },
  data: function () {
    return {
      personLogs: [],
      personLogLoading: false
    }
  },
  methods: {
    async getPersonActivities () {
      const splitDate = this.dateString.split('-')

      const timeStamp = new Date(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2])).getTime()
      this.personLogLoading = true
      const response = await handleGETLogsByDateAndDonor({ timeStamp, donorId: this.dateLog.donorId })
      this.personLogLoading = false
      if (response.status !== 200) return
      this.personLogs = response.data.logs
    }
  }
}
</script>

<style scoped>

</style>
