<template>
  <div  class="modal fade bd-example-modal-lg" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div  class="modal-dialog modal-lg">
      <div class="modal-content"  >
        <div v-if="$store.getters.getLoadingFlag" class="spinner-border text-dark" role="status" style="align-self: center">
          <span class="sr-only">Loading...</span>
        </div>
        <div class="alert alert-danger animated jello" role="alert" v-if="errorDetailsLoading.length!==0">
          {{errorDetailsLoading}}
        </div>
        <!--            Modal Header-->
        <div v-if="!$store.getters.getLoadingFlag && errorDetailsLoading.length===0" class="modal-header animated fadeIn">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>
              {{name}}
            </span>
            <br>
            (
            <span v-if="designation==2">
              Hall admin
            </span>
            <span v-else-if="designation==3">
              Super admin
            </span>
            <span v-else-if="designation==1">
              Volunteer
            </span>
            <span v-else-if="designation==0">
              Donor
            </span>
            )
            <br><br>
            <span v-if="availableIn>0" class="alert alert-danger" >
              {{this.availableIn}} Days remaining
            </span>
            <span v-else="" class="alert alert-success" >
              Available
            </span>
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="hideDetails()" >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <!--            Modal Body-->
        <div class="modal-body row animated fadeIn" v-if="!$store.getters.getLoadingFlag">


          <!--                Modal First column-->
          <div class="card col-lg-8 col-md-12 col-sm-12 ">
            <br>
            <div class="custom-control custom-switch"
                 v-if="$store.getters.getDesignation===3 || $store.getters.getPhone == oldPhone || ($store.getters.getHall===hall && $store.getters.getDesignation> designation) ||hall===7">
              <input type="checkbox" class="custom-control-input" id="customSwitch1" v-model="enableEditing">
              <label class="custom-control-label" for="customSwitch1">Toggle to edit details</label>
            </div>
            <br>

            <div id="accordion">
              <div class="card">
                <div class="card-header" id="headingOne">
                  <h5 class="mb-0">
                    <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                      Person Details
                    </button>
                  </h5>
                </div>

                <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                  <div class="card-body">

                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Name</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control" :disabled="!enableEditing" v-model="name">
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Phone</label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control" :disabled="!enableEditing" v-model="phone">
                      </div>
                    </div>

                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Blood Group: </label>
                      <div class="col-sm-8">
                        <select class="form-control" v-model="bloodGroup" :disabled="!enableEditing">
                          <option v-for="(blood, index) in bloodGroups" :value="index">{{blood}}</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Student ID: </label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control" :disabled="!enableEditing" v-model="studentID">
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Hall: </label>
                      <div class="col-sm-8">
                        <select class="form-control" v-model="hall" :disabled="!enableEditing || designation===2 || designation===1">
                          <option v-for="(oneHall, index) in halls" :value="index" v-if="$store.getters.getDesignation===3 || index===7 || $store.getters.getHall=== index">{{oneHall}}</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Room: </label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control" :disabled="!enableEditing" v-model="room">
                      </div>
                    </div>
                    <div class="form-group row">
                      <label class="col-sm-4 col-form-label">Address: </label>
                      <div class="col-sm-8">
                        <input type="text" class="form-control" :disabled="!enableEditing" v-model="address">
                      </div>
                    </div>

                    <div v-if="$store.getters.getDesignation>designation || $store.getters.getPhone== oldPhone">
                      <button type="button" class="btn btn-warning" data-dismiss="modal" aria-label="Close" @click="hideDetails()">Cancel</button>
                      <button type="button" class="btn btn-success" :disabled="detailsSpinner || !enableEditing" @click="saveDetailsClicked()">Save</button>
                    </div>
                    <br>
                    <div class="alert alert-danger animated jello" role="alert" v-if="errorDetails.length!==0">
                      {{errorDetails}}
                    </div>
                    <div class="alert alert-success animated jello" role="alert" v-if="successDetails.length!==0">
                      {{successDetails}}
                    </div>

                    <div style="width: 10px; height: 20px">
                      <div class="spinner-border text-primary" v-if="detailsSpinner" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card" v-if="$store.getters.getDesignation>designation || $store.getters.getPhone== oldPhone">
                <div class="card-header" id="headingTwo">
                  <h5 class="mb-0">
                    <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      Settings
                    </button>
                  </h5>
                </div>
                <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                  <div class="card-body">
                    <div v-if="designation!=0 || $store.getters.getPhone== oldPhone">
                      <div class="form-group row">
                        <label class="col-sm-4 col-form-label">New Password: </label>
                        <div class="col-sm-8">
                          <input type="password" class="form-control" :disabled="!enableEditing" v-model="newPassword">
                        </div>
                      </div>
                      <div class="form-group row">
                        <label class="col-sm-4 col-form-label">Confirm Password: </label>
                        <div class="col-sm-8">
                          <input type="password" class="form-control" :disabled="!enableEditing" v-model="confirmPassword">
                        </div>
                      </div>
                      <button v-if="designation==1" class="btn btn-outline-danger" :disabled="!enableEditing" style="width: 100%" @click="demote()">Demote this member to donor</button>
                      <br><br>

                    </div>

                    <div v-if="$store.getters.getDesignation>1 && designation==0 && this.hall!==7">
                      <label>Promote this member to volunteer</label>
                      <div class="form-group row">
                        <label class="col-sm-4 col-form-label">New Password: </label>
                        <div class="col-sm-8">
                          <input type="password" class="form-control" :disabled="!enableEditing" v-model="newPassword">
                        </div>
                      </div>
                      <div class="form-group row">
                        <label class="col-sm-4 col-form-label">Confirm Password: </label>
                        <div class="col-sm-8">
                          <input type="password" class="form-control" :disabled="!enableEditing" v-model="confirmPassword">
                        </div>
                      </div>

                    </div>

                    <div v-if="$store.getters.phone== oldPhone||$store.getters.getDesignation>1">
                        <button type="button" class="btn btn-warning" data-dismiss="modal" aria-label="Close" @click="hideDetails()">Cancel</button>
                        <button type="button" class="btn btn-success" :disabled="settingsSpinner || !enableEditing" @click="saveSettingsClicked()">Save</button>
                    </div>
                    <br>
                    <div class="alert alert-danger animated jello" role="alert" v-if="errorSettings.length!==0">
                      {{errorSettings}}
                    </div>
                    <div class="alert alert-success animated jello" role="alert" v-if="successSettings.length!==0">
                      {{successSettings}}
                    </div>
                    <div style="width: 10px; height: 20px">
                      <div class="spinner-border text-primary" v-if="settingsSpinner" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <br>
            <div class="input-group mb-3">
              <input type="text" class="form-control" :disabled="!enableEditing" v-model="comment">
              <div class="input-group-append">
                <button class="btn btn-success" type="button" :disabled="commentSpinner || !enableEditing" @click="saveCommentClicked()">
                  Save Comment
                </button>
              </div>

            </div>

            <div class="alert alert-danger animated jello" role="alert" v-if="errorComment.length!==0">
              {{errorComment}}
            </div>
            <div class="alert alert-success animated jello" role="alert" v-if="successComment.length!==0">
              {{successComment}}
            </div>
            <div style="width: 50px; height: 50px">
              <div class="spinner-border text-primary" v-if="commentSpinner" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </div>

          <!--                Modal Second Column-->
          <div class="card col-lg-4 col-md-12 col-md-12" style="height: fit-content" >
            <label>Last Donation: </label>
            <p class="text-dark">{{lastDonation}}</p>
            <button :disabled="historySpinner" class="btn btn-outline-primary" @click="loadHistory()">Load history</button>
            <br>
            <div v-if="showHistory" class="animated fadeIn">
              <div class="input-group mb-3" v-for="(date) in history">
                <input type="text" readonly class="form-control" :value="datePrint(date)">
                <div class="input-group-append">
                  <button class="btn btn-success" type="button" @click="deleteDonation(date)">Delete</button>
                </div>
              </div>
              <br>
            </div>
            <div class="alert alert-danger animated jello" role="alert" v-if="errorHistory.length!==0">
              {{errorHistory}}
            </div>
            <div class="alert alert-success animated jello" role="alert" v-if="successHistory.length!==0">
              {{successHistory}}
            </div>
              <div class="spinner-border text-primary" v-if="historySpinner" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            <br>
          </div>
          <button class="btn btn-primary" style="width: 100%" data-dismiss="modal" aria-label="Close" @click="hideDetails()">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {eventBus} from "../../../../main";
  import {halls,bloodGroups} from "../../../../constants";

  export default {
        name: "PersonDetails",
        data: function () {
            return {
                //form fields
                name:'',
                oldPhone:'',
                phone:'',
                studentID:'',
                bloodGroup:'',
                availableIn: '',
                designation: '',
                hall: '',
                room:'',
                address: '',
                lastDonation:'',

                history:[
                ],
                dateToBeDeleted: '',

                halls,
                // dummyMe,
                bloodGroups,
                showDetails:false,
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
                comment: '',

                //history flag
                showHistory: false,

                //spinner controller flags
                detailsSpinner: false,
                settingsSpinner: false,
                commentSpinner: false,
                historySpinner: false,
                enableEditing: false,

                //error messages
                errorDetails:'',
                errorComment:'',
                errorSettings: '',
                errorHistory: '',
                errorDetailsLoading: '',

                successComment:'',
                successSettings:'',
                successHistory:'',
                successDetails:'',

            }
        },
      methods:{
          datePrint(date){
              let dateObj = new Date(date);
              return dateObj.getDate()+"/"+(dateObj.getMonth()+1)+"/"+dateObj.getFullYear();
          },
          hideDetails(){
              this.showHistory=false;
              this.enableEditing=false;
              this.errorDetailsLoading="";

          },
          saveCommentClicked(){
              console.log('Save comment clicked');
              console.log('comment: ',this.comment);

              this.errorComment="";
              this.successComment="";

              let sendData={
                token: this.$store.getters.getToken,
                userPhone: this.$store.getters.getPhone,
                donorPhone: parseInt('88'+this.phone),
                comment: this.comment,
              };
              console.log('sendData: ',sendData);
              this.commentSpinner=true;
              let self=this;
              this.axios.post('/comment', sendData).then(function (response) {
              console.log('status: ',response.status);
              if(response.status==200){
                console.log('successful comment change');
                self.successComment="Successfully changed comment";
                self.enableEditing=false;
              }else{
                self.error="Status code not 200";
              }
            }).catch(function (error) {
              self.errorComment=error.response.message;
              console.log(error.response);
            }).finally(function () {
              self.commentSpinner=false;
            });
          },
          deleteDonation(date){
              console.log('date to be deleted: ',date);

              this.errorHistory="";
              this.successHistory="";


              this.dateToBeDeleted=date;
              let sendData = {
                  token:this.$store.getters.getToken,
                  userPhone:this.$store.getters.getPhone,
                  donorPhone:parseInt('88'+this.phone),
                  date: date
              };
              console.log('sendData: ',sendData);
              this.historySpinner=true;
              let self = this;
              this.axios.post('/deletedonation', sendData).then(function (response) {
                  console.log('status: ',response.status);
                  if(response.status==200){
                    for( let i = 0; i < self.history.length; i++){
                      if ( self.history[i] == self.dateToBeDeleted) {
                        self.history.splice(i, 1);
                        break;
                      }
                    }
                    let lastDonationNew=0;
                      if(self.history.length!==0){
                        lastDonationNew= self.history.reduce(function(a,b){
                          return Math.max(a,b);
                        });
                      }

                      let date = new Date(lastDonationNew);
                      self.availableIn=120-Math.round((Math.round((new Date()).getTime())-date.getTime())/(1000*3600*24));
                      self.lastDonation= date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
                      console.log('donation deletion successful');
                      self.successHistory="Successfully deleted donation";
                  }else{
                      self.errorHistory="Status code not 200";
                  }
              }).catch(function (error) {
                  self.errorHistory=error.response.data.message;
                  console.log(error.response);
              }).finally(function () {
                  self.historySpinner=false;
              });

          },

          saveSettingsClicked(){
              console.log('save settings clicked');


              if(this.newPassword !== this.confirmPassword){
                  this.errorSettings="Passwords didn't match";
                  return;
              }else if(this.newPassword.length===0){
                  this.errorSettings="Password can't have length of zero";
                  return;
              }

              if(this.designation===0){
                  this.promote();
              }else{
                  this.savePasswordClicked();
              }
          },
          promote(){
              console.log('promote clicked');
              this.errorSettings="";
              this.successSettings="";

              let sendData = {
                  token:this.$store.getters.getToken,
                  userPhone:this.$store.getters.getPhone,
                  donorPhone: parseInt('88'+this.phone),
                  promoteFlag: true,
                  newPassword: this.newPassword
              };
              console.log('sendData: ',sendData);

              this.settingsSpinner=true;
              let self = this;
              this.axios.post('/promote', sendData).then(function (response) {

                  console.log('status: ',response.status);
                  if(response.status==200){
                      console.log('promotion successful');
                      self.successSettings="Successfully promoted to volunteer";
                      self.enableEditing=false;
                  }else{
                      self.errorSettings="Status code not 200";
                  }
              }).catch(function (error) {
                  self.errorSettings=error.response.data.message;
                  console.log(error.response);
              }).finally(function () {
                  self.settingsSpinner=false;
              });
          },
          demote(){
              console.log('demote clicked');
              this.errorSettings="";
              this.successSettings="";

              let sendData = {
                  token:this.$store.getters.getToken,
                  userPhone:this.$store.getters.getPhone,
                  donorPhone: parseInt('88'+this.phone),
                  promoteFlag: false,
                  newPassword: ''
              };
              console.log('sendData: ',sendData);

              this.settingsSpinner=true;
              let self = this;
              this.axios.post('/promote', sendData).then(function (response) {
                  //8801823472762 test1234
                  console.log('status: ',response.status);
                  if(response.status==200){
                      console.log('demotion successful');
                      self.successSettings="Successfully demoted to donor";
                      self.enableEditing=false;
                  }else{
                      self.errorSettings="Status code not 200";
                  }
              }).catch(function (error) {
                  self.errorSettings=error.response.data.message;
                  console.log(error.response);
              }).finally(function () {
                  self.settingsSpinner=false;
              });
          },
          savePasswordClicked(){
              console.log('save password clicked');
              this.errorSettings="";
              this.successSettings="";

              if(this.newPassword!=this.confirmPassword){
                  console.log("Passwords didn't match");
                  this.errorSettings="Passwords didn't match";
                  return;
              }
              if(this.newPassword.length===0){
                  console.log("Passwords can't be of length zero");
                  this.errorSettings="Passwords can't be of length zero";
                  return;
              }
              let sendData = {
                  token:this.$store.getters.getToken,
                  userPhone:this.$store.getters.getPhone,
                  donorPhone:parseInt('88'+this.phone),
                  newPassword: this.newPassword
              };
              console.log('sendData: ',sendData);
              this.settingsSpinner=true;
              let self = this;
              this.axios.post('/changepassword', sendData).then(function (response) {
                  console.log('status: ',response.status);
                  if(response.status==200){
                      console.log('password change successful');
                      self.successSettings="Successfully changed password";
                      self.enableEditing=false;
                  }else{
                      self.errorSettings="Status code not 200";
                  }
              }).catch(function (error) {
                  self.errorSettings=error.response.data.message;
                  console.log(error.response);
              }).finally(function () {
                  self.settingsSpinner=false;
              });
          },
          saveDetailsClicked(){
              console.log('save defaults clicked');
              this.errorDetails="";
              this.successDetails="";

              if(this.name.length===0){
                  this.errorDetails="Please input the name of donor";
                  console.log("Please input the name of donor");
                  return;
              }

              if(isNaN(this.phone) || this.phone.toString().length!==11){
                  this.errorDetails="Please enter a 11 digit phone number";
                  console.log("Please enter a 11 digit phone number");
                  return;
              }

              if(isNaN(this.studentID) || this.studentID.toString().length!==7){
                  this.errorDetails="Please enter a valid student ID";
                  console.log("Please enter a valid student ID");
                  return;
              }
              console.log('student ID length ',this.studentID.toString().length);
              this.detailsSpinner=true;
              let sendData={
                  token: this.$store.getters.getToken,
                  userPhone: this.$store.getters.getPhone,
                  oldPhone: this.oldPhone,
                  newName: this.name,
                  newPhone: parseInt('88'+this.phone),
                  newStudentId: this.studentID,
                  newBloodGroup: this.bloodGroup,
                  newHall: this.hall,
                  newRoomNumber: this.room,
                  newAddress: this.address
              };
              console.log('sendData: ',sendData);
              let self = this;
              this.axios.post('/edit', sendData).then(function (response) {
                  console.log('status: ',response.status);
                  if(response.status==200){
                      console.log('saved donor details successfully');
                      self.successDetails="Successfully saved details.";
                      self.$store.commit('setPhone',parseInt('88'+self.phone));
                      self.enableEditing=false;
                  }else{
                      self.errorDetails="Status code not 200";
                  }
              }).catch(function (error) {
                  self.errorDetails=error.response.data.message;
                  console.log(error.response);
              }).finally(function () {
                  self.detailsSpinner=false;
              });
          },
          loadHistory(){
            this.errorHistory="";
            this.successHistory="";

            if(this.showHistory){
              this.showHistory=false;
            }else{
              this.historySpinner=true;

              let sendData={
                  token: this.$store.getters.getToken,
                  userPhone: this.$store.getters.getPhone,
                  donorPhone: parseInt('88'+this.phone)
              };
              console.log('send data: ',sendData);
              let self=this;
                this.axios.post('/seehistory', sendData).then(function (response) {
                    console.log('status: ',response.status);
                    if(response.status==200){
                        //self.$store.commit('setToken',response.data.token);
                        console.log('received dates: ',response.data);
                        self.history=response.data;
                        self.showHistory=true;
                        self.successHistory="Successfully loaded history";
                    }else{
                        self.errorHistory="Status code not 200";
                    }
                }).catch(function (error) {
                    self.errorHistory=error.response.data.message;
                    console.log(error.response);
                }).finally(function () {
                    self.historySpinner=false
                });
          }
        }
      },

        created() {
            eventBus.$on('dataloaded',(data)=>{
                this.successHistory="";
                this.successSettings="";
                this.successComment="";
                this.successDetails="";
                this.errorHistory="";
                this.errorDetails="";
                this.errorComment="";
                this.errorSettings="";
                this.enableEditing=false;

                this.name=data.name;
                this.phone=data.phone.toString().substr(2);
                this.oldPhone=data.phone;
                this.studentID=data.studentId;
                this.bloodGroup=data.bloodGroup;
                this.hall = parseInt(data.hall);
                this.room = data.room;
                this.address = data.address;
                this.comment = data.comment;
                this.designation = data.designation;

                let date = new Date(data.lastDonation);
                this.lastDonation= date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
                if(data.lastDonation===0){
                    this.lastDonation="No donations found";
                }
                this.availableIn=120-Math.round((Math.round((new Date()).getTime())-date.getTime())/(1000*3600*24));
                this.showDetails=true;
            });
            eventBus.$on('errorFound',(data)=>{
                console.log('Error received from network');
                this.errorDetailsLoading = data.message;
                console.log(data.message);
            });
        }
    }
</script>

<style scoped>

</style>
