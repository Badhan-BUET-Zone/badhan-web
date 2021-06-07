<template>
  <div>
    <SignInDialog></SignInDialog>
  </div>
</template>

<script>
import PageTitle from "../components/PageTitle";
import {mapActions, mapGetters} from "vuex";
import SignInDialog from "../components/SignInDialog";

export default {
  name: "Redirection",
  computed: {
    ...mapGetters(['isLoggedIn', 'getSignInLoaderFlag','getToken']),
  },
  components: {
    PageTitle,SignInDialog
  },
  methods:{
    ...mapActions(['redirectionLogin']),
    ...mapActions('notification',['notifyInfo'])
  },
  async mounted() {
    if(!this.isLoggedIn){
      if(!await this.redirectionLogin(this.$route.query.token)){
        await this.$router.push('/')
      }else{
        await this.$router.push(this.$route.query.payload);
      }
    }else {
      await this.$router.push(this.$route.query.payload);
    }
  }
}
</script>

<style scoped>

</style>
