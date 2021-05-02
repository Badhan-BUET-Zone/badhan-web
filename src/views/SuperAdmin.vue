<template>
    <div data-aos="fade-up">
        <div class="row">
            <div class="col-lg-6 col-sm-12 col-md-12 jumbotron card">
                <h3>Hall Admins</h3>
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
            </div>
        </div>
    </div>
</template>

<script>
import {halls} from '@/mixins/constants';
import {mapActions, mapGetters} from "vuex";

export default {
    name: "SuperAdminPanel",
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
    computed:{
        ...mapGetters(['getHallAdmins','getHallAdminsLoaderFlag']),
    },
    methods: {
        ...mapActions(['changeHallAdmin','fetchHallAdmins']),
        changeHallAdminClicked() {
            this.changeHallAdmin({newAdminPhone:this.newAdminPhone});
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
