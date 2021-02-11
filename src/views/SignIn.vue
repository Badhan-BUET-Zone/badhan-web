<template>
    <div class="row d-flex justify-content-center">
        <div class="bg-light mb-3 col-lg-4 col-md-12 col-sm-12 p-4" style="height: fit-content">
            <div class="h4 p-2">Sign in</div>
            <div>
                <div class="form-group">
                    <label>Phone: </label>
                    <input class="form-control" type="text" v-model="phone" placeholder="11 Digit Phone number">
                    <br>
                    <label>Password: </label>
                    <input class="form-control" type="password" v-model="password" placeholder="Password">
                    <br>
                    <button type="button" class="btn btn-warning" @click="clearClicked()">Clear</button>
                    <button type="button" class="btn btn-success" @click="signInClicked()">
                        Sign In
                    </button>
<!--                    <br>-->
<!--                    <br>-->
<!--                    <a href="https://badhanweb.github.io/badhanliteapp/app/build/outputs/apk/debug/app-debug.apk">Download the android app</a>-->

                </div>
            </div>
            <div class="alert alert-danger animated jello" role="alert" v-if="error.length!==0">
                {{error}}
            </div>
        </div>
<!--        <div class="col-lg-8">-->

<!--        </div>-->
    </div>
</template>

<script>
export default {
name: "SignIn",
    data: function(){
        return {
            phone: "",
            password: "",
            error: "",
            isLargeWindow:true,
        }
    },
    methods:{
        signInClicked() {

        },
        clearClicked() {

        }
    }
}
</script>

<style scoped>

</style>