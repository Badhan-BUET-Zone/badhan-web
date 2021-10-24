<template>
  <div>
    <PageTitle>
      <HelpTooltip>
        <div>
          Input information of new donor as specified below
          <ul>
            <li><b>Name: </b>String of non-zero length</li>
            <li><b>Phone: </b>Numeric string of 11 characters</li>
            <li><b>Student ID: </b>Input data type is a 7 digit number. E.g. 1605011. If department code is unknown, use
              00
            </li>
            <li><b>Blood Group: </b>Blood group of donor from dropdown</li>
            <li><b>Room: </b>Field can be null but must be a string if not null</li>
            <li><b>Address: </b>Field can be null but must be a string if not null</li>
            <li><b>Comment: </b>Field can be null but must be a string if not null</li>
            <li><b>Donation count: </b>Must be an integer number and minimum value should be 0.</li>
            <li><b>Select Hall: </b>If the hall name is unknown, the donor will be editable and accessible to members of
              all halls.
            </li>
            <li><b>Public Data: </b>If the information of the donor needs to be accessible by member of other halls,
              please put a tick here. Otherwise the donor will be restricted to be accessed only from the specified
              hall.
            </li>
            <li><b>Pick Last Donation Date: </b>If the donation count is non-zero, please specify the last donation date
              from the date picker.
            </li>
          </ul>
        </div>
      </HelpTooltip>
    </PageTitle>


    <NewPersonCard v-if="donor!==null" :donor="donor" :discard-donor="null"></NewPersonCard>

    <ContainerFlat>
      <v-btn rounded to="/donorCreation" color="secondary" style="text-decoration: none" text>
        Advanced donor creation
      </v-btn>
    </ContainerFlat>
    <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import NewPersonCard from "../components/BatchInsertion/NewPersonCard";
import PageTitle from "../components/PageTitle";
import HelpTooltip from "../components/UI Components/HelpTooltip";
import ContainerFlat from "../components/Wrappers/ContainerFlat";

export default {
  name: "SingleDonorCreation",
  components: {
    ContainerFlat,
    NewPersonCard,
    PageTitle,
    HelpTooltip
  },
  data: () => {
    return {
      donor: null
    }
  },
  computed: {
    ...mapGetters(['getHall', 'getDesignation']),
  },
  methods: {
    reset() {
      this.donor = {
        name: null,
        phone: null,
        studentId: null,
        bloodGroup: null,

        hall: this.getHall,

        address: null,
        roomNumber: null,
        comment: null,
        donationCount: 0,
        lastDonation: null,

        availableToAll: false,

        key: new Date().getTime(),
      }
    }
  },
  mounted() {
    this.reset();
  }
}
</script>

<style scoped>

</style>
