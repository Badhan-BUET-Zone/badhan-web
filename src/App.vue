<template>
    <v-app id="app" app>
        <app-bar v-if="getIsLoggedIn"></app-bar>
        <v-main>
            <router-view app class="container" ></router-view>
        </v-main>
        <SignInDialog v-if="getSignInLoaderFlag"></SignInDialog>
        <Notification></Notification>

    </v-app>
</template>

<script>
import AppBar from "@/components/AppBar";

import PageTitle from "./components/PageTitle";

import Notification from "./components/Notification";
import {mapActions, mapGetters} from "vuex";
import SignInDialog from "./components/SignInDialog";

import {getDeviceInfo,isNative,exitApp} from '@/plugins/android_support';

export default {
    name: 'app',
    data() {
        return {
            msg: 'Welcome to Your Vue.js App',
            waitingForExitConfirmation: false,
        }
    },
    components: {
        PageTitle,
        'app-bar': AppBar,
        Notification,
      SignInDialog
    },
    computed:{
        ...mapGetters(['getSignInLoaderFlag','getIsLoggedIn']),
    },
    methods:{
        ...mapActions('release',['fetchtAppDetails']),
        yourCallBackFunction () {
            if(this.$route.name==="Details"){
                this.$router.push('/home');
                return;
            }
            if(this.$route.path==="/home" || this.$route.path==='/'){
                if(this.waitingForExitConfirmation===true){
                    return;
                }
                this.waitingForExitConfirmation=true;
                this.$bvModal.msgBoxConfirm('Exit app?',{
                    centered:true
                })
                    .then(value => {
                        if(value===true){
                          exitApp();
                        }else{
                            this.waitingForExitConfirmation=false;

                        }
                    })
                    .catch(err => {
                        // An error occurred
                    }).finally(()=>{
                })
            }else{
                this.$router.go(-1);
            }
        },
        async versionCheck(){
            const info = await getDeviceInfo();
            const deployedAppInfo = await this.fetchtAppDetails();

            if(isNative() && deployedAppInfo.data.version!=info.appVersion){
                this.$bvModal.msgBoxConfirm('New version '+deployedAppInfo.data.version+' available. Please download the latest update.',{
                    centered:true
                })
                    .then(value => {
                        if(value===true){
                            window.open("https://play.google.com/store/apps/details?id=com.mmmbadhan");
                        }
                    })
                    .catch(err => {
                        // An error occurred
                    }).finally(()=>{
                })
            }
        }
    },

    async mounted () {

        document.addEventListener("backbutton", this.yourCallBackFunction, false);
        this.versionCheck();
    },
    beforeDestroy () {
        document.removeEventListener("backbutton", this.yourCallBackFunction);
    },
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
v-btn {
    text-decoration: none;
}

.required label::after {
  content: " *";
}


</style>
