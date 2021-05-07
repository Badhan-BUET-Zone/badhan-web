<template>
    <div
        class="bg-light mb-3 col-lg-4 col-md-12 col-sm-12"
        style="height: fit-content"
    >
        <div v-if="isFilterShown">
            <!--      Filter title-->
            <h1 class="h4 p-2">Filters</h1>

            <!--      A button to hide the filters-->
            <button
                v-if="isFilterShown"
                class="h4 p-2 btn btn-outline-dark"
                style="width: 100%"
                @click="hideFilterClicked()"
            >
                Hide filters
            </button>
        </div>

        <!--    A button to show the filters-->
        <button
            v-else
            class="h4 p-2 btn btn-outline-dark"
            style="width: 100%"
            @click="showFilterClicked()"
        >
            Show filters
        </button>

        <!--    Main Filters-->
        <div v-if="isFilterShown">
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

                <v-checkbox
                    dense
                    v-model="availability"
                    :label="'Available'"

                ></v-checkbox>

                <v-checkbox
                    dense
                    v-model="notAvailability"
                    :label="'Not Available'"

                ></v-checkbox>

                <br/>

                <!--        A button to reset the form fields-->
                <v-btn rounded color="warning" @click="clearFields"> Reset</v-btn>

                <!--        The button for executing search-->
                <v-btn
                    rounded
                    color="primary"
                    :disabled="isSearchLoading"
                    :loading="isSearchLoading"
                    @click="searchClicked()"
                    class="ml-2"
                >
                    Search
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import {bloodGroups, halls} from "@/mixins/constants";
import {mapActions, mapGetters,mapMutations} from "vuex";

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
    methods: {
        ...mapActions(['search']),
        ...mapActions('notification',['notifyError']),
        ...mapMutations(['hideSearchResults','showFilter','hideFilter']),
        async searchClicked() {
            //front end input validation
            //batch number input validation
            let inputBatch = 0;
            if (this.batch === null) {
                this.batch = "";
            }

            inputBatch = parseInt(this.batch);
            if (this.batch.length === 0) {
                inputBatch = "";
            } else if (isNaN(inputBatch)) {
                this.notifyError("Please input a valid batch number");
                return;
            } else if (this.batch.length !== 2) {
                this.notifyError("Please input a 2 digit batch number");
                return;
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
        ...mapGetters(['getDesignation','getHall','isSearchLoading','isFilterShown']),
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
    },
};
</script>

<style scoped>
</style>
