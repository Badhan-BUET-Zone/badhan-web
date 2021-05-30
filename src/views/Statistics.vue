<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <v-card max-width="500" class="pa-2 rounded-xl" v-if="getStatisticsLoaderFlag">
      <v-progress-circular
          indeterminate
          color="primary"
      ></v-progress-circular>
    </v-card>
    <v-card v-if="getStatistics!==null" max-width="500" class="pa-2 rounded-xl">
      <v-card-text>
        <p><b>Number of donors: </b>{{ getStatistics.donorCount }}</p>
        <p><b>Number of donations: </b>{{ getStatistics.donationCount }}</p>
        <p><b>Number of volunteers: </b>{{ getStatistics.volunteerCount }}</p>
      </v-card-text>
    </v-card>
    <v-card class="mt-4 rounded-xl">
      <v-card-title>Activity Logs of Badhan BUET Zone</v-card-title>
      <v-progress-circular
          v-if="getLogsLoaderFlag"
          indeterminate
          color="primary"
          class="ma-4"
      ></v-progress-circular>
      <v-card-text v-else>
        <v-row class="fill-height">
          <v-col>
            <v-sheet height="64">
              <v-toolbar
                  flat
              >
                <v-btn
                    outlined
                    class="mr-4"
                    color="grey darken-2"
                    @click="setToday"
                >
                  Today
                </v-btn>
                <v-btn
                    fab
                    text
                    small
                    color="grey darken-2"
                    @click="prev"
                >
                  <v-icon small>
                    mdi-chevron-left
                  </v-icon>
                </v-btn>
                <v-btn
                    fab
                    text
                    small
                    color="grey darken-2"
                    @click="next"
                >
                  <v-icon small>
                    mdi-chevron-right
                  </v-icon>
                </v-btn>
                <v-toolbar-title v-if="$refs.calendar">
                  {{ $refs.calendar.title }}
                </v-toolbar-title>

              </v-toolbar>
            </v-sheet>
            <v-sheet height="600">
              <v-calendar
                  ref="calendar"
                  v-model="focus"
                  color="primary"
                  :events="events"
                  :event-color="getEventColor"
                  :type="'month'"
                  @click:date="viewDay"
              ></v-calendar>

            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mt-4 rounded-xl" v-if="selectedDate===null">
      <v-card-text>
        Please choose a date to see the logs
      </v-card-text>
    </v-card>
    <v-card v-else class="mt-4 rounded-xl">
      <v-card-title>Logs of {{selectedDate.toDateString()}}</v-card-title>
    <v-data-table
        dense
        :headers="headers"
        :items="getLogsByDate"
        :items-per-page="10"
        class="elevation-1 mt-2"
        sort-by="date"
        sort-desc
    >
      <template v-slot:item.editedObject="{ item }">
        <LogObject :object="item.editedObject"></LogObject>
      </template>
      <template v-slot:item.date="{ item }">
        {{ new Date(item.date).toLocaleString() }}
      </template>
      <template v-slot:item.hall="{ item }">
        {{ halls[item.hall] }}
      </template>
    </v-data-table>
    </v-card>
    <v-btn class="mt-2" color="error" rounded :disabled="getLogDeleteFLag" :loading="getLogDeleteFLag" @click="removeAllLogsClicked">
      Delete All Logs
    </v-btn>
  </div>
</template>

<script>
import PageTitle from "@/components/PageTitle";
import {mapActions, mapGetters} from "vuex";
import LogObject from "../components/Statistics/LogObject";
import {halls} from "../mixins/constants";

export default {
  name: "Statistics",
  components: {PageTitle, LogObject},
  computed: {
    ...mapGetters('statistics', ['getStatisticsLoaderFlag', 'getStatistics', 'getLogs', 'getLogsLoaderFlag', 'getLogDeleteFLag']),
    ...mapGetters(['getDesignation']),
    getLogsByDate() {
      if (this.selectedDate === null) {
        return [];
      }
      let filteredLogs = this.getLogs.filter((log) => {
        return new Date(log.date).toDateString() === this.selectedDate.toDateString();
      })
      return filteredLogs
    }
  },
  methods: {
    ...mapActions('notification', ['notifyError', 'notifySuccess', 'notifyInfo']),
    ...mapActions('statistics', ['fetchStatistics', 'fetchLogs', 'removeAllLogs', 'getFilteredLogs']),
    async removeAllLogsClicked() {
      let value = await this.$bvModal.msgBoxConfirm('Confirm deletion of all logs?', {
        centered: true
      });
      if (!value) return;
      await this.removeAllLogs();
    },


    ///////////////////////////CALENDER
    async viewDay({date}) {
      this.focus = date
      this.selectedDate = new Date(date);
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = ''
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },

    updateRange() {
      const events = []

      this.getLogs.forEach((log) => {
        events.push({
          name: log.operation,
          start: new Date(log.date),
          color: 'secondary',
          timed: true,
        })
      })

      this.events = events
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },

  },
  async mounted() {
    // this.notifyInfo('Page under construction');
    if (this.getDesignation !== 3) {
      this.$router.push({name: 'NotFound'});
      return;
    }
    this.fetchStatistics();
    await this.fetchLogs();
    this.updateRange();

  },
  data() {
    return {
      halls,
      headers: [
        {text: 'Time', value: 'date'},
        {text: 'Name', value: 'name'},
        {text: 'Hall', value: 'hall'},
        {text: "Update", value: 'editedObject'},
        {text: "Operation", value: 'operation'}
      ],

      ////////////////////////////////////////////////////////////// CALENDER
      focus: '',

      selectedDate: null,
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],

    }
  },

}
</script>

<style scoped>

</style>
