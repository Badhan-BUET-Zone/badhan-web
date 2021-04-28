<template>
    <div data-aos="fade-up">
        <div class="row">
            <div class="card col-lg-6 col-md-12 col-sm-12 p-4">
                <div>
                    <div class="card">
                        <div class="card-header" id="headingOne">
                            <h5 class="mb-0">
                                <b-button
                                    @click="
                    personDetailsCollapseFlag = !personDetailsCollapseFlag
                  "
                                    variant="light"
                                >
                                    Create New Donor
                                </b-button>
                            </h5>
                        </div>
                        <div v-if="personDetailsCollapseFlag" data-aos="fade-down">
                            <div class="card-body">
                                <div class="form-group row required">
                                    <label class="col-sm-4 col-form-label control-label"
                                    >Name</label
                                    >
                                    <div class="col-sm-8">
                                        <input
                                            type="text"
                                            class="form-control"
                                            v-model="name"
                                            placeholder="Enter name of donor"
                                        />
                                    </div>
                                </div>
                                <div class="form-group row required">
                                    <label class="col-sm-4 col-form-label control-label"
                                    >Phone</label
                                    >
                                    <div class="col-sm-8">
                                        <input
                                            type="text"
                                            class="form-control"
                                            v-model="phone"
                                            placeholder="Enter 11 digit phone number"
                                        />
                                    </div>
                                </div>
                                <div class="form-group row required">
                                    <label class="col-sm-4 col-form-label control-label"
                                    >Blood Group:
                                    </label>
                                    <div class="col-sm-8">
                                        <select class="form-control" v-model="bloodGroup">
                                            <option
                                                v-for="(blood, index) in bloodGroups"
                                                :value="index"
                                            >
                                                {{ blood }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row required">
                                    <label class="col-sm-4 col-form-label control-label"
                                    >Batch</label
                                    >
                                    <div class="col-sm-8">
                                        <input
                                            type="text"
                                            class="form-control"
                                            v-model="batch"
                                            placeholder="Enter 2 digit batch number"
                                        />
                                    </div>
                                </div>
                                <div class="form-group row required">
                                    <label class="col-sm-4 col-form-label control-label"
                                    >Department:
                                    </label>
                                    <div class="col-sm-8">
                                        <select class="form-control" v-model="department">
                                            <option
                                                v-for="(dept, index) in departments"
                                                :value="index"
                                                v-if="dept !== 'NULL'"
                                            >
                                                {{ dept }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-4 col-form-label">Roll (3 digit roll number)</label>
                                    <div class="col-sm-8">
                                        <input
                                            type="text"
                                            class="form-control"
                                            v-model="roll"
                                            placeholder="Enter 3 digit roll number"
                                        />
                                    </div>
                                </div>
                                <div class="form-group row required">
                                    <label class="col-sm-4 col-form-label control-label"
                                    >Hall:
                                    </label>
                                    <div class="col-sm-8">
                                        <select class="form-control" v-model="hall">
                                            <option
                                                v-for="(oneHall, index) in halls"
                                                :value="index"
                                                v-if="
                          $store.getters.getDesignation === 3 ||
                          $store.getters.getHall === index ||
                          index === 7
                        "
                                            >
                                                {{ oneHall }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-4 col-form-label">Room: </label>
                                    <div class="col-sm-8">
                                        <input
                                            type="text"
                                            class="form-control"
                                            v-model="roomNumber"
                                            placeholder="Enter room number"
                                        />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-4 col-form-label">Address: </label>
                                    <div class="col-sm-8">
                                        <input
                                            type="text"
                                            class="form-control"
                                            v-model="address"
                                            placeholder="Enter address"
                                        />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-sm-4 col-form-label">Add a comment</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" v-model="comment"/>
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label class="col-sm-4 col-form-label"
                                    >Add a donation date</label
                                    >
                                    <div class="col-sm-8">
                                        <v-menu
                                            ref="menu"
                                            v-model="menu"
                                            :close-on-content-click="false"
                                            :return-value.sync="newDonationDate"
                                            transition="scale-transition"
                                            offset-y
                                            min-width="auto"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                    v-model="newDonationDate"
                                                    label="Picker in menu"
                                                    prepend-icon="mdi-calendar"
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker
                                                v-model="newDonationDate"
                                                no-title
                                                scrollable
                                            >
                                                <v-spacer></v-spacer>
                                                <v-btn text color="primary" @click="menu = false"
                                                >Cancel
                                                </v-btn
                                                >
                                                <v-btn
                                                    text
                                                    color="primary"
                                                    @click="$refs.menu.save(newDonationDate)"
                                                >
                                                    OK
                                                </v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </div>
                                </div>
                                <v-btn
                                    :disabled="$store.getters['halladmin/getNewDonorLoader']"
                                    rounded
                                    :loading="$store.getters['halladmin/getNewDonorLoader']"
                                    color="primary"
                                    @click="createDonor"
                                >Save Donor
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
            </div>

            <div class="card col-lg-6 col-md-12 col-sm-12 p-4">
                <div>
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">
                                <b-button
                                    variant="light"
                                    @click="seeVolunteersFlag = !seeVolunteersFlag"
                                >
                                    See volunteers
                                </b-button>
                            </h5>
                        </div>
                        <div v-if="seeVolunteersFlag" class="pa-4">
                            <v-progress-circular indeterminate color="primary" v-if="$store.getters['halladmin/getVolunteerLoader']">

                            </v-progress-circular>

                            <v-simple-table v-if="$store.getters['halladmin/getVolunteers'].length!==0">
                                <template v-slot:default>
                                    <thead>
                                    <tr>
                                        <th class="text-left">
                                            Name
                                        </th>
                                        <th class="text-left">
                                            Batch
                                        </th>
                                        <th class="text-left">
                                            Department
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr
                                        v-for="volunteer in $store.getters['halladmin/getVolunteers']"
                                        :key="volunteer.name"
                                    >
                                        <td>{{ volunteer.name }}</td>
                                        <td>{{ volunteer.studentId.substr(0, 2) }}</td>
                                        <td>{{ volunteer.studentId | idToDept}}</td>
                                    </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import {bloodGroups, halls, departments} from "@/constants";
import Datepicker from "vuejs-datepicker";
import {badhanAxios} from "@/api";
import {mapGetters, mapActions} from "vuex";

export default {
    name: "HallAdminPanel",
    data: function () {
        return {

            //new donor
            phone: "",
            bloodGroup: -1,
            hall: this.$store.getters.getHall,
            name: "",
            // studentId:'',
            address: "",
            roomNumber: "",
            batch: "",
            roll: "",
            department: "",

            password: "",
            comment: "",
            newDonationDate: "",

            //error messages
            errorArchive: "route archive not enabled",
            errorAddDonor: "",
            successArchive: "",
            successAddDonor: "",

            //archive variables
            archiveBatch: "",

            //constants
            bloodGroups,
            halls,
            departments,

            //vuetify date picker
            menu: false,

            //add donor collapse
            personDetailsCollapseFlag: !this.$isMobile(),
            archiveCollapseFlag: !this.$isMobile(),
            seeVolunteersFlag: !this.$isMobile(),


            newDonorLoaderFlag: false,
        };
    },
    components: {
        Datepicker,
    },
    filters: {
        idToDept(studentID) {
            return departments[Number(studentID.toString().substr(2, 2))];
        },
        numToBloodGroup(num) {
            return bloodGroups[num];
        },
    },
    methods: {
        ...mapActions('notification',['notifySuccess','notifyError']),
        clearFields() {
            this.phone = "";
            this.bloodGroup = -1;
            this.hall = this.$store.getters.getHall;
            this.name = "";
            this.studentId = "";
            this.address = "";
            this.roomNumber = "";
            this.batch = "";
            this.roll = "";
            this.department = "";
            this.batch = "";
            this.password = "";
            this.newDonationDate = "";
            this.comment = "";
        },
        async createDonor() {
            if (isNaN(this.batch) || this.batch.length !== 2) {
                this.notifyError("Please enter valid batch number for creating a donor")
                return;
            }
            if (this.department === "") {
                this.notifyError("Please enter department of new donor")
                return;
            }
            if (this.roll === "") {
                this.roll = "000";
            }
            if (this.bloodGroup === -1) {
                this.notifyError("Blood group can't be left blank for new donor")
                return;
            }
            if (this.name.length === 0) {
                this.notifyError("Please enter the name of donor")
                return;
            }
            if (this.phone.toString().length === 0) {
                this.notifyError("Please enter the phone number of donor");
                return;
            }
            if (isNaN(this.phone)) {
                this.notifyError("Please enter a valid phone number");
                return;
            }
            if (this.phone.toString().length !== 11) {
                this.notifyError("Please enter an 11 digit phone number for new donor")
                return;
            }
            if (this.hall === -1) {
                this.notifyError("Hall name can't be left blank for new donor");
                return;
            }
            if (this.newDonationDate === "") {
                this.newDonationDate = new Date(0);
            } else {
                this.newDonationDate = new Date(this.newDonationDate);
            }
            let newStudentId = this.batch;
            if (this.department < 10) {
                newStudentId += "0";
            }
            newStudentId += this.department + this.roll;
            let sendData = {
                userPhone: this.$store.getters.getPhone,
                phone: parseInt("88" + this.phone),
                bloodGroup: this.bloodGroup,
                hall: this.hall,
                name: this.name,
                studentId: parseInt(newStudentId),
                address: this.address,
                roomNumber: this.roomNumber,
                comment: this.comment,
                lastDonation: this.newDonationDate.getTime(),
            };

            let ok = await this.$store.dispatch('halladmin/saveDonor',sendData);
            if(ok){
                this.clearFields();
            }
        },
        async getVolunteers() {
        },
    },
  mounted() {
    this.$store.dispatch('halladmin/fetchVolunteers')
  }
};
</script>

<style scoped>
.form-group.required .control-label:after {
    content: "*";
    color: red;
}
</style>
