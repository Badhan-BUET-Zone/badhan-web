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
          <Button :icon="'mdi-close'" :text="'Close'" :click="()=>{this.filterListMenu = false}"
                  :color="'secondary'"></Button>
          <Filters :search-clicked="searchClicked"></Filters>
        </v-sheet>
      </v-bottom-sheet>
      <v-checkbox @change="checkBoxChanged" v-model="markedByMe" label="Show donors marked by me"></v-checkbox>
    </ContainerFlat>


    <div ref="noPostFoundHolder" id="noPostFoundHolder">

    </div>

    <div style="max-width: 700px" class="mx-auto" v-if="activeDonorsLoader">
      <PersonCardNewSkeleton></PersonCardNewSkeleton>
      <PersonCardNewSkeleton></PersonCardNewSkeleton>
      <PersonCardNewSkeleton></PersonCardNewSkeleton>
    </div>

    <div style="max-width: 700px" class="mx-auto" v-else>
      <PersonCardNew v-for="donor in activeDonors" :key="donor._id" :donor="donor">

      </PersonCardNew>
    </div>
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
import {bloodGroups, halls} from "../mixins/constants";
import PersonCardNewSkeleton from "../components/PersonCardNewSkeleton";
import Button from "../components/UI Components/Button";
import NoticeCard from "../components/UI Components/NoticeCard";
import Vue from "vue";
export default {
  name: "ActiveDonors",
  components: {PersonCardNewSkeleton, Filters, PersonCardNew, PageTitle, ContainerFlat, Container, Button},
  methods: {
    ...mapActions('activeDonors', ['fetchActiveDonors']),
    ...mapActions('activeDonors', ['fetchActiveDonors']),
    async checkBoxChanged(lastValueOfCheckbox) {
      await this.search({
        ...this.lastSearched,
        markedByMe: lastValueOfCheckbox,
      });
    },
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

    createNoDonorComponent() {
      let NoticeCardClass = Vue.extend(NoticeCard);
      let instance = new NoticeCardClass();
      instance.$mount() // pass nothing
      this.$refs.noPostFoundHolder.appendChild(instance.$el)
    },
    clearNoDonorComponent(){
      if(this.$refs.noPostFoundHolder.children.length!==0){
        this.$refs.noPostFoundHolder.removeChild(this.$refs.noPostFoundHolder.children[0]);
      }
    },
    async searchActiveDonorsAndSet() {
      let payloadForGetActiveDonors = {
        bloodGroup: -1,
        hall: 5,
        batch: "",
        name: "",
        address: "",
        isAvailable: true,
        isNotAvailable: true,
        availableToAll: true,
        markedByMe: false,
      }
      this.lastSearched = payloadForGetActiveDonors;
      await this.search(payloadForGetActiveDonors);
    },
    async searchClicked(searchQueries) {
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
        markedByMe: this.markedByMe,
      }
      this.lastSearched = payloadForGetActiveDonors;
      this.filterListMenu = false;
      await this.search(payloadForGetActiveDonors);
    },
    async search(payloadForGetActiveDonors) {
      this.activeDonorsLoader = true;
      this.clearNoDonorComponent();
      await this.fetchActiveDonors(payloadForGetActiveDonors);
      this.activeDonors = this.getActiveDonors;
      if(this.activeDonors.length===0){
        this.createNoDonorComponent();
      }
      this.activeDonorsLoader = false;
    }
  },
  computed: {
    ...mapGetters('activeDonors', ['getActiveDonors']),

  },
  mounted() {
    this.searchActiveDonorsAndSet();
  },
  data: () => {
    return {
      activeDonors: [],
      activeDonorsLoader: false,
      filterListMenu: false,
      markedByMe: false,
      lastSearched: null,
    }
  }
}
</script>

<style scoped>

</style>