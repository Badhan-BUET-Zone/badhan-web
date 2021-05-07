<template>
    <div>
        <div class="card">
            <div>
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
                          getDesignation === 3 ||
                          getHall === index ||
                          index === 7 ||
                          index === 8
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
                        :disabled="getNewDonorLoader"
                        rounded
                        :loading="getNewDonorLoader"
                        color="primary"
                        @click="createDonorClicked"
                    >Save Donor
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {bloodGroups, halls, departments} from "@/mixins/constants";
import {mapGetters, mapActions} from "vuex";

export default {
    name: "CreateDonor",
    data() {
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

            //constants
            bloodGroups,
            halls,
            departments,

            //vuetify date picker
            menu: false,

            newDonorLoaderFlag: false,
        }
    },
    computed: {
        ...mapGetters(['getPhone', 'getHall', 'getDesignation']),
        ...mapGetters('halladmin', ['getVolunteerLoader', 'getVolunteers', 'getNewDonorLoader']),
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
        ...mapActions('notification', ['notifySuccess', 'notifyError']),
        ...mapActions('halladmin', ['saveDonor']),
        clearFields() {
            this.phone = "";
            this.bloodGroup = -1;
            this.hall = this.getHall;
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
        async createDonorClicked() {
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
                userPhone: this.getPhone,
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

            let ok = await this.saveDonor(sendData);
            if (ok) {
                this.clearFields();
            }
        },

    },
}
</script>

<style scoped>

</style>