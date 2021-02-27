<template>
    <div data-aos="fade-up">
        <div class="row d-flex justify-content-center" align="center">
            <div
                class="bg-light mb-3 col-lg-4 col-md-12 col-sm-12 p-4"
                style="height: fit-content; top: 5vh"
            >
                <img
                    src="../assets/images/badhanlogo.png"
                    style="width: 150px; height: 150px"
                />

                <div class="h4 p-2">Sign into Badhan Sync</div>

                <div>
<!--                        <label>Phone </label>-->
<!--                        <input-->
<!--                            class="form-control"-->
<!--                            type="text"-->
<!--                            v-model="phone"-->
<!--                            placeholder="11 Digit Phone number"-->
<!--                        />-->
                        <v-text-field
                            :type="'text'"
                            outlined
                            label="Phone"
                            v-model="phone"
                            class="input-group--focused"

                        ></v-text-field>

<!--                        <label>Password </label>-->
<!--                        <input-->
<!--                            class="form-control"-->
<!--                            type="password"-->
<!--                            v-model="password"-->
<!--                            placeholder="Password"-->
<!--                        />-->

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

                        ></v-text-field>


                        <v-checkbox v-model="rememberFlag" label="Remember me"></v-checkbox>

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
                    class="alert alert-danger animated jello"
                    role="alert"
                    v-if="$store.getters.getError.length !== 0"
                >
                    {{ $store.getters.getError }}
                </div>

                <v-btn
                    class="mt-3"
                  v-if="!isMobile"
                  text
                  style="text-decoration: none"
                  href="https://play.google.com/store/apps/details?id=com.mmmbadhan"
                >
                  Download App
                  <v-icon right>mdi-google-play</v-icon>
                </v-btn>

<!--                <v-btn-->
<!--                    v-if="!isMobile"-->
<!--                    text-->
<!--                    style="text-decoration: none"-->
<!--                    disabled-->
<!--                >-->
<!--                    App under review-->
<!--                    <v-icon right>mdi-google-play</v-icon>-->
<!--                </v-btn>-->
            </div>
        </div>

        <SignInDialog :dialog="$store.getters.getSignInLoaderFlag"></SignInDialog>
    </div>
</template>

<script>
import SignInDialog from "@/components/SignInDialog";
import {Capacitor} from "@capacitor/core";

export default {
    name: "SignIn",
    data: function () {
        return {
            phone: "",
            password: "",
            rememberFlag: localStorage.getItem("rememberFlag") == "true",

            passwordFlag: false,
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
            }
        },

        clearClicked() {
            this.phone = "";
            this.password = "";
            this.$store.commit("clearSignInError");
        },
    },
    async mounted() {
    },

    components: {
        SignInDialog,
    },
};
</script>

<style scoped>
</style>
