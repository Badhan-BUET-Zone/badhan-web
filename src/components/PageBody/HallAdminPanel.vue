<template >
  <div class="row">
  <div class="jumbotron col-lg-6 col-md-12 col-sm-12 animated fadeIn" style="height: fit-content">
    <div>
      <p>Archive: (CAUTION)</p>
      <div class="form-group row">
        <label class="col-sm-4 col-form-label">Enter batch number to be archived: </label>
        <div class="col-sm-8">
          <input type="text" v-model="archiveBatch"class="form-control">
        </div>
        <label class="col-sm-4 col-form-label">Enter your password: </label>
        <div class="col-sm-8">
          <input type="password" v-model="password"class="form-control">
        </div>
        <br>
        <div class="col-sm-8">
        <button class="btn btn-danger" @click="archiveClicked()">Archive batch</button>
        </div>
      </div>
      <div class="alert alert-danger animated jello" role="alert" v-if="errorArchive.length!==0">
        {{errorArchive}}
      </div>
    </div>
  </div>
    <div class="card col-lg-6 col-md-12 col-sm-12 p-4 animated fadeIn">
      <h4>Create New Donor</h4>
      <div id="accordion">
        <div class="card">
          <div class="card-header" id="headingOne">
            <h5 class="mb-0">
              <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Person Details
              </button>
            </h5>
          </div>
          <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
            <div class="card-body">
              <div class="form-group row required">
                <label class="col-sm-4 col-form-label control-label">Name</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control " v-model="name" placeholder="Enter name of donor">
                </div>
              </div>
              <div class="form-group row required">
                <label class="col-sm-4 col-form-label control-label">Phone</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="phone" placeholder="Enter 11 digit phone number">
                </div>
              </div>
              <div class="form-group row required">
                <label class="col-sm-4 col-form-label control-label">Blood Group: </label>
                <div class="col-sm-8">
                  <select class="form-control" v-model="bloodGroup">
                    <option v-for="(blood, index) in bloodGroups" :value="index">{{blood}}</option>
                  </select>
                </div>
              </div>
              <div class="form-group row required">
                <label class="col-sm-4 col-form-label control-label">Batch</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="batch" placeholder="Enter 2 digit batch number">
                </div>
              </div>
              <div class="form-group row required">
                <label class="col-sm-4 col-form-label control-label">Department: </label>
                <div class="col-sm-8">
                  <select class="form-control" v-model="department">
                    <option v-for="(dept, index) in departments" :value="index" v-if="dept!=='NULL'">{{dept}}</option>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-4 col-form-label">Roll</label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="roll" placeholder="Enter 3 digit roll number">
                </div>
              </div>
              <div class="form-group row required">
                <label class="col-sm-4 col-form-label control-label">Hall: </label>
                <div class="col-sm-8">
                  <select class="form-control" v-model="hall">
                    <option v-for="(oneHall, index) in halls" :value="index" v-if="$store.getters.getDesignation ===3 || $store.getters.getHall===index || index===7">{{oneHall}}</option>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-4 col-form-label">Room: </label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="roomNumber" placeholder="Enter room number">
                </div>
              </div>
              <div class="form-group row">
                <label class="col-sm-4 col-form-label">Address: </label>
                <div class="col-sm-8">
                  <input type="text" class="form-control" v-model="address" placeholder="Enter address">
                </div>
              </div>
            </div>
          </div>
        </div>
<!--        <div class="card">-->
<!--          <div class="card-header" id="headingTwo">-->
<!--            <h5 class="mb-0">-->
<!--              <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">-->
<!--                Settings-->
<!--              </button>-->
<!--            </h5>-->
<!--          </div>-->
<!--          <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">-->
<!--            <div class="card-body">-->
<!--              <div>-->
<!--                <label>Promote this member to volunteer</label>-->
<!--                <div class="form-group row">-->
<!--                  <label class="col-sm-4 col-form-label">New Password: </label>-->
<!--                  <div class="col-sm-8">-->
<!--                    <input type="password" class="form-control">-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="form-group row">-->
<!--                  <label class="col-sm-4 col-form-label">Confirm Password: </label>-->
<!--                  <div class="col-sm-8">-->
<!--                    <input type="password" class="form-control">-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <br>
      <div class="input-group mb-3">
        <label class="col-sm-4 col-form-label">Add a comment</label>
        <input type="text" class="form-control" v-model="comment">
      </div>

      <div class="input-group mb-3">
        <label class="col-sm-4 col-form-label">Add a donation date</label>
        <datepicker v-model="newDonationDate" placeholder="Select Date"></datepicker>
      </div>
      <br>
      <button class="btn btn-success" @click="createDonor">Save Donor</button>
      <br>
      <div class="alert alert-danger animated jello" role="alert" v-if="errorAddDonor.length!==0">
        {{errorAddDonor}}
      </div>
      <div class="alert alert-success animated jello" role="alert" v-if="successAddDonor.length!==0">
        {{successAddDonor}}
      </div>
    </div>
</div>
</template>

<script>

  import {bloodGroups,halls,departments} from "../../constants";
  import Datepicker from 'vuejs-datepicker';

  export default {
        name: "HallAdminPanel",
        data: function(){
          return {
              //new donor
              phone:'',
              bloodGroup:-1,
              hall:this.$store.getters.getHall,
              name:'',
              // studentId:'',
              address:'',
              roomNumber:'',
              batch: '',
              roll: '',
              department:'',

              password:"",
              comment:"",
              newDonationDate:"",

              //error messages
              errorArchive: "route archive not enabled",
              errorAddDonor: "",
              successArchive: "",
              successAddDonor:"",

              //archive variables
              archiveBatch:"",

              //constants
              bloodGroups,
              halls,
              departments,

          }
        },
      components:{
          Datepicker
      },
        methods:{
          archiveClicked(){
            console.log("Archive button clicked: ");
            console.log("password: ",this.password);
            console.log("archiveBatch: ",this.archiveBatch);

            //SIMULATION START
            setTimeout(()=>{
                console.log("Archive complete");

            },2000);
            //SIMULATION STOP
          },
            clearFields(){
                this.phone='';
                this.bloodGroup=-1;
                this.hall=this.$store.getters.getHall;
                this.name='';
                this.studentId='';
                this.address='';
                this.roomNumber='';
                this.batch="";
                this.roll='';
                this.department='';
                this.batch='';
                this.password="";
                this.newDonationDate="";
                this.comment="";
            },
            createDonor(){
              console.log('create Donor clicked');

              this.errorAddDonor="";
              this.successAddDonor="";

              //input validation
                if(isNaN(this.batch)||this.batch.length!==2){
                    this.errorAddDonor='Please enter valid batch number';
                    console.log('Enter valid batch number');
                    return;
                }

                if(this.department==''){
                    this.errorAddDonor='Please enter department of donor';
                    console.log('Please enter department of donor');
                    return;
                }

                if(this.roll==''){
                    this.roll='000';
                }

                if(this.bloodGroup==-1){
                    console.log('Blood group can\'t be left blank');
                    this.errorAddDonor = "Please enter blood group";
                    return;
                }
                if(this.name.length===0){
                    console.log('Name field can\'t be empty');
                    this.errorAddDonor="Please enter the name of donor";
                    return;
                }
                if(this.phone.toString().length===0){
                    console.log('Please enter the phone number of donor');
                    this.errorAddDonor="Please enter the phone number of donor";
                    return;
                }
                if(isNaN(this.phone)){
                    console.log('Please enter a valid phone number');
                    this.errorAddDonor="Please enter a valid phone number";
                    return;
                }
                if(this.phone.toString().length!==11){
                    console.log('Phone number must be of 11 digits');
                    this.errorAddDonor="Please enter an 11 digit phone number";
                    return;
                }

                if(this.hall===-1){
                    console.log('Hall name can\'t be left blank');
                    this.errorAddDonor="Please enter a hall name";
                    return;
                }
                if(this.newDonationDate===""){
                  this.newDonationDate=new Date(0);
                }

                let newStudentId=this.batch;
                if(this.department<10){
                    newStudentId+='0';
                }
                newStudentId+=(this.department+this.roll);
              let sendData={
                  token:this.$store.getters.getToken,
                  userPhone: this.$store.getters.getPhone,
                  phone: parseInt('88'+this.phone),
                  bloodGroup:this.bloodGroup,
                  hall:this.hall,
                  name:this.name,
                  studentId:parseInt(newStudentId),
                  address:this.address,
                  roomNumber:this.roomNumber,
                  comment: this.comment,
                  lastDonation: this.newDonationDate.getTime()
              };
                console.log('sendData: ',sendData);

                let self = this;
                this.$store.commit('setLoadingTrue');
                this.axios.post('/insert', sendData).then(function (response) {
                    //01823472762 test1234
                    console.log('status: ',response.status);
                    if(response.status==200){
                        console.log('donor save successful');
                        self.successAddDonor="Donor added successfully";
                        self.clearFields();
                    }else{
                        self.errorAddDonor="Status code not 200";
                    }
                }).catch(function (error) {
                    self.errorAddDonor=error.response.data.message;
                    console.log(error.response);
                }).finally(function () {
                    self.$store.commit('setLoadingFalse');
                });
            }
        },
    }
</script>

<style scoped>
  .form-group.required .control-label:after {
    content:"*";
    color:red;
  }
</style>
