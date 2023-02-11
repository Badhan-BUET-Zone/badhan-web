<template>
  <v-card flat>
    <v-card-title>
      {{ logCount.dateString }}
    </v-card-title>
    <v-card-subtitle>
      Activity count: {{ logCount.totalLogCount }}<br>
      Active user count: {{logCount.activeUserCount}}
    </v-card-subtitle>
    <v-card-text>
      <v-btn :id="`dateLogDetailsButtonId_${logCount.dateString}`" rounded color="primary" x-small @click="detailsClick" v-if="dateLogs.length===0 && !dateLogsLoading">
        Details
      </v-btn>
      <v-skeleton-loader type="text@3" v-if="dateLogsLoading"></v-skeleton-loader>
      <div v-for="(dateLog,index) in dateLogs" :key="index">
        <PersonLog :date-log="dateLog" :date-string="logCount.dateString"></PersonLog>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
/* eslint-disable */
import { handleGETLogsByDate } from '../../api'
import PersonLog from './PersonLog'

export default {
  props: ['logCount'],
  name: 'DateLog',

  data: function () {
    return {
      dateLogs: [],
      dateLogsLoading: false
    }
  },
  components: {
    PersonLog
  },
  methods: {
    async detailsClick () {
      const splitDate = this.logCount.dateString.split('-')
      const timeStamp = new Date(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2])).getTime()
      this.dateLogsLoading = true
      const logs = await handleGETLogsByDate({ timeStamp })
      this.dateLogsLoading = false
      if (!logs) return
      this.dateLogs = logs
    }
  }
}
</script>

<style lang="sass">

</style>
