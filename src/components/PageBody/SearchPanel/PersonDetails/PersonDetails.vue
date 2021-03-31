<template>
    <div>
        <v-card
            data-aos="fade-down"
            v-if="$store.getters['details/getDonorLoaderFlag']"
            style="
        z-index: 90;
        position: fixed;
        left: 0px;
        top: 0px;
        height: 20vh;
        width: 100vw;
        overflow-y: scroll;
      "
            class="pa-5 d-flex justify-center"
        >
            <v-progress-circular indeterminate color="red"></v-progress-circular>
        </v-card>
        <v-card
            v-else
            style="
        z-index: 90;
        position: fixed;
        left: 0px;
        top: 0px;
        height: 100vh;
        width: 100vw;
        overflow-y: scroll;
      "
            class="pa-5"
        >
            <v-app-bar color="red" dark>
                <v-btn icon @click="$router.push('/home')">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-toolbar-title> Person Details</v-toolbar-title>
            </v-app-bar>

            <v-card-title
                v-if="!$store.getters.getLoadingFlag">
                <span>{{ name }}</span>
            </v-card-title>

            <v-card-subtitle>
                (<span v-if="designation === 2">Hall admin</span>
                <span v-else-if="designation === 3">Super admin</span>
                <span v-else-if="designation === 1">Volunteer</span>
                <span v-else-if="designation === 0">Donor</span>)
            </v-card-subtitle>

            <div class="mb-5">
                <span v-if="availableIn > 0" class="alert alert-danger rounded">{{ availableIn }} Days remaining</span>
                <span v-else class="alert alert-success">Available</span>

                <v-btn rounded color="light-blue" max-width="150px" class="ml-2" @click="callFromDialer"
                >Direct call
                </v-btn>
            </div>


            <!--            Modal Body-->
            <div
                class="modal-body row"
                v-if="!$store.getters.getLoadingFlag"
            >
                <!--                Modal First column-->
                <div class="card col-lg-8 col-md-12 col-sm-12">

                    <br/>
                    <div
                        class="custom-control custom-switch"
                        v-if="$store.getters.getDesignation === 3 ||$store.getters.getPhone == oldPhone ||($store.getters.getHall === halls.indexOf(hall) &&$store.getters.getDesignation > designation) ||halls.indexOf(hall) === 7 ||halls.indexOf(hall) === 8">

                        <v-switch
                            v-model="enableEditing"
                            inset
                            :label="'Toggle to edit details'"
                        ></v-switch>
                    </div>
                    <br/>

                    <div>
                        <div class="card">
                            <div class="card-header" id="headingOne">
                                <h5 class="mb-0">
                                    <button
                                        class="btn btn-link"
                                        @click="personDetailCollapseFlag = !personDetailCollapseFlag">
                                        Person Details
                                    </button>
                                </h5>
                            </div>

                            <div v-if="personDetailCollapseFlag">
                                <div class="card-body">

                                    <v-text-field
                                        type="'text'"
                                        outlined
                                        label="Name"
                                        v-model="name"
                                        :disabled="!enableEditing"
                                    ></v-text-field>

                                    <v-text-field
                                        type="'text'"
                                        outlined
                                        label="Phone"
                                        v-model="phone"
                                        :disabled="!enableEditing"
                                    ></v-text-field>

                                    <v-select
                                        v-model="bloodGroup"
                                        :items="bloodGroups"
                                        label="Blood Group"
                                        outlined
                                        :disabled="!enableEditing"
                                    ></v-select>


                                    <v-text-field
                                        type="'text'"
                                        outlined
                                        label="Student ID: "
                                        v-model="studentID"
                                        :disabled="!enableEditing"
                                    ></v-text-field>

                                    <v-select
                                        v-model="hall"
                                        :items="availableHalls"
                                        label="Hall"
                                        outlined
                                        :disabled="
                      !enableEditing || designation === 2 || designation === 1
                    "
                                    ></v-select>


                                    <v-text-field
                                        type="'text'"
                                        outlined
                                        label="Room"
                                        v-model="room"
                                        :disabled="!enableEditing"
                                    ></v-text-field>


                                    <v-text-field
                                        type="'text'"
                                        outlined
                                        label="Address"
                                        v-model="address"
                                        :disabled="!enableEditing"
                                    ></v-text-field>

                                    <div
                                        v-if="$store.getters.getDesignation > designation ||$store.getters.getPhone == oldPhone"
                                    >
                                        <v-btn color="warning" rounded @click="dialog = false"
                                        >Cancel
                                        </v-btn>
                                        <v-btn
                                            color="primary"
                                            rounded
                                            class="white--text ml-2"
                                            :disabled="$store.getters['userDetails/getDetailsLoaderFlag'] || !enableEditing"
                                            :loading="$store.getters['userDetails/getDetailsLoaderFlag']"
                                            @click="saveDetailsClicked()"
                                        >Save
                                        </v-btn>
                                    </div>
                                    <br/>
                                    <div
                                        class="alert alert-danger animated jello"
                                        role="alert"
                                        v-if="$store.getters['userDetails/getDetailsError']!==null"
                                    >
                                        {{ $store.getters['userDetails/getDetailsError'] }}
                                    </div>
                                    <div
                                        class="alert alert-success animated jello"
                                        role="alert"
                                        v-if="$store.getters['userDetails/getDetailsSuccess']!==null"
                                    >
                                        {{ $store.getters['userDetails/getDetailsSuccess'] }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="card"
                            v-if="$store.getters.getDesignation > designation ||$store.getters.getPhone == oldPhone"
                        >
                            <div class="card-header" id="headingTwo">
                                <h5 class="mb-0">
                                    <button
                                        class="btn btn-link"
                                        @click="settingsCollapseFlag = !settingsCollapseFlag"
                                    >
                                        Settings
                                    </button>
                                </h5>
                            </div>
                            <div v-if="settingsCollapseFlag">
                                <div class="card-body">
                                    <div
                                        v-if="designation !== 0 || $store.getters.getPhone == oldPhone">
                                        <v-text-field
                                            :append-icon="newPasswordFlag ? 'mdi-eye' : 'mdi-eye-off'"
                                            :type="newPasswordFlag ? 'text' : 'password'"
                                            outlined
                                            label="New Password"
                                            v-model="newPassword"
                                            class="input-group--focused"
                                            @click:append="newPasswordFlag = !newPasswordFlag"
                                            :disabled="!enableEditing"
                                        ></v-text-field>

                                        <v-text-field
                                            :append-icon="confirmPasswordFlag ? 'mdi-eye' : 'mdi-eye-off'"
                                            :type="confirmPasswordFlag ? 'text' : 'password'"
                                            outlined
                                            label="Confirm Password"
                                            v-model="confirmPassword"
                                            class="input-group--focused"
                                            @click:append="confirmPasswordFlag = !confirmPasswordFlag"
                                            :disabled="!enableEditing"
                                        ></v-text-field>

                                    </div>

                                    <div
                                        v-if="$store.getters.getDesignation > 1 && designation == 0 &&hall !== 7 &&hall !== 8"
                                    >
                                        <label>Promote this member to volunteer</label>
                                        <div class="form-group row">
                                            <label class="col-sm-4 col-form-label"
                                            >New Password:
                                            </label>
                                            <div class="col-sm-8">
                                                <input
                                                    type="password"
                                                    class="form-control"
                                                    :disabled="!enableEditing"
                                                    v-model="newPassword"
                                                />
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-sm-4 col-form-label"
                                            >Confirm Password:
                                            </label>
                                            <div class="col-sm-8">
                                                <input
                                                    type="password"
                                                    class="form-control"
                                                    :disabled="!enableEditing"
                                                    v-model="confirmPassword"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        v-if="$store.getters.phone === oldPhone ||$store.getters.getDesignation > 1 ||($store.getters.getDesignation === 1 && $store.getters.getPhone == oldPhone)"
                                    >
                                        <v-btn color="warning" @click="hideDetails()" rounded
                                        >Cancel
                                        </v-btn>
                                        <v-btn
                                            color="primary"
                                            class="white--text ml-2"
                                            rounded
                                            :disabled="settingsSpinner || !enableEditing ||
                                            $store.getters['password/getPasswordLoader'] ||
                                            $store.getters['promote/getPromoteFlag']"
                                            :loading="settingsSpinner ||
                                            $store.getters['password/getPasswordLoader'] ||
                                            $store.getters['promote/getPromoteFlag']"
                                            @click="saveSettingsClicked()"
                                        >Save
                                        </v-btn>
                                    </div>
                                    <v-btn
                                        v-if="designation == 1 && $store.getters.getPhone !== oldPhone"
                                        rounded
                                        color="red"
                                        :disabled="!enableEditing || $store.getters['promote/getPromoteFlag']"
                                        :loading="$store.getters['promote/getPromoteFlag']"
                                        style="width: 100%"
                                        class="mt-3 white--text"
                                        @click="demote()"
                                    >
                                        Demote this member to donor
                                    </v-btn>
                                    <br/>
                                    <div
                                        class="alert alert-danger animated jello"
                                        role="alert"
                                        v-if="errorSettings.length !== 0"
                                    >
                                        {{ errorSettings }}
                                    </div>
                                    <div
                                        class="alert alert-success animated jello"
                                        role="alert"
                                        v-if="successSettings.length !== 0"
                                    >
                                        {{ successSettings }}
                                    </div>

                                    <div
                                        class="alert alert-danger animated jello"
                                        role="alert"
                                        v-if="$store.getters['password/getPasswordError']!==null"
                                    >
                                        {{ $store.getters['password/getPasswordError'] }}
                                    </div>
                                    <div
                                        class="alert alert-success animated jello"
                                        role="alert"
                                        v-if="$store.getters['password/getPasswordSuccess']!==null"
                                    >
                                        {{ $store.getters['password/getPasswordSuccess'] }}
                                    </div>

                                    <div
                                        class="alert alert-danger animated jello"
                                        role="alert"
                                        v-if="$store.getters['promote/getPromoteError']!==null"
                                    >
                                        {{ $store.getters['promote/getPromoteError'] }}
                                    </div>
                                    <div
                                        class="alert alert-success animated jello"
                                        role="alert"
                                        v-if="$store.getters['promote/getPromoteSuccess']!==null"
                                    >
                                        {{ $store.getters['promote/getPromoteSuccess'] }}
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div>
                        <div class="card">
                            <div class="col-sm-12">
                                <v-textarea name="comment" outlined v-model="comment" label="Comment" auto-grow dense
                                            :disabled="!enableEditing" :rows="1"
                                ></v-textarea>
                            </div>
                            <v-btn
                                color="primary"
                                :disabled="$store.getters['comment/getCommentLoaderFlag'] || !enableEditing"
                                :loading="$store.getters['comment/getCommentLoaderFlag']"
                                @click="saveCommentClicked()"
                            >
                                Save Comment
                            </v-btn>
                        </div>
                    </div>

                    <div
                        class="alert alert-danger animated jello"
                        role="alert"
                        v-if="$store.getters['comment/getCommentError']!==null"
                    >
                        {{ $store.getters['comment/getCommentError'] }}
                    </div>
                    <div
                        class="alert alert-success animated jello"
                        role="alert"
                        v-if="$store.getters['comment/getCommentSuccess']!==null"
                    >
                        {{ $store.getters['comment/getCommentSuccess'] }}
                    </div>
                </div>

                <!--                Modal Second Column-->
                <div
                    class="card col-lg-4 col-md-12 col-md-12"
                    style="height: fit-content"
                >
                    <p>Last Donation:</p>
                    <template v-if="lastDonation !== 0">
                        <p class="text-dark">{{ lastDonation }}</p>
                        <v-btn
                            :loading="$store.getters['donation/getDonationLoader']"
                            :disabled="$store.getters['donation/getDonationLoader']"
                            color="primary"
                            rounded
                            class="mb-2"
                            @click="loadHistory()"
                        >Load history
                        </v-btn>
                        <br/>
                        <div v-if="$store.getters['donation/getDonationList'].length!==0">
                            <div class="input-group mb-3" v-for="date in $store.getters['donation/getDonationList']">
                                <input
                                    type="text"
                                    readonly
                                    class="form-control"
                                    :value="datePrint(date)"
                                />
                                <div class="input-group-append">
                                    <button
                                        class="btn btn-success"
                                        type="button"
                                        @click="deleteDonation(date)"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <br/>
                        </div>
                        <div
                            class="alert alert-danger animated jello"
                            role="alert"
                            v-if="$store.getters['donation/getDonationError']!==null"
                        >
                            {{ $store.getters['donation/getDonationError'] }}
                        </div>
                        <div
                            class="alert alert-success animated jello"
                            role="alert"
                            v-if="$store.getters['donation/getDonationSuccess']!==null"
                        >
                            {{ $store.getters['donation/getDonationSuccess'] }}
                        </div>
                    </template>
                    <template v-else>No donation found</template>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script>
import {halls, bloodGroups} from "@/constants";

export default {
    name: "PersonDetails",
    data: function () {
        return {
            //form fields
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

            history: [],
            dateToBeDeleted: "",

            halls,
            // dummyMe,
            bloodGroups,
            showDetails: false,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            comment: "",

            //history flag
            showHistory: false,

            //spinner controller flags
            detailsSpinner: false,
            settingsSpinner: false,
            commentSpinner: false,
            historySpinner: false,
            enableEditing: false,

            //error messages
            errorDetails: "",
            errorComment: "",
            errorSettings: "",
            errorHistory: "",

            successComment: "",
            successSettings: "",
            successHistory: "",
            successDetails: "",

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
                let profile = this.$store.getters["details/getProfile"];
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
        donorLoaderFlag() {
            return this.$store.getters["details/getDonorLoaderFlag"];
        },
        availableHalls() {
            if (this.$store.getters.getDesignation !== null) {
                if (this.$store.getters.getDesignation === 3) {
                    return halls;
                } else {
                    //covid support
                    //return [halls[this.$store.getters.getHall], halls[7]];
                    return [halls[this.$store.getters.getHall], halls[7], halls[8]];
                }
            }
        },
    },
    methods: {
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
            await this.$store.dispatch('comment/saveComment', {
                phone: this.phone,
                comment: this.comment
            })

        },
        async deleteDonation(date) {
            let lastDonation = await this.$store.dispatch('donation/deleteDonation', {
                phone: this.phone,
                date: date,
            });

            let newDate = new Date(lastDonation);



            this.availableIn =
                120 -
                Math.round(
                    (Math.round(new Date().getTime()) - newDate.getTime()) /
                    (1000 * 3600 * 24)
                );

            if(lastDonation===0){
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

                this.promote();
            } else {
                this.savePasswordClicked();
            }
        },
        async promote() {
            this.$store.commit('promote/clearPromoteMessage');

            if (this.newPassword !== this.confirmPassword) {
                this.$store.commit('promote/setPromoteError', "Passwords did not match");
                return;
            } else if (this.newPassword.length === 0) {
                this.$store.commit('promote/setPromoteError', "Password can't have length of zero");
                return;
            }

            await this.$store.dispatch('promote/promote', {
                phone: this.phone,
                promoteFlag: true,
                newPassword: this.newPassword
            })


        },
        async demote() {
            this.$store.commit('promote/clearPromoteMessage');

            await this.$store.dispatch('promote/promote', {
                phone: this.phone,
                promoteFlag: false,
                newPassword: this.newPassword
            })

        },
        async savePasswordClicked() {
            this.$store.commit('password/clearPasswordMessage');

            if (this.newPassword !== this.confirmPassword) {
                this.$store.commit('password/setPasswordError', "Passwords didn't match");
                return;
            }
            if (this.newPassword.length === 0) {
                this.$store.commit('password/setPasswordError', "Passwords can't be of length zero");
                return;
            }
            await this.$store.dispatch('password/savePassword', {
                phone: this.phone,
                newPassword: this.newPassword,
            })
        },
        async saveDetailsClicked() {
            this.$store.commit('userDetails/clearDetailsMessage');

            if (this.name.length === 0) {
                this.$store.commit('userDetails/setDetailsError', "Please input the name of donor");
                return;
            }

            if (isNaN(this.phone) || this.phone.toString().length !== 11) {
                this.$store.commit('userDetails/setDetailsError', "Please enter a 11 digit phone number");
                return;
            }

            if (isNaN(this.studentID) || this.studentID.toString().length !== 7) {
                this.$store.commit('userDetails/setDetailsError', "Please enter a valid student ID");
                return;
            }

            let sendData = {
                oldPhone: this.oldPhone,
                newName: this.name,
                newPhone: parseInt("88" + this.phone),
                newStudentId: this.studentID,
                newBloodGroup: bloodGroups.indexOf(this.bloodGroup),
                newHall: halls.indexOf(this.hall),
                newRoomNumber: this.room,
                newAddress: this.address,
            };

            await this.$store.dispatch('userDetails/saveUserDetails', sendData);

        },
        async loadHistory() {
            await this.$store.dispatch('donation/fetchDonationHistory', {
                phone: this.phone
            });

        },
    },

    async mounted() {
        await this.$store.dispatch("details/getDetails", this.$route.query.phone);
    },
};
</script>

<style scoped>
</style>
