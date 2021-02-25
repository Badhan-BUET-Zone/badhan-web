<template>
  <div
    class="bg-light mb-3 col-lg-4 col-md-12 col-sm-12"
    style="height: fit-content"
  >
    <div v-if="$store.getters.isFilterShown">
      <!--      Filter title-->
      <h1 class="h4 p-2">Filters</h1>

      <!--      A button to hide the filters-->
      <button
        v-if="$store.getters.isFilterShown"
        class="h4 p-2 btn btn-outline-dark"
        style="width: 100%"
        @click="hideFilter()"
      >
        Hide filters
      </button>
    </div>

    <!--    A button to show the filters-->
    <button
      v-else
      class="h4 p-2 btn btn-outline-dark"
      style="width: 100%"
      @click="showFilter()"
    >
      Show filters
    </button>

    <!--    Main Filters-->
    <div v-if="$store.getters.isFilterShown">
      <div class="form-group">
        <!--        Input field for name-->

        <v-text-field
          v-model="name"
          outlined
          label="Name of Donor"
          clearable
        ></v-text-field>

        <v-select
          v-model="bloodGroup"
          :items="bloodGroups"
          label="Blood Group"
          outlined
        ></v-select>

        <!--        Input field for batch-->
        <v-text-field
          v-model="batch"
          outlined
          label="Batch"
          clearable
        ></v-text-field>

        <!--        Input field for hall-->
        <v-select
          v-model="hall"
          :items="availableHalls"
          label="Select Hall"
          outlined
        ></v-select>

        <v-text-field
          outlined
          label="Address"
          clearable
          v-model="address"
        ></v-text-field>

        <!--        A check box to search by availability-->
        <div class="custom-control custom-checkbox">
          <input
            v-model="availability"
            type="checkbox"
            class="custom-control-input"
            checked
            id="customCheck1"
          />
          <label class="custom-control-label" for="customCheck1">
            Available
          </label>
        </div>

        <br />

        <!--        A button to reset the form fields-->
        <v-btn rounded color="warning" @click="clearFields"> Reset </v-btn>

        <!--        The button for executing search-->
        <v-btn
          rounded
          color="primary"
          :disabled="$store.getters.isSearchLoading"
          :loading="$store.getters.isSearchLoading"
          @click="searchClick()"
          class="ml-2"
        >
          Search
        </v-btn>
        <br /><br />

        <!--        a division to show errors in the GUI-->
        <div
          class="alert alert-danger"
          role="alert"
          v-if="$store.getters.getSearchError.length !== 0"
        >
          {{ $store.getters.getSearchError }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bloodGroups, halls } from "@/constants";

export default {
  name: "Filters",
  data: function () {
    return {
      //filter input fields
      name: "",
      bloodGroup: -1,
      batch: "",
      address: "",
      hall: halls[this.$store.getters.getHall],
      availability: true,
      archiveSearch: false,

      //GUI flags
      filterShown: true,

      //imported constants
      halls,
      bloodGroups,
    };
  },
  methods: {
    async searchClick() {
      //front end input validation
      this.$store.commit("clearSearchError");
      //batch number input validation
      let inputBatch = 0;
      inputBatch = parseInt(this.batch);
      if (this.batch.length === 0) {
        inputBatch = "";
      } else if (isNaN(inputBatch)) {
        this.$store.commit(
          "setSearchError",
          "Please input a valid batch number"
        );
        return;
      } else if (this.batch.length !== 2) {
        this.$store.commit(
          "setSearchError",
          "Please input a 2 digit batch number"
        );
        return;
      }
      // if(this.$store.getters.getDesignation !==3){
      //   this.hall =  halls[this.$store.getters.getHall];
      // }

      //name input validation
      let inputName = this.processName(this.name);
      if (inputName.length === 0) {
        inputName = "";
      }

      let inputAddress = this.processName(this.address);
      if(inputAddress.length===0){
        inputAddress="";
      }

      this.$store.dispatch("search", {
        inputName: inputName,
        bloodGroup: this.bloodGroup,
        inputBatch: inputBatch,
        hall: this.hall,
        availability: this.availability,
        inputAddress: inputAddress
      });
    },

    clearFields() {
      this.batch = "";
      //this.hall=halls[this.$store.getters.getHall];
      if (this.$store.getters.getDesignation === 3) {
        this.hall = -1;
      }
      this.bloodGroup = -1;
      this.name = "";
      this.error = "";
    },
    showFilter() {
      this.$store.commit("showFilter");
    },
    hideFilter() {
      this.$store.commit("hideFilter");
    },

    processName(name) {
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
  },
  created() {},

  mounted() {
  },
  computed: {
    availableHalls() {
      if (this.$store.getters.getDesignation !== null) {
        if (this.$store.getters.getDesignation === 3) {
          return halls;
        } else {
          //covid support
          //return [halls[this.$store.getters.getHall], halls[7]];
          return [halls[this.$store.getters.getHall], halls[7],halls[8]];
        }
      }
    },
  },
};
</script>

<style scoped>
</style>
