<template>
  <div class="mb-2">
    <v-card
        style="width: 100%; height: 100%;" rounded
        @click="donorDetailsExpansion = !donorDetailsExpansion"
    >
      <v-row no-gutters>
        <v-col align-self="center" cols="4">
          <v-card
              class="text-center"
              color="successLight"
              flat rounded
          >
            <v-card-text>
              <span>B+</span><br>
              <span>2 donations</span>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
            cols="8"
            align-self="center"
            class="d-flex align-content-center"
        >
          <div style="font-size: small; width: 100%" class="text-wrap pa-2">
            <b style="width: 100%">{{name}}</b>
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
          <v-btn :to="'/activeDonors/details?id='+id" depressed class="ma-1" x-small fab color="blue" dark><v-icon>mdi-account-details</v-icon></v-btn>
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
    this.name = donor.name;
    this.hall = halls[donor.hall];
    this.phone = '+'+donor.phone;
    this.department = departments[parseInt(donor.studentId.substr(2,2))];
    this.address = donor.address;
    this.comment = donor.comment;
    this.commentTime = donor.commentTime;
    this.markerName = donor.markerName;
    this.markedTime = donor.markedTime;
    this.lastCallRecord = donor.lastCallRecord;
    this.callRecordCount = donor.callRecordCount;

  },
  methods:{
    ...mapActions('callrecord',['postCallRecordFromCard']),
    async callFromDialer() {
      document.location.href = "tel:+" + this.phone;
      this.newCallRecordLoader = true;
      await this.postCallRecordFromCard({donorId: this.id});
      this.newCallRecordLoader = false;
      this.lastCallRecord = new Date().getTime();
      this.callRecordCount++;
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
      commentTime:'',
      markerName:'',
      markedTime:'',
      lastCallRecord:'',
      callCount:0,
      callRecordCount:0,
      newCallRecordLoader: false,
      donorDetailsExpansion: false,
    }
  }
}
</script>

<style scoped>

</style>