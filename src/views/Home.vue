<template>
    <div>
    <div class="row">
        <filters></filters>
        <search-results></search-results>
        <person-details></person-details>
    </div>
    </div>
</template>

<script>
import SearchResults from "@/components/PageBody/SearchPanel/SearchResults/SearchResults";
import Filters from "@/components/PageBody/SearchPanel/Filters";
import PersonDetails from "@/components/PageBody/SearchPanel/PersonDetails/PersonDetails";
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
