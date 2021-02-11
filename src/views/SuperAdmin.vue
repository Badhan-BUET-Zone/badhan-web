<template>
    <div>
        <div class="row">
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
                            <button class="btn btn-danger" @click="archiveBatchClicked()">Archive batch</button>
                        </div>
                    </div>
                    <div class="alert alert-danger animated jello" role="alert" v-if="errorArchive.length!==0">
                        {{ errorArchive }}
                    </div>
                </div>
            </div>

            <div class="col-lg-6 col-sm-12 col-md-12 jumbotron card animated fadeIn">
                <button class="btn btn-primary" @click="showAdmins">
                    <span v-if="!loadingComplete">Load Admins</span>
                    <span v-else="">Hide Admins</span>
                </button>
                <div class="alert alert-danger animated jello" role="alert" v-if="errorAdminsLoaded.length!==0">
                    {{ errorAdminsLoaded }}
                </div>

                <table class="table table-hover animated fadeIn" v-if="loadingComplete">
                    <thead>
                    <tr>
                        <th scope="col">Hall Name</th>
                        <th scope="col">Hall Admin</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(hallAdmin) in hallAdmins">
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
                        <button class="btn btn-success" @click="changeHallAdminClicked()">Change Hall Admin</button>
                    </div>
                </div>

                <div class="alert alert-danger animated jello" role="alert" v-if="errorChangeAdmin.length!==0">
                    {{ errorChangeAdmin }}
                </div>
                <div class="alert alert-success animated jello" role="alert" v-if="successChangeAdmin.length!==0">
                    {{ successChangeAdmin }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {halls} from '@/constants';
import {eventBus} from "@/main";

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
        }
    },
    methods: {
        changeHallAdminClicked() {
            console.log('Change hall admin clicked: ');
            this.errorChangeAdmin = "";
            this.successChangeAdmin = "";

            if (isNaN(this.newAdminPhone) || this.newAdminPhone.toString().length !== 11) {
                this.errorChangeAdmin = "Please enter a valid phone number";
                console.log('Please enter a valid number');
                return;
            }

            let sendData = {
                token: this.$store.getters.getToken,
                userPhone: this.$store.getters.getPhone,
                donorPhone: parseInt('88' + this.newAdminPhone)
            };
            console.log('sendData: ', sendData);

            let self = this;
            this.$store.commit('setLoadingTrue');
            this.axios.post('/changeadmin', sendData).then(function (response) {
                console.log('status: ', response.status);
                if (response.status == 200) {
                    console.log('hall admin change successful');
                    self.successChangeAdmin = "Successfully changed hall admin";
                    self.loadingComplete = true;
                    self.showAdmins();
                } else {
                    self.errorChangeAdmin = "Status code not 200";
                }
            }).catch(function (error) {
                self.errorChangeAdmin = error.response.data.message;
                console.log(error.response);
            }).finally(function () {
                self.$store.commit('setLoadingFalse');
            });
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
        showAdmins() {
            if (this.loadingComplete == true) {
                this.loadingComplete = false;
                return;
            }
            this.$store.commit('setLoadingTrue');
            let sendData = {
                token: this.$store.getters.getToken,
                userPhone: this.$store.getters.getPhone,
            };
            console.log('sendData: ', sendData);

            let self = this;
            this.$store.commit('setLoadingTrue');
            this.axios.post('/showadmins', sendData).then(function (response) {
                //01823472762 test1234
                console.log('status: ', response.status);
                if (response.status == 200) {
                    console.log('response.data: ', response.data);
                    console.log('sample data: ', self.hallAdmins);
                    self.hallAdmins = response.data;
                    self.loadingComplete = true;
                } else {
                    self.errorAdminsLoaded = "Status code not 200";
                }
            }).catch(function (error) {
                self.errorAdminsLoaded = error.response.data.message;
                console.log(error.response);
            }).finally(function () {
                self.$store.commit('setLoadingFalse');
            });
        }
    },
    created() {

    }
}
</script>

<style scoped>

</style>
