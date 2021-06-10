<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <v-card max-width="500" class="pa-2 rounded-xl">
      <v-card-text>Redirecting...</v-card-text>
    </v-card>
  </div>
</template>

<script>
import PageTitle from "../components/PageTitle";
import {mapActions, mapGetters} from "vuex";
import SignInDialog from "../components/SignInDialog";

export default {
  name: "Redirection",
  computed: {
    ...mapGetters(['getIsLoggedIn', 'getSignInLoaderFlag','getToken']),
  },
  components: {
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
