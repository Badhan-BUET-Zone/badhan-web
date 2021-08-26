<template>
  <div>
    <PageTitle></PageTitle>
    <Container>
      <v-card-text>
        <v-text-field @blur="$v.newPassword.$touch()"
                      :error-messages="newPasswordErrors" @click:append="newPasswordFlag = !newPasswordFlag" :type="newPasswordFlag ? 'text' : 'password'" :append-icon="newPasswordFlag ? 'mdi-eye' : 'mdi-eye-off'" v-model="newPassword" dense outlined rounded label="New Password"></v-text-field>
        <v-text-field @blur="$v.confirmPassword.$touch()"
                      :error-messages="confirmPasswordErrors" @click:append="confirmPasswordFlag = !confirmPasswordFlag" :append-icon="confirmPasswordFlag ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="confirmPasswordFlag ? 'text' : 'password'" v-model="confirmPassword" dense outlined rounded label="Confirm Password"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="changePasswordClicked" :disabled="passwordChangeFlag || $v.$anyError" :loading="passwordChangeFlag" rounded color="primary">
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
import {required, minLength, maxLength, numeric, sameAs} from 'vuelidate/lib/validators'

export default {
  name: "PasswordReset",
  validations: {
    newPassword: {
      required,
      minLength: minLength(6),
    },
    confirmPassword: {
      sameAs: sameAs('newPassword')
    }
  },
  computed:{
    newPasswordErrors() {
      const errors = []
      if (!this.$v.newPassword.$dirty) return errors
      !this.$v.newPassword.required && errors.push('Specify a password')
      !this.$v.newPassword.minLength && errors.push('Password must be at least 6 characters long')
      return errors
    },
    confirmPasswordErrors() {
      const errors = []
      if (!this.$v.confirmPassword.$dirty) return errors
      !this.$v.confirmPassword.sameAs && errors.push('Password does not match')
      return errors
    },
  },
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
      newPasswordFlag: false,
      confirmPasswordFlag: false,
    }
  },
  methods:{
    async changePasswordClicked(){
      await this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }

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
