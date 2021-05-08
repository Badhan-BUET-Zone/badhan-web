<template>
  <v-card max-width="500px">
    <v-form>
      <v-container>
        <v-text-field outlined label="Name of Donor" dense v-model="name"></v-text-field>
        <v-text-field outlined label="Phone Number (11 Digits)" dense v-model="phone"></v-text-field>
        <v-select v-model="bloodGroup" :items="bloodGroups" label="Blood Group" outlined dense></v-select>
        <v-text-field outlined label="Batch Number (2 Digits)" dense v-model="batch"></v-text-field>
        <v-select outlined dense label="Department" v-model="department" :items="departments.filter(word => word!=='NULL')"></v-select>
        <v-text-field outlined label="Roll (3 Digits)" v-model="roll" dense></v-text-field>
        <v-select :items="availableHalls" label="Select Hall" outlined dense v-model="hall"></v-select>
        <v-text-field outlined label="Room" dense v-model="roomNumber"></v-text-field>
        <v-text-field outlined label="Address" dense v-model="address"></v-text-field>
        <v-text-field outlined label="Comment" dense v-model="comment"></v-text-field>
        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="newDonationDate" transition="scale-transition" offset-y min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="newDonationDate" label="Picker in menu" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="newDonationDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(newDonationDate)">OK</v-btn>
          </v-date-picker>
        </v-menu>
        <v-btn :disabled="getNewDonorLoader" rounded :loading="getNewDonorLoader" color="primary" @click="createDonorClicked">Save Donor
        </v-btn>
      </v-container>
    </v-form>
<!--    <div class="card">-->
<!--      <div>-->
<!--        <div class="card-body">-->
<!--          <div class="form-group row required">-->
<!--            <label class="col-sm-4 col-form-label control-label"-->
<!--            >Name</label-->
<!--            >-->
<!--            <div class="col-sm-8">-->
<!--              <input-->
<!--                  type="text"-->
<!--                  class="form-control"-->
<!--                  v-model="name"-->
<!--                  placeholder="Enter name of donor"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="form-group row required">-->
<!--            <label class="col-sm-4 col-form-label control-label"-->
<!--            >Phone</label-->
<!--            >-->
<!--            <div class="col-sm-8">-->
<!--              <input-->
<!--                  type="text"-->
<!--                  class="form-control"-->
<!--                  v-model="phone"-->
<!--                  placeholder="Enter 11 digit phone number"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="form-group row required">-->
<!--            <label class="col-sm-4 col-form-label control-label"-->
<!--            >Blood Group:-->
<!--            </label>-->
<!--            <div class="col-sm-8">-->
<!--              <select class="form-control" v-model="bloodGroup">-->
<!--                <option-->
<!--                    v-for="(blood, index) in bloodGroups"-->
<!--                    :value="index"-->
<!--                >-->
<!--                  {{ blood }}-->
<!--                </option>-->
<!--              </select>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="form-group row required">-->
<!--            <label class="col-sm-4 col-form-label control-label"-->
<!--            >Batch</label-->
<!--            >-->
<!--            <div class="col-sm-8">-->
<!--              <input-->
<!--                  type="text"-->
<!--                  class="form-control"-->
<!--                  v-model="batch"-->
<!--                  placeholder="Enter 2 digit batch number"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="form-group row required">-->
<!--            <label class="col-sm-4 col-form-label control-label"-->
<!--            >Department:-->
<!--            </label>-->
<!--            <div class="col-sm-8">-->
<!--              <select class="form-control" v-model="department">-->
<!--                <option-->
<!--                    v-for="(dept, index) in departments"-->
<!--                    :value="index"-->
<!--                    v-if="dept !== 'NULL'"-->
<!--                >-->
<!--                  {{ dept }}-->
<!--                </option>-->
<!--              </select>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="form-group row">-->
<!--            <label class="col-sm-4 col-form-label">Roll (3 digit roll number)</label>-->
<!--            <div class="col-sm-8">-->
<!--              <input-->
<!--                  type="text"-->
<!--                  class="form-control"-->
<!--                  v-model="roll"-->
<!--                  placeholder="Enter 3 digit roll number"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="form-group row required">-->
<!--            <label class="col-sm-4 col-form-label control-label"-->
<!--            >Hall:-->
<!--            </label>-->
<!--            <div class="col-sm-8">-->
<!--              <select class="form-control" v-model="hall">-->
<!--                <option-->
<!--                    v-for="(oneHall, index) in halls"-->
<!--                    :value="index"-->
<!--                    v-if="-->
<!--                          getDesignation === 3 ||-->
<!--                          getHall === index ||-->
<!--                          index === 7 ||-->
<!--                          index === 8-->
<!--                        "-->
<!--                >-->
<!--                  {{ oneHall }}-->
<!--                </option>-->
<!--              </select>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="form-group row">-->
<!--            <label class="col-sm-4 col-form-label">Room: </label>-->
<!--            <div class="col-sm-8">-->
<!--              <input-->
<!--                  type="text"-->
<!--                  class="form-control"-->
<!--                  v-model="roomNumber"-->
<!--                  placeholder="Enter room number"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="form-group row">-->
<!--            <label class="col-sm-4 col-form-label">Address: </label>-->
<!--            <div class="col-sm-8">-->
<!--              <input-->
<!--                  type="text"-->
<!--                  class="form-control"-->
<!--                  v-model="address"-->
<!--                  placeholder="Enter address"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="form-group row">-->
<!--            <label class="col-sm-4 col-form-label">Add a comment</label>-->
<!--            <div class="col-sm-8">-->
<!--              <input type="text" class="form-control" v-model="comment"/>-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="form-group row">-->
<!--            <label class="col-sm-4 col-form-label"-->
<!--            >Add a donation date</label-->
<!--            >-->
<!--            <div class="col-sm-8">-->
<!--              <v-menu-->
<!--                  ref="menu"-->
<!--                  v-model="menu"-->
<!--                  :close-on-content-click="false"-->
<!--                  :return-value.sync="newDonationDate"-->
<!--                  transition="scale-transition"-->
<!--                  offset-y-->
<!--                  min-width="auto"-->
<!--              >-->
<!--                <template v-slot:activator="{ on, attrs }">-->
<!--                  <v-text-field-->
<!--                      v-model="newDonationDate"-->
<!--                      label="Picker in menu"-->
<!--                      prepend-icon="mdi-calendar"-->
<!--                      readonly-->
<!--                      v-bind="attrs"-->
<!--                      v-on="on"-->
<!--                  ></v-text-field>-->
<!--                </template>-->
<!--                <v-date-picker-->
<!--                    v-model="newDonationDate"-->
<!--                    no-title-->
<!--                    scrollable-->
<!--                >-->
<!--                  <v-spacer></v-spacer>-->
<!--                  <v-btn text color="primary" @click="menu = false"-->
<!--                  >Cancel-->
<!--                  </v-btn-->
<!--                  >-->
<!--                  <v-btn-->
<!--                      text-->
<!--                      color="primary"-->
<!--                      @click="$refs.menu.save(newDonationDate)"-->
<!--                  >-->
<!--                    OK-->
<!--                  </v-btn>-->
<!--                </v-date-picker>-->
<!--              </v-menu>-->
<!--            </div>-->
<!--          </div>-->
<!--          <v-btn-->
<!--              :disabled="getNewDonorLoader"-->
<!--              rounded-->
<!--              :loading="getNewDonorLoader"-->
<!--              color="primary"-->
<!--              @click="createDonorClicked"-->
<!--          >Save Donor-->
<!--          </v-btn>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </v-card>
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
      hall: halls[this.$store.getters.getHall],
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
    pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
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

      let newDonationDate;
      if (this.newDonationDate === "") {
        newDonationDate = new Date(0);
      } else {
        newDonationDate = new Date(this.newDonationDate);
      }

      let newStudentId = this.batch + this.pad(this.departments.indexOf(this.department),2,'0') + this.pad(this.roll,3,'0')

      let sendData = {
        phone: parseInt("88" + this.phone),
        bloodGroup: this.bloodGroups.indexOf(this.bloodGroup),
        hall: this.halls.indexOf(this.hall),
        name: this.name,
        studentId: parseInt(newStudentId),
        address: this.address,
        roomNumber: this.roomNumber,
        comment: this.comment,
        lastDonation: newDonationDate.getTime(),
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