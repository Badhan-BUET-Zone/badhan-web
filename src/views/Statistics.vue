<template>
  <div>
    <PageTitle></PageTitle>
    <v-tabs class="rounded-xl" centered
            next-icon="mdi-arrow-right-bold-box-outline"
            prev-icon="mdi-arrow-left-bold-box-outline"
            show-arrows
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab to="/statistics/logsByDate" style="text-decoration: none">
        Logs by Date
      </v-tab>
      <v-tab to="/statistics/recentLogs" style="text-decoration: none">
        Recent Logs
      </v-tab>
      <v-tab to="/statistics/volunteersAll" style="text-decoration: none">
        All Volunteers
      </v-tab>
      <v-tab to="/statistics/stats" style="text-decoration: none">
        Stats
      </v-tab>
    </v-tabs>
    <transition name="slide-fade" mode="out-in">
    <router-view></router-view>
    </transition>

  </div>
</template>

<script>
import PageTitle from "../components/PageTitle";

export default {
  name: "Statistics",
  components: {PageTitle},
  data() {
    return {}
  },

}
</script>

<style scoped>

</style>
