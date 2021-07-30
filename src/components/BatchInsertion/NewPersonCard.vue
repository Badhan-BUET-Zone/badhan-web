<template>
  <v-card rounded class="ma-1">

    <v-card-text>
      <v-text-field rounded outlined label="Name of Donor" dense v-model="name" @blur="$v.name.$touch()"
                    :error-messages="nameErrors"></v-text-field>
      <v-text-field rounded outlined label="Phone" dense v-model="phone" @blur="$v.phone.$touch()"
                    :error-messages="phoneErrors"></v-text-field>
      <v-text-field rounded outlined label="Student ID" dense v-model="studentId" @blur="$v.studentId.$touch()"
                    :error-messages="studentIdErrors"></v-text-field>
      <div v-if="!$v.studentId.departmentCheck">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="info"
                x-small
                v-bind="attrs"
                v-on="on"
                text
                class="mb-3"
            >
              Click to see the departments
            </v-btn>
          </template>
          <v-list>
            <v-list-item
                v-for="(item, index) in departments.filter((department)=>department!=='NULL')"
                :key="index"
            >
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <v-select rounded v-model="bloodGroup" :items="bloodGroups" label="Blood Group" outlined dense
                @blur="$v.bloodGroup.$touch()"
                :error-messages="bloodGroupErrors"></v-select>

      <v-text-field rounded outlined label="Room" dense v-model="roomNumber"></v-text-field>
      <v-text-field rounded outlined label="Address" dense v-model="address"></v-text-field>
      <v-text-field rounded outlined label="Comment" dense v-model="comment"></v-text-field>
      <v-text-field type="number" rounded outlined label="Donation count" dense v-model="donationCount" @blur="$v.donationCount.$touch()"
                    :error-messages="donationCountErrors"></v-text-field>
      <v-card outlined class="rounded-xl">
        <v-card-text>
          <v-select rounded :items="availableHalls" label="Select Hall" outlined dense v-model="hall"
                    @blur="$v.hall.$touch()" :error-messages="hallErrors"></v-select>
          <v-checkbox :disabled="halls.indexOf(hall)===8" dense v-model="availableToAll" @blur="$v.availableToAll.$touch()" :error-messages="availableToAllErrors" label="Public Data"></v-checkbox>
        </v-card-text>
      </v-card>


      <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="lastDonation"
              transition="scale-transition" offset-y min-width="auto">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field rounded v-model="lastDonation" label="Pick Last Donation Date" prepend-icon="mdi-calendar" readonly
                        v-bind="attrs" v-on="on"></v-text-field>
        </template>
        <v-date-picker v-model="lastDonation" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn rounded text color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn rounded text color="primary" @click="$refs.menu.save(lastDonation)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-card-text>
    <v-card-actions>
      <v-btn small color="secondary" rounded @click="discardClicked">
        <v-icon left>
          mdi-delete
        </v-icon>
        Discard
      </v-btn>
      <v-btn small color="primary" rounded @click="createDonorClicked" :disabled="donorCreationLoader|| $v.$anyError || warnings.length!==0 || getNewDonorLoader"
             :loading="donorCreationLoader">
        <v-icon left>
          mdi-account-plus
        </v-icon>
        Create
      </v-btn>
    </v-card-actions>
    <v-card-actions v-if="duplicateDonorId!==null && !isNative">
      <v-btn small color="primary" rounded @click="goToDuplicateProfile">
        <v-icon left>
          mdi-content-duplicate
        </v-icon>
        See Duplicate
      </v-btn>
    </v-card-actions>

    <v-alert color="warning" v-for="(warning, index) in warnings" :key="index">{{warning}} </v-alert>
  </v-card>
</template>

<script>
import {halls, bloodGroups,departments} from "@/mixins/constants";
import {required, minLength, maxLength, numeric} from 'vuelidate/lib/validators'
import {mapActions, mapGetters} from "vuex";
import {isNative} from '@/plugins/android_support';
export default {
  name: "NewPersonCard",
  props: ['donor','discardDonor'],
  validations:()=>{return{
    phone: {
      required,
      minLength: minLength(11),
      maxLength: maxLength(11),
      numeric,
    },
    name: {
      required
    },
    bloodGroup: {
      required
    },
    studentId: {
      minLength: minLength(7),
      maxLength: maxLength(7),
      numeric,
      required,
      departmentCheck(studentId){
        let indexOfDepartment = parseInt(String(studentId).substr(2,2));
        if(indexOfDepartment > 18){
          return false;
        }
        // if(indexOfDepartment > 18 || this.departments[indexOfDepartment]==="NULL"){
        //   return false;
        // }
        return true;
      }
    },
    hall: {
      required,
      permission(hall){
        //COVID DATABASE
        return !(this.getHall !== this.halls.indexOf(hall) && this.halls.indexOf(hall) !== 7 && this.halls.indexOf(hall) !== 8 && this.getDesignation!==3);
      }
    },
    donationCount:{
      maxLength: maxLength(2),
      numeric,
      required,
      lastDonationCheck(value){
        return !(this.lastDonation === null && parseInt(value) !== 0);
      },
      lastDonationCheck2(value){
        return !(this.lastDonation !== null && parseInt(value) === 0);

      }
    },
    availableToAll:{
      isBoolean: (value) => {
        return typeof value == "boolean";
      }
    }
  }},
  computed: {
    ...mapGetters(['getHall', 'getDesignation']),
    ...mapGetters('halladmin', ['getNewDonorLoader']),

    availableHalls() {
      return [...halls.slice(0,7),halls[8]];
    },

    isNative(){
      return isNative();
    },
    phoneErrors() {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.minLength && errors.push('Phone must be 11 digits long')
      !this.$v.phone.maxLength && errors.push('Phone must be 11 digits long')
      !this.$v.phone.required && errors.push('Phone is required')
      !this.$v.phone.numeric && errors.push('Phone must be numeric')
      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Name is required')
      return errors
    },
    studentIdErrors() {
      const errors = []
      if (!this.$v.studentId.$dirty) return errors
      !this.$v.studentId.minLength && errors.push('Student ID must be 7 digits long')
      !this.$v.studentId.maxLength && errors.push('Student ID must be 7 digits long')
      !this.$v.studentId.required && errors.push('Student ID is required')
      !this.$v.studentId.numeric && errors.push('Student ID must be numeric')
      !this.$v.studentId.departmentCheck && errors.push('Invalid department ID')
      return errors
    },
    bloodGroupErrors() {
      const errors = []
      if (!this.$v.bloodGroup.$dirty) return errors
      !this.$v.bloodGroup.required && errors.push('Blood group is required')
      return errors
    },
    hallErrors() {
      const errors = []
      if (!this.$v.hall.$dirty) return errors
      !this.$v.hall.required && errors.push('Hall is required');
      !this.$v.hall.permission && errors.push('You are not allowed to create donor for this hall')
      return errors
    },
    donationCountErrors() {
      const errors = []
      if (!this.$v.donationCount.$dirty) return errors
      !this.$v.donationCount.maxLength && errors.push('Max donation count can be 99')
      !this.$v.donationCount.required && errors.push('Minimum donation count must be zero')
      !this.$v.donationCount.numeric && errors.push('Donation count must be numeric')
      !this.$v.donationCount.lastDonationCheck && errors.push('Last donation must be specified if donation count is non-zero');
      !this.$v.donationCount.lastDonationCheck2 && errors.push('Donation count must be non-zero if last donation is specified');
      return errors
    },
    availableToAllErrors(){
      const errors = []
      if (!this.$v.availableToAll.$dirty) return errors
      !this.$v.availableToAll.isBoolean && errors.push('Max donation count can be 99')
      return errors
    }
  },
  data: () => {
    return {
      halls,
      bloodGroups,
      departments,

      name: null,
      phone: null,
      studentId: null,
      bloodGroup: null,
      hall: null,
      address: null,
      roomNumber: null,
      comment: null,
      donationCount: null,
      lastDonation: null,
      availableToAll: false,

      donorCreationLoader: false,
      menu: false,
      warnings:[],
      duplicateDonorId: null,
    }
  },

  mounted() {
    const keysExpected = ["name","phone","studentId","bloodGroup","hall","address","roomNumber","comment","donationCount","lastDonation","key","availableToAll"]
    Object.keys(this.$props.donor).forEach((key)=>{
      if(!keysExpected.includes(key)){
        this.warnings.push("Unwanted key found: "+key);
      }
    })

    keysExpected.forEach((expectedKey)=>{
      if(!Object.keys(this.$props.donor).includes(expectedKey)){
        this.warnings.push("Missing key: "+expectedKey);
      }
    });

    this.name = this.$props.donor.name;
    this.phone = this.$props.donor.phone;
    this.studentId = this.$props.donor.studentId;
    this.bloodGroup = this.bloodGroups[this.$props.donor.bloodGroup];

    this.hall = this.halls[this.$props.donor.hall];

    this.address = this.$props.donor.address;
    this.roomNumber = this.$props.donor.roomNumber;
    this.comment = this.$props.donor.comment;
    this.donationCount = this.$props.donor.donationCount;
    this.availableToAll = this.$props.donor.availableToAll;

    // this.lastDonation = this.$props.donor.lastDonation;
    if(this.$props.donor.lastDonation!==0 && this.$props.donor.lastDonation!==null){
      this.lastDonation = new Date(this.$props.donor.lastDonation).toISOString().substr(0,10)
    }

  },
  methods: {
    ...mapActions('halladmin', ['saveDonor']),
    async createDonorClicked() {
      await this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }

      let lastDonation;
      if (this.lastDonation === null) {
        lastDonation = 0;
      } else {
        lastDonation = new Date(this.lastDonation).getTime();
      }

      let newDonor = {
        name: String(this.name),
        phone: Number("88"+this.phone),
        bloodGroup: Number(this.bloodGroups.indexOf(this.bloodGroup)),
        hall: Number(this.halls.indexOf(this.hall)),
        studentId: Number(this.studentId),
        address: this.address,
        roomNumber: this.roomNumber,
        comment: this.comment,
        lastDonation: lastDonation,
        extraDonationCount: lastDonation===0?0:this.donationCount-1,
        availableToAll: this.availableToAll
      }

      this.donorCreationLoader = true;
      let newDonorResult = await this.saveDonor(newDonor);
      if(newDonorResult.payload.status===409){
        this.duplicateDonorId = newDonorResult.payload.data.donor._id;
      }
      this.donorCreationLoader = false;

      // prevent returning the duplicate user in case if the duplicate user is of another hall
    },
    goToDuplicateProfile(){
      window.open("/#/home/details?id="+this.duplicateDonorId);
    },
    discardClicked(){
      this.discardDonor(this.$props.donor.key);
    },
  }
}
</script>

<style scoped>

</style>
