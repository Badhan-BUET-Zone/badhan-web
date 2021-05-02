<template>
    <div
        class="card bg-light col-lg-8 col-md-12 col-sm-12 p-3"

        style="height: fit-content"
    >
        <div v-if="isSearchResultShown">
            <div class="alert alert-secondary">
                Found {{ getNumberOfDonors }} donors
            </div>
        </div>

        <div v-if="isSearchResultShown">
            <div data-aos="fade-up">
                <json-excel
                    v-if="!isSmallWindow"
                    :data="getPersons"
                    :name="'badhan_'+getSearchedHall+'.xls'"
                    worksheet="Badhan"
                    :fields="{
                    name:'name',
                    studentId:'studentId',
                    lastDonation:{
                        field: 'lastDonation',
                        callback: (value) => {
                            let date = new Date(value);
                            return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
                        }
                    },
                    bloodGroup:{
                        field: 'bloodGroup',
                        callback: (value) => {
                            return bloodGroups[parseInt(value)];
                        },
                    },
                    address:'address',
                    roomNumber: 'roomNumber',
                    donationCount: 'donationCount'
                }"
                >
                    <v-btn color="primary" rounded class="mb-4" style="width: 100%">
                        Download Data
                    </v-btn>
                </json-excel>
                <v-btn v-else color="primary" rounded class="mb-4" style="width: 100%" disabled>
                    Download available on PC
                </v-btn>
            </div>
            <div v-for="(obj, index) in getPersonGroups" :key="index">
                <div class="alert alert-primary card" role="alert">
                    Batch {{ obj.batch }}:
                </div>
                <person-card
                    v-for="(person, personIndex) in obj.people"
                    :phone="person.phone"
                    :name="person.name"
                    :availableIn="person.availableIn"
                    :bloodGroup="person.bloodGroup"
                    :studentID="person.studentID"
                    :lastDonation="person.lastDonation"
                    :comment="person.comment"
                    :address="person.address"
                    :key="personIndex"
                    :roomNumber="person.roomNumber"
                    :id="person._id"
                ></person-card>
            </div>
        </div>
    </div>
</template>
<script>
import PersonCard from "./PersonCard";
import JsonExcel from "vue-json-excel";
import {bloodGroups} from "@/mixins/constants";
import {mapGetters} from "vuex";

export default {
    name: "SearchResults",
    data: function () {
        return {
            searchResultShown: false,
            personGroups: {},
            numOfDonor: 0,
            bloodGroups
        };
    },
    methods: {},
    computed: {
        ...mapGetters(['getPersonGroups','isSearchResultShown','getNumberOfDonors','getPersons','getSearchedHall']),
        isSmallWindow() {
            return window.innerWidth < 500;
        }
    },
    created() {
    },
    components: {
        "person-card": PersonCard,
        "json-excel": JsonExcel
    },
};
</script>

<style scoped>
</style>
