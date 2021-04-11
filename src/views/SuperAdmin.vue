<template>
    <div data-aos="fade-up">
        <div class="row">
            <div class="col-lg-6 col-sm-12 col-md-12 jumbotron card">
                <h3>Hall Admins</h3>
                <v-progress-circular
                    v-if="$store.getters.getHallAdminsLoaderFlag"
                    indeterminate
                    color="primary"
                ></v-progress-circular>

                <div class="alert alert-danger" role="alert" v-if="$store.getters.getHallAdminsFetchError!==null">
                    {{ $store.getters.getHallAdminsFetchError }}
                </div>

                <table class="table table-hover" v-if="$store.getters.getHallAdmins!==null && !$store.getters.getHallAdminsLoaderFlag">
                    <thead>
                    <tr>
                        <th scope="col">Hall Name</th>
                        <th scope="col">Hall Admin</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(hallAdmin,index) in $store.getters.getHallAdmins" :key="index">
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
import {halls} from '@/constants';

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

            //error message controller flags
            errorArchive: "route archive not enabled",
            errorChangeAdmin: "",
            errorAdminsLoaded: "",

            successChangeAdmin: "",

            changeHallAdminLoaderFlag: false,
        }
    },
    methods: {
        changeHallAdminClicked() {
            //01878514798
            this.$store.dispatch('changeHallAdmin',{newAdminPhone:this.newAdminPhone});
        },
        archiveBatchClicked() {

        },

    },
    created() {

    },
    mounted() {
        this.$store.dispatch('fetchHallAdmins');
    }
}
</script>

<style scoped>

</style>
