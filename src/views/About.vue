<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <transition-group name="slide-fade-down-snapout" mode="out-in">
      <Container :key="'versionLoaded'">
        <v-card-text>
          <p><b>App Version on Google Play:</b> {{ getGooglePlayAppVersion }}</p>
          <p><b>Local App Version:</b> {{ nativeAppVersion }}</p>
          <p><b>Database:</b> {{ $getEnvironmentName() }}</p>
          <p><b>Last Updated:</b> {{getBuildTime}}</p>
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
      nativeAppVersion: 'Web'
    }
  },
  async mounted () {
    if (getIsNative()) {
      this.nativeAppVersion = await getLocalAppVersion()
    }
  }
}
</script>

<style scoped>

</style>
