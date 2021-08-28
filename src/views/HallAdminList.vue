<template>
  <div>
    <PageTitle>
      <HelpTooltip>
        <div>
          Here you can view the hall admins
        </div>
      </HelpTooltip>
    </PageTitle>
    <Container>
      <transition name="slide-fade-down" mode="out-in">
        <v-simple-table :key="'hallAdminsLoading'" v-if="getHallAdminsLoaderFlag">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Hall Name
              </th>
              <th class="text-left">
                Admin
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
            </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-simple-table v-if="getHallAdmins!==null && !getHallAdminsLoaderFlag" :key="'hallAdminsLoaded'">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Hall Name
              </th>
              <th class="text-left">
                Admin
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(hallAdmin,index) in getHallAdmins"
                :key="index"
            >
              <td>{{ halls[hallAdmin.hall] }}</td>
              <td>{{ hallAdmin.name }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </transition>
    </Container>
  </div>
</template>

<script>
import {halls} from '@/mixins/constants';
import {mapActions, mapGetters, mapMutations} from "vuex";
import PageTitle from "../components/PageTitle";
import HelpTooltip from "../components/UI Components/HelpTooltip";
import Container from "../components/Wrappers/Container";

export default {
  name: "SuperAdminPanel",
  components: {Container, PageTitle,HelpTooltip},
  data: function () {
    return {
      hallAdmins: [],
      halls,
      newAdminPhone: '',
      password: '',
      batch: '',
      loadingComplete: false,

      changeHallAdminLoaderFlag: false,
    }
  },
  computed: {
    ...mapGetters(['getHallAdmins', 'getHallAdminsLoaderFlag']),
  },
  methods: {
    ...mapActions(['fetchHallAdmins']),
    ...mapMutations(['clearHallAdmins']),
  },
  created() {
  },
  mounted() {
    this.fetchHallAdmins();
  },
  beforeRouteLeave(to,from,next){
    this.clearHallAdmins();
    next();
  },
}
</script>

<style scoped>

</style>
