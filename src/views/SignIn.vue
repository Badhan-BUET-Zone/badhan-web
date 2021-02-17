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
                        <v-btn color="primary" rounded class="ml-2" @click="signInClicked()" :disabled="signInLoaderFlag"
                               :loading="signInLoaderFlag">
                            Sign In
                        </v-btn>

                    </div>
                </div>
                <div class="alert alert-danger animated jello" role="alert" v-if="error.length!==0">
                    {{ error }}
                </div>
            </div>
        </div>

        <SignInDialog :dialog="signInLoaderFlag">

        </SignInDialog>

    </div>
</template>

<script>
import axios from 'axios'
import SignInDialog from "@/components/SignInDialog";
export default {
    name: "SignIn",
    data: function () {
        return {
            phone: "",
            password: "",
            error: "",
            isLargeWindow: true,
            rememberFlag: localStorage.getItem('rememberFlag') == 'true',

            signInLoaderFlag: false,
        }
    },
    watch: {
        'rememberFlag'(to, from) {
            localStorage.setItem('rememberFlag', to);

        }
    },
    methods: {
        async signInClicked() {


            this.error = "";

            if (this.phone === null || isNaN(this.phone)) {
                this.error = "Invalid Phone Number";
                this.$store.commit('setLoadingFalse');
                return;
            }

            if (this.phone.toString().length !== 11) {
                this.error = "Phone number must be of 11 digits";
                this.$store.commit('setLoadingFalse');
                return;
            }


            this.signInLoaderFlag = true;
            try {
                let sendData = {
                    phone: parseInt('88' + this.phone),
                    password: this.password
                };
                console.log("REQUEST POST TO /users/signin: HIDDEN");
                let response = await axios.post('/users/signin', sendData);

                console.log("RESPONSE FROM /users/signin: ", response);

                if (response.status !== 201) {
                    this.error = "Status code not 201";
                    return;
                }

                this.$store.commit('setToken', response.data.token);

                let headers = {
                    'x-auth': this.$store.getters.getToken
                };
                sendData = {
                    donorPhone: parseInt('88' + this.phone)
                };

                console.log("REQUEST POST TO /donor/details: ", sendData);
                let profileInfo = await axios.post('/donor/details', sendData, {headers: headers});

                console.log("RESPONSE FROM /donor/details: ", profileInfo);

                // this.$store.commit('showSearchPanel');



                this.$store.commit('setPhone', parseInt('88' + this.phone));
                this.$store.commit('setName', profileInfo.data.donor.name);
                this.$store.commit('setStudentId', profileInfo.data.donor.studentId);
                this.$store.commit('setLastDonation', profileInfo.data.donor.lastDonation);
                this.$store.commit('setBloodGroup', profileInfo.data.donor.bloodGroup);
                this.$store.commit('setHall', profileInfo.data.donor.hall);
                this.$store.commit('setAddress', profileInfo.data.donor.address);
                this.$store.commit('setComment', profileInfo.data.donor.comment);
                this.$store.commit('setDesignation', profileInfo.data.donor.designation);

                await this.$router.push('/home');

                if (this.rememberFlag === true) {
                    localStorage.setItem('phone', this.phone);
                    localStorage.setItem('password', this.password);
                } else {
                    console.log("REMOVED CREDENTIALS")
                    localStorage.removeItem('phone');
                    localStorage.removeItem('password');
                }

            } catch (error) {
                console.log(error);
                this.error = error.response.data.message;
            } finally {
                this.signInLoaderFlag = false;
            }

        },

        clearClicked() {
            this.phone = "";
            this.password = "";
            this.$store.commit('setToken', "123");
            this.error = "";
        },

    },
    async mounted() {
        this.phone = localStorage.getItem('phone');
        this.password = localStorage.getItem('password');
        if (this.phone !== null) {
            await this.signInClicked();
        }
    },

    components:{
        SignInDialog
    }

}
</script>

<style scoped>

</style>
