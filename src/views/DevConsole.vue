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

      <v-btn @click="fileWrite">Save File</v-btn>

    </v-card>
  </div>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";
import PageTitle from "../components/PageTitle";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import FrontendErrors from "../components/DevConsole/FrontendErrors";

import {Plugins, FilesystemDirectory, FilesystemEncoding} from '@capacitor/core';

const {Filesystem} = Plugins;

export default {
  name: "DevConsole",
  computed: {
    ...mapGetters('errorStore', ['getErrors']),
    ...mapGetters(['getDesignation']),
  },
  components: {
    PageTitle,
    VueJsonPretty,
    FrontendErrors
  },
  methods: {
    ...mapMutations('errorStore', ['addError',]),
    b64toBlob(b64Data, contentType = '', sliceSize = 512) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, {type: contentType});
      return blob;
    },
    async fileWrite() {
      try {
        const result = await Filesystem.writeFile({
          path: '/blahblahblah.txt',
          data: "This is a test",
          directory: FilesystemDirectory.Documents,
          encoding: FilesystemEncoding.UTF8
        })
        console.log('Wrote file', result);

        // window.open(result.uri, '_blank');
      } catch (e) {
        console.error('Unable to write file', e);
      }
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
