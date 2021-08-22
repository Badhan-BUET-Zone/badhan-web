<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <v-card max-width="500" class="pa-4 mx-auto rounded-xl">
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
