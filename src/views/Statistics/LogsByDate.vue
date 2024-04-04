<template>
  <div>
    <Container>
      <v-card-title>Activity Logs of <br>Badhan BUET Zone</v-card-title>
      <transition name="slide-fade-down-snapout" type="out-in">
        <LoadingMessage v-if="logCountLoader" :key="'logLoader'"/>
        <v-card-text v-else :key="'logLoaded'">
          <v-sparkline
            :labels="labelsForSparkLine"
            :value="valuesForSparkLine"
            color="rgba(255, 0, 0, 1)"
            height="100"
            stroke-linecap="round"
            smooth
            auto-draw
          >
          </v-sparkline>
          <v-row>
            <v-col cols="12" sm="4" v-for="(log,i) in logs" :key="i">
              <DateLog :groupedLog="log" :key="i"/>
            </v-col>
          </v-row>
        </v-card-text>
      </transition>
    </Container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { handleGETLogs } from '@/api'
import DateLog from '../../components/Statistics/DateLog'
import Container from '../../components/Wrappers/Container'
import LoadingMessage from '@/components/LoadingMessage.vue'

export default {
  name: 'LogsByDate',
  components: { LoadingMessage, Container, DateLog },
  computed: {
    ...mapGetters('statistics', ['getStatisticsLoaderFlag', 'getStatistics', 'getLogs', 'getLogsLoaderFlag', 'getLogDeleteFLag', 'getVolunteers', 'getVolunteerLoaderFlag']),
    ...mapGetters(['getDesignation'])

  },
  methods: {
    ...mapActions('notification', ['notifyError', 'notifySuccess', 'notifyInfo']),
    ...mapActions('statistics', ['fetchStatistics', 'removeAllLogs', 'getFilteredLogs', 'fetchAllVolunteers']),

    async showStats () {
      this.fetchStatistics()
      this.statsShown = true
    }
  },
  async mounted () {
    if (this.getDesignation !== 3) {
      this.$router.push({ name: 'NotFound' })
      return
    }
    this.logCountLoader = true
    const response = await handleGETLogs()
    this.logCountLoader = false
    if (response.status !== 200) return
    let options = { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit' };
    let logs = response.data.logs.map(log=>{
      return {
        ...log,
        dateString: new Date(log.date).toLocaleString('en-US', options)
      }})
    this.logs = logs.reduce((acc, val) => {
      let o = acc.find((obj) => obj.dateString === val.dateString);
      if (o) {
        o.group.push(val);
      } else {
        acc.push({dateString: val.dateString, group: [val]});
      }
      return acc;
    }, []);
    const reverseLogs = this.logs.slice(0, 14)
    this.labelsForSparkLine = reverseLogs.map(a => a.dateString.split('/')[1])
    this.valuesForSparkLine = reverseLogs.map(a => a.group.length)
  },
  data () {
    return {
      tabs: null,
      deleteLogsPromptFlag: false,
      headers: [
        { text: 'Time', value: 'date' },
        { text: 'Name', value: 'donorId.name' },
        { text: 'Hall', value: 'donorId.hall' },
        { text: 'Details', value: 'details' },
        { text: 'Operation', value: 'operation' }
      ],
      volunteerListHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Hall', value: 'hall' },
        { text: 'Student ID', value: 'studentId' },
        { text: 'Activity Count', value: 'logCount' }
      ],

      statsShown: false,
      logsShown: false,
      volunteersShown: false,

      logCountLoader: false,
      logs: [],
      valuesForSparkLine: [],
      labelsForSparkLine: []
    }
  }

}
</script>

<style scoped>

</style>
