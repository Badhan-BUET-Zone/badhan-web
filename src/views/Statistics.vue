<template>
  <div>
    <PageTitle></PageTitle>
    <Container>
      <v-btn class="ma-2" color="primary" rounded @click="showStats">Show Stats</v-btn>
      <transition name="slide-fade-down-snapout" mode="out-in">
        <v-card-text :key="'loadingStats'" v-if="getStatisticsLoaderFlag">
          <p><b>Number of donors: </b><br>
            <v-skeleton-loader type="text"></v-skeleton-loader>
          </p>
          <p><b>Number of donations: </b><br>
            <v-skeleton-loader type="text"></v-skeleton-loader>
          </p>
          <p><b>Number of volunteers: </b><br>
            <v-skeleton-loader type="text"></v-skeleton-loader>
          </p>
        </v-card-text>
        <v-card-text :key="'loadedStats'" v-if="getStatistics!==null">
          <p><b>Number of donors: </b><br>{{ getStatistics.donorCount }}</p>
          <p><b>Number of donations: </b><br>{{ getStatistics.donationCount }}</p>
          <p><b>Number of volunteers: </b><br>{{ getStatistics.volunteerCount }}</p>
        </v-card-text>
      </transition>
    </Container>

    <Container>
      <v-card-title>Activity Logs of <br>Badhan BUET Zone</v-card-title>
      <transition name="slide-fade-down" type="out-in">
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

    <Container>
      <v-btn class="ma-2" color="primary" rounded @click="showVolunteers">Show Volunteers</v-btn>
      <v-progress-circular v-if="getVolunteerLoaderFlag" indeterminate color="primary"></v-progress-circular>

      <span v-else-if="volunteersShown">
      <v-card-title>List of all volunteers</v-card-title>
      <v-data-table
          dense
          :headers="volunteerListHeaders"
          :items="getVolunteers"
          :items-per-page="10"
          class="elevation-1 mt-2"
          sort-by="hall"
          sort-desc
      >
        <template v-slot:item.hall="{ item }">
          {{ halls[item.hall] }}
        </template>
      </v-data-table>
      </span>
    </Container>
    <Dialog
        :message="'Delete all logs?'"
        :confirmed="deleteLogsConfirmed"
        :dialog-opened="deleteLogsPromptFlag"
        :canceled="deleteLogsCanceled"
    >
    </Dialog>
  </div>
</template>

<script>
import PageTitle from "@/components/PageTitle";
import {mapActions, mapGetters} from "vuex";
import LogObject from "../components/Statistics/LogObject";
import {halls} from "../mixins/constants";
import {handleGETLogs} from "../api";
import DateLog from "../components/Statistics/DateLog";
import SkeletonDateLog from "../components/Statistics/SkeletonDateLog";
import Container from "../components/Wrappers/Container";
import ContainerFlat from "../components/Wrappers/ContainerFlat";
import Dialog from "../components/Dialog";

export default {
  name: "Statistics",
  components: {Dialog, ContainerFlat, Container, PageTitle, LogObject, DateLog, SkeletonDateLog},
  computed: {
    ...mapGetters('statistics', ['getStatisticsLoaderFlag', 'getStatistics', 'getLogs', 'getLogsLoaderFlag', 'getLogDeleteFLag', 'getVolunteers', 'getVolunteerLoaderFlag']),
    ...mapGetters(['getDesignation']),

  },
  methods: {
    ...mapActions('notification', ['notifyError', 'notifySuccess', 'notifyInfo']),
    ...mapActions('statistics', ['fetchStatistics', 'removeAllLogs', 'getFilteredLogs', 'fetchAllVolunteers']),
    deleteLogsPrompt(){
      this.deleteLogsPromptFlag=true;
    },
    deleteLogsCanceled(){
      this.deleteLogsPromptFlag=false;
    },
    async deleteLogsConfirmed(){
      this.deleteLogsPromptFlag=false;
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
