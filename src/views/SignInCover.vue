<template>
  <div>
    <section id="hero">
      <v-row no-gutters>
        <v-img
            min-height="90vh"
            src="../assets/cover.png"
        >
          <v-theme-provider>
            <v-container fill-height>
              <v-row
                  align="center"
                  class="mx-auto"
                  justify="center"

              >
                <v-col
                    class="text-center"
                    cols="12"
                    sm="8"
                    tag="h1"
                >
                  <transition-group name="slide-fade-down-snapout" type="out-in">
                    <div key="titlekey">
                      <img
                          src="../assets/images/badhanlogo.png"
                          style="width: 100px; height: 100px"
                      />
                      <br>
                      <span
                          class="font-weight-bold"
                      >
                        Badhan
                      </span>
                      <p class="subtitle-2">BUET Zone</p>
                      <v-chip
                          color="secondary"
                      >
                        {{$getEnvironmentName()==="production"?"production":$getEnvironmentName()}}
                      </v-chip>
                    </div>
                    <div v-if="chartData" :key="'barchartKey'">
                      <v-btn icon color="primary" @click="populateBefore">
                        <v-icon>mdi-arrow-left</v-icon>
                      </v-btn>
                      <v-btn icon color="primary" @click="populateNext">
                        <v-icon>mdi-arrow-right</v-icon>
                      </v-btn>
                      <BarChart
                        id="my-chart-id"
                        :options="chartOptions"
                        :data="chartData"
                      />
                    </div>
                    <div v-else key="loadingKey">
                      <LoadingMessage/>
                    </div>

                  </transition-group>
                </v-col>
                <v-col class="text-center"
                       cols="12"
                       sm="4">
                  <div style="max-width: 300px">
                    <v-text-field
                        :type="'text'"
                        outlined
                        rounded
                        label="Phone"
                        id="signInPhoneTextBox"
                        class="input-group--focused"
                        dense
                        :hint="'Enter your 11 digit phone number'"
                        v-model="phone"
                        @blur="$v.phone.$touch()"
                        :error-messages="phoneErrors"
                    ></v-text-field>
                    <v-text-field
                        id="signInPasswordTextBox"
                        rounded
                        outlined
                        label="Password"
                        class="input-group--focused"
                        dense
                        :append-icon="passwordFlag ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="passwordFlag ? 'text' : 'password'"
                        v-model="password"
                        @click:append="passwordFlag = !passwordFlag"
                        @blur="$v.password.$touch()"
                        :error-messages="passwordErrors"
                        :hint="'Enter your password'"
                    ></v-text-field>
                    <v-btn
                        color="primary"
                        rounded
                        class="ma-1"
                        @click="signInClicked()"
                        :disabled="getSignInLoaderFlag || $v.$anyError"
                        id="signInButton"
                    >
                      <v-icon left>
                        mdi-login
                      </v-icon>
                      Sign In
                    </v-btn>
                    <br>
                    <div class="d-flex">
                      <v-btn id="forgotPasswordButtonId" x-small text color="primary" rounded class="ma-1"
                             :to="'/forgotPassword'"
                             style="text-decoration: none">
                        Forgot Password?
                      </v-btn>
                      <v-btn
                          id="guestSignInButtonId"
                          x-small
                          text
                          color="primary"
                          rounded
                          class="ma-1"
                          @click="guestSignInClicked"
                          :disabled="getSignInLoaderFlag"
                      >
                        Or, login as guest
                      </v-btn>
                    </div>
                  </div>
                </v-col>
                <v-col class="text-center" cols="12" sm="4">
                  <v-btn
                      x-small
                      color="primary"
                      class="align-self-end ma-1"
                      outlined
                      rounded
                      style="text-decoration: none"
                      :to="'/about'"
                  >
                    About the App
                  </v-btn>
                  <v-btn
                      x-small
                      color="primary"
                      rounded
                      class="align-self-end ma-1"
                      outlined
                      style="text-decoration: none"
                      href="https://play.google.com/store/apps/details?id=com.mmmbadhan"
                  >
                    Download App
                    <v-icon right>mdi-google-play</v-icon>
                  </v-btn>
                  <v-btn
                      x-small
                      color="primary"
                      class="align-self-end ma-1"
                      outlined
                      rounded
                      style="text-decoration: none"
                      :to="'/credits'"
                  >
                    Know the Developers
                  </v-btn>
                  <v-btn x-small class="align-self-end ma-1"
                         color="primary"
                         rounded
                         outlined
                         style="text-decoration: none"
                         :to="'/contacts'">
                    Emergency Contacts
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-theme-provider>
        </v-img>
      </v-row>
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { handleGETLogsDonations } from '@/api'
import { Bar as BarChart } from 'vue-chartjs'
import LoadingMessage from '@/components/LoadingMessage.vue'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Filler } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, Filler)
export default {
  name: 'SignInCover',
  components: { BarChart, LoadingMessage },
  data () {
    return {
      detailsFlag: false,
      phone: '',
      password: '',
      passwordFlag: false,

      chartData: null,
      chartOptions: {
        responsive: true,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Donation Count',
            },
            ticks: {
              stepSize: 1,
              callback: function(value) {
                if (Math.floor(value) === value) {
                  return value;
                }
              },
            }
          }
        }
      },
      rawCountByYearMonth: {},
      currentYear: 0,
      currentMonth: 0
    }
  },
  validations: {
    phone: {
      required,
      minLength: minLength(11),
      maxLength: maxLength(11)
    },
    password: {
      required,
      minLength: minLength(4)
    }
  },
  watch: {},
  computed: {
    ...mapGetters(['getSignInLoaderFlag', 'getAutoRedirectionPath']),
    getBuildTime () {
      return new Date(document.documentElement.dataset.buildTimestampUtc).toLocaleString()
    },
    phoneErrors () {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.minLength && errors.push('Phone must be at least 11 digits long')
      !this.$v.phone.maxLength && errors.push('Phone must be at least 11 digits long')
      !this.$v.phone.required && errors.push('Phone is required.')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Password is required.')
      !this.$v.password.minLength && errors.push('Password is must be more than 3 characters')
      return errors
    }

  },
  mounted(){
    this.getDonationStats()
  },
  methods: {
    ...mapActions('notification', ['notifySuccess', 'notifyError']),
    ...mapActions(['login', 'guestLogin']),
    ...mapMutations(['clearSignInError', 'setAutoRedirectionPath', 'unsetAutoRedirectionPath']),
    async populateNext(){
      const date = new Date(this.currentYear, this.currentMonth - 1)
      date.setMonth(date.getMonth() + 6)
      this.currentYear = date.getFullYear()
      this.currentMonth = date.getMonth() + 1
      this.populateSixMonths()
    },
    async populateBefore(){
      let date = new Date(this.currentYear, this.currentMonth - 1)
      date.setMonth(date.getMonth() - 6)
      this.currentYear = date.getFullYear()
      this.currentMonth = date.getMonth() + 1
      this.populateSixMonths()
    },
    async populateSixMonths(){
      const chartData = {
        labels: [],
        datasets: []
      }
      const yearObject = {
        label: `Last 6 Months`,
        data: [],
        borderColor: this.getRandomColor(),
        backgroundColor: this.getRandomColor(0.5),
        fill: 'start'
      }

      for(let i = 5; i >= 0; i--){
        const month = (this.currentMonth - i - 1 + 12) % 12 + 1;
        const year = this.currentYear - (month > this.currentMonth ? 1 : 0)
        yearObject.data.push(this.rawCountByYearMonth[`${year}`]?.[`${month}`]?? 0)
        chartData.labels.push(new Date(year, month - 1).toLocaleString('en-US', { year: '2-digit', month: 'short'}))
      }

      yearObject.label = `${chartData.labels[0]} - ${chartData.labels[chartData.labels.length - 1]}`

      chartData.datasets.push(yearObject)
      this.chartData = chartData
    },
    async getDonationStats(){
      const response = await handleGETLogsDonations()
      if(response.status!==200)return
      this.rawCountByYearMonth = response.data.countByYearMonth

      const currentDate = new Date()
      this.currentYear = currentDate.getFullYear()
      this.currentMonth = currentDate.getMonth() + 1
      this.populateSixMonths(this.currentYear, this.currentMonth)
    },
    getRandomColor(transparency=1) {
      let color = 'rgba(';
      for (let i = 0; i < 3; i++) {
        color += Math.floor(Math.random() * 256) + ',';
      }
      color += `${transparency})`
      return color;
    },
    async signInClicked () {
      await this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }

      const isSignInOk = await this.login({
        phone: this.phone,
        password: this.password,
        rememberFlag: true
      })

      if (isSignInOk) {
        if (this.getAutoRedirectionPath) {
          await this.$router.push(this.getAutoRedirectionPath)
          this.unsetAutoRedirectionPath()
          return
        }
        await this.$router.push('/home')
      }
    },

    async guestSignInClicked () {
      await this.guestLogin()
      await this.$router.push('/home')
    },
  },
}
</script>

<style scoped>

</style>
