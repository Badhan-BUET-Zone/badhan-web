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
        <p><b>Number of donors: </b>{{ getStatistics.donorCount }}</p>
        <p><b>Number of donations: </b>{{ getStatistics.donationCount }}</p>
        <p><b>Number of volunteers: </b>{{ getStatistics.volunteerCount }}</p>
      </v-card-text>
    </v-card>

    <!--    <v-card max-width="500" class="pa-4 rounded-xl" v-if="getLogsLoaderFlag">-->
    <!--      <v-progress-circular-->
    <!--          indeterminate-->
    <!--          color="primary"-->
    <!--      ></v-progress-circular>-->
    <!--    </v-card>-->

    <v-data-table
        dense
        :loading="getLogsLoaderFlag"
        :headers="headers"
        :items="getLogs"
        :items-per-page="10"
        class="elevation-1 ma-2"
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
    <v-btn color="error" rounded :disabled="getLogDeleteFLag" :loading="getLogDeleteFLag" @click="removeAllLogsClicked">
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
    ...mapGetters(['getDesignation'])
  },
  methods: {
    ...mapActions('notification', ['notifyError', 'notifySuccess', 'notifyInfo']),
    ...mapActions('statistics', ['fetchStatistics', 'fetchLogs', 'removeAllLogs']),
    async removeAllLogsClicked() {
      let value = await this.$bvModal.msgBoxConfirm('Confirm deletion of all logs?', {
        centered: true
      });
      if (!value) return;
      await this.removeAllLogs();
    }
  },
  async mounted() {
    // this.notifyInfo('Page under construction');
    if (this.getDesignation !== 3) {
      this.$router.push('/notfound');
      return;
    }
    this.fetchStatistics();
    this.fetchLogs();
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
    }
  },

}
</script>

<style scoped>

</style>
