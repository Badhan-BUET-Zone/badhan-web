<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <Container>
      <v-card-text>Redirecting...</v-card-text>
    </Container>
  </div>
</template>

<script>
import PageTitle from '../components/PageTitle'
import { mapActions, mapGetters } from 'vuex'
import Container from '../components/Wrappers/Container'

export default {
  name: 'RedirectionPage',
  computed: {
    ...mapGetters(['getIsLoggedIn', 'getSignInLoaderFlag', 'getToken'])
  },
  components: {
    Container,
    PageTitle
  },
  methods: {
    ...mapActions(['redirectionLogin']),
    ...mapActions('notification', ['notifyInfo'])
  },
  async mounted () {
    if (!this.getIsLoggedIn && !await this.redirectionLogin(this.$route.query.token)) {
      await this.$router.replace('/')
    } else {
      await this.$router.replace(this.$route.query.payload)
    }
  }
}
</script>

<style scoped>

</style>
