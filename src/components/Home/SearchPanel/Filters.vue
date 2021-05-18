<template>
  <div
      class="mb-3 col-lg-4 col-md-12 col-sm-12"
      style="height: fit-content"
  >
    <div class="ml-5">
      <v-row>
        <!--      Filter title-->
        <v-col><h5>Filters</h5></v-col>

        <v-col>
          <v-btn small @click="toggleFilterClicked()" rounded>
            <span v-if="!isFilterShown">Show Filters</span>
            <span v-else>Hide Filters</span>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!--    Main Filters-->

    <v-form v-if="isFilterShown">
      <v-container>
        <!--        Input field for name-->
        <v-text-field
            v-model="name"
            outlined
            label="Name of Donor"
            clearable
            dense
        ></v-text-field>

        <v-select
            v-model="bloodGroup"
            :items="bloodGroups"
            label="Blood Group"
            outlined
            dense
        ></v-select>

        <!--        Input field for batch-->
        <v-text-field
            v-model="batch"
            outlined
            label="Batch"
            clearable
            dense
            @blur="$v.batch.$touch()"
            :error-messages="batchErrors"
        ></v-text-field>

        <!--        Input field for hall-->
        <v-select
            v-model="hall"
            :items="availableHalls"
            label="Select Hall"
            outlined
            dense
        ></v-select>

        <v-text-field
            outlined
            label="Address"
            clearable
            v-model="address"
            dense
        ></v-text-field>

        <v-row>
          <v-col>
            <v-checkbox
                dense
                v-model="availability"
                :label="'Available'"
            ></v-checkbox>
          </v-col>
          <v-col>
            <v-checkbox
                dense
                v-model="notAvailability"
                :label="'Not Available'"
            ></v-checkbox>
          </v-col>
        </v-row>

        <!--        A button to reset the form fields-->
        <v-btn rounded color="warning" @click="clearFields"> Reset</v-btn>

        <!--        The button for executing search-->
        <v-btn
            rounded
            color="primary"
            :disabled="isSearchLoading || $v.$anyError"
            :loading="isSearchLoading"
            @click="searchClicked()"
            class="ml-2"
        >
          Search
        </v-btn>
      </v-container>
    </v-form>

  </div>
</template>

<script>
import {bloodGroups, halls} from "@/mixins/constants";
import {mapActions, mapGetters, mapMutations} from "vuex";
import {minLength, maxLength, numeric} from 'vuelidate/lib/validators'

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
      notAvailability: false,
      archiveSearch: false,

      //GUI flags
      filterShown: true,

      //imported constants
      halls,
      bloodGroups,
    };
  },
  validations: {
    batch: {
      minLength: minLength(2),
      maxLength: maxLength(2),
      numeric
    },
  },
  methods: {
    ...mapActions(['search']),
    ...mapActions('notification', ['notifyError']),
    ...mapMutations(['hideSearchResults', 'showFilter', 'hideFilter', 'toggleFilter']),
    async searchClicked() {
      await this.$v.$touch();
      if(this.$v.$anyError){
        return;
      }

      let inputBatch = 0;
      if (this.batch === null) {
        this.batch = "";
      }

      inputBatch = parseInt(this.batch);
      if (this.batch.length === 0) {
        inputBatch = "";
      }

      //name input validation
      let inputName = this.processName(this.name);
      if (inputName.length === 0) {
        inputName = "";
      }


      let inputAddress = this.processName(this.address);
      if (inputAddress.length === 0) {
        inputAddress = "";
      }

      this.search({
        inputName: inputName,
        bloodGroup: this.bloodGroup,
        inputBatch: inputBatch,
        hall: this.hall,
        availability: this.availability,
        notAvailability: this.notAvailability,
        inputAddress: inputAddress
      });
    },

    clearFields() {
      this.$v.$reset();
      this.batch = "";
      if (this.getDesignation === 3) {
        this.hall = -1;
      }
      this.bloodGroup = -1;
      this.name = "";
      this.error = "";
      this.address = "";
      this.hideSearchResults();
    },
    showFilterClicked() {
      this.showFilter();
    },
    hideFilterClicked() {
      this.hideFilter();
    },
    toggleFilterClicked() {
      this.toggleFilter();
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
  },
  created() {
  },

  mounted() {
  },
  computed: {
    ...mapGetters(['getDesignation', 'getHall', 'isSearchLoading', 'isFilterShown']),
    availableHalls() {
      if (this.getDesignation !== null) {
        if (this.getDesignation === 3) {
          return halls;
        } else {
          //covid support
          //return [halls[this.getHall], halls[7]];
          return [halls[this.getHall], halls[7], halls[8]];
        }
      }
    },
    batchErrors() {
      const errors = []
      if (!this.$v.batch.$dirty) return errors
      !this.$v.batch.minLength && errors.push('Batch number must be of 2 digits')
      !this.$v.batch.maxLength && errors.push('Batch number must be of 2 digits')
      !this.$v.batch.numeric && errors.push('Batch number must be numeric')
      return errors
    }
  },
};
</script>

<style scoped>
</style>
