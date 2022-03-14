<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <Container>
      <v-card-title>
        Logs
      </v-card-title>
      <MyConsoleLog v-for="(log, index) in getConsoleLogs" :key="index" :log="log"></MyConsoleLog>
    </Container>
  </div>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex'
import PageTitle from '../components/PageTitle'
import Container from '../components/Wrappers/Container'
import MyConsoleLog from '../components/DevConsole/MyConsoleLog'

export default {
  name: 'DevConsole',
  computed: {
    ...mapGetters('errorStore', ['getErrors']),
    ...mapGetters(['getDesignation']),
    ...mapGetters('consoleStore', ['getConsoleLogs'])
  },
  components: {
    MyConsoleLog,
    Container,
    PageTitle
  },
  methods: {
    ...mapMutations('consoleStore', ['addConsoleLog'])
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
