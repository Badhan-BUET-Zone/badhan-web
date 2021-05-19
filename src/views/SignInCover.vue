<template>
  <div style="background-image: url('../assets/cover.png')">
    <section id="hero">
      <v-row no-gutters>
        <v-img
            min-height="100vh"
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
                    <span
                        :class="[$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-2']"
                        class="font-weight-light"
                    >
                      WELCOME TO
                    </span>

                  <br>

                  <span
                      :class="[$vuetify.breakpoint.smAndDown ? 'display-3': 'display-4']"
                      class="font-weight-black"
                  >
                      Badhan

                    </span>
                  <p class="subtitle-1">BUET Zone</p>
                  <p class="subtitle-1" v-if="isMobile">Version: {{ version }}</p>

                </v-col>
                <v-col class="text-center"
                       cols="12"
                       sm="4">

                  <div style="max-width: 300px">
                    <v-text-field
                        :type="'text'"
                        outlined
                        label="Phone"
                        class="input-group--focused"
                        dense
                        v-model="phone"
                        @blur="$v.phone.$touch()"
                        :error-messages="phoneErrors"

                    ></v-text-field>

                    <v-text-field
                        outlined
                        label="Password"
                        class="input-group--focused"
                        dense
                        :append-icon="
                            passwordFlag ? 'mdi-eye' : 'mdi-eye-off'
                          "
                        :type="passwordFlag ? 'text' : 'password'"
                        v-model="password"
                        @click:append="passwordFlag = !passwordFlag"
                        dense
                        @blur="$v.password.$touch()"
                        :error-messages="passwordErrors"
                    ></v-text-field>
                    <v-checkbox dense label="Remember me" v-model="rememberFlag"></v-checkbox>
                    <v-btn
                        color="primary"
                        rounded
                        class="ml-2"
                        @click="signInClicked()"
                        :disabled="getSignInLoaderFlag || $v.$anyError"
                        :loading="getSignInLoaderFlag"
                    >
                      Sign In
                    </v-btn>
                  </div>

                </v-col>

                <v-btn
                    class="align-self-end"

                    outlined
                    @click="$vuetify.goTo('#about-me')"
                >
                  See More
                </v-btn>
              </v-row>
            </v-container>
          </v-theme-provider>
        </v-img>
      </v-row>
    </section>

    <section id="about-me">
      <v-parallax
          :height="900"
          src="../assets/cover2.png"
      >
        <v-container fill-height class="text-dark">


          <div class="py-12"></div>

          <v-container class="text-center">
            <v-btn
                class="align-self-end ma-1"
                outlined
                style="text-decoration: none"
                :to="'/credits'"
            >
              Know the Developers
            </v-btn>
            <br>
            <v-btn
                class="align-self-end ma-1"
                outlined
                style="text-decoration: none"
                v-if="!isMobile"
                href="https://play.google.com/store/apps/details?id=com.mmmbadhan"
            >
              Download App
              <v-icon right>mdi-google-play</v-icon>
            </v-btn>
            <v-btn
                class="align-self-end ma-1"
                outlined
                style="text-decoration: none"
                v-else
                href="https://badhan-buet.web.app"
            >
              Web Version
              <v-icon right>mdi-web</v-icon>
            </v-btn>
            <br>
            <v-btn class="align-self-end ma-1"
                   outlined
                   style="text-decoration: none"
                   href="https://docs.google.com/forms/d/1G4SYOGWoERJzPVuLUu1bSVUaOQEieCPoEKojf_gjh7g/edit">
              Don't have an account?
            </v-btn>
            <h2 class="display-2 font-weight-bold mt-5">ABOUT BADHAN</h2>

            <v-responsive
                class="mx-auto"
                width="56"
            >
              <v-divider class="mb-1"></v-divider>

              <v-divider></v-divider>
            </v-responsive>
            <v-avatar
                class="elevation-12 mb-12"
                size="128"
            >
              <v-img src="../assets/images/badhanlogo.png"></v-img>
            </v-avatar>
            <v-responsive
                class="mx-auto title font-weight-light mb-8"
                max-width="720"
            >
              <b>
                BADHAN is a Voluntary Blood Donors’ Orgnanization.It is totally a non-political, non-communal,
                non-regional, non-racial, secular and voluntary social organization.
                <span v-if="!$vuetify.breakpoint.smAndDown">
              It operates with objective of Initiating social movement to build up a healthy society through motivating voluntary blood donation, donating blood voluntarily and others services and awareness programs throughout the whole country with 8 Zones,124 Units and 22,380 Volunteers.It was established on 24 October, 1997.
          <br>

          BADHAN, BUET Zone was officially inaugerated  on 18 September,2005 as a Zone of BADHAN.It has seven unit- Ahsan Ullah Hall Unit, Chattri Hall Unit, Nazrul Hall Unit, Suhrawardy Hall Unit, Sher-e-Bangla Hall Unit, Rashid Hall Unit, Titumir Hall Unit.
          </span>
              </b>
            </v-responsive>


            <div></div>


          </v-container>

          <div class="py-12"></div>
        </v-container>
      </v-parallax>
    </section>

  </div>
</template>

<script>
import SignInDialog from "@/components/SignInDialog";
import {Capacitor} from "@capacitor/core";
import {Plugins} from '@capacitor/core';

const {Device} = Plugins;
import {mapActions, mapGetters, mapMutations} from 'vuex';
import {required, minLength,maxLength} from 'vuelidate/lib/validators'
export default {
  name: "SignInCover",
  data() {
    return {
      detailsFlag: false,
      phone: "",
      password: "",
      rememberFlag: localStorage.getItem("rememberFlag") == "true",

      passwordFlag: false,
      version: ""
    }
  },
  validations: {
    phone: {
      required,
      minLength: minLength(11),
      maxLength: maxLength(11)
    },
    password: {
      required
    }
  },
  watch: {
    rememberFlag(to, from) {
      localStorage.setItem("rememberFlag", to);
    },
  },
  computed: {
    ...mapGetters(['getSignInLoaderFlag']),
    isMobile() {
      return Capacitor.isNative;
    },

    phoneErrors(){
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.minLength && errors.push('Phone must be at least 11 digits long')
      !this.$v.phone.maxLength && errors.push('Phone must be at least 11 digits long')
      !this.$v.phone.required && errors.push('Phone is required.')
      return errors
    },
    passwordErrors(){
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Password is required.')
      return errors
    }

  },
  methods: {
    ...mapActions('notification', ['notifySuccess', 'notifyError']),
    ...mapActions(['login']),
    ...mapMutations(['clearSignInError']),
    async signInClicked() {
      await this.$v.$touch();
      if(this.$v.$anyError){
        return;
      }

      let isSignInOk = await this.login({
        phone: this.phone,
        password: this.password,
        rememberFlag: this.rememberFlag,
      });

      if (isSignInOk) {
        await this.$router.push("/home");
        this.notifySuccess('Sign in successful');
      }
    },

    clearClicked() {
      this.$v.$reset()
      this.phone = "";
      this.password = "";
      this.clearSignInError();
    },
  },
  async mounted() {
    const info = await Device.getInfo();
    this.version = info.appVersion;
  },

  components: {
    SignInDialog,
  },
}
</script>

<style scoped>

</style>
