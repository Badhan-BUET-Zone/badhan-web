<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>

    <v-card max-width="500" class="pa-2 rounded-xl">
      <v-card-text>
        Please wait...
      </v-card-text>

    </v-card>
  </div>
</template>

<script>
import PageTitle from "../components/PageTitle";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Redirection",
  computed: {
    ...mapGetters(['isLoggedIn', 'getSignInLoaderFlag','getToken']),
  },
  components: {
    PageTitle
  },
  methods:{
    ...mapActions(['redirectionLogin'])
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
