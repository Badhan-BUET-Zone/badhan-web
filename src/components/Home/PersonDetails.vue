<template>
  <div>
    <transition name="slide-fade-down-snapout" mode="out-in">
      <Container v-if="getDonorLoaderFlag" :key="'donorLoading'">
        <v-card-title><span class="grey--text">Loading...</span></v-card-title>
        <v-skeleton-loader type="article"></v-skeleton-loader>
      </Container>

      <Container v-else-if="donorErrorHappened" :key="'donorError'">
        <PageTitle></PageTitle>
        <v-card class="mx-auto mt-2" max-width="700">
          <v-card-title>No donor found</v-card-title>
        </v-card>
      </Container>

      <Container v-else :key="'donorLoaded'">
        <v-card-title>{{ name }}</v-card-title>
        <v-card-text class="mb-5">
          <v-chip color="secondary" class="mr-1 mb-1">
            <span v-if="designation === 0">Donor</span>
            <span v-else-if="designation === 1">Volunteer</span>
            <span v-else-if="designation === 2">Hall Admin</span>
            <span v-else>Super Admin</span>
          </v-chip>
          <v-chip class="mr-1 mb-1" color="secondary">{{ donationCount }} Donations</v-chip>
          <v-chip class="mr-1 mb-1" v-if="availableIn > 0" color="warning">{{ availableIn }} Days remaining</v-chip>
          <v-chip class="mr-1 mb-1" dark v-else color="green">Available</v-chip>
          <br>
          <div class="row" v-if="!getLoadingFlag">
            <div class="col-lg-6 col-md-12 col-sm-12" id="firstColumn">
              <ContainerOutlined>
                <v-card-title>
                  <v-btn rounded @click="personDetailCollapseFlag = !personDetailCollapseFlag">
                    Person Details
                  </v-btn>
                  <HelpTooltip>
                    <div style="max-width: 200px">
                      You can only edit donors of your own hall, editing donors of other halls is restricted.<br>You
                      can still view details, update comments and manage donations of a donor of other halls if that
                      donor is marked as public data.
                    </div>
                  </HelpTooltip>
                </v-card-title>
                <transition name="slide-fade-down-snapout" mode="out-in">
                  <v-card-text v-if="personDetailCollapseFlag">
                    <div>
                      <v-text-field rounded dense type="'text'" outlined label="Name" v-model="name"
                                    :disabled="!isDetailsEditable" @blur="$v.name.$touch()"
                                    :error-messages="nameErrors"></v-text-field>
                      <v-text-field rounded dense type="'text'" outlined label="Phone" v-model="phone"
                                    :disabled="!isDetailsEditable" @blur="$v.phone.$touch()"
                                    :error-messages="phoneErrors"></v-text-field>
                      <v-text-field
                          :hint="(designation!==0 && !$isMe(_id))?'You cannot edit this email':'Password Recovery Email'"
                          :persistent-hint="(designation!==0 && !$isMe(_id))" rounded dense outlined :label="'Email'"
                          v-model="email"
                          :disabled="!isDetailsEditable || (designation!==0 && !$isMe(_id)) "
                          @blur="$v.email.$touch()"
                          :error-messages="emailErrors">
                      </v-text-field>
                      <v-select rounded dense v-model="bloodGroup" :items="bloodGroups" label="Blood Group" outlined
                                :disabled="!isDetailsEditable"></v-select>
                      <v-text-field rounded dense type="'text'" outlined label="Student ID: " v-model="studentId"
                                    :disabled="!isDetailsEditable" @blur="$v.studentId.$touch()"
                                    :error-messages="studentIdErrors"></v-text-field>
                      <v-text-field rounded dense type="'text'" outlined label="Room" v-model="room"
                                    :disabled="!isDetailsEditable"></v-text-field>
                      <v-text-field rounded dense type="'text'" outlined label="Address" v-model="address"
                                    :disabled="!isDetailsEditable"></v-text-field>
                      <v-select rounded dense v-model="hall" :items="availableHalls" label="Hall" outlined
                                :disabled="!isDetailsEditable || designation === 2 || designation === 1"></v-select>
                      <v-checkbox :disabled="!isDetailsEditable || halls.indexOf(hall)===8" v-model="availableToAll"
                                  dense
                                  label="Public Data"></v-checkbox>

                      <div v-if="getDesignation > designation || $isMe(_id)">
                        <v-btn color="primary" rounded class="white--text ml-2" small
                               :disabled="getDetailsLoaderFlag || !isDetailsEditable || $v.name.$error || $v.phone.$error || $v.studentId.$error || $v.email.$error"
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
                                :disabled="getCommentLoaderFlag" :rows="1"
                                :messages="'Last Updated: '+ (commentTime==0?'Unknown':new Date(commentTime).toDateString()+' on '+new Date(commentTime).toLocaleTimeString())">
                    </v-textarea>

                    <v-btn color="primary" rounded small
                           :disabled="getCommentLoaderFlag"
                           :loading="getCommentLoaderFlag" @click="saveCommentClicked()">
                      <v-icon left>
                        mdi-content-save
                      </v-icon>
                      Save Comment
                    </v-btn>
                  </v-card-text>
                </transition>
              </ContainerOutlined>

              <ContainerOutlined v-if="getDesignation >= designation || $isMe(_id)">
                <v-card-title>
                  <v-btn rounded
                         @click="settingsCollapseFlag = !settingsCollapseFlag">
                    Settings
                  </v-btn>
                </v-card-title>
                <transition name="slide-fade-down-snapout" mode="out-in">
                  <v-card-text v-if="settingsCollapseFlag">
                    <transition-group name="slide-fade-down" mode="out-in">
                      <v-btn key="promoteToVolunteer"
                             small
                             class="ma-1"
                             color="primary"
                             :loading="promoteFlag"
                             :disabled="promoteFlag"
                             @click="promoteClicked"
                             rounded v-if="isAllowedToPromoteToVolunteer">
                        <v-icon left>mdi-arrow-up</v-icon>
                        Promote To Volunteer
                      </v-btn>
                      <v-btn key="passwordRecoveryLink" small :loading="passwordRecoveryFlag"
                             :disabled="passwordRecoveryFlag"
                             @click="createPasswordRecoveryLink" class="ma-1" color="primary" rounded
                             v-if="isPasswordLinkResetable">
                        <v-icon left>mdi-lock-reset</v-icon>
                        Password Recovery Link
                      </v-btn>

                      <div key="linkGenerated" class="mt-2" v-if="passwordRecoveryLink">
                        <v-row no-gutters>
                          <v-col cols="9">
                            <v-text-field rounded dense outlined disabled
                                          v-model="passwordRecoveryLink" label="Recovery link"></v-text-field>
                          </v-col>
                          <v-col cols="3">
                            <v-tooltip
                                v-model="passwordRecoveryTooltip"
                                top
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn class="ml-1" @click="passwordRecoveryLinkCopyClicked" v-bind="attrs" rounded
                                       color="secondary">
                                  <v-icon>
                                    mdi-clipboard-outline
                                  </v-icon>
                                </v-btn>
                              </template>
                              <span style="max-width: 300px">Password recovery link copied to clipboard.</span>
                            </v-tooltip>
                          </v-col>
                        </v-row>
                      </div>


                      <v-btn key="demoteToDonor" small class="ma-1" color="warning" rounded :loading="promoteFlag"
                             :disabled="promoteFlag"
                             v-if="isAllowedToDemoteToDonor" @click="demoteClicked">
                        <v-icon left>mdi-arrow-down</v-icon>
                        Demote To Donor
                      </v-btn>

                      <div key="passwordChange" v-if="$isMe(_id)">
                        <v-text-field rounded dense :append-icon="newPasswordFlag ? 'mdi-eye' : 'mdi-eye-off'"
                                      :type="newPasswordFlag ? 'text' : 'password'" outlined
                                      label="New Password" v-model="newPassword"
                                      class="input-group--focused"
                                      @click:append="newPasswordFlag = !newPasswordFlag"
                                      :disabled="!isDetailsEditable"
                                      @blur="$v.newPassword.$touch()"
                                      :error-messages="newPasswordErrors"></v-text-field>
                        <v-text-field rounded dense :append-icon="confirmPasswordFlag ? 'mdi-eye' : 'mdi-eye-off'"
                                      :type="confirmPasswordFlag ? 'text' : 'password'" outlined
                                      label="Confirm Password" v-model="confirmPassword" class="input-group--focused"
                                      @click:append="confirmPasswordFlag = !confirmPasswordFlag"
                                      :disabled="!isDetailsEditable"
                                      @blur="$v.confirmPassword.$touch()"
                                      :error-messages="confirmPasswordErrors"></v-text-field>
                        <v-btn small class="ma-1" color="secondary" style="text-decoration: none" to="/home" rounded>
                          <v-icon left>mdi-window-close</v-icon>
                          Cancel
                        </v-btn>
                        <v-btn class="ma-1" color="primary" rounded small
                               :disabled="$v.newPassword.$error || $v.confirmPassword.$error || passwordChangeFlag"
                               :loading="passwordChangeFlag"
                               @click="savePasswordClicked"
                        >
                          <v-icon left>mdi-content-save</v-icon>
                          Save
                        </v-btn>
                      </div>
                      <v-btn key="deletePerson" small class="ma-1" v-if="isDeletable" @click="deleteDonorPrompt"
                             rounded
                             color="warning"
                             :loading="deleteDonorFlag" :disabled="deleteDonorFlag">
                        <v-icon left dark>mdi-delete</v-icon>
                        Delete this person
                      </v-btn>
                      <v-btn key="promoteToHallAdmin" small class="ma-1" rounded color="primary"
                             v-if="getDesignation===3 && designation===1"
                             :disabled="getChangeAdminLoaderFlag || !isDetailsEditable"
                             :loading="getChangeAdminLoaderFlag" @click="changeHallAdminClicked()">
                        <v-icon left dark>mdi-arrow-up</v-icon>
                        Promote to Hall admin
                      </v-btn>
                    </transition-group>
                  </v-card-text>
                </transition>
              </ContainerOutlined>

            </div>
            <div class="col-lg-6 col-md-12 col-md-12" style="height: fit-content">

              <ContainerOutlined>
                <v-card-title>
                  Add Donation
                </v-card-title>
                <v-card-text>
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
                        <v-btn small rounded text color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn
                            small
                            rounded
                            text
                            color="primary"
                            @click="$refs.menu.save(newDonationDate)"
                        >
                          OK
                        </v-btn>
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
                </v-card-text>
              </ContainerOutlined>

              <ContainerOutlined>
                <v-card-title>
                  Donations
                </v-card-title>
                <v-card-text>
                  <p class="mt-2 h6 font-weight-bold">Last Donation:</p>
                  <template v-if="lastDonation !== 0">
                    <p>{{ lastDonation }}</p>
                    <p class="h6 font-weight-bold">Donation History:</p>
                    <div v-if="getDonationList.length!==0">
                      <DonationCard
                          v-for="(date,index) in getDonationList"
                          :key="index"
                          :date="date"
                          :delete-donation="deleteDonationClicked">
                      </DonationCard>
                      <br/>
                    </div>
                  </template>
                  <span v-else>(Unknown)</span>
                </v-card-text>
              </ContainerOutlined>

              <ContainerOutlined v-if="getDesignation === 3">
                <v-card-title>
                  Public Contacts
                </v-card-title>
                <v-card-text>
                  <p class="mt-2 h6 font-weight-bold">Existing Public Contacts:</p>
                  <p v-if="publicContacts.length===0">This contact is not published for the public to see</p>
                  <v-chip :disabled="deletePublicContactLoader" class="ma-1" v-for="publicContact in publicContacts" :key="publicContact._id"
                          color="secondary" close
                          @click:close="()=>{deletePublicContactClicked(publicContact._id)}">
                    {{ publicContact.bloodGroup | getBloodGroupString }}
                  </v-chip>
                  <v-progress-linear indeterminate v-if="deletePublicContactLoader"></v-progress-linear>
                  <p class="mt-4 h6 font-weight-bold">New Public Contact</p>
                  <v-select
                      rounded
                      dense
                      outlined
                      v-model="selectedNewPublicContact"
                      :items="publicContactBloodGroups"
                      item-text="name"
                      item-value="code"
                      label="Blood Group"
                      return-object
                  ></v-select>

                  <Button
                      :click="publishToPublicContactClicked"
                      :loading="newPublicContactLoader"
                      :disabled="newPublicContactLoader || selectedNewPublicContact===null"
                      :color="'primary'" :text="'Publish'" :icon="'mdi-content-save'">
                  </Button>
                </v-card-text>
              </ContainerOutlined>
            </div>
          </div>
        </v-card-text>
      </Container>

    </transition>
    <Dialog
        :message="'Delete donor?'"
        :canceled="deleteDonorCanceled"
        :confirmed="deleteDonorConfirmed"
        :dialog-opened="deleteDonorDialogFlag"
    ></Dialog>
  </div>
</template>

<script>
import {halls, bloodGroups} from "../../mixins/constants";
import {mapActions, mapGetters, mapMutations} from "vuex";
import {required, minLength, maxLength, numeric, sameAs} from 'vuelidate/lib/validators'
import CallRecordCard from "../../components/Home/CallRecordCard";
import HelpTooltip from "../../components/UI Components/HelpTooltip";
import PageTitle from "../PageTitle";
import ShareProfileButton from "../ShareProfileButton";
import Container from "../Wrappers/Container";
import ContainerOutlined from "../Wrappers/ContainerOutlined";
import {isGuestEnabled} from "../../api";
import {
  handlePATCHDonorsDesignation,
  handlePATCHUsersPassword,
  handleDELETEDonors,
  handlePOSTDonorsPasswordRequest,
  handleDELETEPublicContacts,
  handlePOSTPublicContacts,
} from "../../api";
import DonationCard from "./DonationCard";
import Dialog from "../Dialog";
import Button from "../UI Components/Button";

export default {
  name: "PersonDetails",
  props: ["donorId"],
  components: {
    Button,
    Dialog,
    DonationCard,
    ContainerOutlined,
    Container,
    ShareProfileButton,
    CallRecordCard,
    HelpTooltip,
    PageTitle
  },
  data: function () {
    return {
      //form fields
      _id: null,
      name: "",
      oldPhone: "",
      phone: "",
      studentId: "",
      email: "",
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
      availableToAll: false,

      //history flag
      showHistory: false,

      //spinner controller flags

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
      showTooltip: false,

      donorErrorHappened: false,
      promoteFlag: false,
      passwordChangeFlag: false,
      deleteDonorFlag: false,
      passwordRecoveryFlag: false,
      passwordRecoveryTooltip: false,
      passwordRecoveryLink: null,

      deleteDonorDialogFlag: false,

      publicContacts: [],
      publicContactBloodGroups: [
        {name: "A+", code: 0},
        {name: "B+", code: 2},
        {name: "O+", code: 4},
        {name: "AB+", code: 6},
        {name: "All Negative", code: -1}
      ],
      selectedNewPublicContact: null,
      newPublicContactLoader: false,
      deletePublicContactLoader: false,
    };
  },
  validations: {
    phone: {
      required,
      minLength: minLength(11),
      maxLength: maxLength(11),
      numeric,
    },
    studentId: {
      minLength: minLength(7),
      maxLength: maxLength(7),
      numeric,
      required
    },
    email: {
      validEmail(email) {
        if (email === "") return true;
        let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email);
      }
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
    ...mapGetters(['getChangeAdminLoaderFlag']),
    ...mapGetters('comment', ['getCommentLoaderFlag']),
    ...mapGetters('donation', ['getDonationList']),
    ...mapGetters('donate', ['getDonationLoaderFlag']),
    ...mapGetters('callrecord', ['getNewCallRecordLoaderFlag', 'getCallRecords', 'getCallRecordsLoader', 'getDeleteCallRecordLoaderFlag']),

    isAllowedToPromoteToVolunteer() {
      return this.designation === 0 && halls.indexOf(this.hall) <= 6 && (this.getDesignation === 3 || (this.getHall === halls.indexOf(this.hall) && this.getDesignation === 2))
    },
    isAllowedToDemoteToDonor() {
      return this.designation === 1 && halls.indexOf(this.hall) <= 6 && (this.getDesignation === 3 || (this.getHall === halls.indexOf(this.hall) && this.getDesignation === 2))
    },
    isPasswordLinkResetable() {
      return !isGuestEnabled() && !this.$isMe(this._id) && this.designation !== 0 && (this.getDesignation === 3 || (this.getHall === halls.indexOf(this.hall) && this.getDesignation > this.designation))
    },
    isDeletable() {
      return !this.$isMe(this._id) && this.designation <= 1 && (this.getDesignation === 3 || (this.getDesignation > this.designation && this.getHall === halls.indexOf(this.hall)));
    },

    isDetailsEditable() {
      return this.getDesignation === 3 || this.$isMe(this._id) || (this.getHall === halls.indexOf(this.hall) && this.getDesignation > this.designation) || halls.indexOf(this.hall) === 8
    },

    phoneErrors() {
      const errors = []
      if (!this.$v.phone.$dirty) return errors
      !this.$v.phone.minLength && errors.push('Phone must be at least 11 digits long')
      !this.$v.phone.maxLength && errors.push('Phone must be at least 11 digits long')
      !this.$v.phone.numeric && errors.push('Phone must be numeric')
      !this.$v.phone.required && errors.push('Phone is required.')
      return errors
    },
    studentIdErrors() {
      const errors = []
      if (!this.$v.studentId.$dirty) return errors
      !this.$v.studentId.minLength && errors.push('Student ID must be of 7 digits')
      !this.$v.studentId.maxLength && errors.push('Student ID must be of 7 digits')
      !this.$v.studentId.numeric && errors.push('Student ID must be numeric')
      !this.$v.studentId.required && errors.push('Student ID is required')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.email.$dirty) return errors
      !this.$v.email.validEmail && errors.push('Email not valid')
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
          return [...halls.slice(0, 7), halls[8]];
        } else {
          return [halls[this.getHall], halls[8]];
        }
      }
    },
  },
  methods: {
    ...mapActions('notification', ['notifyError', 'notifySuccess', 'notifyInfo']),
    ...mapActions('donation', ['deleteDonation']),
    ...mapActions(['changeHallAdmin']),
    ...mapActions('comment', ['saveComment']),
    ...mapActions('userDetails', ['saveUserDetails']),
    ...mapActions('details', ['getDetails']),
    ...mapActions('donate', ['donate']),
    ...mapMutations('donation', ['addDonation']),
    ...mapMutations(['deletePerson']),
    ...mapMutations(['setToken']),
    ...mapActions('callrecord', ['postCallRecord', 'deleteCallRecord']),
    ...mapActions('notification',['notifySuccess']),

    async publishToPublicContactClicked() {
      console.log(this.selectedNewPublicContact);
      this.newPublicContactLoader = true;
      let response = await handlePOSTPublicContacts({donorId: this._id,bloodGroup: this.selectedNewPublicContact.code})
      this.newPublicContactLoader = false;
      if(response.status!==201)return;
      this.publicContacts.push({_id: response.data.publicContact._id,bloodGroup: this.selectedNewPublicContact.code})
      this.notifySuccess('Public Contacts Updated');
    },

    async deletePublicContactClicked(contactId) {
      this.deletePublicContactLoader = true;
      let response = await handleDELETEPublicContacts({donorId: this._id,contactId});
      this.deletePublicContactLoader = false;
      if(response.status!==200) return;

      this.publicContacts = this.publicContacts.filter((publicContact) => {
        return publicContact._id !== contactId
      });

      this.notifySuccess('Public Contacts Updated');
    },

    async createPasswordRecoveryLink() {
      this.passwordRecoveryFlag = true;
      let token = await handlePOSTDonorsPasswordRequest({donorId: this._id});
      this.passwordRecoveryFlag = false;
      if (!token) {
        return;
      }
      this.passwordRecoveryLink = process.env.VUE_APP_FRONTEND_BASE + '#/passwordReset?token=' + token;
    },
    async passwordRecoveryLinkCopyClicked() {
      await this.$copyText(this.passwordRecoveryLink);
      this.passwordRecoveryTooltip = true;
      setTimeout(() => {
        this.passwordRecoveryTooltip = false
      }, 2000);

    },
    shareClicked() {
      let routeData = this.$router.resolve({
        name: 'Details',
        query: {
          id: this._id,
        }
      });
      // navigator.clipboard.writeText(process.env.VUE_APP_FRONTEND_BASE+routeData.href);
      this.$copyText(process.env.VUE_APP_FRONTEND_BASE + routeData.href).then((e) => {
        this.showTooltip = true;
        setTimeout(() => {
          this.showTooltip = false
        }, 2000);
      }, (e) => {
      })
    },
    async changeHallAdminClicked() {
      let response = await this.changeHallAdmin({donorId: this._id});
      console.log(response);
      if (response) {
        this.designation = 2
      }
    },
    deleteDonorPrompt() {
      this.deleteDonorDialogFlag = true;
    },
    async deleteDonorConfirmed() {
      this.deleteDonorDialogFlag = false;
      this.deleteDonorFlag = true;
      let response = await handleDELETEDonors({donorId: this._id});
      this.deleteDonorFlag = false;
      if (response.status !== 200) return;
      this.deletePerson({_id: this._id, studentId: this.studentId});
      this.notifySuccess('Deleted donor successfully');
      await this.$router.push('/home');
    },
    async deleteDonorCanceled() {
      this.deleteDonorDialogFlag = false;
    },
    async callFromDialer() {
      await this.postCallRecord({donorId: this._id});
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
    },

    async saveCommentClicked() {
      let comment = this.comment;
      if (this.comment === "") {
        comment = "(Unknown)"
      }
      await this.saveComment({
        donorId: this._id,
        comment: comment
      })
      this.commentTime = new Date().getTime();

    },

    async deleteDonationClicked(date) {
      let lastDonation = await this.deleteDonation({
        donorId: this._id,
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
        this.lastDonation = "(Unknown)";
        return;
      }
      this.lastDonation =
          newDate.getDate() +
          "/" +
          (newDate.getMonth() + 1) +
          "/" +
          newDate.getFullYear();


    },

    async promoteClicked() {
      this.promoteFlag = true;
      if (await handlePATCHDonorsDesignation({
        donorId: this._id,
        promoteFlag: true,
      })) {
        this.designation = 1
      }
      this.promoteFlag = false;
    },
    async demoteClicked() {
      this.promoteFlag = true;
      if (await handlePATCHDonorsDesignation({
        donorId: this._id,
        promoteFlag: false,
      })) {
        this.designation = 0
      }
      this.promoteFlag = false;
    },
    async savePasswordClicked() {
      await this.$v.newPassword.$touch();
      await this.$v.confirmPassword.$touch();
      if (this.$v.newPassword.$error || this.$v.confirmPassword.$error) {
        return;
      }
      this.passwordChangeFlag = true;
      let data = await handlePATCHUsersPassword({
        donorId: this._id,
        password: this.newPassword,
      });
      if (data && !isGuestEnabled()) {
        this.setToken(data.token);
      }
      this.passwordChangeFlag = false;
    },
    async saveDetailsClicked() {
      await this.$v.name.$touch();
      await this.$v.phone.$touch();
      await this.$v.studentId.$touch();
      await this.$v.email.$touch();

      if (this.$v.name.$error || this.$v.phone.$error || this.$v.studentId.$error || this.$v.email.$error) {
        return;
      }

      let room = this.room;
      let address = this.address;
      if (room === "") {
        room = "(Unknown)";
      }
      if (address === "") {
        address = "(Unknown)";
      }

      let sendData = {
        donorId: this._id,
        name: this.name,
        phone: parseInt("88" + this.phone),
        studentId: this.studentId,
        email: this.email,
        bloodGroup: bloodGroups.indexOf(this.bloodGroup),
        hall: halls.indexOf(this.hall),
        roomNumber: room,
        address: address,
        availableToAll: this.availableToAll
      };
      await this.saveUserDetails(sendData);
    },
    async donateClicked() {
      let success = await this.donate({
        donorId: this._id,
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

    this.donorErrorHappened = false;
    this.dataLoaded = false;

    // let success = await this.getDetails(this.$route.query.id);
    let success = await this.getDetails(this.$props.donorId);

    if (!success) {
      this.donorErrorHappened = true;
      return;
    }


    let profile = this.getProfile;
    this._id = profile._id;
    this.name = profile.name;
    this.phone = profile.phone.toString().substr(2);
    this.oldPhone = profile.phone;
    this.studentId = profile.studentId;
    this.bloodGroup = bloodGroups[profile.bloodGroup];
    this.email = profile.email;
    this.hall = halls[profile.hall];
    this.room = profile.roomNumber;
    this.address = profile.address;
    this.address = profile.address;
    this.comment = profile.comment;
    this.designation = profile.designation;
    this.donationCount = this.getDonationList.length;
    this.commentTime = profile.commentTime;
    this.availableToAll = profile.availableToAll;
    this.publicContacts = profile.publicContacts;

    let date = new Date(profile.lastDonation);
    this.lastDonation =
        date.getDate() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getFullYear();
    if (profile.lastDonation === 0) {
      this.lastDonation = "(Unknown)";
    }

    this.availableIn =
        120 -
        Math.round(
            (Math.round(new Date().getTime()) - date.getTime()) /
            (1000 * 3600 * 24)
        );

    this.dataLoaded = true;

    this.$forceUpdate();
    this.personDetailCollapseFlag = !this.$isMobile();
  },
  // beforeRouteLeave(to,from,next){
  //   next();
  // },
  // beforeDestroy() {
  //   console.log("before destroy")
  // }
};
</script>
<style>

</style>
