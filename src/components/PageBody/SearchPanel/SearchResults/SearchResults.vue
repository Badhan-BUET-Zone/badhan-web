<template>
    <div
        class="card bg-light col-lg-8 col-md-12 col-sm-12 p-3"

        style="height: fit-content"
    >
        <div v-if="$store.getters.isSearchResultShown">
            <div class="alert alert-secondary">
                Found {{ $store.getters.getNumberOfDonors }} donors
            </div>
        </div>


        <div v-if="$store.getters.isSearchResultShown" data-aos="fade-up">


            <json-excel
                :data="$store.getters.getPersons"
                name="badhan.xls"
                worksheet="Badhan"
                :fields="{
                    name:'name',
                    studentId:'studentId',
                    lastDonation:{
                        field: 'lastDonation',
                        callback: (value) => {
                            let date = new Date(value);
                            return date.toDateString();
                        },
                    },
                    bloodGroup:{
                        field: 'bloodGroup',
                        callback: (value) => {
                            return bloodGroups[parseInt(value)];
                        },
                    },
                    address:'address',
                }"
            >
                <v-btn color="primary" rounded class="mb-4" style="width: 100%">
                    Download Data
                </v-btn>
            </json-excel>

            <div v-for="(obj, index) in $store.getters.getPersonGroups" :key="index">
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
                    :key="personIndex"
                ></person-card>
            </div>
        </div>
    </div>
</template>
<script>
import PersonCard from "./PersonCard";
import JsonExcel from "vue-json-excel";
import {bloodGroups} from "@/constants";

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
