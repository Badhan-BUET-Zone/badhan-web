<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-danger sticky-top animated slideInDown">
<!--        Badhon Icon/ Logo-->
    <img src="https://badhanweb.github.io/badhan/images/badhanlogo.png" style="width: 40px; height: 40px; background: transparent">
    <a class="navbar-brand" href="#" @click="homeClicked()">Badhan <span class="sr-only">(current)</span></a>

    <div style="height: 100%; width: 50px">
    <div v-if="$store.getters.getLoadingFlag" class="spinner-border text-light" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    </div>
        <button class="navbar-toggler" v-if="$store.getters.getToken!==null" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent" v-if="$store.getters.getToken!==null">
<!--        Hall Admin Panel button-->
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" v-if="$store.getters.getDesignation >=2">
            <a class="nav-link" href="#" @click="hallAdminPanelClicked()">Hall Admin Panel</a>
          </li>

        <!--        Super Admin Panel button-->
        <li class="nav-item" v-if="$store.getters.getDesignation === 3">
          <a class="nav-link" href="#" @click="superAdminPanelClicked()">Super Admin Panel</a>
        </li>

      </ul>

<!--      My profile link-->
            <a class="nav-item btn" @click="myProfileclicked()" data-toggle="modal" data-target="#exampleModal"> My Profile</a>

            <a class="nav-item btn" @click="signOutClicked()"> Sign Out</a>
        </div>

  </nav>
</template>

<script>
  import {eventBus} from "../main";
  import {dummyMe} from "../dummydata";

  export default {
        name: "Header",
        data: function(){
            return {
                searchString: '',

                dummyMe,
                spinnerOn: false
            }
        },
        methods: {
            homeClicked(){
                if(this.$store.getters.getToken.length===0)
                    return;
                this.$store.commit('showSearchPanel');
            },
            hallAdminPanelClicked(){
                this.$store.commit('showHallAdminPanel');
            },
            superAdminPanelClicked(){
                this.$store.commit('showSuperAdminPanel');
            },
            myProfileclicked(){
                this.$store.commit('showSearchPanel');
                let sendData={
                    token:this.$store.getters.getToken,
                    userPhone:parseInt(this.$store.getters.getPhone),
                    donorPhone:parseInt(this.$store.getters.getPhone)
                };
                console.log('sendData: ',sendData);

                this.$store.commit('setLoadingTrue');
                let self=this;

                this.axios.post('/users/seeDetails', sendData).then(function (response) {
                    console.log('status: ',response.status);
                    if(response.status==200){
                        console.log(response.data);

                        eventBus.$emit('dataloaded',{
                            name: response.data.name,
                            studentId: parseInt(response.data.studentId),
                            bloodGroup: response.data.bloodGroup,
                            phone: response.data.phone,
                            hall:response.data.hall,
                            room: response.data.roomNumber,
                            address: response.data.address,
                            designation: response.data.designation,
                            lastDonation: response.data.lastDonation,
                            comment: response.data.comment
                        });

                    }else{
                        self.error="Status code not 200";
                    }
                }).catch(function (error) {
                      eventBus.$emit('errorFound',error.response);
                      console.log('Error occured on receiving data on navbar myprofile link clicking')
                }).finally(function () {
                    self.$store.commit('setLoadingFalse');
                });
            },
            signOutClicked(){
                this.$store.commit('showSignIn');
                this.$store.commit('signOut');
            },
        },
        created() {

        }
  }
</script>

<style scoped>

</style>
