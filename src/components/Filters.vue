<template>
  <v-card rounded>
    <!--    Main Filters-->
    <v-card-text>
      <v-form>
        <v-container>
          <v-card-title class="font-weight-bold">
          Filters
          <HelpTooltip>
            <div>
              You may choose any one of the following options.
              <ul>
                <li><b>Name: </b>Search any donor by name</li>
                <li><b>Blood group: </b>Search any donor by blood group</li>
                <li><b>Batch: </b>Donors from the specified batch will be fetched. Please enter a valid numeric two digit
                  batch number (e.g. 16, 17 etc.)
                </li>
                <li><b>Address/ Comment: </b>Those donors will be shown whose comment or address field consists your written
                  text
                </li>
                <li><b>Public Data: </b>If you choose this option, donors who are marked as public data will be fetched.
                  Donors who were previously in "Attached/Covid" database are in this search criteria
                </li>
                <li><b>Specify Hall: </b>If you choose this option, donors of specified hall will be fetched. You can only
                  search your own hall for donors in such case.
                </li>
                <li><b>Available: </b>If you specify this option, donors who have given blood before 120 days will be
                  fetched. These donors are basically available for donations.
                </li>
                <li><b>Not Available: </b>If you specify this option, donors who have given blood in a span of 120 days will
                  be shown
                </li>
              </ul>
            </div>
          </HelpTooltip>
          </v-card-title>
          <!--        Input field for name-->
          <v-text-field
              rounded
              v-model="name"
              :hint="'Search any donor by name'"
              outlined
              label="Name of Donor"
              clearable
              dense
          ></v-text-field>

          <v-select
              rounded
              v-model="bloodGroup"
              :items="bloodGroups"
              label="Blood Group"
              outlined
              dense
          ></v-select>

          <!--        Input field for batch-->
          <v-text-field
              rounded
              v-model="batch"
              outlined
              label="Batch"
              clearable
              dense
              @blur="$v.batch.$touch()"
              :error-messages="batchErrors"
          ></v-text-field>


          <!--        Input field for hall-->
          <v-text-field
              rounded
              outlined
              label="Address/ Comment"
              clearable
              v-model="address"
              dense
          ></v-text-field>

          <v-radio-group row v-model="radios" dense>
            <v-radio value="AvailableToAll">
              <template v-slot:label>
                Public Data
              </template>
            </v-radio>
            <v-radio value="SpecifyHall">
              <template v-slot:label>
                Specify hall
              </template>
            </v-radio>
          </v-radio-group>
          <v-select
              :disabled="radios!== 'SpecifyHall'"
              rounded
              v-model="hall"
              :items="availableHalls"
              label="Select Hall"
              outlined
              dense
              @blur="$v.hall.$touch()" :error-messages="hallErrors"
          ></v-select>
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
          <v-btn rounded color="secondary" @click="clearFields">
            <v-icon left>
              mdi-refresh
            </v-icon>
            Reset
          </v-btn>

          <!--        The button for executing search-->
          <v-btn
              rounded
              color="primary"
              :disabled="isSearchLoading || $v.$anyError"
              :loading="isSearchLoading"
              @click="searchClickInsideComponent"
              class="ml-2"
          >
            <v-icon left>
              mdi-magnify
            </v-icon>

            Search
          </v-btn>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import HelpTooltip from "../components/UI Components/HelpTooltip";
import {bloodGroups, halls} from "../mixins/constants";
import {maxLength, minLength, numeric, required} from "vuelidate/lib/validators";
import {mapGetters} from "vuex";

export default {
  name: "Filters",
  props:{
    searchClicked:{
      type: Function,
      required: true
    }
  },
  components: {
    HelpTooltip
  },
  methods: {
    clearFields() {
      this.$v.$reset();
      this.batch = "";
      this.hall = halls[this.getHall];
      this.bloodGroup = -1;
      this.name = "";
      this.error = "";
      this.address = "";
      this.showFab = false;
    },
    async searchClickInsideComponent(){
      await this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }
      this.searchClicked({
        name: this.name,
        bloodGroup: this.bloodGroup,
        batch: this.batch,
        hall: this.hall,
        availability: this.availability,
        notAvailability: this.notAvailability,
        address: this.address,
        availableToAll: this.radios
      })
    },
  },
  validations: () => {
    return {
      batch: {
        minLength: minLength(2),
        maxLength: maxLength(2),
        numeric
      },
      hall: {
        required,
        permission(hall) {
          //COVID DATABASE
          return !(this.getHall !== this.halls.indexOf(hall) && this.halls.indexOf(hall) !== 7 && this.halls.indexOf(hall) !== 8 && this.getDesignation !== 3);
        }
      },
    }
  },
  computed: {
    ...mapGetters(['getDesignation', 'getHall']),
    availableHalls() {
      if (this.getDesignation !== null) {
        if (this.getDesignation === 3) {
          return halls.slice(0, 7);
        } else {
          return [halls[this.getHall]];
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
    },
    hallErrors() {
      const errors = []
      if (!this.$v.hall.$dirty) return errors
      !this.$v.hall.required && errors.push('Hall is required');
      !this.$v.hall.permission && errors.push('You are not allowed to create donor for this hall')
      return errors
    },
  },
  data: function () {
    return {
      name: "",
      bloodGroup: -1,
      batch: "",
      address: "",
      hall: halls[this.$store.getters.getHall],
      availability: true,
      notAvailability: false,

      //GUI flags
      filterShown: true,

      //imported constants
      halls,
      bloodGroups,

      showTooltip: false,
      showFilterHelpTooltip: false,

      radios: 'AvailableToAll',
      showFab: false,

      downloadCSVMessageFlag: false,
      isSearchLoading: false,
    };
  },
}
</script>

<style scoped>

</style>