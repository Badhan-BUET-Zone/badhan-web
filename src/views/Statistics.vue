<template>
  <div>
    <PageTitle></PageTitle>
    <v-tabs class="rounded-xl" centered
            next-icon="mdi-arrow-right-bold-box-outline"
            prev-icon="mdi-arrow-left-bold-box-outline"
            show-arrows
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab id="statisticsLogsByDateTabId" to="/statistics/logsByDate" style="text-decoration: none">
        Logs by Date
      </v-tab>
      <v-tab id="statisticsAllVolunteersTabId" to="/statistics/membersAll" style="text-decoration: none">
        All Members
      </v-tab>
      <v-tab id="statisticsStatsTabId" to="/statistics/stats" style="text-decoration: none">
        Stats
      </v-tab>
    </v-tabs>
    <transition name="slide-fade" mode="out-in">
    <router-view></router-view>
    </transition>

  </div>
</template>

<script>
import PageTitle from '../components/PageTitle'

export default {
  name: 'StatisticsPage',
  components: { PageTitle },
  data () {
    return {}
  }

}
</script>

<style scoped>

</style>
