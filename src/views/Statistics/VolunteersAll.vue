<template>
  <Container>
    <v-card-title>List of all members</v-card-title>
    <transition name="slide-fade-down-snapout" mode="out-in">
      <v-data-table :key="'volunteerLoading'" v-if="getVolunteerLoaderFlag" :loading="true">
      </v-data-table>
      <v-data-table id="statisticsAllVolunteersTableId" :key="'volunteerLoaded'"
                    v-if="volunteersShown"
                    dense
                    :headers="volunteerListHeaders"
                    :items="getVolunteers"
                    :items-per-page="10"
                    class="elevation-1 mt-2"
                    sort-by="logCount"
                    sort-desc
      >
        <template v-slot:[`item.hall`]="{ item }">
          {{item.hall | getHallName}}
        </template>
      </v-data-table>
    </transition>
  </Container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Container from '../../components/Wrappers/Container'

export default {
  name: 'VolunteersAll',
  components: {
    Container
  },
  data () {
    return {
      volunteerListHeaders: [
        { text: 'Name', value: 'name' },
        { text: 'Hall', value: 'hall' },
        { text: 'Student ID', value: 'studentId' },
        { text: 'Activity Count', value: 'logCount' }
      ],
      volunteersShown: false
    }
  },
  computed: {
    ...mapGetters('statistics', ['getVolunteers', 'getVolunteerLoaderFlag'])

  },
  methods: {
    ...mapActions('statistics', ['fetchAllVolunteers'])
  },
  async mounted () {
    await this.fetchAllVolunteers()
    this.volunteersShown = true
  }
}
</script>

<style scoped>

</style>
