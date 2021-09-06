<template>
  <div>
    <PageTitle></PageTitle>
    <transition name="slide-fade-down-snapout" mode="out-in">
    <Container v-if="!success" :key="'recovery'">
      <v-card-title>
        Password Recovery
      </v-card-title>
      <v-card-text>
        <v-text-field :disabled="recoveryCalledLoader" @blur="$v.phone.$touch()"
                      :error-messages="phoneErrors" class="required" rounded outlined label="Enter your phone number" dense v-model="phone"></v-text-field>
        <v-btn :loading="recoveryCalledLoader" :disabled="recoveryCalledLoader || $v.$anyError" @click="recoveryClicked" color="primary" rounded>
          <v-icon left>
            mdi-backup-restore
          </v-icon>
          Get Recovery Email
        </v-btn>
      </v-card-text>
    </Container>
    <Container v-else :key="'recoverySuccess'">
      <v-card-title>
        Check Email
      </v-card-title>
      <v-card-text>
        Please check your email and follow the instructions
      </v-card-text>
    </Container>
    </transition>
  </div>
</template>

<script>
import Container from "../components/Wrappers/Container";
import PageTitle from "../components/PageTitle";
import {required, minLength, maxLength, numeric} from 'vuelidate/lib/validators'
import {handlePOSTPasswordForgot} from "../api";
export default {
  name: "ForgotPassword",
  components: {PageTitle, Container},
  validations: () => {
    return {
      phone: {
        required,
        minLength: minLength(11),
        maxLength: maxLength(11),
        numeric,
      },
    }
  },
  computed:{
    phoneErrors() {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.minLength && errors.push('Phone must be 11 digits long')
      !this.$v.phone.maxLength && errors.push('Phone must be 11 digits long')
      !this.$v.phone.required && errors.push('Phone is required')
      !this.$v.phone.numeric && errors.push('Phone must be numeric')
      return errors
    },
  },
  data:()=>{
    return{
      phone: null,
      recoveryCalledLoader: false,
      success: false,
    }
  },
  methods:{
    async recoveryClicked(){
      await this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }

      this.recoveryCalledLoader = true;
      let response = await handlePOSTPasswordForgot({phone: '88'+this.phone});
      this.recoveryCalledLoader = false;
      if(response.status!==200)return;
      this.success = true;
    }
  }
}
</script>

<style scoped>

</style>
