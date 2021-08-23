<template>
  <div>
    <PageTitle>
      <HelpTooltip>
        <div>
          Here you can view all the volunteers of your own hall
        </div>
      </HelpTooltip>
    </PageTitle>
    <Container>
      <transition name="slide-fade-down" mode="out-in">
      <v-simple-table v-if="getVolunteerLoader" :key="'volunteerLoading'">
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">
              Name
            </th>
            <th class="text-left">
              Batch
            </th>
            <th class="text-left">
              Department
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="index in 3"
              :key="index"
          >
            <td><v-skeleton-loader type="text"></v-skeleton-loader></td>
            <td><v-skeleton-loader type="text"></v-skeleton-loader></td>
            <td><v-skeleton-loader type="text"></v-skeleton-loader></td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-simple-table v-if="getVolunteers.length!==0" :key="'volunteerLoaded'">
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-left">
              Name
            </th>
            <th class="text-left">
              Batch
            </th>
            <th class="text-left">
              Department
            </th>
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
      </transition>
    </Container>
  </div>
</template>

<script>
import {bloodGroups, halls, departments} from "@/mixins/constants";
import {mapGetters, mapActions, mapMutations} from "vuex";
import PageTitle from "../components/PageTitle";
import HelpTooltip from "../components/UI Components/HelpTooltip";
import Container from "../components/Wrappers/Container";

export default {
  name: "VolunteerList",
  components: {
    Container,
    PageTitle,
    HelpTooltip
  },
  data: function () {
    return {
      //constants
      bloodGroups,
      halls,
      departments,

      seeVolunteersFlag: !this.$isMobile(),

    };
  },
  computed: {
    ...mapGetters('halladmin', ['getVolunteerLoader', 'getVolunteers']),
  },

  filters: {
    idToDept(studentID) {
      return departments[Number(studentID.toString().substr(2, 2))];
    },
    numToBloodGroup(num) {
      return bloodGroups[num];
    },
  },
  methods: {
    ...mapActions('notification', ['notifySuccess', 'notifyError']),
    ...mapActions('halladmin', ['fetchVolunteers']),
    ...mapMutations('halladmin',['clearVolunteers']),
  },
  mounted() {
    this.fetchVolunteers();
  },
  beforeRouteLeave(to,from,next){
    this.clearVolunteers();
    next();
  },
};
</script>

<style scoped>

</style>
