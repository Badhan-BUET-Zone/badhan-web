<template>
  <div>
    <PageTitle>
    </PageTitle>
    <Container>
      <transition name="slide-fade-down" mode="out-in">
      <div v-if="getMemberLoaderFlag" :key="'membersLoading'">
        <v-card-title>
          Loading Members
        </v-card-title>
        <v-skeleton-loader type="article">
        </v-skeleton-loader>
      </div>
        <div v-else :key="'membersLoaded'">
        <v-card-title :key="'volunteerTitle'">
          Volunteers of {{ getHall | getHallName }} hall
        </v-card-title>

        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Batch</th>
                <th class="text-left">Department</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(volunteer,index) in getVolunteers"
                  :key="index"
              >
                <td>{{ volunteer.name }}</td>
                <td>{{ volunteer.studentId.substr(0, 2) }}</td>
                <td>{{ volunteer.studentId | idToDept }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-title>
          Hall Admins of all halls
        </v-card-title>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">
                  Hall
                </th>
                <th class="text-left">
                  Name
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(hallAdmin,index) in getHallAdmins"
                  :key="index"
              >
                <td>{{ hallAdmin.hall | getHallName }}</td>
                <td>{{ hallAdmin.name }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-title>
          Super Admins
        </v-card-title>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">
                  Name
                </th>
                <th class="text-left">
                  Phone
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(superAdmin,index) in getSuperAdmins"
                  :key="index"
              >
                <td>{{ superAdmin.name }}</td>
                <td>+{{ superAdmin.phone }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        </div>
      </transition>
    </Container>

  </div>
</template>

<script>
import PageTitle from '../components/PageTitle'
import Container from '../components/Wrappers/Container'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Members',
  components: { Container, PageTitle },
  computed: {
    ...mapGetters('members', ['getVolunteers', 'getHallAdmins', 'getSuperAdmins', 'getMemberLoaderFlag']),
    ...mapGetters(['getHall'])
  },
  methods: {
    ...mapActions('members', ['fetchMembers'])
  },
  async mounted () {
    await this.fetchMembers()
  }
}
</script>

<style scoped>

</style>
