<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <v-card max-width="500" class="pa-4">
        <v-progress-circular indeterminate color="primary" v-if="getVolunteerLoader">

        </v-progress-circular>

        <v-simple-table v-if="getVolunteers.length!==0">
            <template v-slot:default>
                <thead>
                <tr>
                    <th class="text-left">
                        Name
                    </th>
                    <th class="text-left">
                        Batch
                    </th>
                    <th class="text-left">
                        Department
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="(volunteer,index) in getVolunteers"
                    :key="index"
                >
                    <td>{{ volunteer.name }}</td>
                    <td>{{ volunteer.studentId.substr(0, 2) }}</td>
                    <td>{{ volunteer.studentId | idToDept}}</td>
                </tr>
                </tbody>
            </template>
        </v-simple-table>
    </v-card>
  </div>
</template>

<script>
import {bloodGroups, halls, departments} from "@/mixins/constants";
import {mapGetters, mapActions} from "vuex";
import PageTitle from "../components/PageTitle";

export default {
    name: "VolunteerList",
  components:{
      PageTitle
  },
    data: function () {
        return {
            //constants
            bloodGroups,
            halls,
            departments,

            seeVolunteersFlag: !this.$isMobile(),

        };
    },
    computed:{
        ...mapGetters('halladmin',['getVolunteerLoader','getVolunteers']),
    },

    filters: {
        idToDept(studentID) {
            return departments[Number(studentID.toString().substr(2, 2))];
        },
        numToBloodGroup(num) {
            return bloodGroups[num];
        },
    },
    methods: {
        ...mapActions('notification',['notifySuccess','notifyError']),
        ...mapActions('halladmin',['fetchVolunteers']),
    },
    mounted() {
        this.fetchVolunteers();
    }
};
</script>

<style scoped>

</style>