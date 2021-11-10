<template>
  <div class="mb-2">
    <v-card
        style="width: 100%; height: 100%;" rounded
        @click="donorDetailsExpansion = !donorDetailsExpansion"
    >
      <v-row no-gutters>
        <v-col align-self="center" cols="4">
          <v-card
              v-if="availableIn > 0"
              class="text-center"
              color="errorLight"
              flat rounded
          >
            <v-card-text style="font-size: 10px;  line-height: 1.6;">
              <span>{{ bloodGroup | getBloodGroupString }}</span><br>
              <span>{{ availableIn }} day</span><br>
              <span>{{ donationCount }} donations</span>
            </v-card-text>
          </v-card>
          <v-card
              v-else
              class="text-center"
              color="successLight"
              flat rounded
          >
            <v-card-text style="font-size: 10px; line-height: 1.6;">
              <span>{{ bloodGroup | getBloodGroupString }}</span><br>
              <span>Available</span><br>
              <span>{{ donationCount }} donations</span>
            </v-card-text>
          </v-card>

        </v-col>
        <v-col
            cols="8"
            align-self="center"
            class="d-flex align-content-center"
        >
          <div style="font-size: small; width: 100%" class="text-wrap pa-2">
            <b style="width: 100%">{{name}} <v-icon v-if="markerName" small color="secondary">mdi-bookmark</v-icon></b>
            <br/>
            <b>Phone: </b>
            <span>{{phone}}</span>
            <br/>
            <b>Hall: </b>
            <span>{{hall}}</span>
          </div>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-if="donorDetailsExpansion" class="mt-2 rounded-xl" >
      <v-card-text style="font-size: small">
        <div style="float: right;">
          <v-btn @click="callFromDialer" :disabled="newCallRecordLoader" :loading="newCallRecordLoader" depressed class="ma-1" x-small fab color="green" dark><v-icon>mdi-phone</v-icon></v-btn>
          <v-btn style="text-decoration: none" :to="'/activeDonors/details?id='+id" depressed class="ma-1" x-small fab color="blue" dark><v-icon>mdi-account-details</v-icon></v-btn>
        </div>
        <span><b>Department: </b>{{department}}</span><br>
        <span><b>Address: </b>{{address}}</span><br>
        <span><b>Comment: </b>{{comment}} (Last updated: {{commentTime}})</span><br>
        <span><b>Marked by: </b>{{markerName}} (On {{markedTime}})</span><br>
        <span><b>Last called: </b>On {{lastCallRecord}}</span><br>
        <span>Called {{callRecordCount}} times in last 3 days</span>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {halls,departments} from "../mixins/constants";
import {mapActions} from "vuex";

export default {
  props:{
    donor:{
      type: Object,
    }
  },
  name: "PersonCardNew",
  mounted() {
    let donor = this.$props.donor;
    this.id = donor._id;
    this.bloodGroup = donor.bloodGroup;
    this.name = donor.name;
    this.hall = halls[donor.hall];
    this.phone = '+'+donor.phone;
    this.department = departments[parseInt(donor.studentId.substr(2,2))];
    this.address = donor.address;
    this.comment = donor.comment;
    this.commentTime = donor.commentTime===0?'Unknown':new Date(donor.commentTime).toLocaleString() ;
    this.markerName = donor.markerName;
    this.markedTime = new Date(donor.markedTime).toLocaleString();
    this.lastCallRecord = donor.lastCallRecord===0?'Unknown':new Date(donor.lastCallRecord).toLocaleString() ;
    this.callRecordCount = donor.callRecordCount;
    this.lastDonation = donor.lastDonation;
    this.donationCount = donor.donationCount;



    this.setAvailableIn(this.lastDonation);

  },
  methods:{
    ...mapActions('callrecord',['postCallRecordFromCard']),
    async callFromDialer() {
      document.location.href = "tel:+" + this.phone;
      this.newCallRecordLoader = true;
      await this.postCallRecordFromCard({donorId: this.id});
      this.newCallRecordLoader = false;
      this.lastCallRecord = new Date().toLocaleString();
      this.callRecordCount++;
    },
    setAvailableIn(donationDate) {
      this.availableIn =
          120 -
          Math.round(
              (Math.round(new Date().getTime()) - donationDate) /
              (1000 * 3600 * 24)
          );
    },
  },
  data: () => {
    return {
      id: '',
      name:'',
      hall:'',
      phone:'',
      department:'',
      address:'',
      comment:'',
      bloodGroup:-1,
      commentTime:'',
      markerName:null,
      markedTime:'',
      lastCallRecord:'',
      lastDonation:0,
      callCount:0,
      donationCount:0,
      callRecordCount:0,
      newCallRecordLoader: false,
      donorDetailsExpansion: false,

      availableIn: 0,
    }
  }
}
</script>

<style scoped>

</style>