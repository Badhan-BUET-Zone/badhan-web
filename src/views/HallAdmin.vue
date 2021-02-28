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
                  <label class="col-sm-4 col-form-label">Roll</label>
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
                    <input type="text" class="form-control" v-model="comment" />
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
                          >Cancel</v-btn
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
                  :disabled="newDonorLoaderFlag"
                  rounded
                  :loading="newDonorLoaderFlag"
                  color="primary"
                  @click="createDonor"
                  >Save Donor
                </v-btn>
                <br />
                <div
                  class="alert alert-danger animated jello"
                  role="alert"
                  v-if="errorAddDonor.length !== 0"
                >
                  {{ errorAddDonor }}
                </div>
                <div
                  class="alert alert-success animated jello"
                  role="alert"
                  v-if="successAddDonor.length !== 0"
                >
                  {{ successAddDonor }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>

      <div class="card col-lg-6 col-md-12 col-sm-12 p-4 animated fadeIn">
        <div>
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <b-button
                  variant="light"
                  @click="archiveCollapseFlag = !archiveCollapseFlag"
                >
                  Archive batch:
                </b-button>
              </h5>
            </div>
            <div v-if="archiveCollapseFlag" data-aos="fade-down">
              <div class="card-body">
                <div class="form-group row">
                  <label class="col-sm-4 col-form-label"
                    >Enter batch number to be archived:
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="text"
                      v-model="archiveBatch"
                      class="form-control"
                    />
                  </div>
                </div>

                <div class="form-group row">
                  <label class="col-sm-4 col-form-label"
                    >Enter your password:
                  </label>
                  <div class="col-sm-8">
                    <input
                      type="password"
                      v-model="password"
                      class="form-control"
                    />
                  </div>
                </div>

                <br />
                <div class="col-sm-8">
                  <v-btn
                    rounded
                    color="red"
                    class="white--text"
                    disabled
                    >Archive batch <br>(not implemented)</v-btn
                  >
                </div>
              </div>
              <!-- <div
                class="alert alert-danger animated jello"
                role="alert"
                v-if="errorArchive.length !== 0"
              >
                {{ errorArchive }}
              </div> -->
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { bloodGroups, halls, departments } from "@/constants";
import Datepicker from "vuejs-datepicker";
import {badhanAxios} from "@/api";

export default {
  name: "HallAdminPanel",
  data: function () {
    return {
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
        },
        {
          name: "Eclair",
          calories: 262,
        },
        {
          name: "Cupcake",
          calories: 305,
        },
        {
          name: "Gingerbread",
          calories: 356,
        },
        {
          name: "Jelly bean",
          calories: 375,
        },
        {
          name: "Lollipop",
          calories: 392,
        },
        {
          name: "Honeycomb",
          calories: 408,
        },
        {
          name: "Donut",
          calories: 452,
        },
        {
          name: "KitKat",
          calories: 518,
        },
      ],

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
  methods: {
    archiveClicked() {
      console.log("Archive button clicked: ");
      console.log("password: ", this.password);
      console.log("archiveBatch: ", this.archiveBatch);

      //SIMULATION START
      setTimeout(() => {
        console.log("Archive complete");
      }, 2000);
      //SIMULATION STOP
    },
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
      console.log("create Donor clicked");

      this.errorAddDonor = "";
      this.successAddDonor = "";

      //input validation
      if (isNaN(this.batch) || this.batch.length !== 2) {
        this.errorAddDonor = "Please enter valid batch number";
        console.log("Enter valid batch number");
        return;
      }

      if (this.department === "") {
        this.errorAddDonor = "Please enter department of donor";
        console.log("Please enter department of donor");
        return;
      }

      if (this.roll === "") {
        this.roll = "000";
      }

      if (this.bloodGroup === -1) {
        console.log("Blood group can't be left blank");
        this.errorAddDonor = "Please enter blood group";
        return;
      }
      if (this.name.length === 0) {
        console.log("Name field can't be empty");
        this.errorAddDonor = "Please enter the name of donor";
        return;
      }
      if (this.phone.toString().length === 0) {
        console.log("Please enter the phone number of donor");
        this.errorAddDonor = "Please enter the phone number of donor";
        return;
      }
      if (isNaN(this.phone)) {
        console.log("Please enter a valid phone number");
        this.errorAddDonor = "Please enter a valid phone number";
        return;
      }
      if (this.phone.toString().length !== 11) {
        console.log("Phone number must be of 11 digits");
        this.errorAddDonor = "Please enter an 11 digit phone number";
        return;
      }

      if (this.hall === -1) {
        console.log("Hall name can't be left blank");
        this.errorAddDonor = "Please enter a hall name";
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
      let headers = {
        "x-auth": this.$store.getters.getToken,
      };
      console.log("REQUEST TO /donor/insert: ", sendData);

      this.newDonorLoaderFlag = true;

      try {
        let response = await badhanAxios.post("/donor/insert", sendData, {
          headers: headers,
        });
        console.log("RESPONSE FROM /donor/insert: ", response);
        if (response.status !== 201) {
          this.errorAddDonor = "Status code not 200";
          return;
        }
        console.log("donor save successful");
        this.successAddDonor = "Donor added successfully";
        this.clearFields();
      } catch (error) {
        this.errorAddDonor = error.response.data.message;
        console.log(error.response);
      } finally {
        this.newDonorLoaderFlag = false;
      }
    },

    async getVolunteers() {

    },
  },
};
</script>

<style scoped>
.form-group.required .control-label:after {
  content: "*";
  color: red;
}
</style>
