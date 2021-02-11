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
import SearchResults from "@/components/UI/SearchResults/SearchResults";
import Filters from "@/components/UI/Filters";
import PersonDetails from "@/components/UI/PersonDetails/PersonDetails";

export default {
    name: "ActiveSearch",
    components: {
        'search-results': SearchResults,
        'filters': Filters,
        'person-details': PersonDetails
    },

}
</script>

<style scoped>

</style>
