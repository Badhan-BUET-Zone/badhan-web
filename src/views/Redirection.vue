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
    ...mapGetters(['isLoggedIn', 'getSignInLoaderFlag']),
  },
  components: {
    PageTitle
  },
  methods:{
    ...mapActions(['redirectionLogin'])
  },
  async mounted() {
    console.log(this.$route.query)
    if(!this.isLoggedIn){
      await this.redirectionLogin(this.$route.query.token);
    }else {
      await this.$router.replace(this.$route.query.payload);
    }
  }
}
</script>

<style scoped>

</style>
