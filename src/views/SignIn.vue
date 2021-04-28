<template>
    <div data-aos="fade-up">
        <div class="row d-flex justify-content-center" align="center">
            <div
                class="bg-light mb-3 col-lg-4 col-md-12 col-sm-12 p-4"
                style="height: fit-content; top: 2vh"
            >
                <img
                    src="../assets/images/badhanlogo.png"
                    style="width: 150px; height: 150px"
                />

                <div class="h5 ma-6">Badhan BUET Zone<br>Sign In</div>
                <div class="h6" v-if="isMobile">Version: {{version}}</div>

                <div>
                    <v-text-field
                        :type="'text'"
                        outlined
                        label="Phone"
                        v-model="phone"
                        class="input-group--focused"
                        dense
                    ></v-text-field>

                    <v-text-field
                        :append-icon="
                            passwordFlag ? 'mdi-eye' : 'mdi-eye-off'
                          "
                        :type="passwordFlag ? 'text' : 'password'"
                        outlined
                        label="Password"
                        v-model="password"
                        class="input-group--focused"
                        @click:append="passwordFlag = !passwordFlag"
                        dense

                    ></v-text-field>


                    <v-checkbox dense v-model="rememberFlag" label="Remember me"></v-checkbox>

                    <v-btn color="warning" rounded @click="clearClicked()">Clear</v-btn>
                    <v-btn
                        color="primary"
                        rounded
                        class="ml-2"
                        @click="signInClicked()"
                        :disabled="$store.getters.getSignInLoaderFlag"
                        :loading="$store.getters.getSignInLoaderFlag"
                    >
                        Sign In
                    </v-btn>
                </div>
                <div
                    class="alert alert-danger mt-4"
                    role="alert"
                    v-if="$store.getters.getError.length !== 0"
                >
                    {{ $store.getters.getError }}
                </div>



                <v-btn
                    class="mt-2"
                    v-if="!isMobile"
                    text
                    style="text-decoration: none"
                    href="https://play.google.com/store/apps/details?id=com.mmmbadhan"
                >
                    Download App
                    <v-icon right>mdi-google-play</v-icon>
                </v-btn>
                <v-btn
                    class="mt-3"
                    v-else
                    text
                    style="text-decoration: none"
                    href="https://badhan-buet.web.app"
                >
                    Web Version
                    <v-icon right>mdi-web</v-icon>
                </v-btn>
              <v-btn text x-small style="text-decoration: none" class="mt-2" href="https://docs.google.com/forms/d/1G4SYOGWoERJzPVuLUu1bSVUaOQEieCPoEKojf_gjh7g/edit">
                Don't have an account? Click here
              </v-btn>

                <v-btn text x-small style="text-decoration: none" class="mt-2" to="/credits">
                    Developers of Badhan, BUET
                </v-btn>

            </div>
        </div>

        <SignInDialog :dialog="$store.getters.getSignInLoaderFlag"></SignInDialog>
    </div>
</template>

<script>
import SignInDialog from "@/components/SignInDialog";
import {Capacitor} from "@capacitor/core";
import {Plugins} from '@capacitor/core';
const { Device } = Plugins;
import {mapActions,mapGetters} from 'vuex';

export default {
    name: "SignIn",
    data: function () {
        return {
            phone: "",
            password: "",
            rememberFlag: localStorage.getItem("rememberFlag") == "true",

            passwordFlag: false,
            version: "2.0.1"
        };
    },
    watch: {
        rememberFlag(to, from) {
            localStorage.setItem("rememberFlag", to);
        },
    },
    computed: {
        isMobile() {
            return Capacitor.isNative;
        },
    },
    methods: {
        ...mapActions('notification',['notify']),
        async signInClicked() {
            this.$store.commit("clearSignInError");

            if (this.phone === null || isNaN(this.phone)) {
                this.$store.commit("setSignInError", "Invalid Phone Number");
                return;
            }

            if (this.phone.toString().length !== 11) {
                this.$store.commit(
                    "setSignInError",
                    "Phone number must be of 11 digits"
                );
                return;
            }



            let isSignInOk = await this.$store.dispatch("login", {
                phone: this.phone,
                password: this.password,
                rememberFlag: this.rememberFlag,
            });

            if (isSignInOk) {
                await this.$router.push("/home");
                this.notify('Sign in successful');
            }
        },

        clearClicked() {
            this.phone = "";
            this.password = "";
            this.$store.commit("clearSignInError");
        },
    },
    async mounted() {
        const info = await Device.getInfo();
        this.version = info.appVersion;
    },

    components: {
        SignInDialog,
    },
};
</script>

<style scoped>
</style>
