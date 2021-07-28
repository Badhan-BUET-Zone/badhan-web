<template>
  <div>
    <v-card v-if="getDonorLoaderFlag"
            style="z-index: 90;position: fixed;left: 0px;top: 0px;height: 20vh;width: 100vw;overflow-y: scroll;"
            class="d-flex justify-center">
      <v-app-bar color="primary" dark>
        <v-btn icon @click="$router.push('/home')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>
          <v-progress-circular indeterminate></v-progress-circular>
          Loading
        </v-toolbar-title>
      </v-app-bar>

    </v-card>
    <v-card v-else-if="dataLoaded"
            style="z-index: 90;position: fixed;left: 0px;top: 0px;height: 100vh;width: 100vw;overflow-y: scroll;">
      <v-app-bar color="primary" dark>
        <v-btn icon @click="$router.push('/home')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title> Person Details</v-toolbar-title>
      </v-app-bar>
      <v-card class="mx-auto mt-2" max-width="1000px">
        <v-card-title>{{ name }}</v-card-title>
        <v-card-text class="mb-5">
          <v-chip color="secondary" class="ma-1">
            <span v-if="designation === 0">Donor</span>
            <span v-else-if="designation === 1">Volunteer</span>
            <span v-else-if="designation === 2">Hall Admin</span>
            <span v-else>Super Admin</span>
          </v-chip>
          <v-chip class="ma-1" color="secondary">{{ donationCount }} Donations</v-chip>
          <v-chip class="ma-1" v-if="availableIn > 0" color="error">{{ availableIn }} Days remaining</v-chip>
          <v-chip class="ma-1" v-else color="success">Available</v-chip>

          <v-chip v-if="getCallRecordsLoader" class="ma-1" color="secondary">Last called: Loading...</v-chip>
          <v-chip v-else class="ma-1" color="secondary">Last called: {{getLastCallRecordDate===0?'Unknown':new Date(getLastCallRecordDate).toLocaleString()}}</v-chip>

          <br>
          <v-btn small rounded color="secondary" class="ma-1" @click="callFromDialer" :disabled="getNewCallRecordLoaderFlag" :loading="getNewCallRecordLoaderFlag">
            <v-icon left>
              mdi-phone
            </v-icon>
            Call Now
          </v-btn>

          <v-tooltip
              v-model="showTooltip"
              top
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn small color="secondary" rounded class="ma-1" v-bind="attrs"
                     @click="shareClicked">
                <v-icon left>
                  mdi-share
                </v-icon>
                Share
              </v-btn>
            </template>
            <span>Copied to clipboard</span>
          </v-tooltip>


          <div class="row" v-if="!getLoadingFlag">
            <div class="col-lg-8 col-md-12 col-sm-12" id="firstColumn">


              <v-switch
                  v-if="getDesignation === 3 ||getPhone == oldPhone ||(getHall === halls.indexOf(hall) &&getDesignation > designation) ||halls.indexOf(hall) === 7 ||halls.indexOf(hall) === 8"
                  v-model="enableEditing" inset :label="'Toggle to edit details'"></v-switch>

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
                  <div class="card-body">
                    <div v-on:click="promptForEdit($event)">
                    <v-text-field rounded dense type="'text'" outlined label="Name" v-model="name"
                                  :disabled="!enableEditing" @blur="$v.name.$touch()"
                                  :error-messages="nameErrors"></v-text-field>
                    <v-text-field rounded dense type="'text'" outlined label="Phone" v-model="phone"
                                  :disabled="!enableEditing" @blur="$v.phone.$touch()"
                                  :error-messages="phoneErrors"></v-text-field>
                    <v-select rounded dense v-model="bloodGroup" :items="bloodGroups" label="Blood Group" outlined
                              :disabled="!enableEditing"></v-select>
                    <v-text-field rounded dense type="'text'" outlined label="Student ID: " v-model="studentID"
                                  :disabled="!enableEditing" @blur="$v.studentID.$touch()"
                                  :error-messages="studentIDErrors"></v-text-field>
                     <v-text-field rounded dense type="'text'" outlined label="Room" v-model="room"
                                  :disabled="!enableEditing"></v-text-field>
                    <v-text-field rounded dense type="'text'" outlined label="Address" v-model="address"
                                  :disabled="!enableEditing"></v-text-field>
                    <v-select rounded dense v-model="hall" :items="availableHalls" label="Hall" outlined
                              :disabled="!enableEditing || designation === 2 || designation === 1"></v-select>
                    <v-checkbox :disabled="!enableEditing || halls.indexOf(hall)===8" v-model="availableToAll" dense label="Public Data"></v-checkbox>

                    <div v-if="getDesignation > designation ||getPhone == oldPhone">
                      <v-btn color="primary" rounded class="white--text ml-2"
                             :disabled="getDetailsLoaderFlag || !enableEditing || $v.name.$error || $v.phone.$error || $v.studentID.$error"
                             :loading="getDetailsLoaderFlag" @click="saveDetailsClicked()">
                        <v-icon left>
                          mdi-content-save
                        </v-icon>
                        Save
                      </v-btn>
                    </div>
                    </div>
                    <v-textarea rounded dense class="mt-5" name="comment" outlined v-model="comment"
                                label="Comment" auto-grow
                                :disabled="getCommentLoaderFlag" :rows="1" :messages="'Last Updated: '+ (commentTime==0?'Unknown':new Date(commentTime).toLocaleString())">
                    </v-textarea>

                    <v-btn color="primary" rounded
                           :disabled="getCommentLoaderFlag"
                           :loading="getCommentLoaderFlag" @click="saveCommentClicked()">
                      <v-icon left>
                        mdi-content-save
                      </v-icon>
                      Save Comment
                    </v-btn>
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
                    <div v-if="getDesignation > 1 && designation == 0 &&hall !== 7 &&hall !== 8">
                      <label>Promote this member to volunteer</label>
                    </div>
                    <div
                        v-if="(designation !== 0 || getPhone == oldPhone) || (getDesignation > 1 && designation == 0 &&hall !== 7 &&hall !== 8)">
                      <v-text-field rounded dense :append-icon="newPasswordFlag ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="newPasswordFlag ? 'text' : 'password'" outlined
                                    label="New Password" v-model="newPassword"
                                    class="input-group--focused"
                                    @click:append="newPasswordFlag = !newPasswordFlag"
                                    :disabled="!enableEditing"
                                    @blur="$v.newPassword.$touch()"
                                    :error-messages="newPasswordErrors"></v-text-field>
                      <v-text-field rounded dense :append-icon="confirmPasswordFlag ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="confirmPasswordFlag ? 'text' : 'password'" outlined
                                    label="Confirm Password" v-model="confirmPassword" class="input-group--focused"
                                    @click:append="confirmPasswordFlag = !confirmPasswordFlag"
                                    :disabled="!enableEditing"
                                    @blur="$v.confirmPassword.$touch()"
                                    :error-messages="confirmPasswordErrors"></v-text-field>
                    </div>

                    <div
                        v-if="getPhone === oldPhone || getDesignation > 1 ||(getDesignation === 1 && getPhone == oldPhone)">
                      <v-btn color="secondary" style="text-decoration: none" to="/home" rounded>
                        <v-icon left>
                          mdi-window-close
                        </v-icon>
                        Cancel
                      </v-btn>
                      <v-btn color="primary" class="white--text ml-2" rounded
                             :disabled="!enableEditing ||getPasswordLoader||getPromoteFlag || $v.newPassword.$error || $v.confirmPassword.$error"
                             :loading="getPasswordLoader ||getPromoteFlag"
                             @click="saveSettingsClicked()">
                        <v-icon left>
                          mdi-content-save
                        </v-icon>
                        Save
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
                       v-if="(getID!==$route.query.id) && (getDesignation===3|| (designation < getDesignation && (halls.indexOf(hall)===getHall || halls.indexOf(hall)>6)))">
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
            <div class="col-lg-4 col-md-12 col-md-12" style="height: fit-content">

              <!--              NEW DONATION SECTION-->
              <div>
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
                        rounded
                        v-model="newDonationDate"
                        label="Add a donation date"
                        prepend-icon="mdi-calendar"
                        readonly
                        outlined
                        v-bind="attrs"
                        v-on="on"
                        dense
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="newDonationDate" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(newDonationDate)"
                    >
                      OK
                    </v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </div>
              <v-btn
                  color="primary"
                  rounded
                  small
                  style="width: 100%"
                  @click="donateClicked()"
                  :loading="getDonationLoaderFlag"
                  :disabled="getDonationLoaderFlag || newDonationDate.length === 0"
              >
                <v-icon left>
                  mdi-check
                </v-icon>
                Done
              </v-btn>
              <!--              NEW DONATION SECTION END-->

              <p class="mt-2">Last Donation:</p>
              <template v-if="lastDonation !== 0">
                <p class="text-dark">{{ lastDonation }}</p>
                <br/>
                <div v-if="getDonationList.length!==0">
                  <div class="input-group mb-3" v-for="date in getDonationList">
                    <input type="text" readonly class="form-control"
                           :value="date===0?'Unknown date':datePrint(date)"/>

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
              <span v-else>No donation found</span>

              <p>Call History:</p>
              <v-progress-circular class="ma-2" color="primary" indeterminate v-if="getCallRecordsLoader"></v-progress-circular>
              <CallRecordCard :callee-id="$route.query.id" :call-record="callRecord" v-for="(callRecord) in getCallRecords" :key="callRecord._id"></CallRecordCard>
              <span v-if="getCallRecords.length===0">No call history found</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-card>
    <v-card v-else
            style="z-index: 90;position: fixed;left: 0px;top: 0px;height: 100vh;width: 100vw;overflow-y: scroll;">
      <v-app-bar color="primary" dark>
        <v-btn icon @click="$router.push('/home')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title> Person Details</v-toolbar-title>
      </v-app-bar>
      <v-card class="mx-auto mt-2" max-width="1000px">
        <v-card-title>No donor found</v-card-title>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import {halls, bloodGroups} from "@/mixins/constants";
import {mapActions, mapGetters, mapMutations} from "vuex";
import {required, minLength, maxLength, numeric, sameAs} from 'vuelidate/lib/validators'
import CallRecordCard from "../../CallRecordCard";
export default {
  name: "PersonDetails",
  components:{
    CallRecordCard
  },
  data: ()=>{
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
      donationCount: 0,
      commentTime: 0,

      dateToBeDeleted: "",

      halls,
      bloodGroups,
      showDetails: false,
      oldPassword: null,
      newPassword: null,
      confirmPassword: "",
      comment: "",
      availableToAll:false,

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

      newDonationDate: "",
      menu: false,

      dataLoaded: false,
      showTooltip: false
    };
  },
  validations: {
    phone: {
      required,
      minLength: minLength(11),
      maxLength: maxLength(11),
      numeric,
    },
    studentID: {
      minLength: minLength(7),
      maxLength: maxLength(7),
      numeric,
      required
    },
    name: {
      required
    },
    newPassword: {
      required,
      minLength: minLength(6),
    },
    confirmPassword: {
      sameAs: sameAs('newPassword')
    }
  },
  watch: {
    dialog(to, from) {
      if (to === false) {
        this.$router.push("/home");
      }
    },
  },
  computed: {
    ...mapGetters('details', ['getDonorLoaderFlag', 'getProfile']),
    ...mapGetters(['getLoadingFlag', 'getDesignation', 'getPhone', 'getHall', 'getID', 'getToken']),
    ...mapGetters('userDetails', ['getDetailsLoaderFlag']),
    ...mapGetters('password', ['getPasswordLoader']),
    ...mapGetters('promote', ['getPromoteFlag']),
    ...mapGetters('deleteDonor', ['getDeleteLoaderFlag']),
    ...mapGetters(['getChangeAdminLoaderFlag']),
    ...mapGetters('comment', ['getCommentLoaderFlag']),
    ...mapGetters('donation', ['getDonationList']),
    ...mapGetters('donate', ['getDonationLoaderFlag']),
    ...mapGetters('callrecord',['getNewCallRecordLoaderFlag','getCallRecords','getCallRecordsLoader','getDeleteCallRecordLoaderFlag']),
    phoneErrors() {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.minLength && errors.push('Phone must be at least 11 digits long')
      !this.$v.phone.maxLength && errors.push('Phone must be at least 11 digits long')
      !this.$v.phone.numeric && errors.push('Phone must be numeric')
      !this.$v.phone.required && errors.push('Phone is required.')
      return errors
    },
    studentIDErrors() {
      const errors = []
      if (!this.$v.studentID.$dirty) return errors
      !this.$v.studentID.minLength && errors.push('Student ID must be of 7 digits')
      !this.$v.studentID.maxLength && errors.push('Student ID must be of 7 digits')
      !this.$v.studentID.numeric && errors.push('Student ID must be numeric')
      !this.$v.studentID.required && errors.push('Student ID is required')
      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Name is required')
      return errors
    },
    newPasswordErrors() {
      const errors = []
      if (!this.$v.newPassword.$dirty) return errors
      !this.$v.newPassword.required && errors.push('Specify a password')
      !this.$v.newPassword.minLength && errors.push('Password must be at least 6 characters long')
      return errors
    },
    confirmPasswordErrors() {
      const errors = []
      if (!this.$v.confirmPassword.$dirty) return errors
      !this.$v.confirmPassword.sameAs && errors.push('Password does not match')
      return errors
    },

    donorLoaderFlag() {
      return this.getDonorLoaderFlag;
    },
    availableHalls() {
      if (this.getDesignation !== null) {
        if (this.getDesignation === 3) {
          return [...halls.slice(0,7),halls[8]];
        } else {
          //covid support
          //return [halls[this.getHall], halls[7]];
          return [halls[this.getHall], halls[8]];
        }
      }
    },
    getLastCallRecordDate(){
      let lastDate = 0;
      this.getCallRecords.forEach((callRecord)=>{
        if(callRecord.date> lastDate){
          lastDate = callRecord.date;
        }
      });
      return lastDate;
    }
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
    ...mapActions('donate', ['donate']),
    ...mapMutations('donation', ['addDonation']),
    ...mapActions('callrecord',['postCallRecord','deleteCallRecord','fetchCallRecords']),

    shareClicked() {
      let routeData = this.$router.resolve({
        name: 'Details',
        query: {
          id: this.$route.query.id,
        }
      });
      // navigator.clipboard.writeText(process.env.VUE_APP_FRONTEND_BASE+routeData.href);
      this.$copyText(process.env.VUE_APP_FRONTEND_BASE+routeData.href).then((e)=>{
        this.showTooltip=true;
        setTimeout(()=>{this.showTooltip=false},2000);
      },(e)=>{
      })
    },
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
    async callFromDialer() {
      await this.postCallRecord({donorId: this.$route.query.id});
      document.location.href = "tel:+88" + this.phone;
      this.$forceUpdate();
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
      this.commentTime = new Date().getTime();

    },
    async deleteDonationClicked(date) {
      let lastDonation = await this.deleteDonation({
        donorId: this.$route.query.id,
        date: date,
      });
      this.donationCount = this.donationCount - 1;

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
    async saveSettingsClicked() {
      await this.$v.newPassword.$touch();
      await this.$v.confirmPassword.$touch();
      if (this.$v.newPassword.$error || this.$v.confirmPassword.$error) {
        return;
      }

      if (this.designation === 0) {
        this.promoteClicked();
      } else {
        this.savePasswordClicked();
      }
    },
    async promoteClicked() {
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
      await this.savePassword({
        donorId: this.$route.query.id,
        password: this.newPassword,
        logoutFlag: this.$route.query.id === this.getID
      });

      if(this.$route.query.id === this.getID){
        await this.$router.push({name: 'SignIn'});
      }
    },
    async saveDetailsClicked() {
      await this.$v.name.$touch();
      await this.$v.phone.$touch();
      await this.$v.studentID.$touch();

      if (this.$v.name.$error || this.$v.phone.$error || this.$v.studentID.$error) {
        return;
      }

      let sendData = {
        donorId: this.$route.query.id,
        name: this.name,
        phone: parseInt("88" + this.phone),
        studentId: this.studentID,
        bloodGroup: bloodGroups.indexOf(this.bloodGroup),
        hall: halls.indexOf(this.hall),
        roomNumber: this.room,
        address: this.address,
        availableToAll: this.availableToAll
      };
      await this.saveUserDetails(sendData);
    },
    promptForEdit(event) {
      if (!this.enableEditing) {
        this.notifyInfo("Please enable toggle to edit ");
      }
    },
    async donateClicked() {
      let success = await this.donate({
        donorId: this.$route.query.id,
        newDonationDate: this.newDonationDate
      });

      if (success) {
        let newAvailableIn =
            120 -
            Math.round(
                (Math.round(new Date().getTime()) -
                    new Date(this.newDonationDate).getTime()) /
                (1000 * 3600 * 24)
            );
        this.addDonation(new Date(this.newDonationDate).getTime());
        if (newAvailableIn > this.availableIn) {
          this.availableIn = newAvailableIn;
          this.lastDonation = this.datePrint(new Date(this.newDonationDate).getTime());
        }
        this.newDonationDate = "";
        this.donationCount++;
      }

    },
  },
  async mounted() {
    this.dataLoaded = false;

    let success = await this.getDetails(this.$route.query.id);

    if (!success)
      return;


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
    this.donationCount = profile.donationCount;
    this.commentTime = profile.commentTime;
    this.availableToAll = profile.availableToAll;

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

    this.dataLoaded = true;

    this.$forceUpdate();
  },
};
</script>
<style>

</style>
