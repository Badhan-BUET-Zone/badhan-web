<template>
  <!--  Person card-->
  <div class="mb-2" style="width: 100%">
    <v-card
        rounded
        style="width: 100%; height: 100%"
        class="pa-1"
        @click="expansionClicked"
    >
      <v-row no-gutters>
        <v-col align-self="center" cols="4">
          <v-card
              v-if="availableInRendered > 0"
              class="ma-1 text-center"
              color="error lighten-4"
              flat
          >
            <v-card-text>
              {{ bloodGroup | numToBloodGroup }}
              <br>
              {{ availableInRendered }} day
            </v-card-text>
          </v-card>
          <v-card
              v-else
              class="text-center"
              color="success lighten-5"
              flat
          >
            <v-card-text>
              {{ bloodGroup | numToBloodGroup }}
              <br>
              <span class="text-caption">Available</span>
            </v-card-text>
          </v-card>

        </v-col>
        <v-col
            cols="8"
            align-self="center"
            class="d-flex align-content-center"
        >
          <div style="font-size: small; width: 100%" class="text-wrap pa-4">
            <b style="width: 100%">{{ name }}</b>
            <br/>
            <b>Phone: </b>
            <span v-if="phone">{{ phone.toString().substr(2) }}</span>
          </div>
        </v-col>


      </v-row>

    </v-card>

    <!--    Person card extension-->
    <v-card color="grey lighten-3" class="mt-2" v-if="showExtensionFlag">
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" sm="6">
            <span><b>Department: </b>{{ studentID | idToDept }} <br></span>
            <span v-if="address!==undefined && address!==null && address.length !==0"><b>Address:</b> {{ address }} <br></span>
            <span v-if="roomNumber!==undefined && roomNumber!==null && roomNumber.length !==0"><b>Room:</b>
              {{ roomNumber }}</span>
          </v-col>
          <v-col cols="12" sm="6">
            <span v-if="comment!==undefined && comment!==null && comment.length !==0"><b>Comment:</b> {{ comment }} (Last Updated: {{commentTime==0?'Unknown':new Date(commentTime).toLocaleString()}} )<br></span>
            <span><b>Last called: </b>
              <v-progress-circular color="primary" indeterminate v-if="callRecordFetchLoader"></v-progress-circular>
              <span v-else-if="getLastCallRecordDate!==0">{{ new Date(getLastCallRecordDate).toLocaleString() }}</span>
              <span v-else>Unknown</span>
              <br>
            </span>
            <span v-if="!callRecordFetchLoader">Called {{getCallCountInRange}} times in last 3 days</span>
          </v-col>
        </v-row>
        <div class="mt-1">
          <v-btn
              small
              rounded
              color="primary"
              v-b-modal="'detailsModal'"
              @click="loadPersonDetails()"
              :disabled="seeDetailsLoaderFlag"
              :loading="seeDetailsLoaderFlag"
          >
            <v-icon left>
              mdi-account-details
            </v-icon>
            See profile
          </v-btn>
          <v-btn :disabled="newCallRecordLoader" :loading="newCallRecordLoader" small rounded color="secondary" class="ml-2" @click="callFromDialer"
          >
            <v-icon left>
              mdi-phone
            </v-icon>
            Direct call
          </v-btn
          >
        </div>
        <div class="mt-2">
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
              >OK
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
        >Done
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {departments, bloodGroups} from "@/mixins/constants";

import {mapActions, mapGetters} from "vuex";

export default {
  name: "PersonCard",
  props: [
    "phone",
    "name",
    "bloodGroup",
    "availableIn",
    "studentID",
    "lastDonation",
    "comment",
    "address",
    "roomNumber",
    "id",
    "commentTime",
    "callRecords"
  ],
  components: {

  },
  filters: {
    idToDept(studentID) {
      return departments[Number(studentID.toString().substr(2, 2))];
    },
    numToBloodGroup(num) {
      return bloodGroups[num];
    },
  },
  data: function () {
    return {
      newDonationDate: "",
      error: "",
      success: "",

      //vuetify date picker
      menu: false,

      showExtensionFlag: false,
      seeDetailsLoaderFlag: false,
      donateLoaderFlag: false,
      availableInRendered: 0,

      newCallRecordLoader:false,
      callRecordFetchLoader: false,
      callRecordFetchCalled: false,

      // callRecords: [],
    };
  },
  computed: {
    ...mapGetters('donate', ['getDonationLoaderFlag']),
    getLastCallRecordDate(){
      let lastDate = 0;
      this.callRecords.forEach((callRecord)=>{
        if(callRecord.date> lastDate){
          lastDate = callRecord.date;
        }
      });
      return lastDate;
    },
    getCallCountInRange(){
      let count = 0;
      let todayDate = new Date().getTime();
      this.callRecords.forEach((callRecord)=>{
        if(callRecord.date> todayDate-3*24*3600*1000){
          count++;
        }
      });
      return count;
    }
  },
  mounted() {
    this.availableInRendered = this.$props.availableIn;
  },
  methods: {
    ...mapActions('donate', ['donate']),
    ...mapActions('callrecord',['postCallRecordFromCard','fetchCallRecordsForHome']),
    async callFromDialer() {
      document.location.href = "tel:+" + this.phone;
      this.newCallRecordLoader=true;
      await this.postCallRecordFromCard({donorId: this.$props.id});
      this.newCallRecordLoader = false;
      this.callRecords.push({date:new Date().getTime()})
    },
    async loadPersonDetails() {
      //   await this.$router.push("/home/details");
      await this.$router.push({
        path: "/home/details",
        query: {id: this.$props.id},
      });

    },
    async donateClicked() {
      let success = await this.donate({
        donorId: this.$props.id,
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
        if (newAvailableIn > this.availableInRendered) {
          this.availableInRendered = newAvailableIn;
        }

        this.newDonationDate = "";
      }

    },
    async expansionClicked(){
      this.showExtensionFlag = !this.showExtensionFlag;
    }
  },
};
</script>

<style scoped>
</style>
