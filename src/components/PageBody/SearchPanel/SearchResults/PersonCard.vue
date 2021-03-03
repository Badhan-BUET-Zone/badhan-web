<template>
    <!--  Person card-->
    <div class="mb-2" style="width: 100%">
        <v-btn
            style="width: 100%; height: 100%"
            class="pa-2"
            @click="showExtensionFlag = !showExtensionFlag"
        >
            <v-row no-gutters>
                <v-col cols="2" md="2" sm="2" xl="2">
                    <div
                        v-if="availableIn > 0"
                        class="alert alert-danger"
                        style="text-align: center; vertical-align: middle; height: 100%"
                        role="alert"
                    >
                        <span style="font-size: small">{{ availableIn }} <br/>day</span>
                    </div>
                    <div
                        v-else
                        class="alert alert-success"
                        style="text-align: center; vertical-align: middle; height: 100%"
                        role="alert"
                    >
                        <span style="font-size: small">Av.</span>
                    </div>
                </v-col>
                <v-col
                    cols="8"
                    md="8"
                    sm="8"
                    xl="8"
                    class="d-flex align-content-center"
                    style="width: 200px"
                >
                    <div style="font-size: small; width: 100%" class="text-wrap pa-4">
                        <b style="width: 100%">{{ name }}</b>
                        <br/>
                        <b>Dept: </b><span>{{ studentID | idToDept }}</span>
                        <br/>
                        <b>Phone: </b>
                        <span v-if="phone">{{ phone.toString().substr(2) }}</span>
                    </div>
                </v-col>
                <v-col cols="2" md="2" sm="2" xl="2">
                    <div
                        class="alert alert-info"
                        style="
              text-align: center;
              vertical-align: middle;
              font-size: small;
              height: 100%;
            "
                    >
                        {{ bloodGroup | numToBloodGroup }}
                    </div>
                </v-col>
            </v-row>
        </v-btn>

        <!--    Person card extension-->
        <div v-if="showExtensionFlag">
            <div class="card card-body" style="background-color: lightgrey">
                <div>
                    <v-btn
                        rounded
                        color="light-blue"
                        v-b-modal="'detailsModal'"
                        @click="loadPersonDetails()"
                        :disabled="seeDetailsLoaderFlag"
                        :loading="seeDetailsLoaderFlag"
                    >
                        See profile
                    </v-btn>
                    <v-btn rounded color="light-blue" class="ml-2" @click="callFromDialer"
                    >Direct call
                    </v-btn
                    >
                </div>
                <br/>
                <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="newDonationDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="newDonationDate"
                            label="Add a donation date"
                            prepend-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker v-model="newDonationDate" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(newDonationDate)"
                        >OK
                        </v-btn
                        >
                    </v-date-picker>
                </v-menu>
                <br/>
                <v-btn
                    color="red"
                    rounded
                    @click="donate()"
                    :loading="donateLoaderFlag"
                    :disabled="donateLoaderFlag || newDonationDate.length === 0"
                >Done
                </v-btn>
            </div>
            <div
                class="alert alert-danger animated jello"
                role="alert"
                v-if="error.length !== 0"
            >
                {{ error }}
            </div>
            <div
                class="alert alert-success animated jello"
                role="alert"
                v-if="success.length !== 0"
            >
                {{ success }}
            </div>
        </div>
    </div>
</template>

<script>
import {eventBus} from "@/main";
import {departments, bloodGroups} from "@/constants";
import Datepicker from "vuejs-datepicker";
import {badhanAxios} from "@/api";

export default {
    name: "PersonCard",
    props: [
        "phone",
        "name",
        "bloodGroup",
        "availableIn",
        "studentID",
        "lastDonation",
    ],
    components: {
        Datepicker,
    },
    filters: {
        idToDept(studentID) {
            return departments[Number(studentID.toString().substr(2, 2))];
        },
        numToBloodGroup(num) {
            return bloodGroups[num];
        },
    },
    data: function () {
        return {
            newDonationDate: "",
            error: "",
            success: "",

            //vuetify date picker
            menu: false,

            showExtensionFlag: false,
            seeDetailsLoaderFlag: false,
            donateLoaderFlag: false,
        };
    },
    methods: {
        callFromDialer() {
            document.location.href = "tel:+" + this.phone;
        },
        async loadPersonDetails() {
            //   await this.$router.push("/home/details");
            await this.$router.push({
                path: "/home/details",
                query: {phone: this.$props.phone},
            });

        },
        async donate() {
            this.error = "";
            this.success = "";
            let sendData = {
                donorPhone: this.$props.phone,
                date: new Date(this.newDonationDate).getTime(),
            };
            let headers = {
                "x-auth": this.$store.getters.getToken,
            };

            this.donateLoaderFlag = true;
            console.log("REQUESTING TO /donation/insert : ", sendData);

            try {
                let response = await badhanAxios.post("/donation/insert", sendData, {
                    headers: headers,
                });
                console.log("RESPONSE FROM /donation/insert: ", response);
                if (response.status !== 200) {
                    this.error = "Status code not 200";
                }

                let newAvailableIn =
                    120 -
                    Math.round(
                        (Math.round(new Date().getTime()) -
                            new Date(this.newDonationDate).getTime()) /
                        (1000 * 3600 * 24)
                    );
                if (newAvailableIn > this.$props.availableIn) {
                    this.$props.availableIn = newAvailableIn;
                }
                this.newDonationDate = "";
                this.success = "Successfully added donation";
            } catch (error) {
                this.error = error.response.data.message;
                console.log(error.response);
            } finally {
                this.donateLoaderFlag = false;
            }
        },
    },
};
</script>

<style scoped>
</style>
