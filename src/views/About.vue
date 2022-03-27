<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <transition-group name="slide-fade-down-snapout" mode="out-in">
      <Container :key="'versionLoaded'">
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
              <tr>
                <td><b>App Version on Google Play: </b></td>
                <td>{{ getGooglePlayAppVersion }}</td>
              </tr>
              <tr>
                <td><b>Local App Version: </b></td>
                <td>{{ nativeAppVersion }}</td>
              </tr>
              <tr>
                <td><b>Github Release Version: </b></td>
                <td><span v-if="versionLoaderFlag"><v-skeleton-loader type="text"></v-skeleton-loader></span><span v-else>{{githubVersion}}</span></td>
              </tr>
              <tr>
                <td><b>Download from Github: </b></td>
                <td><v-btn rounded :loading="versionLoaderFlag" x-small :href="githubLink" style="text-decoration: none"><v-icon left>mdi-download</v-icon>Download</v-btn></td>
              </tr>
              <tr>
                <td><b>Database:</b></td>
                <td>{{ $getEnvironmentName() }}</td>
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
      <Container :key="'aboutPage'">
        <v-card-text>
          <VueMarkdown>{{ text }}</VueMarkdown>
        </v-card-text>
      </Container>
    </transition-group>

  </div>

</template>

<script>
import PageTitle from '../components/PageTitle'
import VueMarkdown from 'vue-markdown'
import readme from '../../README.md'
import Container from '../components/Wrappers/Container'
import { mapGetters } from 'vuex'
import { getIsNative, getLocalAppVersion } from '../plugins/android_support'
import { handleGETAppVersions } from '../api'

export default {
  name: 'About',
  computed: {
    ...mapGetters('release', ['getAppVersion', 'getAppDetailsLoader']),
    ...mapGetters('frontendSettings', ['getSettings']),
    isAndroidApp () {
      return getIsNative()
    },
    getBuildTime () {
      return new Date(document.documentElement.dataset.buildTimestampUtc).toLocaleString()
    },
    isMobile () {
      return getIsNative()
    },
    getGooglePlayAppVersion () {
      return this.getSettings.version
    }

  },
  components: { Container, PageTitle, VueMarkdown },
  data () {
    return {
      text: readme,
      nativeAppVersion: 'Web',
      versionLoaderFlag: false,
      githubVersion: 'None',
      githubLink: 'https://github.com'
    }
  },
  async mounted () {
    if (getIsNative()) {
      this.nativeAppVersion = await getLocalAppVersion()
    }
    this.versionLoaderFlag = true
    const appVersionResponse = await handleGETAppVersions()
    this.versionLoaderFlag = false
    if (appVersionResponse.status !== 200) return
    this.githubVersion = appVersionResponse.data.githubReleaseVersion
    this.githubLink = appVersionResponse.data.githubReleaseDownloadURL
  }
}
</script>

<style scoped>

</style>
