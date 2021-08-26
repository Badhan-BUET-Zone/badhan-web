<template>
  <v-card flat>
    <v-card-title>
      {{ logCount.dateString }}
    </v-card-title>
    <v-card-subtitle>
      Activity count: {{ logCount.count }}
    </v-card-subtitle>
    <v-card-text>
      <v-btn rounded color="primary" x-small @click="detailsClick" v-if="dateLogs.length===0 && !dateLogsLoading">
        Details
      </v-btn>
      <v-skeleton-loader type="text@3" v-if="dateLogsLoading"></v-skeleton-loader>
      <div v-for="dateLog in dateLogs">
        <PersonLog :date-log="dateLog" :date-string="logCount.dateString"></PersonLog>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import {handleGETLogsByDate} from "../../api";
import PersonLog from "./PersonLog";

export default {
  props: ["logCount"],
  name: "DateLog",

  data: function () {
    return {
      dateLogs: [],
      dateLogsLoading: false,
    }
  },
  components: {
    PersonLog
  },
  methods: {
    async detailsClick() {
      let splitDate = this.logCount.dateString.split('-');
      let timeStamp = new Date(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2])).getTime();
      this.dateLogsLoading = true;
      let logs = await handleGETLogsByDate({timeStamp});
      this.dateLogsLoading = false;
      if (!logs) return;
      this.dateLogs = logs;

    }
  }
}
</script>

<style lang="sass">

</style>
