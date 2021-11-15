<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <Container v-if="getErrors">
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
    </Container>
  </div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex'
import PageTitle from '../components/PageTitle'
import 'vue-json-pretty/lib/styles.css'
import FrontendErrors from '../components/DevConsole/FrontendErrors'
import Container from '../components/Wrappers/Container'

export default {
  name: 'DevConsole',
  computed: {
    ...mapGetters('errorStore', ['getErrors']),
    ...mapGetters(['getDesignation']),
    ...mapGetters('consoleStore', ['getConsoleLogs'])
  },
  components: {
    Container,
    PageTitle,
    FrontendErrors
  },
  methods: {
    ...mapMutations('errorStore', ['addError']),
    ...mapMutations('consoleStore', ['addConsoleLog'])
    // async fileSelect() {
    //   let multiple_selection = true;
    //   let ext = ["*"];
    //   ext = ext.map(v => v.toLowerCase());
    //   let selectedFile = await FileSelector.fileSelector({
    //     multiple_selection: multiple_selection,
    //     ext: ext
    //   });
    //   this.addConsoleLog(selectedFile);
    // }
  },
  async mounted () {
    if (this.getDesignation !== 3) {
      this.$router.push({ name: 'NotFound' })
    }
  }
}
</script>

<style scoped>

</style>
