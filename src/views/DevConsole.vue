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
    </v-card>
  </div>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";
import PageTitle from "../components/PageTitle";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import FrontendErrors from "../components/DevConsole/FrontendErrors";
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
