<template>
    <div class="bg-light mb-3 col-lg-4 col-md-12 col-sm-12 animated slideInDown" style="height: fit-content">
        <div v-if="filterShown">

            <!--      Filter title-->
            <h1 class="h4 p-2">
                Filters
            </h1>

            <!--      A button to hide the filters-->
            <button v-if="filterShown" class="h4 p-2 btn btn-outline-dark" style="width: 100%" @click="hideFilter()">
                Hide filters
            </button>
        </div>

        <!--    A button to show the filters-->
        <button v-else="" class="h4 p-2 btn btn-outline-dark animated fadeInDown" style="width: 100%"
                @click="showFilter()">
            Show filters
        </button>

        <!--    Main Filters-->
        <div v-if="filterShown">
            <div class="form-group animated fadeIn">

                <!--        Input field for name-->
                <label>
                    Name of Donor:
                </label>
                <input class="form-control" v-model="name" type="text" placeholder="Name">

                <!--        Input field for blood group-->
                <label>
                    Blood Group:
                </label>
                <select v-model="bloodGroup" class="form-control">
                    <option v-for="(blood,index) in bloodGroups">
                        {{ blood }}
                    </option>
                </select>
                <br>

                <!--        Input field for batch-->
                <label>
                    Batch:
                </label>
                <input class="form-control" v-model="batch" type="text" placeholder="Batch number (2 digits)">
                <br>

                <!--        Input field for hall-->
                <label>
                    Hall:
                </label>
                <select v-model="hall" class="form-control">
                    <option v-for="(oneHall,index) in halls"
                            v-if="$store.getters.getDesignation===3 || $store.getters.getHall=== halls.indexOf(oneHall) || halls.indexOf(oneHall)===7">
                        {{ oneHall }}
                    </option>
                </select>
                <br>

                <!--        A check box to search by availability-->
                <div class="custom-control custom-checkbox">
                    <input v-model="availability" type="checkbox" class="custom-control-input" checked
                           id="customCheck1">
                    <label class="custom-control-label" for="customCheck1">
                        Available
                    </label>
                </div>
                <br>

                <!--        A check box to enable searching in archive-->
                <div class="custom-control custom-checkbox">
                    <input v-model="archiveSearch" type="checkbox" class="custom-control-input" id="customCheck2">
                    <label class="custom-control-label" for="customCheck2">
                        Archive Search
                    </label>
                </div>
                <br>

                <!--        A button to reset the form fields-->
                <button type="button" class="btn btn-warning" @click="clearFields">
                    Reset
                </button>

                <!--        The button for executing search-->
                <button type="button" class="btn btn-success" :disabled="$store.getters.getLoadingFlag"
                        @click="searchClick()">
                    Search
                </button>
                <br><br>

                <!--        a division to show errors in the GUI-->
                <div class="alert alert-danger animated jello" role="alert" v-if="error.length!==0">
                    {{ error }}
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import {eventBus} from "../../../main";
import {bloodGroups, halls} from "../../../constants";
import axios from 'axios';

export default {
    name: "Filters",
    data: function () {
        return {
            //filter input fields
            name: "",
            bloodGroup: -1,
            batch: "",
            hall: halls[this.$store.getters.getHall],
            availability: true,
            archiveSearch: false,

            //GUI flags
            filterShown: true,
            isLargeWindow: true,

            //error message
            error: "",

            //imported constants
            halls,
            bloodGroups
        }
    },
    methods: {
        async searchClick() {
            console.log('Search button clicked: ');
            this.error = "";
            //front end input validation

            //batch number input validation
            let inputBatch = 0;
            inputBatch = parseInt(this.batch);
            if (this.batch.length === 0) {
                inputBatch = "";
            } else if (isNaN(inputBatch)) {
                this.error = "Please input a valid batch number";
                console.log('Invalid batch input, ', this.batch.length);
                return;
            } else if (this.batch.length !== 2) {
                this.error = "Please input a 2 digit batch number";
                console.log('Invalid batch input');
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

            //clear previous search results
            this.clearSearch();

            this.$store.commit('setLoadingTrue');

            let sendData = {
                userPhone: this.$store.getters.getPhone,
                name: inputName,
                bloodGroup: bloodGroups.indexOf(this.bloodGroup),
                batch: inputBatch.toString(),
                hall: halls.indexOf(this.hall),
                availability: this.availability
            };
            let headers = {
                'x-auth': this.$store.getters.getToken
            };
            console.log('REQUEST POST TO /donor/search: ', sendData);
            try {
                let response = await axios.post('/donor/search', sendData, {headers: headers});
                console.log("RESPONSE FROM /donor/search: ", response);

                if (response.status !== 200) {
                    this.error = "Status code not 200";
                    return;
                }

                eventBus.$emit('searchComplete', {
                    data: response.data.filteredDonors
                });


                if (!this.isLargeWindow) {
                    this.filterShown = false;
                }
            } catch (error) {
                this.error = this.response.data.message;
                console.log(error.response);
            } finally {
                this.$store.commit('setLoadingFalse');
                console.log('search complete');
            }
        },
        clearSearch() {
            console.log('Clear button clicked');
            eventBus.$emit('clearSearch', {});
        },
        clearFields() {
            this.batch = '';
            //this.hall=halls[this.$store.getters.getHall];
            if (this.$store.getters.getDesignation === 3) {
                this.hall = -1;
            }
            this.bloodGroup = -1;
            this.name = "";
            this.error = "";
            this.clearSearch();
        },
        showFilter() {
            this.filterShown = true;
        },
        hideFilter() {
            this.filterShown = false;
        },
        processName(name) {
            let newName = name.toLowerCase();
            let nameWithoutWs = "";
            for (let i = 0; i < newName.length; i++) {
                let currentChar = newName.charAt((i));
                if (currentChar < 'a' || currentChar > 'z') {
                    continue;
                }
                nameWithoutWs += currentChar;
            }
            return nameWithoutWs;
        }
    }
    ,
    created() {
        this.isLargeWindow = window.innerWidth > 992;

        eventBus.$on('hideFilter', () => {
            this.filterShown = false;
        });
    }
    ,

}
</script>

<style scoped>

</style>
