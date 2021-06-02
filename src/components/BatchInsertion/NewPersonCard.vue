<template>
  <v-card rounded class="ma-1">

    <v-card-text>
      <v-text-field rounded outlined label="Name of Donor" dense v-model="name" @blur="$v.name.$touch()"
                    :error-messages="nameErrors"></v-text-field>
      <v-text-field rounded outlined label="Phone" dense v-model="phone" @blur="$v.phone.$touch()"
                    :error-messages="phoneErrors"></v-text-field>
      <v-text-field rounded outlined label="Student ID" dense v-model="studentId" @blur="$v.studentId.$touch()"
                    :error-messages="studentIdErrors"></v-text-field>
      <v-select rounded v-model="bloodGroup" :items="bloodGroups" label="Blood Group" outlined dense
                @blur="$v.bloodGroup.$touch()"
                :error-messages="bloodGroupErrors"></v-select>
      <v-select rounded :items="availableHalls" label="Select Hall" outlined dense v-model="hall"
                @blur="$v.hall.$touch()" :error-messages="hallErrors"></v-select>
      <v-text-field rounded outlined label="Room" dense v-model="roomNumber"></v-text-field>
      <v-text-field rounded outlined label="Address" dense v-model="address"></v-text-field>
      <v-text-field rounded outlined label="Donation count" dense v-model="donationCount" @blur="$v.donationCount.$touch()"
                    :error-messages="donationCountErrors"></v-text-field>
      <p>
        <b>Last Donation: </b>
        <span v-if="donor.lastDonation!==0">
                {{ new Date(donor.lastDonation).toDateString() }}
              </span>
        <span v-else>None</span>
      </p>
    </v-card-text>
    <v-card-actions>
      <v-btn small color="secondary" rounded>Discard</v-btn>
      <v-btn small color="primary" rounded @click="createDonorClicked" :disabled="donorCreationLoader|| $v.$anyError"
             :loading="donorCreationLoader">Create
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {halls, bloodGroups} from "@/mixins/constants";
import {required, minLength, maxLength, numeric} from 'vuelidate/lib/validators'
import {mapGetters} from "vuex";

export default {
  name: "NewPersonCard",
  props: ['donor'],
  validations: {
    phone: {
      required,
      minLength: minLength(13),
      maxLength: maxLength(13),
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
      required
    },
    hall: {
      required
    },
    donationCount:{
      maxLength: maxLength(2),
      numeric,
      required
    }
  },
  computed: {
    ...mapGetters(['getHall', 'getDesignation']),
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
      !this.$v.phone.minLength && errors.push('Phone must be 13 digits long')
      !this.$v.phone.maxLength && errors.push('Phone must be 13 digits long')
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
      !this.$v.hall.required && errors.push('Hall is required')
      return errors
    },
    donationCountErrors() {
      const errors = []
      if (!this.$v.donationCount.$dirty) return errors
      !this.$v.donationCount.maxLength && errors.push('Max donation count can be 99')
      !this.$v.donationCount.required && errors.push('Donation count is required')
      !this.$v.donationCount.numeric && errors.push('Donation count must be numeric')
      return errors
    },
  },
  data: () => {
    return {
      halls,
      bloodGroups,

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

      donorCreationLoader: false,
    }
  },

  mounted() {
    this.name = this.$props.donor.name;
    this.phone = this.$props.donor.phone;
    this.studentId = this.$props.donor.studentId;
    this.bloodGroup = this.bloodGroups[this.$props.donor.bloodGroup];

    if(this.getDesignation===3 || this.getHall===this.$props.donor.hall){
      this.hall = this.halls[this.$props.donor.hall];
    }
    this.address = this.$props.donor.address;
    this.roomNumber = this.$props.donor.roomNumber;
    this.comment = this.$props.donor.comment;
    this.donationCount = this.$props.donor.donationCount;
    this.lastDonation = this.$props.donor.lastDonation;
  },
  methods: {
    async createDonorClicked() {
      await this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }
      console.log("Donor creation request sent");
      //can't create donor of other halls
      //can't input invalid bullshit data
      // use pagination
    }
  }
}
</script>

<style scoped>

</style>
