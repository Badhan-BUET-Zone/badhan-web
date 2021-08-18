<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <v-card v-if="getErrors" max-width="500" class="pa-4 mx-auto rounded-xl">
      <v-card-title>
        Frontend Errors
      </v-card-title>
      <v-card flat v-if="getErrors.length===0">
        <v-card-text>
          No frontend errors found
        </v-card-text>
      </v-card>
      <FrontendErrors v-for="(error, index) in getErrors" :key="index" :error="error"></FrontendErrors>
      {{ getConsoleLogs }}
      <v-btn @click="fileWrite">Save File</v-btn>

      <v-btn @click="fileDownloadWeb">Download in web</v-btn>

    </v-card>
  </div>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";
import PageTitle from "../components/PageTitle";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import FrontendErrors from "../components/DevConsole/FrontendErrors";
import { saveAs } from 'file-saver';

import {Plugins, FilesystemDirectory, FilesystemEncoding} from '@capacitor/core';

const {Filesystem} = Plugins;

export default {
  name: "DevConsole",
  computed: {
    ...mapGetters('errorStore', ['getErrors']),
    ...mapGetters(['getDesignation']),
    ...mapGetters('consoleStore', ['getConsoleLogs']),
  },
  components: {
    PageTitle,
    VueJsonPretty,
    FrontendErrors
  },
  methods: {
    ...mapMutations('errorStore', ['addError',]),
    ...mapMutations('consoleStore', ['addConsoleLog']),

    async fileWrite() {
      try {
        const result = await Filesystem.writeFile({
          path: '/blahblahblah.txt',
          data: "This is a test",
          directory: FilesystemDirectory.Documents,
          encoding: FilesystemEncoding.UTF8
        })
        console.log('Wrote file', result);
        this.addConsoleLog(result)

      } catch (e) {
        console.error('Unable to write file', e);
      }
    },
    async fileDownloadWeb(){
      let blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "hello world.txt");
    }
  },
  async mounted() {
    if (this.getDesignation !== 3) {
      this.$router.push({name: 'NotFound'});
    }
  },
}
</script>

<style scoped>

</style>
