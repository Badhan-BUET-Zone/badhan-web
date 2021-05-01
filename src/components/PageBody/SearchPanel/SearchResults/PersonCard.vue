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
                        v-if="availableInRendered > 0"
                        class="alert alert-danger"
                        style="text-align: center; vertical-align: middle; height: 100%"
                        role="alert"
                    >
                        <span style="font-size: small">{{ availableInRendered }} <br/>day</span>
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
                <p><b>Department: </b>{{ studentID | idToDept }}</p>
                <p v-if="comment!==undefined && comment!==null && comment.length !==0"><b>Comment:</b> {{ comment }}</p>
                <p v-if="address!==undefined && address!==null && address.length !==0"><b>Address:</b> {{ address }}</p>
                <p v-if="roomNumber!==undefined && roomNumber!==null && roomNumber.length !==0"><b>Room:</b>
                    {{ roomNumber }}</p>
                <div>
                    <v-btn
                        small
                        rounded
                        color="light-blue"
                        v-b-modal="'detailsModal'"
                        @click="loadPersonDetails()"
                        :disabled="seeDetailsLoaderFlag"
                        :loading="seeDetailsLoaderFlag"
                    >
                        See profile
                    </v-btn>
                    <v-btn small rounded color="light-blue" class="ml-2" @click="callFromDialer"
                    >Direct call
                    </v-btn
                    >
                </div>
                <div class="mt-2">
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
                                outlined
                                v-bind="attrs"
                                v-on="on"
                                dense
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
                </div>
                <v-btn
                    color="red"
                    rounded
                    small
                    @click="donateClicked()"
                    :loading="$store.getters['donate/getDonationLoaderFlag']"
                    :disabled="$store.getters['donate/getDonationLoaderFlag'] || newDonationDate.length === 0"
                >Done
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import {departments, bloodGroups} from "@/constants";
import Datepicker from "vuejs-datepicker";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "PersonCard",
    props: [
        "phone",
        "name",
        "bloodGroup",
        "availableIn",
        "studentID",
        "lastDonation",
        "comment",
        "address",
        "roomNumber",
        "id"
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
            availableInRendered: 0,
        };
    },
    computed:{
        ...mapGetters('donate',['getDonationLoaderFlag']),
    },
    mounted() {
        this.availableInRendered = this.$props.availableIn;
    },
    methods: {
        ...mapActions('donate',['donate']),
        callFromDialer() {
            document.location.href = "tel:+" + this.phone;
        },
        async loadPersonDetails() {
            //   await this.$router.push("/home/details");
            await this.$router.push({
                path: "/home/details",
                query: {id: this.$props.id},
            });

        },
        async donateClicked() {
            let success = await this.donate({
                donorId: this.$props.id,
                newDonationDate: this.newDonationDate
            });

            if (success) {
                let newAvailableIn =
                    120 -
                    Math.round(
                        (Math.round(new Date().getTime()) -
                            new Date(this.newDonationDate).getTime()) /
                        (1000 * 3600 * 24)
                    );
                if (newAvailableIn > this.availableInRendered) {
                    this.availableInRendered = newAvailableIn;
                }

                this.newDonationDate = "";
            }

        },
    },
};
</script>

<style scoped>
</style>
