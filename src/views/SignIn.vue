<template>
    <div>
        <div class="row d-flex justify-content-center" align="center">
            <div class="bg-light mb-3 col-lg-4 col-md-12 col-sm-12 p-4" style="height: fit-content; top: 10vh">

                <img src="../assets/images/badhanlogo.png" style="width: 150px; height: 150px">

                <div class="h4 p-2">Sign into Badhan Sync</div>

                <div>
                    <div class="form-group">
                        <label>Phone </label>
                        <input class="form-control" type="text" v-model="phone" placeholder="11 Digit Phone number">
                        <br>
                        <label>Password </label>
                        <input class="form-control" type="password" v-model="password" placeholder="Password">

                        <!--                    <b-form-checkbox-->
                        <!--                        id="checkbox-1"-->
                        <!--                        v-model="rememberFlag"-->
                        <!--                        name="checkbox-1"-->
                        <!--                        :value="true"-->
                        <!--                        :unchecked-value="false"-->
                        <!--                    >-->
                        <!--                        Remember me-->
                        <!--                    </b-form-checkbox>-->
                        <v-checkbox
                            v-model="rememberFlag"
                            label="Remember me"
                        ></v-checkbox>

                        <v-btn color="warning" rounded @click="clearClicked()">Clear</v-btn>
                        <v-btn color="primary" rounded class="ml-2" @click="signInClicked()" :disabled="$store.getters.getSignInLoaderFlag"
                               :loading="$store.getters.getSignInLoaderFlag">
                            Sign In
                        </v-btn>

                    </div>
                </div>
                <div class="alert alert-danger animated jello" role="alert" v-if="$store.getters.getError.length!==0">
                    {{ $store.getters.getError }}
                </div>
            </div>
        </div>

        <SignInDialog :dialog="$store.getters.getSignInLoaderFlag">

        </SignInDialog>

    </div>
</template>

<script>
import SignInDialog from "@/components/SignInDialog";
export default {
    name: "SignIn",
    data: function () {
        return {
            phone: "",
            password: "",
            rememberFlag: localStorage.getItem('rememberFlag') == 'true',

        }
    },
    watch: {
        'rememberFlag'(to, from) {
            localStorage.setItem('rememberFlag', to);

        }
    },
    methods: {
        async signInClicked() {
            this.$store.commit('clearSignInError');

            if (this.phone === null || isNaN(this.phone)) {
                this.$store.commit('setSignInError',"Invalid Phone Number");
                return;
            }

            if (this.phone.toString().length !== 11) {
                this.$store.commit('setSignInError',"Phone number must be of 11 digits");
                return;
            }

            let isSignInOk = await this.$store.dispatch('login',{
                phone: this.phone,
                password: this.password,
                rememberFlag: this.rememberFlag
            });

            if(isSignInOk){
                await this.$router.push('/home');
            }
        },

        clearClicked() {
            this.phone = "";
            this.password = "";
            this.$store.commit('clearSignInError');
        },

    },
    async mounted() {

    },

    components:{
        SignInDialog
    }

}
</script>

<style scoped>

</style>
