<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <v-card max-width="500" class="pa-4 mx-auto rounded-xl">
        <v-progress-circular
            v-if="getHallAdminsLoaderFlag"
            indeterminate
            color="primary"
        ></v-progress-circular>
        <table class="table table-hover" v-if="getHallAdmins!==null && !getHallAdminsLoaderFlag">
            <thead>
            <tr>
                <th scope="col">Hall Name</th>
                <th scope="col">Hall Admin</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(hallAdmin,index) in getHallAdmins" :key="index">
                <th scope="row">{{ halls[hallAdmin.hall] }}</th>
                <td>{{ hallAdmin.name }}</td>
            </tr>
            </tbody>
        </table>
        <hr>
    </v-card>
  </div>
</template>

<script>
import {halls} from '@/mixins/constants';
import {mapActions, mapGetters} from "vuex";
import Card from "../components/Credits/ContributorCard";
import PageTitle from "../components/PageTitle";

export default {
    name: "SuperAdminPanel",
  components: {Card,PageTitle},
  data: function () {
        return {
            hallAdmins: [],
            halls,
            newAdminPhone: '',
            password: '',
            batch: '',
            loadingComplete: false,

            changeHallAdminLoaderFlag: false,
        }
    },
    computed: {
        ...mapGetters(['getHallAdmins', 'getHallAdminsLoaderFlag']),
    },
    methods: {
        ...mapActions(['changeHallAdmin', 'fetchHallAdmins']),
        changeHallAdminClicked() {
            this.changeHallAdmin({newAdminPhone: this.newAdminPhone});
        },
        archiveBatchClicked() {
        },
    },
    created() {
    },
    mounted() {
        this.fetchHallAdmins();
    }
}
</script>

<style scoped>

</style>
