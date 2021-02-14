<template>
  <div class="row">
    <filters></filters>
    <search-results></search-results>
<!--    <person-details></person-details>-->
      <router-view></router-view>
  </div>
</template>

<script>
    import SearchResults from "./SearchResults/SearchResults";
    import Filters from "./Filters";
    import PersonDetails from "./PersonDetails/PersonDetails";
    export default {
        name: "ActiveSearch",
        components: {
            'search-results':SearchResults,
            'filters':Filters,
            'person-details':PersonDetails
        },

    }
</script>

<style scoped>

</style>
