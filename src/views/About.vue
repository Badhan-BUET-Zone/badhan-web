<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <transition-group name="slide-fade-down-snapout" mode="out-in">
      <Container :key="'aboutPage'">
        <v-card-text>
          <VueMarkdown>{{ text }}</VueMarkdown>
        </v-card-text>
      </Container>
      <Container :key="'versionLoaded'">
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
              <tr>
                <td><b>Google Play Version: </b></td>
                <td>{{ getGooglePlayAppVersion }}</td>
              </tr>
              <tr>
                <td><b>Build:</b></td>
                <td>{{ $getEnvironmentName() }}</td>
              </tr>
              <tr>
                <td><b>TWA: </b></td>
                <td>{{ isTWADetected }} </td>
              </tr>
              <tr>
                <td><b>Last Updated:</b></td>
                <td>{{getBuildTime}}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </Container>
    </transition-group>
  </div>
</template>

<script>
/* eslint-disable */
import PageTitle from '../components/PageTitle'
import VueMarkdown from 'vue-markdown'
import overview from '../../overview.md'
import Container from '../components/Wrappers/Container'
import { mapGetters } from 'vuex'
import {
  getIsTWA
} from '@/plugins/android_support'

export default {
  name: 'About',
  computed: {
    ...mapGetters('frontendSettings', ['getSettings']),
    getBuildTime () {
      return new Date(document.documentElement.dataset.buildTimestampUtc).toLocaleString()
    },
    getGooglePlayAppVersion () {
      return this.getSettings.version
    },
    isTWADetected () {
      return `${getIsTWA()?"detected":"not detected"}`
    },
  },
  components: { Container, PageTitle, VueMarkdown },
  data () {
    return {
      text: overview,
      nativeAppVersion: 'Web'
    }
  },
  async mounted () {
    if (getIsTWA()) {
      this.nativeAppVersion = 'TWA'
    }
  }
}
</script>

<style scoped>

</style>
