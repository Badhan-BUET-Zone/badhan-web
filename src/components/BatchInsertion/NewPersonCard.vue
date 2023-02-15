<template>
  <Container>
    <v-card-text>
      <v-text-field id="newDonorNameTextBoxId" class="required" rounded outlined label="Name of Donor" dense v-model="name"
                    @blur="$v.name.$touch()"
                    :error-messages="nameErrors"></v-text-field>
      <v-text-field id="newDonorPhoneTextBoxId" :loading="phoneDuplicateCheckLoader" :disabled="phoneDuplicateCheckLoader" class="required" rounded
                    outlined label="Phone" dense v-model="computedPhone" @blur="$v.phone.$touch()"
                    :error-messages="phoneErrors"></v-text-field>
      <transition name="slide-fade-down">
        <v-btn id="donorCreationSeeDuplicateButtonId" v-if="duplicateDonorId!==null" small class="mb-2" color="primary" rounded @click="goToDuplicateProfile">
          <v-icon left>
            mdi-content-duplicate
          </v-icon>
          See Duplicate
        </v-btn>
      </transition>

      <v-text-field id="newDonorStudentIdTextBoxId" class="required" rounded outlined label="Student ID" dense v-model="studentId"
                    @blur="$v.studentId.$touch()"
                    :error-messages="studentIdErrors"
                    hint="If the department is unknown, give 00 as dept. code"
      >
        <template v-slot:message>
          <span>{{ studentIdErrors[0] }}</span>
          <span>. If the department is unknown, give 00 as dept. code</span>
          <div v-if="$v.studentId.$invalid">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="info"
                    x-small
                    v-bind="attrs"
                    v-on="on"
                    text
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
        </template>
      </v-text-field>

      <v-select id="newDonorBloodGroupDropDownId" class="required" rounded v-model="bloodGroup" :items="bloodGroups" label="Blood Group" outlined dense
                @blur="$v.bloodGroup.$touch()"
                :error-messages="bloodGroupErrors"></v-select>

      <v-text-field id="newDonorRoomNumberTextFieldId" rounded outlined label="Room" dense v-model="roomNumber"></v-text-field>
      <v-text-field id="newDonorAddressTextFieldId" rounded outlined label="Address" dense v-model="address"></v-text-field>
      <v-text-field id="newDonorCommentTextFieldId" rounded outlined label="Comment" dense v-model="comment"></v-text-field>
      <v-text-field id="newDonorDonationCountTextFieldId" class="required" type="number" rounded outlined label="Donation count" dense v-model="donationCount"
                    @blur="$v.donationCount.$touch()"
                    :error-messages="donationCountErrors"></v-text-field>
      <v-card outlined class="rounded-xl">
        <v-card-text>
          <v-select id="newDonorHallDropdownId" class="required" rounded :items="availableHalls" label="Select Hall" outlined dense v-model="hall"
                    @blur="$v.hall.$touch()" :error-messages="hallErrors"></v-select>
          <v-checkbox id="newDonorPublicDataCheckboxId" :disabled="halls.indexOf(hall)===8" dense v-model="availableToAll"
                      @blur="$v.availableToAll.$touch()" :error-messages="availableToAllErrors"
                      label="Public Data"></v-checkbox>
        </v-card-text>
      </v-card>

      <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="lastDonation"
          transition="scale-transition"
          offset-y
          min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
              id="newDonorLastDonationTextFieldId"
              v-model="lastDonation"
              label="Last Donation"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
            v-model="lastDonation"
            no-title
            scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
              text
              color="primary"
              @click="menu = false"
          >
            Cancel
          </v-btn>
          <v-btn
              id="newDonorLastDonationOkButtonId"
              text
              color="primary"
              @click="$refs.menu.save(lastDonation)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
    </v-card-text>
    <v-card-actions>
      <v-btn small color="primary" rounded @click="discardClicked">
        <v-icon left>
          mdi-delete
        </v-icon>
        Discard
      </v-btn>
      <v-btn id="newDonorCreateButtonId" small color="primary" rounded @click="createDonorClicked"
             :disabled="donorCreationLoader|| $v.$anyError || warnings.length!==0 || getNewDonorLoader"
             :loading="donorCreationLoader">
        <v-icon left>
          mdi-account-plus
        </v-icon>
        Create
      </v-btn>
    </v-card-actions>

    <v-alert color="warning" v-for="(warning, index) in warnings" :key="index">{{ warning }}</v-alert>
  </Container>
</template>

<script>
/* eslint-disable */
import { halls, bloodGroups, departments } from '../../mixins/constants'
import { required, minLength, maxLength, numeric } from 'vuelidate/lib/validators'
import { mapActions, mapGetters } from 'vuex'
import { handleGETDonorsDuplicate } from '../../api'
import Container from '../Wrappers/Container'
import { environmentService } from '@/mixins/environment'

export default {
  name: 'NewPersonCard',
  props: ['donor', 'discardDonor'],
  components: {
    Container
  },
  validations: () => {
    return {
      phone: {
        required,
        minLength: minLength(11),
        maxLength: maxLength(11),
        numeric,
        async uniqueCheck (phone) {
          if (!phone || phone.length !== 11 || isNaN(parseInt(phone))) return true

          this.duplicateDonorId = null
          this.duplicateDonorMessage = 'Checking phone...'
          this.phoneDuplicateCheckLoader = true
          const data = await handleGETDonorsDuplicate({ phone: '88' + phone })
          this.phoneDuplicateCheckLoader = false

          if (!data) return false

          this.duplicateDonorId = data.donor ? data.donor._id : null
          this.duplicateDonorMessage = data.message
          return !data.found
        }
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
        departmentCheck (studentId) {
          const indexOfDepartment = parseInt(String(studentId).substr(2, 2))
          return indexOfDepartment <= 18;

        }
      },
      hall: {
        required,
        permission (hall) {
          // COVID DATABASE
          return !(this.getHall !== this.halls.indexOf(hall) && this.halls.indexOf(hall) !== 7 && this.halls.indexOf(hall) !== 8 && this.getDesignation !== 3)
        }
      },
      donationCount: {
        maxLength: maxLength(2),
        numeric,
        required,
        lastDonationCheck (value) {
          return !(this.lastDonation === null && parseInt(value) !== 0)
        },
        lastDonationCheck2 (value) {
          return !(this.lastDonation !== null && parseInt(value) === 0)
        }
      },
      availableToAll: {
        isBoolean: (value) => {
          return typeof value === 'boolean'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['getHall', 'getDesignation']),
    ...mapGetters('halladmin', ['getNewDonorLoader']),
    computedPhone: {
      get () {
        return this.phone
      },
      set (val) {
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.phone = val
        }, 2000)
      }
    },

    availableHalls () {
      return [...halls.slice(0, 7), halls[8]]
    },
    phoneErrors () {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.minLength && errors.push('Phone must be 11 digits long')
      !this.$v.phone.maxLength && errors.push('Phone must be 11 digits long')
      !this.$v.phone.required && errors.push('Phone is required')
      !this.$v.phone.numeric && errors.push('Phone must be numeric')
      !this.$v.phone.uniqueCheck && errors.push(this.duplicateDonorMessage)
      return errors
    },
    nameErrors () {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Name is required')
      return errors
    },
    studentIdErrors () {
      const errors = []
      if (!this.$v.studentId.$dirty) return errors
      !this.$v.studentId.minLength && errors.push('Student ID must be 7 digits long')
      !this.$v.studentId.maxLength && errors.push('Student ID must be 7 digits long')
      !this.$v.studentId.required && errors.push('Student ID is required')
      !this.$v.studentId.numeric && errors.push('Student ID must be numeric')
      !this.$v.studentId.departmentCheck && errors.push('Invalid department ID')
      return errors
    },
    bloodGroupErrors () {
      const errors = []
      if (!this.$v.bloodGroup.$dirty) return errors
      !this.$v.bloodGroup.required && errors.push('Blood group is required')
      return errors
    },
    hallErrors () {
      const errors = []
      if (!this.$v.hall.$dirty) return errors
      !this.$v.hall.required && errors.push('Hall is required')
      !this.$v.hall.permission && errors.push('You are not allowed to create donor for this hall')
      return errors
    },
    donationCountErrors () {
      const errors = []
      if (!this.$v.donationCount.$dirty) return errors
      !this.$v.donationCount.maxLength && errors.push('Max donation count can be 99')
      !this.$v.donationCount.required && errors.push('Minimum donation count must be zero')
      !this.$v.donationCount.numeric && errors.push('Donation count must be numeric')
      !this.$v.donationCount.lastDonationCheck && errors.push('Last donation must be specified if donation count is non-zero')
      !this.$v.donationCount.lastDonationCheck2 && errors.push('Donation count must be non-zero if last donation is specified')
      return errors
    },
    availableToAllErrors () {
      const errors = []
      if (!this.$v.availableToAll.$dirty) return errors
      !this.$v.availableToAll.isBoolean && errors.push('Max donation count can be 99')
      return errors
    }
  },

  watch: {
    'hall' (to, from) {
      if (to === '(Unknown)') {
        this.availableToAll = true
      }
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
      donationCount: 0,
      lastDonation: null,
      availableToAll: false,

      donorCreationLoader: false,
      lastDonationMenu: false,
      warnings: [],
      duplicateDonorId: null,

      departmentListShown: false,
      timeout: null,
      phoneDuplicateCheckLoader: false,
      duplicateDonorMessage: '',

      menu: false
    }
  },

  mounted () {
    const keysExpected = ['name', 'phone', 'studentId', 'bloodGroup', 'hall', 'address', 'roomNumber', 'comment', 'donationCount', 'lastDonation', 'key', 'availableToAll']
    Object.keys(this.$props.donor).forEach((key) => {
      if (!keysExpected.includes(key)) {
        this.warnings.push('Unwanted key found: ' + key)
      }
    })

    keysExpected.forEach((expectedKey) => {
      if (!Object.keys(this.$props.donor).includes(expectedKey)) {
        this.warnings.push('Missing key: ' + expectedKey)
      }
    })

    this.name = this.$props.donor.name
    this.phone = this.$props.donor.phone
    this.studentId = this.$props.donor.studentId
    this.bloodGroup = this.bloodGroups[this.$props.donor.bloodGroup]

    this.hall = this.halls[this.$props.donor.hall]

    this.address = this.$props.donor.address
    this.roomNumber = this.$props.donor.roomNumber
    this.comment = this.$props.donor.comment
    this.donationCount = this.$props.donor.donationCount
    this.availableToAll = this.$props.donor.availableToAll

    if (this.$props.donor.lastDonation !== 0 && this.$props.donor.lastDonation !== null) {
      this.lastDonation = (new Date(this.$props.donor.lastDonation)).toISOString().substr(0, 10)
    }
  },
  methods: {
    ...mapActions('halladmin', ['saveDonor']),

    async createDonorClicked () {
      await this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }

      let lastDonation
      if (this.lastDonation === null) {
        lastDonation = 0
      } else {
        lastDonation = new Date(this.lastDonation).getTime()
      }

      if (this.comment === '' || this.comment === null) this.comment = '(Unknown)'
      if (this.address === '' || this.address === null) this.address = '(Unknown)'
      if (this.roomNumber === '' || this.roomNumber === null) this.roomNumber = '(Unknown)'

      const newDonor = {
        name: String(this.name),
        phone: Number('88' + this.phone),
        bloodGroup: Number(this.bloodGroups.indexOf(this.bloodGroup)),
        hall: Number(this.halls.indexOf(this.hall)),
        studentId: Number(this.studentId),
        address: this.address,
        roomNumber: this.roomNumber,
        comment: this.comment,
        lastDonation: lastDonation,
        extraDonationCount: lastDonation === 0 ? 0 : this.donationCount - 1,
        availableToAll: this.availableToAll
      }

      this.donorCreationLoader = true
      const response = await this.saveDonor(newDonor)
      if (response.status === 409) {
        this.duplicateDonorId = response.data.donor._id
      }
      this.donorCreationLoader = false
    },
    goToDuplicateProfile () {
      window.open(environmentService.getFrontendBaseURL()+ '#/home/details?id=' + this.duplicateDonorId)
    },
    async discardClicked () {
      if (this.discardDonor !== null) {
        this.discardDonor(this.$props.donor.key)
        return
      }
      await this.$v.$reset()

      this.name = null
      this.phone = null
      this.studentId = null
      this.bloodGroup = null

      this.hall = halls[this.getHall]

      this.address = null
      this.roomNumber = null
      this.comment = null
      this.donationCount = null
      this.lastDonation = null

      this.availableToAll = false

      this.key = new Date().getTime()

      this.duplicateDonorId = null
    }

  }

}
</script>

<style scoped>

</style>
