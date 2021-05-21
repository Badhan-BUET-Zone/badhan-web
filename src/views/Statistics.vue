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
  </div>
</template>

<script>
import PageTitle from "@/components/PageTitle";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Statistics",
  components: {PageTitle},
  computed:{
    ...mapGetters('statistics',['getStatisticsLoaderFlag','getStatistics'])
  },
  methods:{
    ...mapActions('notification', ['notifyError', 'notifySuccess', 'notifyInfo']),
    ...mapActions('statistics',['fetchStatistics']),
  },
  async mounted() {
    // this.notifyInfo('Page under construction');
    await this.fetchStatistics();
  }
}
</script>

<style scoped>

</style>
