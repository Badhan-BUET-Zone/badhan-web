<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <v-container fluid>
      <v-card max-width="600" class="mx-auto mt-1 rounded-xl">
        <v-card-title>
          Feedback
        </v-card-title>
        <v-card-text>
          <div>If you love using this app, give a review in Google play store :D It would really inspire us to keep this
            app alive.
          </div>
          <div>Note: contact mirmahathir1@gmail.com for any further assistance</div>
        </v-card-text>
      </v-card>

      <transition name="slide-fade-down-snapout" mode="out-in">
      <v-card class="pa-2 mx-auto mt-1 rounded-xl" v-if="getCreditsLoaderFlag" :key="'creditedLoading'">
        <v-card-title class="grey--text">
          Active Developers
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" sm="4" v-for="index in 3" :key="index">
              <v-card
                  class="mx-auto"
                  outlined
              >
                <v-avatar
                    size="80"
                    color="grey"
                >
                  <v-img dark>
                  </v-img>
                </v-avatar>
                <v-card-title class="grey--text">
                  Name
                </v-card-title>
                <v-card-subtitle class="grey--text">
                  Work Period
                </v-card-subtitle>
                <v-card-text>
                  <v-skeleton-loader type="text@2"></v-skeleton-loader>
                </v-card-text>
                <v-card-actions>
                  <v-btn v-for="i in 2" :key="i" class="white--text" rounded small>
                    <v-icon left dark>mdi-web</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto mt-1 rounded-xl" v-else-if="getCredits!==null" :key="'creditedLoaded'">
        <v-card-title>
          Active Developers
        </v-card-title>

        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" sm="4" v-for="(person, index) in getCredits['Active Developers']" :key="index">
          <v-card
              class="mx-auto"
              outlined
          >
            <v-avatar
                size="80"
                color="grey"
            >
              <v-img :src="person.image" lazy-src="../assets/account.png">
                <template v-slot:placeholder>
                  <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                  >
                    <v-skeleton-loader type="avatar"></v-skeleton-loader>
                  </v-row>
                </template>
              </v-img>
            </v-avatar>
            <v-card-title>
              {{ person.name }}
            </v-card-title>
            <v-card-subtitle>
              {{ person.calender }}
            </v-card-subtitle>

            <v-card-text class="text--primary">
              <div v-for="(description, index) in person.contributions">{{ description }}</div>
            </v-card-text>

            <v-card-actions>
              <v-btn
                  v-for="(link,linkIndex) in person.links"
                  :key="linkIndex"
                  :color="link.color"
                  class="white--text"
                  rounded
                  @click="goTo(link.link)"
                  small
              >
                <v-icon
                    left
                    dark
                >
                  mdi-{{ link.icon }}
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-title>
          Contributors from Badhan
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" sm="4" v-for="(person, index) in getCredits['Contributors of Badhan']" :key="index">
              <v-card
                  class="mx-auto"
                  outlined
              >
            <v-avatar
                size="80"
                color="grey"
            >
              <v-img :src="person.image" lazy-src="../assets/account.png">
                <template v-slot:placeholder>
                  <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                  >
                    <v-skeleton-loader type="avatar"></v-skeleton-loader>
                  </v-row>
                </template>
              </v-img>
            </v-avatar>
            <v-card-title>
              {{ person.name }}
            </v-card-title>
            <v-card-subtitle>
              {{ person.calender }}
            </v-card-subtitle>

            <v-card-text class="text--primary">
              <div v-for="(description, index) in person.contributions">{{ description }}</div>
            </v-card-text>

            <v-card-actions>
              <v-btn
                  v-for="(link,linkIndex) in person.links"
                  :key="linkIndex"
                  :color="link.color"
                  class="white--text"
                  rounded
                  @click="goTo(link.link)"
                  small
              >
                <v-icon
                    left
                    dark
                >
                  mdi-{{ link.icon }}
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-title>
          Legacy Developers
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" sm="4" v-for="(person, index) in getCredits['Legacy Developers']" :key="index">
              <v-card
                  class="mx-auto"
                  outlined
              >
            <v-avatar
                size="80"
                color="grey"
            >
              <v-img :src="person.image" lazy-src="../assets/account.png">
                <template v-slot:placeholder>
                  <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                  >
                    <v-skeleton-loader type="avatar"></v-skeleton-loader>
                  </v-row>
                </template>
              </v-img>
            </v-avatar>
            <v-card-title>
              {{ person.name }}
            </v-card-title>
            <v-card-subtitle>
              {{ person.calender }}
            </v-card-subtitle>

            <v-card-text class="text--primary">
              <div v-for="(description, index) in person.contributions">{{ description }}</div>
            </v-card-text>

            <v-card-actions>
              <v-btn
                  v-for="(link,linkIndex) in person.links"
                  :key="linkIndex"
                  :color="link.color"
                  class="white--text"
                  rounded
                  @click="goTo(link.link)"
                  small
              >
                <v-icon
                    left
                    dark
                >
                  mdi-{{ link.icon }}
                </v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      </transition>
    </v-container>
  </div>
</template>

<script>
import PageTitle from "../components/PageTitle";
import {mapGetters, mapActions} from "vuex";

export default {
  name: "Credits",
  components: {PageTitle},
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
