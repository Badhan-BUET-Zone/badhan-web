<template>
    <Container>
      <v-card-title>
        Activity Summary
      </v-card-title>
      <transition name="slide-fade-down-snapout" mode="out-in">
        <LoadingMessage :key="'loadingStats'" v-if="getStatisticsLoaderFlag"/>
        <v-card-text :key="'loadedStats'" v-if="getStatistics!==null">
          <p id="statsNumberOfDonors"><b>Number of donors: </b><br>{{ getStatistics.donorCount }}</p>
          <p><b>Number of donations: </b><br>{{ getStatistics.donationCount }}</p>
          <p><b>Number of volunteers: </b><br>{{ getStatistics.volunteerCount }}</p>
        </v-card-text>
      </transition>
    </Container>
</template>

<script>
import Container from '../../components/Wrappers/Container'
import { mapActions, mapGetters } from 'vuex'
import LoadingMessage from '@/components/LoadingMessage.vue'

export default {
  name: 'StatsPage',
  components: {
    LoadingMessage,
    Container
  },
  data: () => {
    return {
      statsShown: false
    }
  },
  computed: {
    ...mapGetters('statistics', ['getStatisticsLoaderFlag', 'getStatistics', 'getLogs', 'getLogsLoaderFlag', 'getLogDeleteFLag', 'getVolunteers', 'getVolunteerLoaderFlag'])
  },
  methods: {
    ...mapActions('statistics', ['fetchStatistics'])

  },
  mounted () {
    this.fetchStatistics()
    this.statsShown = true
  }
}
</script>

<style scoped>

</style>
