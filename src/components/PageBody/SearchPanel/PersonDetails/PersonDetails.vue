<template>
    <!--    <b-modal id="detailsModal" size="xl" hide-footer>-->
<!--    <v-dialog-->
<!--        v-model="dialog"-->
<!--        hide-overlay-->
<!--        fullscreen-->
<!--    >-->
        <v-card v-if="dialog" style="z-index: 90; position: fixed; left: 0px; top:0px; height: 100vh; width: 100vw; overflow-y: scroll" class="pa-5">
<!--            <v-card>-->
            <v-card-actions>
                <v-btn rounded @click="dialog=false">< Back</v-btn>
            </v-card-actions>
            <v-card-title v-if="!$store.getters.getLoadingFlag && errorDetailsLoading.length===0">
                <span>{{ name }}</span>
                (<span v-if="designation===2">Hall admin</span>
                <span v-else-if="designation===3">Super admin</span>
                <span v-else-if="designation===1">Volunteer</span>
                <span v-else-if="designation===0">Donor</span>)
            </v-card-title>
            <v-card-subtitle class="mt-2">
                <span v-if="availableIn>0" class="alert alert-danger">{{ this.availableIn }} Days remaining</span>
                <span v-else="" class="alert alert-success">Available</span>
            </v-card-subtitle>


            <!--            Modal Body-->
            <div class="modal-body row animated fadeIn" v-if="!$store.getters.getLoadingFlag">


                <!--                Modal First column-->
                <div class="card col-lg-8 col-md-12 col-sm-12 ">
                    <br>
                    <div class="custom-control custom-switch"
                         v-if="$store.getters.getDesignation===3 || $store.getters.getPhone == oldPhone || ($store.getters.getHall===hall && $store.getters.getDesignation> designation) ||hall===7">
                        <input type="checkbox" class="custom-control-input" id="customSwitch1"
                               v-model="enableEditing">
                        <label class="custom-control-label" for="customSwitch1">Toggle to edit details</label>
                    </div>
                    <br>

                    <div>
                        <div class="card">
                            <div class="card-header" id="headingOne">
                                <h5 class="mb-0">
                                    <button class="btn btn-link"
                                            @click="personDetailCollapseFlag=!personDetailCollapseFlag">
                                        Person Details
                                    </button>
                                </h5>
                            </div>

                            <div v-if="personDetailCollapseFlag">
                                <div class="card-body">

                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label">Name</label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" :disabled="!enableEditing"
                                                   v-model="name">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label">Phone</label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" :disabled="!enableEditing"
                                                   v-model="phone">
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label">Blood Group: </label>
                                        <div class="col-sm-8">
                                            <select class="form-control" v-model="bloodGroup"
                                                    :disabled="!enableEditing">
                                                <option v-for="(blood, index) in bloodGroups" :value="index">
                                                    {{ blood }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label">Student ID: </label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" :disabled="!enableEditing"
                                                   v-model="studentID">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label">Hall: </label>
                                        <div class="col-sm-8">
                                            <select class="form-control" v-model="hall"
                                                    :disabled="!enableEditing || designation===2 || designation===1">
                                                <option v-for="(oneHall, index) in halls" :value="index"
                                                        v-if="$store.getters.getDesignation===3 || index===7 || $store.getters.getHall=== index">
                                                    {{ oneHall }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label">Room: </label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" :disabled="!enableEditing"
                                                   v-model="room">
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-sm-4 col-form-label">Address: </label>
                                        <div class="col-sm-8">
                                            <input type="text" class="form-control" :disabled="!enableEditing"
                                                   v-model="address">
                                        </div>
                                    </div>

                                    <div
                                        v-if="$store.getters.getDesignation>designation || $store.getters.getPhone== oldPhone">
                                        <v-btn color="warning" rounded @click="dialog=false">Cancel
                                        </v-btn>
                                        <v-btn color="primary" rounded class="white--text ml-2"
                                               :disabled="detailsSpinner || !enableEditing"
                                               :loading="detailsSpinner"
                                               @click="saveDetailsClicked()">Save
                                        </v-btn>
                                    </div>
                                    <br>
                                    <div class="alert alert-danger animated jello" role="alert"
                                         v-if="errorDetails.length!==0">
                                        {{ errorDetails }}
                                    </div>
                                    <div class="alert alert-success animated jello" role="alert"
                                         v-if="successDetails.length!==0">
                                        {{ successDetails }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card"
                             v-if="$store.getters.getDesignation>designation || $store.getters.getPhone== oldPhone">
                            <div class="card-header" id="headingTwo">
                                <h5 class="mb-0">
                                    <button class="btn btn-link" @click="settingsCollapseFlag=!settingsCollapseFlag">
                                        Settings
                                    </button>
                                </h5>
                            </div>
                            <div v-if="settingsCollapseFlag">
                                <div class="card-body">
                                    <div v-if="designation!==0 || $store.getters.getPhone== oldPhone">
                                        <div class="form-group row">
                                            <label class="col-sm-4 col-form-label">New Password: </label>
                                            <div class="col-sm-8">
                                                <input type="password" class="form-control"
                                                       :disabled="!enableEditing"
                                                       v-model="newPassword">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-sm-4 col-form-label">Confirm Password: </label>
                                            <div class="col-sm-8">
                                                <input type="password" class="form-control"
                                                       :disabled="!enableEditing"
                                                       v-model="confirmPassword">
                                            </div>
                                        </div>
                                        <button v-if="designation==1" class="btn btn-outline-danger"
                                                :disabled="!enableEditing" style="width: 100%" @click="demote()">
                                            Demote
                                            this member to donor
                                        </button>
                                        <br><br>

                                    </div>

                                    <div v-if="$store.getters.getDesignation>1 && designation==0 && this.hall!==7">
                                        <label>Promote this member to volunteer</label>
                                        <div class="form-group row">
                                            <label class="col-sm-4 col-form-label">New Password: </label>
                                            <div class="col-sm-8">
                                                <input type="password" class="form-control"
                                                       :disabled="!enableEditing"
                                                       v-model="newPassword">
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-sm-4 col-form-label">Confirm Password: </label>
                                            <div class="col-sm-8">
                                                <input type="password" class="form-control"
                                                       :disabled="!enableEditing"
                                                       v-model="confirmPassword">
                                            </div>
                                        </div>

                                    </div>

                                    <div v-if="$store.getters.phone=== oldPhone||$store.getters.getDesignation>1">
                                        <v-btn color="warning" @click="hideDetails()" rounded>Cancel
                                        </v-btn>
                                        <v-btn color="primary" class="white--text ml-2" rounded
                                               :disabled="settingsSpinner || !enableEditing"
                                               :loading="settingsSpinner"
                                               @click="saveSettingsClicked()">Save
                                        </v-btn>
                                    </div>
                                    <br>
                                    <div class="alert alert-danger animated jello" role="alert"
                                         v-if="errorSettings.length!==0">
                                        {{ errorSettings }}
                                    </div>
                                    <div class="alert alert-success animated jello" role="alert"
                                         v-if="successSettings.length!==0">
                                        {{ successSettings }}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <br>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" :disabled="!enableEditing" v-model="comment">
                        <div class="input-group-append">
                            <v-btn color="primary"
                                    :disabled="commentSpinner || !enableEditing"
                                   :loading="commentSpinner"
                                    @click="saveCommentClicked()">
                                Save Comment
                            </v-btn>
                        </div>

                    </div>

                    <div class="alert alert-danger animated jello" role="alert" v-if="errorComment.length!==0">
                        {{ errorComment }}
                    </div>
                    <div class="alert alert-success animated jello" role="alert" v-if="successComment.length!==0">
                        {{ successComment }}
                    </div>

                </div>

                <!--                Modal Second Column-->
                <div class="card col-lg-4 col-md-12 col-md-12" style="height: fit-content">
                    <p>Last Donation: </p>
                    <template v-if="lastDonation!==0">
                    <p class="text-dark">{{ lastDonation }}</p>
                    <v-btn :loading="historySpinner" :disabled="historySpinner" color="primary" rounded
                           class="mb-2"
                           @click="loadHistory()">Load
                        history
                    </v-btn>
                    <br>
                    <div v-if="showHistory">
                        <div class="input-group mb-3" v-for="(date) in history">
                            <input type="text" readonly class="form-control" :value="datePrint(date)">
                            <div class="input-group-append">
                                <button class="btn btn-success" type="button" @click="deleteDonation(date)">Delete
                                </button>
                            </div>
                        </div>
                        <br>
                    </div>
                    <div class="alert alert-danger animated jello" role="alert" v-if="errorHistory.length!==0">
                        {{ errorHistory }}
                    </div>
                    <div class="alert alert-success animated jello" role="alert" v-if="successHistory.length!==0">
                        {{ successHistory }}
                    </div>
                </template>
                    <template v-else>No donation found</template>

                </div>

            </div>

        </v-card>
<!--    </v-dialog>-->
</template>

<script>
import {eventBus} from "@/main";
import {halls, bloodGroups} from "@/constants";
import axios from "axios";

export default {
    name: "PersonDetails",
    data: function () {
        return {
            //form fields
            name: '',
            oldPhone: '',
            phone: '',
            studentID: '',
            bloodGroup: '',
            availableIn: '',
            designation: '',
            hall: '',
            room: '',
            address: '',
            lastDonation: '',

            history: [],
            dateToBeDeleted: '',

            halls,
            // dummyMe,
            bloodGroups,
            showDetails: false,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            comment: '',

            //history flag
            showHistory: false,

            //spinner controller flags
            detailsSpinner: false,
            settingsSpinner: false,
            commentSpinner: false,
            historySpinner: false,
            enableEditing: false,

            //error messages
            errorDetails: '',
            errorComment: '',
            errorSettings: '',
            errorHistory: '',
            errorDetailsLoading: '',

            successComment: '',
            successSettings: '',
            successHistory: '',
            successDetails: '',


            //vuetify modal
            dialog: false,

            //person detail collapse and settings collapse
            personDetailCollapseFlag: false,
            settingsCollapseFlag: false
        }
    },
    watch: {
        'dialog'(to, from) {
            if (to === false) {
                this.$router.push('/home');
            }
        }
    },
    methods: {
        datePrint(date) {
            let dateObj = new Date(date);
            return dateObj.getDate() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getFullYear();
        },
        hideDetails() {
            this.showHistory = false;
            this.enableEditing = false;
            this.errorDetailsLoading = "";

        },
        async saveCommentClicked() {

            this.errorComment = "";
            this.successComment = "";

            let sendData = {
                donorPhone: parseInt('88' + this.phone),
                comment: this.comment,
            };
            let headers = {
                'x-auth': this.$store.getters.getToken
            }
            console.log('REQUEST TO /donor/comment: ', sendData);
            this.commentSpinner = true;
            try {
                let response = await axios.post('/donor/comment', sendData, {headers: headers});
                console.log('RESPONSE FROM /donor/comment: ', response);

                if (response.status !== 200) {
                    this.error = "Status code not 200";
                    return;
                }
                this.successComment = "Successfully changed comment";
                this.enableEditing = false;
            } catch (error) {
                this.errorComment = error.response.message;
                console.log(error.response);
            } finally {
                this.commentSpinner = false;
            }
        },
        async deleteDonation(date) {
            console.log('date to be deleted: ', date);

            this.errorHistory = "";
            this.successHistory = "";


            this.dateToBeDeleted = date;
            let sendData = {
                donorPhone: parseInt('88' + this.phone),
                date: date
            };
            let headers = {
                'x-auth': this.$store.getters.getToken,
            }
            console.log('REQUEST TO /donation/delete: ', sendData);
            this.historySpinner = true;

            try {
                let response = await axios.post('/donation/delete', sendData, {headers: headers});
                console.log('RESPONSE FROM /donation/delete: ', response);
                if (response.status !== 200) {
                    this.errorHistory = "Status code not 200";
                    return;
                }
                for (let i = 0; i < this.history.length; i++) {
                    if (this.history[i] == this.dateToBeDeleted) {
                        this.history.splice(i, 1);
                        break;
                    }
                }
                let lastDonationNew = 0;
                if (this.history.length !== 0) {
                    lastDonationNew = this.history.reduce(function (a, b) {
                        return Math.max(a, b);
                    });
                }

                let date = new Date(lastDonationNew);
                this.availableIn = 120 - Math.round((Math.round((new Date()).getTime()) - date.getTime()) / (1000 * 3600 * 24));
                this.lastDonation = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                this.successHistory = "Successfully deleted donation";

            } catch (error) {
                this.errorHistory = error.response.data.message;
                console.log(error.response);
            } finally {
                this.historySpinner = false;
            }

        },

        saveSettingsClicked() {
            console.log('save settings clicked');


            if (this.newPassword !== this.confirmPassword) {
                this.errorSettings = "Passwords didn't match";
                return;
            } else if (this.newPassword.length === 0) {
                this.errorSettings = "Password can't have length of zero";
                return;
            }

            if (this.designation === 0) {
                this.promote();
            } else {
                this.savePasswordClicked();
            }
        },
        async promote() {
            console.log('promote clicked');
            this.errorSettings = "";
            this.successSettings = "";

            let sendData = {
                donorPhone: parseInt('88' + this.phone),
                promoteFlag: true,
                newPassword: this.newPassword
            };
            let headers = {
                'x-auth': this.$store.getters.getToken
            }
            console.log('sendData: ', sendData);

            this.settingsSpinner = true;
            console.log("REQUEST TO /admin/promote: ", sendData);
            try {
                let response = await axios.post('/admin/promote', sendData, {headers: headers});

                console.log("RESPONSE FROM /admin/promote: ", response);

                if (response.status !== 200) {
                    this.errorSettings = "Status code not 200";
                    return;
                }
                this.successSettings = "Successfully promoted to volunteer";
                this.enableEditing = false;

            } catch (error) {
                this.errorSettings = error.response.data.message;
                console.log(error.response);
            } finally {
                this.settingsSpinner = false;
            }
        },
        async demote() {
            console.log('demote clicked');
            this.errorSettings = "";
            this.successSettings = "";

            let sendData = {
                donorPhone: parseInt('88' + this.phone),
                promoteFlag: false,
                newPassword: ''
            };
            let headers = {
                'x-auth': this.$store.getters.getToken
            }
            console.log('REQUEST TO /admin/promote: ', sendData);

            this.settingsSpinner = true;
            try {
                let response = await axios.post('/admin/promote', sendData, {headers: headers});
                console.log("RESPONSE FROM /admin/promote: ", response);
                if (response.status !== 200) {
                    this.errorSettings = "Status code not 200";
                    return;
                }
                console.log('demotion successful');
                this.successSettings = "Successfully demoted to donor";
                this.enableEditing = false;
            } catch (error) {
                this.errorSettings = error.response.data.message;
                console.log(error.response);
            } finally {
                this.settingsSpinner = false;
            }
        },
        async savePasswordClicked() {
            console.log('save password clicked');
            this.errorSettings = "";
            this.successSettings = "";

            if (this.newPassword !== this.confirmPassword) {
                console.log("Passwords didn't match");
                this.errorSettings = "Passwords didn't match";
                return;
            }
            if (this.newPassword.length === 0) {
                console.log("Passwords can't be of length zero");
                this.errorSettings = "Passwords can't be of length zero";
                return;
            }
            let sendData = {
                donorPhone: parseInt('88' + this.phone),
                newPassword: this.newPassword
            };
            let headers = {
                'x-auth': this.$store.getters.getToken
            }
            console.log("REQUEST TO /donor/password/change: ", sendData);
            this.settingsSpinner = true;
            try {
                let response = await axios.post('/donor/password/change', sendData, {headers: headers});
                console.log('RESPONSE FROM /donor/password/change: ', response);

                if (response.status !== 200) {
                    this.errorSettings = "Status code not 200";
                    return;
                }
                this.successSettings = "Successfully changed password";
                this.enableEditing = false;

            } catch (error) {
                this.errorSettings = error.response.data.message;
                console.log(error.response);
            } finally {
                this.settingsSpinner = false;
            }
        }
        ,
        async saveDetailsClicked() {
            console.log('save defaults clicked');
            this.errorDetails = "";
            this.successDetails = "";

            if (this.name.length === 0) {
                this.errorDetails = "Please input the name of donor";
                console.log("Please input the name of donor");
                return;
            }

            if (isNaN(this.phone) || this.phone.toString().length !== 11) {
                this.errorDetails = "Please enter a 11 digit phone number";
                console.log("Please enter a 11 digit phone number");
                return;
            }

            if (isNaN(this.studentID) || this.studentID.toString().length !== 7) {
                this.errorDetails = "Please enter a valid student ID";
                console.log("Please enter a valid student ID");
                return;
            }

            this.detailsSpinner = true;

            let sendData = {
                oldPhone: this.oldPhone,
                newName: this.name,
                newPhone: parseInt('88' + this.phone),
                newStudentId: this.studentID,
                newBloodGroup: this.bloodGroup,
                newHall: this.hall,
                newRoomNumber: this.room,
                newAddress: this.address
            };
            let headers = {
                'x-auth': this.$store.getters.getToken
            }
            console.log('REQUEST TO /donor/ecit: ', sendData);

            try {
                let response = await axios.post('/donor/edit', sendData, {headers: headers});
                console.log("RESPONSE FROM /donor/edit: ", response);
                if (response.status !== 200) {
                    this.errorDetails = "Status code not 200";
                    return;
                }

                console.log('saved donor details successfully');
                this.successDetails = "Successfully saved details.";
                this.$store.commit('setPhone', parseInt('88' + this.phone));
                this.enableEditing = false;

            } catch (error) {
                this.errorDetails = error.response.data.message;
                console.log(error.response);
            } finally {
                this.detailsSpinner = false;
            }
        }
        ,
        async loadHistory() {
            this.errorHistory = "";
            this.successHistory = "";

            if (this.showHistory) {
                this.showHistory = false;
                return;
            }

            this.historySpinner = true;

            let sendData = {
                donorPhone: parseInt('88' + this.phone)
            };
            let headers = {
                'x-auth': this.$store.getters.getToken
            }
            console.log('REQUEST TO /donor/donations: ', sendData);

            try {
                let response = await axios.post('/donor/donations', sendData, {headers: headers});
                console.log('RESPONSE FROM /donor/donations: ', response);

                if (response.status !== 200) {
                    this.errorHistory = "Status code not 200";
                    return;
                }
                this.history = response.data.donations;
                this.showHistory = true;
                this.successHistory = "Successfully loaded history";

            } catch (error) {
                this.errorHistory = error.response.data.message;
                console.log(error.response);
            } finally {
                this.historySpinner = false
            }

        }
    },

    mounted() {
        console.log("MOUNTED PERSONDETAILS");
        eventBus.$on('dataloaded', (data) => {
            this.dialog = true;


            this.successHistory = "";
            this.successSettings = "";
            this.successComment = "";
            this.successDetails = "";
            this.errorHistory = "";
            this.errorDetails = "";
            this.errorComment = "";
            this.errorSettings = "";
            this.enableEditing = false;

            this.name = data.name;
            this.phone = data.phone.toString().substr(2);
            this.oldPhone = data.phone;
            this.studentID = data.studentId;
            this.bloodGroup = data.bloodGroup;
            this.hall = parseInt(data.hall);
            this.room = data.room;
            this.address = data.address;
            this.comment = data.comment;
            this.designation = data.designation;

            let date = new Date(data.lastDonation);
            this.lastDonation = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
            if (data.lastDonation === 0) {
                this.lastDonation = "No donations found";
            }
            this.availableIn = 120 - Math.round((Math.round((new Date()).getTime()) - date.getTime()) / (1000 * 3600 * 24));
            this.showDetails = true;
        });
        eventBus.$on('errorFound', (data) => {
            this.dialog = true;
            console.log('Error received from network');
            this.errorDetailsLoading = data.message;
            console.log(data.message);
        });
    }
}
</script>

<style scoped>

</style>
