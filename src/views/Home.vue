<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <div>
      <div class="row">
        <filters></filters>
        <search-results></search-results>
        <router-view></router-view>
        <!--        <person-details></person-details>-->
      </div>
    </div>
  </div>
</template>

<script>
import SearchResults from "@/components/Home/SearchPanel/SearchResults/SearchResults";
import Filters from "@/components/Home/SearchPanel/Filters";
import PersonDetails from "@/components/Home/SearchPanel/PersonDetails/PersonDetails";
import PageTitle from "../components/PageTitle";

export default {
  name: "ActiveSearch",
  components: {
    'search-results': SearchResults,
    'filters': Filters,
    'person-details': PersonDetails,
    PageTitle
  },

}
</script>

<style scoped>

</style>
