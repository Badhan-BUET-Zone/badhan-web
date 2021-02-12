<template >
<!--  Person card-->
  <div class="mb-3 shadow p-1 bg-light rounded" >
    <a class="btn" style="width: 100%" data-toggle="collapse" :href="'#collapse'+phone">
      <div class="row">
        <div v-if="availableIn>0" class="alert alert-danger col-3" style="text-align: center; vertical-align: middle;" role="alert">
          <span style="font-size: small">{{availableIn}} day</span>
        </div>
        <div v-else="" class="alert alert-success col-3" style="text-align: center; vertical-align: middle;" role="alert">
          <span style="font-size: small">Av.</span>
        </div>
        <div class="col-6" style="font-size: small">
            <b >{{name}}</b>
          <br>
            <b>Dept: </b><span>{{studentID | idToDept}}</span>
          <br>
          <b>Phone: </b><span >{{phone.toString().substr(2)}}</span>
        </div>
        <div class="alert alert-info col-3" style="text-align: center; vertical-align: middle; font-size: small;">
          {{bloodGroup|numToBloodGroup}}
        </div>
      </div>
    </a>

<!--    Person card extension-->
    <div class="collapse" :id="'collapse'+phone">
      <div class="card card-body" style="background-color: lightgrey">
        <div>
        <button style="width: 40%" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" @click="loadPersonDetails()"> See profile</button>
        <a class="btn btn-primary" style="width: 40%" :href="'tel:+'+phone">Direct call</a>
        </div>
          <br>
        <label>Add a donation date</label>
          <datepicker v-model="newDonationDate" placeholder="Select Date"></datepicker>
        <br>
        <button class="btn btn-danger" @click="donate()" :disabled="$store.getters.getLoadingFlag || newDonationDate.length===0">Done</button>
      </div>
      <div class="alert alert-danger animated jello" role="alert" v-if="error.length!==0">
        {{error}}
      </div>
      <div class="alert alert-success animated jello" role="alert" v-if="success.length!==0">
        {{success}}
      </div>
    </div>
  </div>
</template>

<script>
    import {eventBus} from "../../../../main";
    import {departments,bloodGroups} from "../../../../constants";
    import Datepicker from 'vuejs-datepicker';

    export default {
        name: "PersonCard",
        props: ['phone','name','bloodGroup','availableIn','studentID','lastDonation'],
        components:{
          Datepicker
        },
        filters: {
            idToDept(studentID){
               return departments[Number(studentID.toString().substr(2,2))];
            },
            numToBloodGroup(num){
                return bloodGroups[num];
            }
        },
        data: function(){
            return {
                newDonationDate: '',
                error:"",
                success:'',
            }
        },
        methods: {
            loadPersonDetails(){
                console.log(this.$props.name,' details button clicked');
                this.$store.commit('setLoadingTrue');
                let self=this;
                let sendData={
                    token: self.$store.getters.getToken,
                    userPhone: self.$store.getters.getPhone,
                    donorPhone: self.$props.phone,
                };
                console.log('sendData: ',sendData);
                this.axios.post('/users/seeDetails', sendData).then(function (response) {
                    console.log('status: ',response.status);
                    if(response.status==200){
                        eventBus.$emit('dataloaded',{
                            name: response.data.name,
                            studentId:  parseInt(response.data.studentId),
                            bloodGroup: response.data.bloodGroup,
                            phone: response.data.phone,
                            hall:response.data.hall,
                            room: response.data.roomNumber,
                            address: response.data.address,
                            comment: response.data.comment,
                            designation: response.data.designation,
                            lastDonation: response.data.lastDonation
                        });
                    }else{
                        self.error="Status code not 200";
                        eventBus.$emit('errorFound',{
                            message:self.error
                        });
                    }
                }).catch(function (error) {
                    self.error=error.response.data.message;
                    eventBus.$emit('errorFound',{
                        message:self.error
                    });
                    console.log(error.response);
                }).finally(function () {
                    self.$store.commit('setLoadingFalse');
                });
            },
            donate(){
                console.log('Phone number ',this.phone,' donated on ',this.newDonationDate.getTime());
                this.error="";
                this.success="";
                let sendData = {
                    token: this.$store.getters.getToken,
                    userPhone: this.$store.getters.getPhone,
                    donorPhone: this.$props.phone,
                    date: this.newDonationDate.getTime()
                };
                console.log('send data: ',sendData);

                this.$store.commit('setLoadingTrue');
                let self=this;
                this.axios.post('/donate', sendData).then(function (response) {
                    console.log('status: ',response.status);
                    if(response.status==200){
                        console.log('Donation added successfully');
                        let newAvailableIn=120-Math.round((Math.round((new Date()).getTime())-self.newDonationDate.getTime())/(1000*3600*24));
                        console.log('newAvailableIn: ',newAvailableIn);
                        if(newAvailableIn>self.$props.availableIn){
                          self.$props.availableIn = newAvailableIn;
                        }
                        self.newDonationDate="";
                        self.success="Successfully added donation";
                    }else{
                        self.error="Status code not 200";
                    }
                }).catch(function (error) {
                    console.log('Error received');
                    self.error=error.response.data.message;
                    console.log(error.response);
                }).finally(function () {
                    self.$store.commit('setLoadingFalse');
                });
            },
        }
    }
</script>

<style scoped>

</style>
