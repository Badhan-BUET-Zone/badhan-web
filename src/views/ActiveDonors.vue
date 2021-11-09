<template>
  <div>
    <PageTitle></PageTitle>
    <ContainerFlat>
      <v-bottom-sheet
          v-model="filterListMenu"
      >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                rounded
                small
                v-bind="attrs"
                v-on="on"
            >
              <v-icon left>
                mdi-filter-outline
              </v-icon>
              Filters
            </v-btn>
          </template>
        <v-sheet
            class="text-center"
        >
            <Button :icon="'mdi-close'" :text="'Close'" :click="()=>{this.filterListMenu = false}" :color="'secondary'"></Button>
            <Filters :search-clicked="searchClicked"></Filters>
        </v-sheet>
      </v-bottom-sheet>
    </ContainerFlat>

    <div style="max-width: 700px" class="mx-auto" v-if="activeDonorsLoader">
      <PersonCardNewSkeleton></PersonCardNewSkeleton>
      <PersonCardNewSkeleton></PersonCardNewSkeleton>
      <PersonCardNewSkeleton></PersonCardNewSkeleton>
    </div>

    <div style="max-width: 700px" class="mx-auto" v-else>
      <PersonCardNew v-for="donor in activeDonors" :key="donor._id" :donor="donor">

      </PersonCardNew>
    </div>
    <v-card>
      <v-card-text>
        Page under construction <v-icon>mdi-hammer</v-icon>
      </v-card-text>
    </v-card>
    <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import PageTitle from "../components/PageTitle";

import Container from "../components/Wrappers/Container";
import ContainerFlat from "../components/Wrappers/ContainerFlat";
import {mapActions, mapGetters} from "vuex";
import PersonCardNew from "../components/PersonCardNew";
import Filters from "../components/Filters";
import {bloodGroups,halls} from "../mixins/constants";
import PersonCardNewSkeleton from "../components/PersonCardNewSkeleton";
import Button from "../components/UI Components/Button";

export default {
  name: "ActiveDonors",
  components: {PersonCardNewSkeleton, Filters, PersonCardNew, PageTitle,ContainerFlat, Container,Button},
  methods:{
    ...mapActions('activeDonors',['fetchActiveDonors']),
    processName(name) {
      if (name === null) {
        return "";
      }
      let newName = name.toLowerCase();
      let nameWithoutWs = "";
      for (let i = 0; i < newName.length; i++) {
        let currentChar = newName.charAt(i);
        if (currentChar < "a" || currentChar > "z") {
          continue;
        }
        nameWithoutWs += currentChar;
      }
      return nameWithoutWs;
    },
    async searchActiveDonorsAndSet(){
      let payloadForGetActiveDonors = {
        bloodGroup:-1,
        hall:5,
        batch:"",
        name:"",
        address:"",
        isAvailable:true,
        isNotAvailable:true,
        availableToAll:true,
        markedByMe:false,
      }
      this.activeDonorsLoader=true;
      await this.fetchActiveDonors(payloadForGetActiveDonors);
      this.activeDonors = this.getActiveDonors;
      this.activeDonorsLoader=false;
    },
    async searchClicked(searchQueries){
      let inputBatch = 0;

      if (searchQueries.batch === null) {
        searchQueries.batch = "";
      }

      inputBatch = parseInt(searchQueries.batch);
      if (searchQueries.batch.length === 0) {
        inputBatch = "";
      }

      //name input validation
      let inputName = this.processName(searchQueries.name);
      if (inputName.length === 0) {
        inputName = "";
      }

      let inputAddress = this.processName(searchQueries.address);
      if (inputAddress.length === 0) {
        inputAddress = "";
      }
      let payloadForGetActiveDonors = {
        name: inputName,
        bloodGroup: bloodGroups.indexOf(searchQueries.bloodGroup),
        batch: inputBatch.toString(),
        hall: halls.indexOf(searchQueries.hall),
        isAvailable: searchQueries.availability,
        isNotAvailable: searchQueries.notAvailability,
        address: inputAddress,
        availableToAll: searchQueries.availableToAll === 'AvailableToAll',
        markedByMe: false,
      }
      this.filterListMenu=false;
      this.activeDonorsLoader=true;
      await this.fetchActiveDonors(payloadForGetActiveDonors);
      this.activeDonors = this.getActiveDonors;
      this.activeDonorsLoader=false;
    }
  },
  computed:{
    ...mapGetters('activeDonors',['getActiveDonors']),

  },
  mounted() {
    this.searchActiveDonorsAndSet();
  },
  data: () => {
    return {
      activeDonors:[],
      activeDonorsLoader: false,
      filterListMenu:false,
    }
  }
}
</script>

<style scoped>

</style>