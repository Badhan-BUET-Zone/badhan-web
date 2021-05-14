<template>
    <div class="mb-2" style="width: 100%">
        <v-card
            style="width: 100%"
            class="pa-2"
        >
            <v-row no-gutters>
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
                        <br/>
                        <b>Student ID: </b>
                        <span>{{studentID}}</span>
                    </div>
                </v-col>
                <v-col cols="4" md="4" sm="4" xl="4">
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
        </v-card>
    </div>
</template>

<script>
import {bloodGroups, departments} from "../../mixins/constants";

export default {
    name: "ArchivedPerson",
    props: [
        "phone",
        "name",
        "bloodGroup",
        "studentID",
        "id"
    ],
    filters: {
        idToDept(studentID) {
            return departments[Number(studentID.toString().substr(2, 2))];
        },
        numToBloodGroup(num) {
            return bloodGroups[num];
        },
    },
}
</script>

<style scoped>

</style>