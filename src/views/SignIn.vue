<template>
    <div data-aos="fade-up">
        <div class="row d-flex justify-content-center" align="center">
            <div
                class="bg-light mb-3 col-lg-4 col-md-12 col-sm-12 p-4"
                style="height: fit-content; top: 2vh"
            >
                <img
                    src="../assets/images/badhanlogo.png"
                    style="width: 120px; height: 120px"
                />

                <div class="h5 ma-2">Badhan BUET Zone<br>Sign In</div>
                <div class="h6" v-if="isMobile">Version: {{ version }}</div>

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
                        :disabled="getSignInLoaderFlag"
                        :loading="getSignInLoaderFlag"
                    >
                        Sign In
                    </v-btn>
                </div>
                <v-btn
                    class="mt-1"
                    v-if="!isMobile"
                    text
                    style="text-decoration: none"
                    href="https://play.google.com/store/apps/details?id=com.mmmbadhan"
                >
                    Download App
                    <v-icon right>mdi-google-play</v-icon>
                </v-btn>
                <v-btn
                    class="mt-2"
                    v-else
                    text
                    style="text-decoration: none"
                    href="https://badhan-buet.web.app"
                >
                    Web Version
                    <v-icon right>mdi-web</v-icon>
                </v-btn>
                <v-btn text x-small style="text-decoration: none" class="mt-1"
                       href="https://docs.google.com/forms/d/1G4SYOGWoERJzPVuLUu1bSVUaOQEieCPoEKojf_gjh7g/edit">
                    Don't have an account? Click here
                </v-btn>

                <v-btn text x-small style="text-decoration: none" class="mt-1" to="/credits">
                    Developers of Badhan, BUET
                </v-btn>
            </div>
        </div>
        <SignInDialog :dialog="getSignInLoaderFlag"></SignInDialog>
    </div>
</template>

<script>
import SignInDialog from "@/components/SignInDialog";
import {Capacitor} from "@capacitor/core";
import {Plugins} from '@capacitor/core';

const {Device} = Plugins;
import {mapActions, mapGetters, mapMutations} from 'vuex';

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
        ...mapGetters(['getSignInLoaderFlag']),
        isMobile() {
            return Capacitor.isNative;
        },

    },
    methods: {
        ...mapActions('notification', ['notifySuccess', 'notifyError']),
        ...mapActions(['login']),
        ...mapMutations(['clearSignInError']),
        async signInClicked() {
            if (this.phone === null || isNaN(this.phone)) {
                this.notifyError("Invalid Phone Number")
                return;
            }

            if (this.phone.toString().length !== 11) {
                this.notifyError("Phone number must be of 11 digits")
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
};
</script>

<style scoped>
</style>
