<template>
  <div>
    <PageTitle></PageTitle>
    <transition-group name="slide-fade-down-snapout" mode="out-in">
    <Container :key="'recovery'">
      <v-card-title>
        Password Recovery
      </v-card-title>
      <v-card-text>
        <v-text-field :disabled="recoveryCalledLoader" @blur="$v.phone.$touch()"
                      :error-messages="phoneErrors" class="required" rounded outlined label="Enter your phone number" dense v-model="phone"></v-text-field>
        <v-btn :loading="recoveryCalledLoader" :disabled="recoveryCalledLoader|| emailTimeCoolDownTime<4*60 || $v.$anyError" @click="recoveryClicked" color="primary" rounded>
          <v-icon left>
            mdi-backup-restore
          </v-icon>
          Get Recovery Email
        </v-btn>
        <transition name="slide-fade-down" mode="out-in">
          <v-progress-linear v-if="emailTimeCoolDownTime<4*60" striped
                             class="rounded-xl mt-2"
                             color="primary"
                             v-model="emailCoolDownBar"
                             height="25"
          >
            <strong>Retry after {{Math.floor(emailTimeCoolDownTime/60)}} minutes {{emailTimeCoolDownTime%60}} seconds</strong>
          </v-progress-linear>
        </transition>

      </v-card-text>
    </Container>
    <Container v-if="success" :key="'recoverySuccess'">
      <v-card-title>
        Check Email
      </v-card-title>
      <v-card-text>
        Please check your email and follow the instructions
      </v-card-text>
    </Container>
    </transition-group>
  </div>
</template>

<script>
import Container from "../components/Wrappers/Container";
import PageTitle from "../components/PageTitle";
import {required, minLength, maxLength, numeric} from 'vuelidate/lib/validators'
import {handlePOSTPasswordForgot} from "../api";
import {mapActions} from "vuex";
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
    emailCoolDownBar(){
      return (this.emailTimeCoolDownTime / (4*60.0))*100;
    }
  },
  data:()=>{
    return{
      phone: null,
      recoveryCalledLoader: false,
      success: false,
      emailTimeCoolDownTime: 4*60.0,
    }
  },
  methods:{
    ...mapActions('notification',['notifySuccess']),
    async recoveryClicked(){
      await this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }

      this.coolDownTimerHandler();
      localStorage.setItem('passwordEmailRecoveryTimestamp',String(new Date().getTime()));
      this.success =  false;
      this.recoveryCalledLoader = true;
      let response = await handlePOSTPasswordForgot({phone: '88'+this.phone});
      this.recoveryCalledLoader = false;
      if(response.status!==200)return;
      this.success = true;
      this.notifySuccess('Recovery mail has been sent');
    },
    coolDownTimerHandler(){

      this.emailTimeCoolDownTime--;
      let timerId = setInterval(()=>{
        if(this.emailTimeCoolDownTime===0){
          clearInterval(timerId);
          this.emailTimeCoolDownTime = 4*60;
          this.phone = null;
          localStorage.removeItem('passwordEmailRecoveryTimestamp');
          this.$v.$reset();
          return;
        }
        this.emailTimeCoolDownTime--;
      },1000)
    }
  },
  mounted(){
    let timeStampOfLastPasswordRecovery = localStorage.getItem('passwordEmailRecoveryTimestamp');
    if(timeStampOfLastPasswordRecovery){
      timeStampOfLastPasswordRecovery = parseInt(timeStampOfLastPasswordRecovery);
      let currentTime = new Date().getTime();
      if((currentTime-timeStampOfLastPasswordRecovery)/1000 < 4*60){
        this.emailTimeCoolDownTime = 4*60- Math.ceil((currentTime-timeStampOfLastPasswordRecovery)/1000);
        this.coolDownTimerHandler();
      }
    }
  }
}
</script>

<style scoped>

</style>
