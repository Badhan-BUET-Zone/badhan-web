<template>
    <div>
        <div class="row">
            <div class="col-lg-6 col-sm-12 col-md-12 jumbotron card">
                <h3>Hall Admins</h3>
                <v-progress-circular
                    v-if="$store.getters.getHallAdminsLoaderFlag"
                    indeterminate
                    color="primary"
                ></v-progress-circular>

                <div class="alert alert-danger" role="alert" v-if="$store.getters.getHallAdminsFetchError!==null">
                    {{ $store.getters.getHallAdminsFetchError }}
                </div>

                <table class="table table-hover" v-if="$store.getters.getHallAdmins!==null">
                    <thead>
                    <tr>
                        <th scope="col">Hall Name</th>
                        <th scope="col">Hall Admin</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(hallAdmin,index) in $store.getters.getHallAdmins" :key="index">
                        <th scope="row">{{ halls[hallAdmin.hall] }}</th>
                        <td>{{ hallAdmin.name }}</td>
                    </tr>
                    </tbody>
                </table>
                <hr>
                <b>Change Hall Admin: </b>

                <div class="form-group row">
                    <label class="col-sm-4 col-form-label">Enter phone number of volunteer: </label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" v-model="newAdminPhone"
                               placeholder="Enter phone number of volunteer to be promoted">
                    </div>
                    <div class="col-sm-8">
                        <v-btn color="primary" rounded :disabled="changeHallAdminLoaderFlag" :loading="changeHallAdminLoaderFlag" @click="changeHallAdminClicked()">Change Hall Admin</v-btn>
                    </div>
                </div>

                <div class="alert alert-danger animated jello" role="alert" v-if="errorChangeAdmin.length!==0">
                    {{ errorChangeAdmin }}
                </div>
                <div class="alert alert-success animated jello" role="alert" v-if="successChangeAdmin.length!==0">
                    {{ successChangeAdmin }}
                </div>
            </div>
            <div class="jumbotron col-lg-6 col-md-12 col-sm-12 card animated fadeInDown" style="height: fit-content">
                <div>
                    <p>Archive: (CAUTION)</p>
                    <div class="form-group row">
                        <label class="col-sm-4 col-form-label">Enter batch number to be archived: </label>
                        <div class="col-sm-8">
                            <input type="text" v-model="batch" class="form-control">
                        </div>
                        <label class="col-sm-4 col-form-label">Enter your password: </label>
                        <div class="col-sm-8">
                            <input type="password" v-model="password" class="form-control">
                        </div>
                        <div class="col-sm-8">
                            <v-btn rounded color="red" class="white--text" @click="archiveBatchClicked()" disabled>Archive batch (not implemented)</v-btn>
                        </div>
                    </div>
                    <div class="alert alert-danger" role="alert" v-if="errorArchive.length!==0">
                        {{ errorArchive }}
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script>
import {halls} from '@/constants';
import {eventBus} from "@/main";
import axios from "axios";

export default {
    name: "SuperAdminPanel",
    data: function () {
        return {
            hallAdmins: [],
            halls,
            newAdminPhone: '',
            password: '',
            batch: '',
            loadingComplete: false,

            //error message controller flags
            errorArchive: "route archive not enabled",
            errorChangeAdmin: "",
            errorAdminsLoaded: "",

            successChangeAdmin: "",

            changeHallAdminLoaderFlag: false,
        }
    },
    methods: {
        async changeHallAdminClicked() {
            console.log('Change hall admin clicked: ');
            this.errorChangeAdmin = "";
            this.successChangeAdmin = "";

            if (isNaN(this.newAdminPhone) || this.newAdminPhone.toString().length !== 11) {
                this.errorChangeAdmin = "Please enter a valid phone number";
                console.log('Please enter a valid number');
                return;
            }

            let sendData = {
                userPhone: this.$store.getters.getPhone,
                donorPhone: parseInt('88' + this.newAdminPhone)
            };
            let headers = {
                'x-auth': this.$store.getters.getToken
            }

            console.log('REQUEST TO /admin/hall/change: ', sendData);

            this.changeHallAdminLoaderFlag = true;
            try {
                let response = await axios.post('/admin/hall/change', sendData, {headers: headers});
                console.log("RESPONSE FROM /admin/hall/change: ", response);
                if (response.status !== 200) {
                    this.errorChangeAdmin = "Status code not 200";
                    return;
                }
                console.log('hall admin change successful');
                this.successChangeAdmin = "Successfully changed hall admin";
                this.loadingComplete = true;
                await this.showAdmins();

            } catch (error) {
                this.errorChangeAdmin = error.response.data.message;
                console.log(error.response);
            } finally {
                this.changeHallAdminLoaderFlag = false;
            }
        },
        archiveBatchClicked() {
            console.log('archive button clicked: ');
            console.log('batch: ', this.batch);
            console.log('password: ', this.password);
            eventBus.$emit('spinnerOn', {});

            //SIMULATION START
            setTimeout(() => {
                console.log("Archive complete");
                eventBus.$emit('spinnerOff', {});
            }, 2000);
            //SIMULATION STOP
        },

    },
    created() {

    },
    mounted() {
        this.$store.dispatch('fetchHallAdmins');
    }
}
</script>

<style scoped>

</style>
