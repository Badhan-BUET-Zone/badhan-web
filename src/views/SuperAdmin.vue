<template>
    <div>
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
                <b>Change Hall Admin: </b>

                <div class="form-group row">
                    <label class="col-sm-4 col-form-label">Enter phone number of volunteer: </label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" v-model="newAdminPhone"
                               placeholder="Enter phone number of volunteer to be promoted">
                    </div>
                    <div class="col-sm-8">
                        <v-btn color="primary" rounded :disabled="$store.getters.getChangeAdminLoaderFlag" :loading="$store.getters.getChangeAdminLoaderFlag" @click="changeHallAdminClicked()">Change Hall Admin</v-btn>
                    </div>
                </div>

                <div class="alert alert-danger animated jello" role="alert" v-if="$store.getters.getChangeAdminError!==null">
                    {{ $store.getters.getChangeAdminError }}
                </div>
                <div class="alert alert-success animated jello" role="alert" v-if="$store.getters.getChangeAdminSuccess!==null">
                    {{ $store.getters.getChangeAdminSuccess }}
                </div>
            </div>
            <div class="jumbotron col-lg-6 col-md-12 col-sm-12 card animated fadeInDown" style="height: fit-content">
                <div>
                    <p>Archive: (CAUTION)</p>
                    <div class="form-group row">
                        <label class="col-sm-4 col-form-label">Enter batch number to be archived: </label>
                        <div class="col-sm-8">
                            <input type="text" v-model="batch" class="form-control">
                        </div>
                        <label class="col-sm-4 col-form-label">Enter your password: </label>
                        <div class="col-sm-8">
                            <input type="password" v-model="password" class="form-control">
                        </div>
                        <div class="col-sm-8">
                            <v-btn rounded color="red" class="white--text" @click="archiveBatchClicked()" disabled>Archive batch (not implemented)</v-btn>
                        </div>
                    </div>
                    <!-- <div class="alert alert-danger" role="alert" v-if="errorArchive.length!==0">
                        {{ errorArchive }}
                    </div> -->
                </div>
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
