<template>
  <div>
    <PageTitle></PageTitle>
    <Container>
      <v-card-text>
        <v-text-field v-model="newPassword" dense outlined rounded label="New Password"></v-text-field>
        <v-text-field v-model="confirmPassword" dense outlined rounded label="Confirm Password"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="changePasswordClicked" :disabled="passwordChangeFlag" :loading="passwordChangeFlag" rounded color="primary">
          <v-icon left>
            mdi-content-save
          </v-icon>
          Save
        </v-btn>
      </v-card-actions>
    </Container>
  </div>
</template>

<script>
import Container from "../components/Wrappers/Container";
import PageTitle from "../components/PageTitle";
import {handlePATCHUsersPassword} from "../api";

export default {
  name: "PasswordReset",
  components: {
    PageTitle,
    Container
  },
  mounted() {

  },
  data:()=>{
    return{
      newPassword: null,
      confirmPassword: null,
      passwordChangeFlag: false,
    }
  },
  methods:{
    async changePasswordClicked(){
      this.$store.commit('setToken',this.$route.query.token);
      this.passwordChangeFlag = true;
      let result = await handlePATCHUsersPassword({password:this.newPassword});
      this.passwordChangeFlag = false;
      if(!result) {
        this.$store.commit('removeToken');
        return;
      }
      this.$store.commit('setToken',result.token);
      if(await this.$store.dispatch('autoLogin')){
        await this.$router.push({name:'Home'});
      }

    }
  }
}
</script>

<style scoped>

</style>
