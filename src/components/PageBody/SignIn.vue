<template>
    <div class="row">
        <div class="bg-light mb-3 col-lg-4 col-md-12 col-sm-12 p-4 animated slideInLeft" style="height: fit-content">
            <div class="h4 p-2" >Sign in to Badhan</div>
            <div>
                <div class="form-group">
                    <label>Phone: </label>
                    <input class="form-control" type="text" v-model="phone" placeholder="11 Digit Phone number">
                    <br>
                    <label>Password: </label>
                    <input class="form-control" type="password" v-model="password" placeholder="Password">
                    <br>
                    <button type="button" class="btn btn-warning" @click="clearClicked()">Clear</button>
                    <button type="button" class="btn btn-success" @click="signInClicked()">
                        Sign In
                    </button>
                    <br>
                    <br>
                  <a href="https://badhanweb.github.io/badhanliteapp/app/build/outputs/apk/debug/app-debug.apk">Download the android app</a>

                </div>
            </div>
          <div class="alert alert-danger animated jello" role="alert" v-if="error.length!==0">
            {{error}}
          </div>
        </div>
        <div class="col-lg-8">

        </div>
    </div>
</template>

<script>

    export default {
        name: "SignIn",
        data: function(){
            return {
                phone: "",
                password: "",
                error: "",
                isLargeWindow:true,
            }
        },
        methods:{
            signInClicked(){
                console.log('Sign in clicked');

                this.error="";

                if(isNaN(this.phone)){
                    this.error = "Invalid Phone Number";
                    this.$store.commit('setLoadingFalse');
                    return;
                }

                if(this.phone.toString().length!==11)
                {
                    this.error = "Phone number must be of 11 digits";
                    this.$store.commit('setLoadingFalse');
                    return;
                }

                let sendData = {
                    phone: parseInt('88'+this.phone),
                    password: this.password
                };
                console.log("sendData: ",sendData);

                let self=this;
                this.$store.commit('setLoadingTrue');
                this.axios.post('/users/signin', sendData).then(function (response) {
                    console.log('status: ',response.status);
                    if(response.status==200){
                        self.$store.commit('showSearchPanel');
                        self.$store.commit('setToken',response.data.token);
                        self.$store.commit('setPhone',parseInt('88'+self.phone));
                        self.$store.commit('setDesignation',response.data.designation);
                        self.$store.commit('setHall',response.data.hall);

                        console.log('token: ',self.$store.getters.getToken);
                        console.log('designation: ',self.$store.getters.getDesignation);
                        console.log('hall: ',self.$store.getters.getHall);

                        self.$localStorage.set('phone', self.phone.toString());
                        self.$localStorage.set('password', self.password);
                    }else{
                        self.error="Status code not 200";
                    }
                }).catch(function (error) {
                    self.error=error.response.data.message;
                    console.log(error.response);
                }).finally(function () {
                    self.$store.commit('setLoadingFalse');
                });
            },

            clearClicked() {
                console.log('Clear clicked');
                this.phone = "";
                this.password = "";
                this.$store.commit('setToken', "123");
                this.error = "";
                console.log(this.$store.getters.getToken);
            },

        },
        mounted() {
            this.phone = localStorage.getItem('phone');
            this.password=localStorage.getItem('password');
        },

    }
</script>

<style scoped>

</style>
