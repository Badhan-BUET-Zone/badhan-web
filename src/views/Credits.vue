<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>

      <Container>
        <v-card-title>
          Feedback
        </v-card-title>
        <v-card-text>
          <div>If you love using this app, give a review in Google play store :D It would really inspire us to keep this
            app alive.
          </div>
          <div>Note: contact mirmahathir1@gmail.com for any further assistance</div>
        </v-card-text>
      </Container>

      <transition name="slide-fade-down-snapout" mode="out-in">
      <Container v-if="getCreditsLoaderFlag" :key="'creditedLoading'">
        <v-card-title class="grey--text">
          Active Developers
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" sm="6">
              <SkeletonPersonCredit></SkeletonPersonCredit>
            </v-col>
          </v-row>
        </v-card-text>
      </Container>
      <Container v-else-if="getCredits!==null" :key="'creditedLoaded'">
        <v-card-title>
          Active Developers
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" v-for="(person, index) in getCredits['Active Developers']" :key="index">
              <PersonCredit :person="person">
              </PersonCredit>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-title>
          Contributors from Badhan
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" v-for="(person, index) in getCredits['Contributors of Badhan']" :key="index">
              <PersonCredit :person="person"></PersonCredit>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-title>
          Legacy Developers
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" v-for="(person, index) in getCredits['Legacy Developers']" :key="index">
              <PersonCredit :person="person"></PersonCredit>
            </v-col>
          </v-row>
        </v-card-text>
      </Container>
      </transition>
  </div>
</template>

<script>
import PageTitle from "../components/PageTitle";
import {mapGetters, mapActions} from "vuex";
import Container from "../components/Wrappers/Container";
import PersonCredit from "../components/Credits/PersonCredit";
import SkeletonPersonCredit from "../components/Credits/SkeletonPersonCredit";

export default {
  name: "Credits",
  components: {SkeletonPersonCredit, PersonCredit, Container, PageTitle},
  computed: {
    ...mapGetters('statistics', ['getCredits', 'getCreditsLoaderFlag']),
  },
  data() {
    return {

    }
  },
  methods: {
    ...mapActions('statistics', ['fetchCredits']),
    goTo(url) {
      window.open(url, '_blank');
    }
  },
  mounted() {
    this.$vuetify.goTo(0);
    this.fetchCredits();
  }
};
</script>

<style scoped>
</style>
