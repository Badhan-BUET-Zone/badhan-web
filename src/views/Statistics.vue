<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <v-card max-width="500" class="pa-4 rounded-xl" v-if="getStatisticsLoaderFlag">
      <v-progress-circular
          indeterminate
          color="primary"
      ></v-progress-circular>
    </v-card>
    <v-card v-if="getStatistics!==null" max-width="500" class="pa-4 rounded-xl">
      <v-card-text>
        <p><b>Number of donors: </b>{{getStatistics.donorCount}}</p>
        <p><b>Number of donations: </b>{{getStatistics.donationCount}}</p>
        <p><b>Number of volunteers: </b>{{getStatistics.volunteerCount}}</p>
      </v-card-text>
    </v-card>

    <v-card max-width="500" class="pa-4 rounded-xl" v-if="getLogsLoaderFlag">
      <v-progress-circular
          indeterminate
          color="primary"
      ></v-progress-circular>
    </v-card>

      <v-data-table
          v-if="getLogs!==null"
          :headers="headers"
          :items="getLogs"
          :items-per-page="5"
          class="elevation-1 ma-2"
      ></v-data-table>

  </div>
</template>

<script>
import PageTitle from "@/components/PageTitle";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Statistics",
  components: {PageTitle},
  computed:{
    ...mapGetters('statistics',['getStatisticsLoaderFlag','getStatistics','getLogs','getLogsLoaderFlag'])
  },
  methods:{
    ...mapActions('notification', ['notifyError', 'notifySuccess', 'notifyInfo']),
    ...mapActions('statistics',['fetchStatistics','fetchLogs']),
  },
  async mounted() {
    // this.notifyInfo('Page under construction');
    await this.fetchStatistics();
    await this.fetchLogs();
  },
  data(){
    return{
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Hall', value: 'hall'},
        { text: 'Date', value: 'date'},
        {text: "Update", value: 'editedObject'},
        {text: "Operation", value: 'operation'}
      ],
    }
  }
}
</script>

<style scoped>

</style>
