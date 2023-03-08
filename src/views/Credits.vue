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
      <Container v-if="contributorsLoader" :key="'creditedLoading'">
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
      <Container v-else-if="activeDevelopers.length!==0" :key="'creditedLoaded'">
        <v-card-title>
          Active Developers
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" v-for="(person, index) in activeDevelopers" :key="index">
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
            <v-col cols="12" sm="6" v-for="(person, index) in contributorsFromBadhan" :key="index">
              <PersonCredit :person="person"></PersonCredit>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-title>
          Legacy Developers
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" v-for="(person, index) in legacyDevelopers" :key="index">
              <PersonCredit :person="person"></PersonCredit>
            </v-col>
          </v-row>
        </v-card-text>
      </Container>
      </transition>
  </div>
</template>

<script>
import PageTitle from '../components/PageTitle'
import { mapGetters, mapActions } from 'vuex'
import Container from '../components/Wrappers/Container'
import PersonCredit from '../components/Credits/PersonCredit'
import SkeletonPersonCredit from '../components/Credits/SkeletonPersonCredit'
import { handleGETContributors } from '@/api'

export default {
  name: 'CreditsPage',
  components: { SkeletonPersonCredit, PersonCredit, Container, PageTitle },
  computed: {
    ...mapGetters('statistics', ['getCredits', 'getCreditsLoaderFlag'])
  },
  data () {
    return {
      contributorsLoader: false,
      activeDevelopers: [],
      contributorsFromBadhan: [],
      legacyDevelopers: []
    }
  },
  methods: {
    ...mapActions('statistics', ['fetchCredits']),
    goTo (url) {
      window.open(url, '_blank')
    }
  },
  async mounted () {
    this.$vuetify.goTo(0)
    // this.fetchCredits()
    this.contributorsLoader = true
    const response = await handleGETContributors()
    this.contributorsLoader = false
    if (response.status !== 200) return
    const rawContributors = response.data
    const groupedContributors = Object.entries(rawContributors).reduce(function (obj, singleElement) {
      const type = singleElement[1].type
      if (!Object.prototype.hasOwnProperty.call(obj, type)) {
        obj[type] = []
      }
      obj[type].push(singleElement[1])
      return obj
    }, {})
    this.activeDevelopers = groupedContributors['Active Developers']
    this.legacyDevelopers = groupedContributors['Legacy Developers']
    this.contributorsFromBadhan = groupedContributors['Contributors of Badhan']
    console.log(this.activeDevelopers)
    console.log(this.legacyDevelopers)
    console.log(this.contributorsFromBadhan)
  }
}
</script>

<style scoped>
</style>
