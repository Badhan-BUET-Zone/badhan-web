<template>
  <div class="container">
    <component :is="$store.getters.getPageBody"></component>
  </div>
</template>

<script>
    import SearchPanel from "./SearchPanel/SearchPanel";
    import SuperAdminPanel from "./SuperAdminPanel";
    import HallAdminPanel from "./HallAdminPanel";
    import SignIn from "./SignIn";
    export default {
        name: "Body",
        data: function(){
            return {
            }
        },
        created(){
        },
        components: {
            'search-panel':SearchPanel,
            'super-admin-panel':SuperAdminPanel,
            'hall-admin-panel':HallAdminPanel,
            'sign-in':SignIn
        },

    }
</script>

<style scoped>

</style>
