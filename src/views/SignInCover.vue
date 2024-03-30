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
                    <LineChart
                      v-if="chartData.datasets.length!==0"
                      :key="'linechartKey'"
                      id="my-chart-id"
                      :options="chartOptions"
                      :data="chartData"
                    />
                    <!-- <LoadingMessage v-else :key="'linechartLoadingKey'"/> -->
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
import { Line as LineChart } from 'vue-chartjs'
import { handleGETLogsDonations } from '@/api'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler} from 'chart.js'
// import LoadingMessage from '@/components/LoadingMessage.vue'
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

export default {
  name: 'SignInCover',
  components: { LineChart, 
    // LoadingMessage 
  },
  data () {
    return {
      detailsFlag: false,
      phone: '',
      password: '',
      passwordFlag: false,

      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: []
        // datasets: [ 
        //   { 
        //     label: 'Dataset 1',
        //     data: [40, 20, 12],
        //     fill: 'start',
        //     borderColor: this.getRandomColor(),
        //     backgroundColor: this.getRandomColor(0.5)
        //   },
        //   { 
        //     label: 'Dataset 2',
        //     data: [30, 50, 20],
        //     borderColor: this.getRandomColor(),
        //   },
        //   { 
        //     label: 'Dataset 3',
        //     data: [50, 30, 40],
        //     borderColor: this.getRandomColor(),
        //   } 
        // ]
      },
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
      }
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
      !this.$v.password.required && errors.push('Password is required.')// minLength
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
    async getDonationStats(){
      const response = await handleGETLogsDonations()
      if(response.status!==200)return
      const countByYearMonthOutput = []
      const countByYearMonth = response.data.countByYearMonth

      const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }

      const years = Object.keys(countByYearMonth).map(Number); // Convert keys to numbers
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);

      for(let year=maxYear;year>=minYear;year--){
        const yearObject = {
            label: `${year}`,
            data: [],
            borderColor: this.getRandomColor()
          }
        for(let month = 1; month<=12; month++){
          yearObject.data.push(countByYearMonth[`${year}`]?.[`${month}`]?? 0)
        }
        countByYearMonthOutput.push(yearObject)
      }
      chartData.datasets = countByYearMonthOutput
      const randomColorForCurrentYear = this.getRandomColor(0.5)
      chartData.datasets[0].fill = 'start'
      chartData.datasets[0].borderColor = randomColorForCurrentYear
      chartData.datasets[0].backgroundColor = randomColorForCurrentYear
      this.chartData = chartData
    },
    getRandomColor(transparency=1) {
      let color = 'rgba(';
      for (let i = 0; i < 3; i++) {
        color += Math.floor(Math.random() * 256) + ',';
      }
      color += `${transparency})`; // Add transparency
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
