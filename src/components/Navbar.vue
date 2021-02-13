<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-danger sticky-top animated slideInDown">
        <!--        Badhon Icon/ Logo-->
        <img src="https://badhanweb.github.io/badhan/images/badhanlogo.png"
             style="width: 40px; height: 40px; background: transparent">
        <a class="navbar-brand" href="#" @click="homeClicked()">Badhan <span class="sr-only">(current)</span></a>

        <div style="height: 100%; width: 50px">
            <div v-if="$store.getters.getLoadingFlag" class="spinner-border text-light" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <button class="navbar-toggler" v-if="$store.getters.getToken!==null" type="button" data-toggle="collapse"
                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent" v-if="$store.getters.getToken!==null">
            <!--        Hall Admin Panel button-->
            <ul class="navbar-nav mr-auto">
                <li class="nav-item" v-if="$store.getters.getDesignation >=2">
                    <a class="nav-link" href="#" @click="hallAdminPanelClicked()">Hall Admin Panel</a>
                </li>

                <!--        Super Admin Panel button-->
                <li class="nav-item" v-if="$store.getters.getDesignation === 3">
                    <a class="nav-link" href="#" @click="superAdminPanelClicked()">Super Admin Panel</a>
                </li>

            </ul>

            <!--      My profile link-->
            <b-button v-b-modal="'detailsModal'" variant="outline-dark" @click="myProfileclicked()"> My
                Profile</b-button>

            <a class="nav-item btn" @click="signOutClicked()"> Sign Out</a>
        </div>

    </nav>
</template>

<script>
import {eventBus} from "../main";
import {dummyMe} from "../dummydata";
import axios from "axios";

export default {
    name: "Header",
    data: function () {
        return {
            searchString: '',

            dummyMe,
            spinnerOn: false
        }
    },
    methods: {
        homeClicked() {
            if (this.$store.getters.getToken.length === 0)
                return;
            this.$store.commit('showSearchPanel');
        },
        hallAdminPanelClicked() {
            this.$store.commit('showHallAdminPanel');
        },
        superAdminPanelClicked() {
            this.$store.commit('showSuperAdminPanel');
        },
        async myProfileclicked() {
            this.$store.commit('showSearchPanel');
            let sendData = {
                donorPhone: parseInt(this.$store.getters.getPhone)
            };
            let headers = {
                'x-auth': this.$store.getters.getToken
            }
            console.log('REQUEST TO /donor/details: ', sendData);

            this.$store.commit('setLoadingTrue');

            try {
                let response = await axios.post('/donor/details', sendData, {headers: headers});
                console.log('status: ', response.status);
                if (response.status !== 200) {
                    this.error = "Status code not 200";
                    return;
                }
                console.log(response.data);

                eventBus.$emit('dataloaded', response.data.donor);


            } catch (error) {
                eventBus.$emit('errorFound', error.response);
                console.log('Error occured on receiving data on navbar myprofile link clicking')
            } finally {
                this.$store.commit('setLoadingFalse');
            }
        },
        signOutClicked() {
            this.$store.commit('showSignIn');
            this.$store.commit('signOut');
            localStorage.removeItem('phone');
            localStorage.removeItem('password');
            localStorage.removeItem('rememberFlag');
        },
    },
    created() {

    }
}
</script>

<style scoped>

</style>
