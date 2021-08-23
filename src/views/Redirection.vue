<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <Container>
      <v-card-text>Redirecting...</v-card-text>
    </Container>
  </div>
</template>

<script>
import PageTitle from "../components/PageTitle";
import {mapActions, mapGetters} from "vuex";
import SignInDialog from "../components/SignInDialog";
import Container from "../components/Wrappers/Container";

export default {
  name: "Redirection",
  computed: {
    ...mapGetters(['getIsLoggedIn', 'getSignInLoaderFlag','getToken']),
  },
  components: {
    Container,
    PageTitle,SignInDialog
  },
  methods:{
    ...mapActions(['redirectionLogin']),
    ...mapActions('notification',['notifyInfo'])
  },
  async mounted() {
    if(!this.getIsLoggedIn && !await this.redirectionLogin(this.$route.query.token)){
      await this.$router.push('/')
    }else{
      await this.$router.push(this.$route.query.payload);
    }
  }
}
</script>

<style scoped>

</style>
