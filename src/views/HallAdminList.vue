<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <v-card max-width="500" class="pa-4 mx-auto rounded-xl">
      <transition name="slide-fade-down" mode="out-in">
        <div :key="'hallAdminsLoading'" v-if="getHallAdminsLoaderFlag">
        <table  class="table table-hover">
          <thead>
          <tr>
            <th scope="col">Hall Name</th>
            <th scope="col">Hall Admin</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="index in 3" :key="index">
            <th scope="row">
              <v-skeleton-loader type="text"></v-skeleton-loader>
            </th>
            <td>
              <v-skeleton-loader type="text"></v-skeleton-loader>
            </td>
          </tr>
          </tbody>
        </table>
        </div>
        <div :key="'hallAdminsLoaded'" v-if="getHallAdmins!==null && !getHallAdminsLoaderFlag">
        <table  class="table table-hover" >
          <thead>
          <tr>
            <th scope="col">Hall Name</th>
            <th scope="col">Hall Admin</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(hallAdmin,index) in getHallAdmins" :key="index">
            <th scope="row">{{ halls[hallAdmin.hall] }}</th>
            <td>{{ hallAdmin.name }}</td>
          </tr>
          </tbody>
        </table>
        </div>
      </transition>
    </v-card>
  </div>
</template>

<script>
import {halls} from '@/mixins/constants';
import {mapActions, mapGetters, mapMutations} from "vuex";
import PageTitle from "../components/PageTitle";

export default {
  name: "SuperAdminPanel",
  components: {PageTitle},
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
    ...mapActions(['changeHallAdmin', 'fetchHallAdmins']),
    ...mapMutations(['clearHallAdmins']),
    changeHallAdminClicked() {
      this.changeHallAdmin({newAdminPhone: this.newAdminPhone});
    },
    archiveBatchClicked() {
    },
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
