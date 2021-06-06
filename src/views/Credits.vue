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

      <v-card class="pa-2 mx-auto mt-1 rounded-xl" v-if="getCreditsLoaderFlag">
        <v-progress-circular
            indeterminate
            color="primary"
        ></v-progress-circular>
      </v-card>
      <v-card class="mx-auto mt-1 rounded-xl" v-if="getCredits!==null">
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
                    <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                    ></v-progress-circular>
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
                    <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                    ></v-progress-circular>
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
                    <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                    ></v-progress-circular>
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
    </v-container>
  </div>
</template>

<script>
import ContributorCard from "@/components/Credits/ContributorCard";
import PageTitle from "../components/PageTitle";
import {mapGetters, mapActions} from "vuex";

export default {
  name: "Credits",
  components: {PageTitle, ContributorCard},
  computed: {
    ...mapGetters('statistics', ['getCredits', 'getCreditsLoaderFlag']),
  },
  data() {
    return {
      contributors: [
        {
          name: 'Mir Mahathir Mohammad',
          subtitle: 'Frontend Developer',
          image: 'https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Fmahathir.jpg?alt=media',
          descriptions: ['UX Design', 'Web Frontend Development', 'Hybrid Android App Development', 'API Development'],
          links: [
            {icon: 'facebook', color: 'primary', link: 'https://web.facebook.com/MirMahathirMohammad'},
            {icon: 'gmail', color: 'red', link: 'mailto:mirmahathir1@gmail.com'},
            {icon: 'linkedin', color: 'blue', link: 'https://www.linkedin.com/in/mir-mahathir-59bb671a5/'},
            {icon: 'github', color: 'grey', link: 'https://github.com/mirmahathir1'}
          ]
        },
        {
          name: 'MH Rahat',
          subtitle: 'Platform Manager',
          image: 'https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Frahat.jpg?alt=media',
          descriptions: ['Initiator of Badhan Website and Android App', 'Test and Bug Report'],
          links: [
            {icon: 'facebook', color: 'primary', link: 'https://www.facebook.com/mhrahat01'},
            {icon: 'gmail', color: 'red', link: 'mailto:mahamudulrahat@gmail.com'},
          ]
        },
        {
          name: 'Aniruddha GS',
          subtitle: 'Backend Developer',
          image: 'https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Faniruddha.jpg?alt=media',
          descriptions: ['API Development', 'Database Administration'],
          links: [
            {icon: 'facebook', color: 'primary', link: 'https://www.facebook.com/aniruddhags3927'},
            {icon: 'gmail', color: 'red', link: 'mailto:aniruddhags3927@gmail.com'},
            {icon: 'linkedin', color: 'blue', link: 'https://www.linkedin.com/in/aniruddha-ganguly-91b707136/'},
            {icon: 'github', color: 'grey', link: 'https://github.com/ags3927'}
          ]
        },
        {
          name: "Atiqur Rahman Shuvo",
          subtitle: 'Backend Developer',
          image: 'https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Fatiq.jpg?alt=media',
          descriptions: ["Database Administration"],
          links: [
            {icon: 'facebook', color: 'primary', link: 'https://www.facebook.com/Shiroe041'},
            {icon: 'gmail', color: 'red', link: 'mailto:arshuvo2015@gmail.com'},
            {icon: 'linkedin', color: 'blue', link: 'https://www.linkedin.com/in/atiqur-rahman-shuvo-14173b1aa/'},
            {icon: 'github', color: 'grey', link: 'https://github.com/SchrodingersCat041'}
          ]
        },
        {
          name: 'Priyeta Saha',
          subtitle: 'Android App Developer',
          image: 'https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Fpriyeta.jpg?alt=media',
          descriptions: ['Flutter Android App Development'],
          links: [
            {icon: 'facebook', color: 'primary', link: 'https://www.facebook.com/profile.php?id=100010509641367'},
            {icon: 'gmail', color: 'red', link: 'mailto:priyetasaha@gmail.com'},
            {icon: 'github', color: 'grey', link: 'https://github.com/prism97'},
            {icon: 'linkedin', color: 'blue', link: 'https://www.linkedin.com/in/priyeta-saha-929629151/'}
          ]
        },
        {
          name: 'Anisha Islam',
          subtitle: 'Backend Developer',
          image: 'https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Fanisha.jpg?alt=media',
          descriptions: ['API Development'],
          links: [
            {icon: 'facebook', color: 'primary', link: 'https://www.facebook.com/anisha.islam.1690'},
            {icon: 'linkedin', color: 'blue', link: 'https://www.linkedin.com/in/anishaislam8/'},
          ]
        }
      ],
      badhanContributors: [
        {
          name: 'Shadman Sakib Showrov',
          image: 'https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Fsadman.jpg?alt=media',
          links: [
            {icon: 'facebook', color: 'primary', link: 'https://www.facebook.com/Showrov1996'},
            {icon: 'linkedin', color: 'blue', link: 'https://www.linkedin.com/in/showrov1996/'},
            {icon: 'gmail', color: 'red', link: 'mailto:showrov.ndc16@gmail.com'},
          ]
        }
      ]
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
