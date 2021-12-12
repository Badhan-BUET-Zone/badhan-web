<template>
  <!--  Person card-->
  <div class="mb-2" style="width: 100%">
    <v-card
        style="width: 100%; height: 100%;"

        @click="expansionClicked" rounded
    >
      <v-row no-gutters>
        <v-col align-self="center" cols="4">
          <v-card
              v-if="availableInRendered > 0"
              class="text-center"
              color="errorLight"
              flat rounded
          >
            <v-card-text style="font-size: 10px;  line-height: 1.6;">
              <span>{{ bloodGroup | getBloodGroupString }}</span><br>
              <span>{{ availableInRendered }} day</span><br>
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
            <b style="width: 100%">{{ name }} <v-icon v-if="markedBy" small color="secondary">mdi-bookmark</v-icon></b>
            <br/>
            <b>Phone: </b>
            <span v-if="phone">{{ phone.toString().substr(2) }}</span>
            <br>
            <b>Hall: </b>
            <span>{{ hall |getHallName }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!--    Person card extension-->
    <transition name="slide-fade-down-snapout" mode="out-in">
      <v-card class="mt-2 rounded-xl" v-if="showExtensionFlag">
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" sm="6">
              <span><b>Department: </b>{{ studentId | idToDept }} <br></span>
              <span v-if="address!==undefined && address!==null && address.length !==0"><b>Address:</b> {{
                  address
                }} <br></span>
              <span v-if="roomNumber!==undefined && roomNumber!==null && roomNumber.length !==0"><b>Room:</b>
              {{ roomNumber }}</span>
            </v-col>
            <v-col cols="12" sm="6">
              <span><b>Last called: </b>
              <span v-if="lastCalled">{{ new Date(lastCalled).toLocaleString() }}</span>
              <span v-else>Unknown</span>
              <br>
            </span>
              <span>Called {{ callRecordCount }} times in last 3 days</span>
              <span v-if="comment!==undefined && comment!==null && comment.length !==0"><VueMarkdown>**Comment:** {{comment }} (Last Updated:
                {{commentTime == 0 ? 'Unknown' : new Date(commentTime).toLocaleString() }} )</VueMarkdown> </span>
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
            <v-btn :disabled="newCallRecordLoader" :loading="newCallRecordLoader" small rounded color="secondary"
                   class="ml-2" @click="callFromDialer"
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
    </transition>
  </div>
</template>

<script>
import { departments } from '../../mixins/constants'
import { fixBackSlash } from '../../mixins/helpers'
import { mapActions, mapGetters } from 'vuex'
import VueMarkdown from 'vue-markdown'

export default {
  name: 'PersonCard',
  props: [
    'person'
  ],
  components: { VueMarkdown },
  filters: {
    idToDept (studentId) {
      return departments[Number(studentId.toString().substr(2, 2))]
    }
  },
  data: function () {
    return {
      newDonationDate: '',
      error: '',
      success: '',

      // vuetify date picker
      menu: false,

      showExtensionFlag: false,
      seeDetailsLoaderFlag: false,
      donateLoaderFlag: false,
      availableInRendered: 0,

      newCallRecordLoader: false,

      profileDetailsClicked: false,
      profileDetailsLoading: false,

      phone: null,
      name: null,
      bloodGroup: null,
      availableIn: null,
      studentId: null,
      lastDonation: 0,
      comment: '(Unknown)',
      address: '(Unknown)',
      roomNumber: '(Unknown)',
      id: null,
      hall: null,
      commentTime: 0,
      callRecordCount: 0,
      donationCount: 0,

      markedBy: null,
      lastCalled: null

    }
  },
  computed: {
    ...mapGetters('donate', ['getDonationLoaderFlag'])
  },
  mounted () {
    this.setInformation(this.person)
  },
  methods: {
    ...mapActions('donate', ['donate']),
    ...mapActions('callrecord', ['postCallRecordFromCard']),
    async callFromDialer () {
      document.location.href = 'tel:+' + this.phone
      this.newCallRecordLoader = true
      await this.postCallRecordFromCard({ donorId: this.id })
      this.newCallRecordLoader = false
      // this.callRecords.push({ date: new Date().getTime() })
      this.lastCalled = new Date().getTime()
      this.callRecordCount++
    },
    async loadPersonDetails () {
      await this.$router.push({
        path: '/home/details',
        query: { id: this.id }
      })
    },
    async donateClicked () {
      const success = await this.donate({
        donorId: this.id,
        newDonationDate: this.newDonationDate
      })

      if (success) {
        this.setAvailableIn(this.newDonationDate)

        this.newDonationDate = ''
      }
    },
    async expansionClicked () {
      this.showExtensionFlag = !this.showExtensionFlag
    },

    setAvailableIn (donationDate) {
      const newAvailableIn =
          120 -
          Math.round(
            (Math.round(new Date().getTime()) -
                  new Date(donationDate).getTime()) /
              (1000 * 3600 * 24)
          )
      if (newAvailableIn > this.availableInRendered) {
        this.availableInRendered = newAvailableIn
      }
    },

    setInformation (person) {
      this.setAvailableIn(person.lastDonation)
      this.phone = person.phone
      this.name = person.name
      this.hall = person.hall
      this.bloodGroup = person.bloodGroup
      this.studentId = person.studentId
      this.lastDonation = person.lastDonation
      this.comment = fixBackSlash(person.comment)
      this.address = person.address
      this.roomNumber = person.roomNumber
      this.id = person._id
      this.commentTime = person.commentTime
      this.callRecordCount = person.callRecordCount
      this.donationCount = person.donationCount
      this.markedBy = person.marker.name
      this.lastCalled = person.lastCalled
    }

  }
}
</script>

<style scoped>
</style>
