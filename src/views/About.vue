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
                <td><b>App Loader: </b></td>
                <td>{{ nativeAppVersion }}</td>
              </tr>
              <tr>
                <td><b>Build:</b></td>
                <td>{{ $getEnvironmentName() }}</td>
              </tr>
              <tr>
                <td><b>Webview: </b></td>
                <td>{{ getWebviewAppVersion }}</td>
              </tr>
              <tr>
                <td><b>TWA: </b></td>
                <td>{{ getTWAAppVersion }} </td>
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
  getIsCapacitorNative,
  getIsWebview,
  getCapacitorLocalAppVersion,
  getWebViewLocalAppVersion,
  getIsTWA,getTWALocalAppVersion
} from '@/plugins/android_support'
import { isAppVersionBackdated } from '@/mixins/helpers'

export default {
  name: 'About',
  computed: {
    ...mapGetters('frontendSettings', ['getSettings']),
    ...mapGetters('githubRelease', ['getGithubVersion', 'getGithubLink', 'getGithubReleaseLoader']),
    isAndroidApp () {
      return getIsCapacitorNative()
    },
    getBuildTime () {
      return new Date(document.documentElement.dataset.buildTimestampUtc).toLocaleString()
    },
    isMobile () {
      return getIsCapacitorNative()
    },
    getGooglePlayAppVersion () {
      return this.getSettings.version
    },
    getWebviewAppVersion (){
      return `${getIsWebview()?"detected":"not detected"} v: ${getWebViewLocalAppVersion()} u: ${isAppVersionBackdated(getWebViewLocalAppVersion(),this.getSettings.version)?"required":"not required"}`
    },
    getTWAAppVersion () {
      return `${getIsTWA()?"detected":"not detected"} v: ${getTWALocalAppVersion()} u: ${isAppVersionBackdated(getTWALocalAppVersion(), this.getSettings.version)?"required":"not required"}`
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
    if (getIsCapacitorNative()) {
      this.nativeAppVersion = 'Capacitor'
      return
    }
    if (getIsWebview()) {
      this.nativeAppVersion = 'Webview'
      return
    }
    if (getIsTWA()) {
      this.nativeAppVersion = 'TWA'
    }
  }
}
</script>

<style scoped>

</style>
