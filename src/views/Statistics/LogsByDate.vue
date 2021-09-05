<template>
  <div>
    <Container>
      <v-card-title>Activity Logs of <br>Badhan BUET Zone</v-card-title>
      <transition name="slide-fade-down-snapout" type="out-in">
        <v-card-text v-if="logCountLoader" :key="'logLoader'">
          <v-row>
            <v-col cols="12" sm="4" v-for="i in 3" :key="i">
              <SkeletonDateLog></SkeletonDateLog>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text v-else :key="'logLoaded'">
          <v-row>
            <v-col cols="12" sm="4" v-for="(logCount,i) in logCountPerDay" :key="i">
              <DateLog :log-count="logCount" :key="i"></DateLog>
            </v-col>
          </v-row>
        </v-card-text>
      </transition>

      <v-card-actions>
        <v-btn class="mt-2" color="error" rounded :disabled="getLogDeleteFLag"
               :loading="getLogDeleteFLag"
               @click="deleteLogsPrompt">
          <v-icon left>
            mdi-delete
          </v-icon>
          Delete All Logs
        </v-btn>
      </v-card-actions>
    </Container>

  </div>
</template>


<script>
import PageTitle from "../../components/PageTitle";
import {mapActions, mapGetters} from "vuex";
import LogObject from "../../components/Statistics/LogObject";
import {halls} from "../../mixins/constants";
import {handleGETLogs} from "../../api";
import DateLog from "../../components/Statistics/DateLog";
import SkeletonDateLog from "../../components/Statistics/SkeletonDateLog";
import Container from "../../components/Wrappers/Container";
import ContainerFlat from "../../components/Wrappers/ContainerFlat";
import Dialog from "../../components/Dialog";

export default {
  name: "LogsByDate",
  components: {Dialog, ContainerFlat, Container, PageTitle, LogObject, DateLog, SkeletonDateLog},
  computed: {
    ...mapGetters('statistics', ['getStatisticsLoaderFlag', 'getStatistics', 'getLogs', 'getLogsLoaderFlag', 'getLogDeleteFLag', 'getVolunteers', 'getVolunteerLoaderFlag']),
    ...mapGetters(['getDesignation']),

  },
  methods: {
    ...mapActions('notification', ['notifyError', 'notifySuccess', 'notifyInfo']),
    ...mapActions('statistics', ['fetchStatistics', 'removeAllLogs', 'getFilteredLogs', 'fetchAllVolunteers']),
    deleteLogsPrompt() {
      this.deleteLogsPromptFlag = true;
    },
    deleteLogsCanceled() {
      this.deleteLogsPromptFlag = false;
    },
    async deleteLogsConfirmed() {
      this.deleteLogsPromptFlag = false;
      await this.removeAllLogs();
      this.logCountPerDay = [];
    },

    async showStats() {
      this.fetchStatistics();
      this.statsShown = true;
    },

    async showVolunteers() {

      await this.fetchAllVolunteers();
      this.volunteersShown = true;
    }
  },
  async mounted() {
    // this.notifyInfo('Page under construction');
    if (this.getDesignation !== 3) {
      this.$router.push({name: 'NotFound'});
      return;
    }

    this.logCountLoader = true;
    let logs = await handleGETLogs();
    this.logCountLoader = false;
    if (!logs) return;
    this.logCountPerDay = logs;
  },
  data() {
    return {
      tabs: null,
      deleteLogsPromptFlag: false,
      halls,
      headers: [
        {text: 'Time', value: 'date'},
        {text: 'Name', value: 'donorId.name'},
        {text: 'Hall', value: 'donorId.hall'},
        {text: "Details", value: 'details'},
        {text: "Operation", value: 'operation'}
      ],
      volunteerListHeaders: [
        {text: 'Name', value: 'name'},
        {text: 'Hall', value: 'hall'},
        {text: 'Student ID', value: 'studentId'},
        {text: 'Activity Count', value: 'logCount'}
      ],

      statsShown: false,
      logsShown: false,
      volunteersShown: false,

      logCountLoader: false,
      logCountPerDay: [],

    }
  },

}
</script>

<style scoped>

</style>
