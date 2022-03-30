<template>
  <div>
    <PageTitle></PageTitle>
    <transition-group name="slide-fade-down-snapout" mode="out-in">
    <Container :key="'recovery'">
      <v-card-title>
        Password Recovery
      </v-card-title>
      <v-card-text>
        <v-text-field id="forgotPasswordPhoneId" :disabled="recoveryCalledLoader" @blur="$v.phone.$touch()"
                      :error-messages="phoneErrors" class="required" rounded outlined label="Enter your phone number" dense v-model="phone"></v-text-field>
        <Button
            id="forgotPasswordButtonConfirmedId"
            :click="recoveryClicked"
            :color="'primary'"
            :disabled="recoveryCalledLoader|| emailTimeCoolDownTime<4*60 || $v.$anyError"
            :loading="recoveryCalledLoader"
            text="Get Recovery Email" icon="mdi-backup-restore">
        </Button>
        <transition name="slide-fade-down" mode="out-in">
          <v-progress-linear v-if="emailTimeCoolDownTime<4*60"
                             class="rounded-xl ma-2"
                             color="primary"
                             v-model="emailCoolDownBar"
                             height="25" dark
          >
            <span>Retry after {{Math.floor(emailTimeCoolDownTime/60)}} minutes {{emailTimeCoolDownTime%60}} seconds</span>
          </v-progress-linear>
        </transition>
      </v-card-text>
    </Container>
    <Container v-if="success" :key="'recoverySuccess'">
      <v-card-title>
        Check Email
      </v-card-title>
      <v-card-text>
        Please check your email and follow the instructions. It may take some time. Please be patient.
        <ul>
          <li>Please check your spam folder if you don't get a mail in your inbox</li>
          <li>If you don't receive any recovery email please try again after 4 minutes</li>
          <li>Contact the Super admins if you find any problems regarding receiving emails</li>
        </ul>
      </v-card-text>
    </Container>
    </transition-group>
  </div>
</template>

<script>
import Container from '../components/Wrappers/Container'
import PageTitle from '../components/PageTitle'
import { required, minLength, maxLength, numeric } from 'vuelidate/lib/validators'
import { handlePOSTPasswordForgot } from '../api'
import { mapActions } from 'vuex'
import Button from '../components/UI Components/Button'
import ldb from '../localDatabase'
export default {
  name: 'ForgotPassword',
  components: { Button, PageTitle, Container },
  validations: () => {
    return {
      phone: {
        required,
        minLength: minLength(11),
        maxLength: maxLength(11),
        numeric
      }
    }
  },
  computed: {
    phoneErrors () {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.minLength && errors.push('Phone must be 11 digits long')
      !this.$v.phone.maxLength && errors.push('Phone must be 11 digits long')
      !this.$v.phone.required && errors.push('Phone is required')
      !this.$v.phone.numeric && errors.push('Phone must be numeric')
      return errors
    },
    emailCoolDownBar () {
      return (this.emailTimeCoolDownTime / (4 * 60.0)) * 100
    }
  },
  data: () => {
    return {
      phone: null,
      recoveryCalledLoader: false,
      success: false,
      emailTimeCoolDownTime: 4 * 60.0
    }
  },
  methods: {
    ...mapActions('notification', ['notifySuccess']),
    async recoveryClicked () {
      await this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }

      this.coolDownTimerHandler()
      ldb.emailRecovery.save()
      this.success = false
      this.recoveryCalledLoader = true
      const response = await handlePOSTPasswordForgot({ phone: '88' + this.phone })
      this.recoveryCalledLoader = false
      if (response.status !== 200) return
      this.success = true
      this.notifySuccess('Recovery mail has been sent')
    },
    coolDownTimerHandler () {
      this.emailTimeCoolDownTime--
      const timerId = setInterval(() => {
        if (this.emailTimeCoolDownTime === 0) {
          clearInterval(timerId)
          this.emailTimeCoolDownTime = 4 * 60
          this.phone = null
          this.success = false
          ldb.emailRecovery.clear()
          this.$v.$reset()
          return
        }
        this.emailTimeCoolDownTime--
      }, 1000)
    }
  },
  mounted () {
    const timeStampOfLastPasswordRecovery = ldb.emailRecovery.load()
    if (timeStampOfLastPasswordRecovery) {
      const currentTime = new Date().getTime()
      if ((currentTime - timeStampOfLastPasswordRecovery) / 1000 < 4 * 60) {
        this.emailTimeCoolDownTime = 4 * 60 - Math.ceil((currentTime - timeStampOfLastPasswordRecovery) / 1000)
        this.coolDownTimerHandler()
        this.success = true
      }
    }
  }
}
</script>

<style scoped>

</style>
