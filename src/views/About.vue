<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <!--    <iframe style="height: 100vh; width: 100%"-->
    <!--            src="https://docs.google.com/document/d/e/2PACX-1vTamaAg-1VswXa2Zd2UScuNBbQAgoIA0AYb1r_Z9Nl7rotLh2_AQEf24kiX4XfL210gCXTKY4_JNB3c/pub?embedded=true"></iframe>-->
    <transition-group name="slide-fade-down-snapout" mode="out-in">
      <Container :key="'versionLoading'" v-if="getAppDetailsLoader">
        <v-card-text>
          <v-skeleton-loader type="text@2">
          </v-skeleton-loader>
        </v-card-text>
      </Container>
      <Container v-else :key="'versionLoaded'">
        <v-card-text>
          <p><b>App Version on Google Play:</b> {{ getAppVersion }}</p>
          <p><b>Local App Version:</b> {{ nativeAppVersion }}</p>
          <p><b>Database:</b> {{ $isDevelopmentEnv() ? 'Test' : 'Production' }}</p>
          <p><b>Build Time:</b> {{getBuildTime}}</p>
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
import PageTitle from "../components/PageTitle";
import VueMarkdown from 'vue-markdown';
import readme from '../../README.md';
import Container from "../components/Wrappers/Container";
import {mapGetters} from "vuex";
import {getNativeAppVersion, isNative} from "../plugins/android_support";

export default {
  name: "About",
  computed: {
    ...mapGetters('release', ['getAppVersion', 'getAppDetailsLoader']),
    getBuildTime(){
      return new Date(document.documentElement.dataset.buildTimestampUtc).toLocaleString();
    },
    isMobile() {
      return isNative();
    },

  },
  components: {Container, PageTitle, VueMarkdown},
  data() {
    return {
      text: readme,
      nativeAppVersion: "Web",
    }

  },
  async mounted() {
    if(isNative()){
      this.nativeAppVersion = await getNativeAppVersion();
    }
  }
}
</script>

<style scoped>

</style>
