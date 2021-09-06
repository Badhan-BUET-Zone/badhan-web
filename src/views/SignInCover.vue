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
                  <img
                      src="../assets/images/badhanlogo.png"
                      style="width: 100px; height: 100px"
                  />
                  <br>
                  <span
                      class="font-weight-black"
                  >
                      Badhan
                    </span>
                  <p class="subtitle-2">BUET Zone
                    (<span class="subtitle-2">
                    <span v-if="!isMobile">Web Version</span>
                    <span v-else>Version: {{ version }}</span>
                  </span>)
                  </p>
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
                        class="input-group--focused"
                        dense
                        :hint="'Enter your 11 digit phone number'"
                        v-model="phone"
                        @blur="$v.phone.$touch()"
                        :error-messages="phoneErrors"
                    ></v-text-field>
                    <v-text-field
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
                    <!--                    <v-checkbox dense label="Remember me" v-model="rememberFlag"></v-checkbox>-->
                    <v-btn
                        color="primary"
                        rounded
                        class="ma-1"
                        @click="signInClicked()"
                        :disabled="getSignInLoaderFlag || $v.$anyError"
                        :loading="getSignInLoaderFlag"
                    >
                      <v-icon left>
                        mdi-login
                      </v-icon>
                      Sign In
                    </v-btn>
                    <br>
                    <v-btn small text color="primary" rounded class="ma-1" :to="'/forgotPassword'"
                           style="text-decoration: none">
                      Forgot Password?
                    </v-btn>
                    <br>
                    <v-btn
                        small
                        text
                        color="primary"
                        rounded
                        class="ma-1"
                        @click="guestSignInClicked()"
                        :disabled="getSignInLoaderFlag"
                        :loading="getSignInLoaderFlag"
                    >
                      Or, login as guest
                    </v-btn>
                  </div>

                </v-col>


                <br>
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
                    v-if="!isMobile"
                    href="https://play.google.com/store/apps/details?id=com.mmmbadhan"
                >
                  Download App
                  <v-icon right>mdi-google-play</v-icon>
                </v-btn>
                <v-btn
                    x-small
                    color="primary"
                    rounded
                    class="align-self-end ma-1"
                    outlined
                    style="text-decoration: none"
                    v-else
                    href="https://badhan-buet.web.app"
                >
                  Web Version
                  <v-icon right>mdi-web</v-icon>
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
                <v-btn class="align-self-end ma-1"
                       x-small
                       color="primary"
                       rounded
                       outlined
                       style="text-decoration: none"
                       href="https://docs.google.com/forms/d/1G4SYOGWoERJzPVuLUu1bSVUaOQEieCPoEKojf_gjh7g/edit">
                  Don't have an account?
                </v-btn>
              </v-row>
            </v-container>
          </v-theme-provider>
        </v-img>
      </v-row>
    </section>
  </div>
</template>

<script>
import SignInDialog from "@/components/SignInDialog";

import {getDeviceInfo, isNative} from '@/plugins/android_support';
import {mapActions, mapGetters, mapMutations} from 'vuex';
import {required, minLength, maxLength} from 'vuelidate/lib/validators'

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
      required,
      minLength: minLength(4),
    }
  },
  watch: {
    rememberFlag(to, from) {
      localStorage.setItem("rememberFlag", to);
    },
  },
  computed: {
    ...mapGetters(['getSignInLoaderFlag', 'getAutoRedirectionPath']),
    isMobile() {
      return isNative();
    },

    phoneErrors() {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.minLength && errors.push('Phone must be at least 11 digits long')
      !this.$v.phone.maxLength && errors.push('Phone must be at least 11 digits long')
      !this.$v.phone.required && errors.push('Phone is required.')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Password is required.')//minLength
      !this.$v.password.minLength && errors.push('Password is must be more than 3 characters')
      return errors
    }

  },
  methods: {
    ...mapActions('notification', ['notifySuccess', 'notifyError']),
    ...mapActions(['login', 'guestLogin']),
    ...mapMutations(['clearSignInError', 'setAutoRedirectionPath', 'unsetAutoRedirectionPath']),
    async signInClicked() {
      await this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }

      let isSignInOk = await this.login({
        phone: this.phone,
        password: this.password,
        rememberFlag: true,
      });

      if (isSignInOk) {
        if (this.getAutoRedirectionPath) {
          await this.$router.push(this.getAutoRedirectionPath);
          this.unsetAutoRedirectionPath();
          return;
        }
        await this.$router.push("/home");
      }
    },

    async guestSignInClicked() {
      await this.guestLogin();
      await this.$router.push("/home");
    },

    clearClicked() {
      this.$v.$reset()
      this.phone = "";
      this.password = "";
      this.clearSignInError();
    },
  },
  async mounted() {
    const info = await getDeviceInfo();
    this.version = info.appVersion;
  },

  components: {
    SignInDialog,
  },
}
</script>

<style scoped>

</style>
