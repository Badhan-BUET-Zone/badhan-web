<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
  <v-card max-width="500px">
    <v-container>
      <v-text-field outlined label="Name of Donor" dense v-model="name" @blur="$v.name.$touch()"
                    :error-messages="nameErrors"></v-text-field>
      <v-text-field outlined label="Phone Number (11 Digits)" dense v-model="phone" @blur="$v.phone.$touch()"
                    :error-messages="phoneErrors"></v-text-field>
      <v-select v-model="bloodGroup" :items="bloodGroups" label="Blood Group" outlined dense
                @blur="$v.bloodGroup.$touch()"
                :error-messages="bloodGroupErrors"></v-select>
      <v-text-field outlined label="Batch Number (2 Digits)" dense v-model="batch" @blur="$v.batch.$touch()"
                    :error-messages="batchErrors"></v-text-field>
      <v-select outlined dense label="Department" v-model="department"
                :items="departments.filter(word => word!=='NULL')" @blur="$v.department.$touch()"
                :error-messages="departmentErrors"></v-select>
      <v-text-field outlined label="Roll (3 Digits)" v-model="roll" dense @blur="$v.roll.$touch()"
                    :error-messages="rollErrors"></v-text-field>
      <v-select :items="availableHalls" label="Select Hall" outlined dense v-model="hall"></v-select>
      <v-text-field outlined label="Room" dense v-model="roomNumber"></v-text-field>
      <v-text-field outlined label="Address" dense v-model="address"></v-text-field>
      <v-text-field outlined label="Comment" dense v-model="comment"></v-text-field>
      <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="newDonationDate"
              transition="scale-transition" offset-y min-width="auto">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field v-model="newDonationDate" label="Pick Last Donation Date" prepend-icon="mdi-calendar" readonly
                        v-bind="attrs" v-on="on"></v-text-field>
        </template>
        <v-date-picker v-model="newDonationDate" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(newDonationDate)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-container>
    <v-card-actions>
      <v-btn rounded :loading="getNewDonorLoader" color="secondary" @click="clearFields">Reset</v-btn>
      <v-btn :disabled="getNewDonorLoader|| $v.$anyError" rounded :loading="getNewDonorLoader" color="primary"
             @click="createDonorClicked">Save Donor
      </v-btn>
    </v-card-actions>
  </v-card>
  </div>
</template>

<script>
import {bloodGroups, halls, departments} from "@/mixins/constants";
import {mapGetters, mapActions} from "vuex";
import {required, minLength, maxLength, numeric} from 'vuelidate/lib/validators'
import PageTitle from "../components/PageTitle";

export default {
  name: "CreateDonor",
  data() {
    return {
      //new donor
      phone: null,
      bloodGroup: null,
      hall: halls[this.$store.getters.getHall],
      name: null,
      address: null,
      roomNumber: null,
      batch: null,
      roll: null,
      department: null,

      comment: null,
      newDonationDate: "",

      //constants
      bloodGroups,
      halls,
      departments,

      //vuetify date picker
      menu: false,
    }
  },
  components:{
    PageTitle
  },
  validations: {
    phone: {
      required,
      minLength: minLength(11),
      maxLength: maxLength(11),
      numeric,
    },
    batch: {
      minLength: minLength(2),
      maxLength: maxLength(2),
      numeric,
      required
    },
    name: {
      required
    },
    bloodGroup: {
      required
    },
    department: {
      required
    },
    roll: {
      minLength: minLength(3),
      maxLength: maxLength(3),
      numeric,
      required
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
    phoneErrors() {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.minLength && errors.push('Phone must be at least 11 digits long')
      !this.$v.phone.maxLength && errors.push('Phone must be at least 11 digits long')
      !this.$v.phone.required && errors.push('Phone is required')
      !this.$v.phone.numeric && errors.push('Phone must be numeric')
      return errors
    },

    batchErrors() {
      const errors = []
      if (!this.$v.batch.$dirty) return errors
      !this.$v.batch.minLength && errors.push('Batch number must be of 2 digits')
      !this.$v.batch.maxLength && errors.push('Batch number must be of 2 digits')
      !this.$v.batch.numeric && errors.push('Batch number must be numeric')
      !this.$v.batch.required && errors.push('Batch number is required')
      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Name is required')
      return errors
    },
    bloodGroupErrors() {
      const errors = []
      if (!this.$v.bloodGroup.$dirty) return errors
      !this.$v.bloodGroup.required && errors.push('Blood group is required')
      return errors
    },
    departmentErrors() {
      const errors = []
      if (!this.$v.department.$dirty) return errors
      !this.$v.department.required && errors.push('Department is required')
      return errors
    },
    rollErrors() {
      const errors = []
      if (!this.$v.roll.$dirty) return errors
      !this.$v.roll.minLength && errors.push('Roll number must be of 3 digits')
      !this.$v.roll.maxLength && errors.push('Roll number must be of 3 digits')
      !this.$v.roll.numeric && errors.push('Roll number must be numeric')
      !this.$v.roll.required && errors.push('Roll number is required')
      return errors
    }
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
      this.$v.$reset();
      this.phone = null;
      this.bloodGroup = null;
      this.hall = halls[this.$store.getters.getHall];
      this.name = null;
      this.address = null;
      this.roomNumber = null;
      this.batch = null;
      this.roll = null;
      this.department = null;
      this.batch = null;
      this.newDonationDate = "";
      this.comment = null;
    },
    pad(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    },
    async createDonorClicked() {
      await this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }
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

      let newStudentId = this.batch + this.pad(this.departments.indexOf(this.department), 2, '0') + this.pad(this.roll, 3, '0')

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
