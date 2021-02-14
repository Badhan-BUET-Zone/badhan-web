<template>
    <!--  Person card-->
    <div class="mb-3 shadow p-1 bg-light rounded">
        <v-btn variant="outline-light" style="width: 100%; height: 80px" v-b-toggle="'collapse'+phone">
            <div class="row">
                <div v-if="availableIn>0" class="alert alert-danger col-3"
                     style="text-align: center; vertical-align: middle;" role="alert">
                    <span style="font-size: small">{{ availableIn }} day</span>
                </div>
                <div v-else="" class="alert alert-success col-3" style="text-align: center; vertical-align: middle;"
                     role="alert">
                    <span style="font-size: small">Av.</span>
                </div>
                <div class="col-6" style="font-size: small">
                    <b>{{ name }}</b>
                    <br>
                    <b>Dept: </b><span>{{ studentID | idToDept }}</span>
                    <br>
                    <b>Phone: </b><span v-if="phone">{{ phone.toString().substr(2) }}</span>
                </div>
                <div class="alert alert-info col-3"
                     style="text-align: center; vertical-align: middle; font-size: small;">
                    {{ bloodGroup|numToBloodGroup }}
                </div>
            </div>
        </v-btn>

        <!--    Person card extension-->
        <b-collapse :id="'collapse'+phone">
            <div class="card card-body" style="background-color: lightgrey">
                <div>
                    <b-button v-b-modal="'detailsModal'" variant="primary" @click="loadPersonDetails()"> See profile</b-button>
                    <b-button variant="primary">Direct call</b-button>
                </div>
                <br>
                <label>Add a donation date</label>
                <datepicker v-model="newDonationDate" placeholder="Select Date"></datepicker>
                <br>
                <button class="btn btn-danger" @click="donate()"
                        :disabled="$store.getters.getLoadingFlag || newDonationDate.length===0">Done
                </button>
            </div>
            <div class="alert alert-danger animated jello" role="alert" v-if="error.length!==0">
                {{ error }}
            </div>
            <div class="alert alert-success animated jello" role="alert" v-if="success.length!==0">
                {{ success }}
            </div>
        </b-collapse>

    </div>
</template>

<script>
import {eventBus} from "@/main";
import {departments, bloodGroups} from "@/constants";
import Datepicker from 'vuejs-datepicker';
import axios from 'axios';

export default {
    name: "PersonCard",
    props: ['phone', 'name', 'bloodGroup', 'availableIn', 'studentID', 'lastDonation'],
    components: {
        Datepicker
    },
    filters: {
        idToDept(studentID) {
            return departments[Number(studentID.toString().substr(2, 2))];
        },
        numToBloodGroup(num) {
            return bloodGroups[num];
        }
    },
    data: function () {
        return {
            newDonationDate: '',
            error: "",
            success: '',
        }
    },
    methods: {
        async loadPersonDetails() {
            console.log(this.$props.name, ' details button clicked');
            await this.$router.push('/home/details');

            this.$store.commit('setLoadingTrue');


            let sendData = {
                donorPhone: this.$props.phone,
            };
            let headers = {
                'x-auth': this.$store.getters.getToken
            };
            console.log('REQUEST TO /donor/details: ', sendData);

            try {
                let response = await axios.post('/donor/details', sendData, {headers: headers});
                console.log('RESPONSE FROM /donor/details: ', response);
                if (response.status !== 200) {
                    this.error = "Status code not 200";
                    eventBus.$emit('errorFound', {
                        message: this.error
                    });
                }

                eventBus.$emit('dataloaded', response.data.donor);
            }catch(error) {
            this.error = error.response.data.message;
            eventBus.$emit('errorFound', {
                message: this.error
            });
            console.log(error.response);
        }finally{
            this.$store.commit('setLoadingFalse');
        }
    },
    async donate() {
        console.log('Phone number ', this.phone, ' donated on ', this.newDonationDate.getTime());
        this.error = "";
        this.success = "";
        let sendData = {
            donorPhone: this.$props.phone,
            date: this.newDonationDate.getTime()
        };
        let headers = {
            'x-auth': this.$store.getters.getToken
        };


        this.$store.commit('setLoadingTrue');

        console.log('REQUESTING TO /donation/insert : ', sendData);


        try {
            let response = await axios.post('/donation/insert', sendData, {headers: headers});
            console.log("RESPONSE FROM /donation/insert: ", response)
            if (response.status !== 200) {
                this.error = "Status code not 200";
            }

            let newAvailableIn = 120 - Math.round((Math.round((new Date()).getTime()) - this.newDonationDate.getTime()) / (1000 * 3600 * 24));
            if (newAvailableIn > this.$props.availableIn) {
                this.$props.availableIn = newAvailableIn;
            }
            this.newDonationDate = "";
            this.success = "Successfully added donation";

        } catch (error) {
            this.error = error.response.data.message;
            console.log(error.response);
        } finally {
            this.$store.commit('setLoadingFalse');
        }
    },
}
}
</script>

<style scoped>

</style>
