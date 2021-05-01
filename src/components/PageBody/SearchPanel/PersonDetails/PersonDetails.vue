<template>
    <div>
        <v-card data-aos="fade-down" v-if="getDonorLoaderFlag"
                style="z-index: 90;position: fixed;left: 0px;top: 0px;height: 20vh;width: 100vw;overflow-y: scroll;"
                class="d-flex justify-center">
            <v-app-bar color="red" dark>
                <v-btn icon @click="$router.push('/home')">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-toolbar-title>
                    <v-progress-circular indeterminate></v-progress-circular>
                    Loading
                </v-toolbar-title>
            </v-app-bar>

        </v-card>
        <v-card v-else
                style="z-index: 90;position: fixed;left: 0px;top: 0px;height: 100vh;width: 100vw;overflow-y: scroll;">
            <v-app-bar color="red" dark>
                <v-btn icon @click="$router.push('/home')">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-toolbar-title> Person Details</v-toolbar-title>
            </v-app-bar>

            <v-card-title>{{ name }}</v-card-title>

            <!--            <v-card-subtitle>-->
            <!--                (<span v-if="designation === 2">Hall admin</span>-->
            <!--                <span v-else-if="designation === 3">Super admin</span>-->
            <!--                <span v-else-if="designation === 1">Volunteer</span>-->
            <!--                <span v-else-if="designation === 0">Donor</span>)-->
            <!--            </v-card-subtitle>-->

            <v-card-text class="mb-5">
                <v-chip color="primary" class="ma-1">
                    <span v-if="designation === 0">Donor</span>
                    <span v-else-if="designation === 1">Volunteer</span>
                    <span v-else-if="designation === 2">Hall Admin</span>
                    <span v-else>Super Admin</span>
                </v-chip>
                <v-chip class="ma-1" v-if="availableIn > 0" color="error">{{ availableIn }} Days remaining</v-chip>
                <v-chip class="ma-1" v-else color="success">Available</v-chip>
                <!--                <span v-if="availableIn > 0" class="alert alert-danger rounded">{{ availableIn }} Days remaining</span>-->
                <!--                <span v-else class="alert alert-success">Available</span>-->
                <v-btn rounded color="blue" max-width="150px" @click="callFromDialer">
                    <v-icon left>
                        mdi-phone
                    </v-icon>
                    Call Now
                </v-btn>
                <v-switch
                    v-if="getDesignation === 3 ||getPhone == oldPhone ||(getHall === halls.indexOf(hall) &&getDesignation > designation) ||halls.indexOf(hall) === 7 ||halls.indexOf(hall) === 8"
                    v-model="enableEditing" inset :label="'Toggle to edit details'"></v-switch>

                <div class="row" v-if="!getLoadingFlag">
                    <div class="col-lg-8 col-md-12 col-sm-12" id="firstColumn">
                        <div>
                            <div class="card">
                                <div class="card-header" id="headingOne">
                                    <h5 class="mb-0">
                                        <button class="btn btn-link"
                                                @click="personDetailCollapseFlag = !personDetailCollapseFlag">Person
                                            Details
                                        </button>
                                    </h5>
                                </div>
                                <div v-if="personDetailCollapseFlag">
                                    <div class="card-body" v-on:click="promptForEdit($event)">
                                        <v-text-field type="'text'" outlined label="Name" v-model="name"
                                                      :disabled="!enableEditing"></v-text-field>
                                        <v-text-field type="'text'" outlined label="Phone" v-model="phone"
                                                      :disabled="!enableEditing"></v-text-field>
                                        <v-select v-model="bloodGroup" :items="bloodGroups" label="Blood Group" outlined
                                                  :disabled="!enableEditing"></v-select>
                                        <v-text-field type="'text'" outlined label="Student ID: " v-model="studentID"
                                                      :disabled="!enableEditing"></v-text-field>
                                        <v-select v-model="hall" :items="availableHalls" label="Hall" outlined
                                                  :disabled="!enableEditing || designation === 2 || designation === 1"></v-select>
                                        <v-text-field type="'text'" outlined label="Room" v-model="room"
                                                      :disabled="!enableEditing"></v-text-field>
                                        <v-text-field type="'text'" outlined label="Address" v-model="address"
                                                      :disabled="!enableEditing"></v-text-field>
                                        <div v-if="getDesignation > designation ||getPhone == oldPhone">
                                            <v-btn color="warning" rounded @click="dialog = false">Cancel</v-btn>
                                            <v-btn color="primary" rounded class="white--text ml-2"
                                                   :disabled="getDetailsLoaderFlag || !enableEditing"
                                                   :loading="getDetailsLoaderFlag" @click="saveDetailsClicked()">Save
                                            </v-btn>
                                        </div>
                                        <v-textarea class="mt-5" name="comment" outlined v-model="comment"
                                                    label="Comment" auto-grow
                                                    :disabled="!enableEditing" :rows="1"></v-textarea>

                                        <v-btn color="primary" rounded
                                               :disabled="getCommentLoaderFlag || !enableEditing"
                                               :loading="getCommentLoaderFlag" @click="saveCommentClicked()">Save
                                            Comment
                                        </v-btn>
                                        <br/>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="card"
                                v-if="getDesignation > designation ||getPhone== oldPhone"
                            >
                                <div class="card-header" id="headingTwo">
                                    <h5 class="mb-0">
                                        <button class="btn btn-link"
                                                @click="settingsCollapseFlag = !settingsCollapseFlag">
                                            Settings
                                        </button>
                                    </h5>
                                </div>
                                <div v-if="settingsCollapseFlag">
                                    <div class="card-body" v-on:click="promptForEdit($event)">
                                        <div
                                            v-if="designation !== 0 || getPhone == oldPhone">
                                            <v-text-field :append-icon="newPasswordFlag ? 'mdi-eye' : 'mdi-eye-off'"
                                                          :type="newPasswordFlag ? 'text' : 'password'" outlined
                                                          label="New Password" v-model="newPassword"
                                                          class="input-group--focused"
                                                          @click:append="newPasswordFlag = !newPasswordFlag"
                                                          :disabled="!enableEditing"></v-text-field>
                                            <v-text-field :append-icon="confirmPasswordFlag ? 'mdi-eye' : 'mdi-eye-off'"
                                                          :type="confirmPasswordFlag ? 'text' : 'password'" outlined
                                                          label="Confirm Password" v-model="confirmPassword"
                                                          class="input-group--focused"
                                                          @click:append="confirmPasswordFlag = !confirmPasswordFlag"
                                                          :disabled="!enableEditing"></v-text-field>
                                        </div>

                                        <div v-if="getDesignation > 1 && designation == 0 &&hall !== 7 &&hall !== 8">
                                            <label>Promote this member to volunteer</label>
                                            <div class="form-group row">
                                                <label class="col-sm-4 col-form-label">New Password:</label>
                                                <div class="col-sm-8">
                                                    <input type="password" class="form-control"
                                                           :disabled="!enableEditing"
                                                           v-model="newPassword"/>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-sm-4 col-form-label">Confirm Password:</label>
                                                <div class="col-sm-8">
                                                    <input type="password" class="form-control"
                                                           :disabled="!enableEditing"
                                                           v-model="confirmPassword"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            v-if="getPhone === oldPhone || getDesignation > 1 ||(getDesignation === 1 && getPhone == oldPhone)">
                                            <v-btn color="warning" @click="hideDetails()" rounded>Cancel</v-btn>
                                            <v-btn color="primary" class="white--text ml-2" rounded
                                                   :disabled="!enableEditing ||getPasswordLoader||getPromoteFlag"
                                                   :loading="getPasswordLoader ||getPromoteFlag"
                                                   @click="saveSettingsClicked()">Save
                                            </v-btn>
                                        </div>
                                        <v-btn v-if="designation == 1 && getPhone!== oldPhone" rounded color="red"
                                               :disabled="!enableEditing || getPromoteFlag" :loading="getPromoteFlag"
                                               class="mt-2 white--text" @click="demote()">
                                            <v-icon left dark>mdi-arrow-down</v-icon>
                                            Demote to donor
                                        </v-btn>
                                    </div>
                                    <div class="card-body"
                                         v-if="(getID!==$route.query.id)&& (getDesignation===3|| (getDesignation===2&& hall===getHall))">
                                        <v-btn @click="deleteDonorClicked" rounded color="error"
                                               :disabled="getDeleteLoaderFlag || !enableEditing"
                                               :loading="getDeleteLoaderFlag">
                                            <v-icon left dark>mdi-delete</v-icon>
                                            Delete this person
                                        </v-btn>
                                    </div>
                                    <div class="card-body" v-if="getDesignation===3 && designation===1">
                                        <v-btn rounded color="primary"
                                               :disabled="getChangeAdminLoaderFlag || !enableEditing"
                                               :loading="getChangeAdminLoaderFlag" @click="changeHallAdminClicked()">
                                            <v-icon left dark>mdi-arrow-up</v-icon>
                                            Promote to Hall admin
                                        </v-btn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-12 col-md-12" style="height: fit-content">
                        <p>Last Donation:</p>
                        <template v-if="lastDonation !== 0">
                            <p class="text-dark">{{ lastDonation }}</p>
                            <br/>
                            <div v-if="getDonationList.length!==0">
                                <div class="input-group mb-3" v-for="date in getDonationList">
                                    <input type="text" readonly class="form-control" :value="datePrint(date)"/>
                                    <div class="input-group-append">
                                        <button class="btn btn-success" type="button"
                                                @click="deleteDonationClicked(date)">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <br/>
                            </div>
                        </template>
                        <template v-else>No donation found</template>
                    </div>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import {halls, bloodGroups} from "@/constants";
import {Plugins} from "@capacitor/core";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "PersonDetails",
    data: function () {
        return {
            //form fields
            _id: null,
            name: "",
            oldPhone: "",
            phone: "",
            studentID: "",
            bloodGroup: "",
            availableIn: "",
            designation: "",
            hall: "",
            room: "",
            address: "",
            lastDonation: "",

            dateToBeDeleted: "",

            halls,
            bloodGroups,
            showDetails: false,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            comment: "",

            //history flag
            showHistory: false,

            //spinner controller flags
            enableEditing: false,

            //vuetify modal
            dialog: false,

            //person detail collapse and settings collapse
            personDetailCollapseFlag: false,
            settingsCollapseFlag: false,

            //password field flag
            confirmPasswordFlag: false,
            newPasswordFlag: false,
        };
    },
    watch: {
        dialog(to, from) {
            if (to === false) {
                this.$router.push("/home");
            }
        },
        donorLoaderFlag(to, from) {
            if (to === false) {
                let profile = this.getProfile;
                this._id = profile._id;
                this.name = profile.name;
                this.phone = profile.phone.toString().substr(2);
                this.oldPhone = profile.phone;
                this.studentID = profile.studentId;
                this.bloodGroup = bloodGroups[profile.bloodGroup];
                this.hall = halls[profile.hall];
                this.room = profile.roomNumber;
                this.address = profile.address;
                this.comment = profile.comment;
                this.designation = profile.designation;

                let date = new Date(profile.lastDonation);
                this.lastDonation =
                    date.getDate() +
                    "/" +
                    (date.getMonth() + 1) +
                    "/" +
                    date.getFullYear();
                if (profile.lastDonation === 0) {
                    this.lastDonation = "No donations found";
                }
                this.availableIn =
                    120 -
                    Math.round(
                        (Math.round(new Date().getTime()) - date.getTime()) /
                        (1000 * 3600 * 24)
                    );
            }
        },
    },
    computed: {
        ...mapGetters('details', ['getDonorLoaderFlag', 'getProfile']),
        ...mapGetters(['getLoadingFlag', 'getDesignation', 'getPhone', 'getHall', 'getID']),
        ...mapGetters('userDetails', ['getDetailsLoaderFlag']),
        ...mapGetters('password', ['getPasswordLoader']),
        ...mapGetters('promote', ['getPromoteFlag']),
        ...mapGetters('deleteDonor', ['getDeleteLoaderFlag']),
        ...mapGetters(['getChangeAdminLoaderFlag']),
        ...mapGetters('comment', ['getCommentLoaderFlag']),
        ...mapGetters('donation', ['getDonationList']),
        donorLoaderFlag() {
            return this.getDonorLoaderFlag;
        },
        availableHalls() {
            if (this.getDesignation !== null) {
                if (this.getDesignation === 3) {
                    return halls;
                } else {
                    //covid support
                    //return [halls[this.getHall], halls[7]];
                    return [halls[this.getHall], halls[7], halls[8]];
                }
            }
        },
    },
    methods: {
        ...mapActions('notification', ['notifyError', 'notifySuccess', 'notifyInfo']),
        ...mapActions('donation', ['deleteDonation', 'fetchDonationHistory']),
        ...mapActions('deleteDonor', ['deleteDonor']),
        ...mapActions(['changeHallAdmin']),
        ...mapActions('comment', ['saveComment']),
        ...mapActions('promote', ['promote']),
        ...mapActions('password', ['savePassword']),
        ...mapActions('userDetails', ['saveUserDetails']),
        ...mapActions('details', ['getDetails']),
        async changeHallAdminClicked() {
            if (await this.changeHallAdmin({donorId: this.$route.query.id})) {
                this.designation = 2
            }
        },
        async deleteDonorClicked() {
            let confirmation = await this.$bvModal.msgBoxConfirm('CAUTION: Are you sure you want to delete this donor?', {
                centered: true
            })
            if (confirmation === true && await this.deleteDonor({donorId: this.$route.query.id})) {
                await this.$router.push('/home');
            }
        },
        callFromDialer() {
            document.location.href = "tel:+88" + this.phone;
        },
        datePrint(date) {
            let dateObj = new Date(date);
            return (
                dateObj.getDate() +
                "/" +
                (dateObj.getMonth() + 1) +
                "/" +
                dateObj.getFullYear()
            );
        },
        hideDetails() {
            this.showHistory = false;
            this.enableEditing = false;
        },
        async saveCommentClicked() {
            await this.saveComment({
                donorId: this.$route.query.id,
                comment: this.comment
            })

        },
        async deleteDonationClicked(date) {
            let lastDonation = await this.deleteDonation({
                donorId: this.$route.query.id,
                date: date,
            });
            let newDate = new Date(lastDonation);
            this.availableIn =
                120 -
                Math.round(
                    (Math.round(new Date().getTime()) - newDate.getTime()) /
                    (1000 * 3600 * 24)
                );
            if (lastDonation === 0) {
                this.lastDonation = "No donation found";
                return;
            }
            this.lastDonation =
                newDate.getDate() +
                "/" +
                (newDate.getMonth() + 1) +
                "/" +
                newDate.getFullYear();
        },
        saveSettingsClicked() {
            if (this.designation === 0) {
                this.promoteClicked();
            } else {
                this.savePasswordClicked();
            }
        },
        async promoteClicked() {
            if (this.newPassword !== this.confirmPassword) {
                this.notifyError("Passwords did not match");
                return;
            } else if (this.newPassword.length === 0) {
                this.notifyError("Password can't have length of zero");
                return;
            }
            if (await this.promote({
                donorId: this.$route.query.id,
                promoteFlag: true,
                newPassword: this.newPassword
            })) {
                this.designation = 1
            }
        },
        async demote() {
            if (await this.promote({
                donorId: this.$route.query.id,
                promoteFlag: false,
                newPassword: this.newPassword
            })) {
                this.designation = 0
            }
        },
        async savePasswordClicked() {
            if (this.newPassword !== this.confirmPassword) {
                this.notifyError("Passwords didn't match");
                return;
            }
            if (this.newPassword.length === 0) {
                this.notifyError("Passwords can't be of length zero");
                return;
            }
            await this.savePassword({
                donorId: this.$route.query.id,
                newPassword: this.newPassword,
            })
        },
        async saveDetailsClicked() {
            if (this.name.length === 0) {
                this.notifyError("Please input the name of donor")
                return;
            }

            if (isNaN(this.phone) || this.phone.toString().length !== 11) {
                this.notifyError("Please enter a 11 digit phone number");
                return;
            }

            if (isNaN(this.studentID) || this.studentID.toString().length !== 7) {
                this.notifyError("Please enter a valid student ID");
                return;
            }

            let sendData = {
                donorId: this.$route.query.id,
                newName: this.name,
                newPhone: parseInt("88" + this.phone),
                newStudentId: this.studentID,
                newBloodGroup: bloodGroups.indexOf(this.bloodGroup),
                newHall: halls.indexOf(this.hall),
                newRoomNumber: this.room,
                newAddress: this.address,
            };
            await this.saveUserDetails(sendData);
        },
        promptForEdit(event) {
            if (!this.enableEditing) {
                this.notifyInfo("Please enable toggle to edit ");
            }
        }
    },
    async mounted() {
        await this.getDetails(this.$route.query.id);
        await this.fetchDonationHistory({donorId: this.$route.query.id});
        this.$forceUpdate();
    },
};
</script>
<style scoped>
</style>
