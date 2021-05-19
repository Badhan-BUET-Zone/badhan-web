<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <div>
    <v-row>
      <v-col cols="12" sm="4">
        <filters></filters>
      </v-col>
      <v-col cols="12" sm="8">
        <search-results></search-results>
      </v-col>
        <!--        <person-details></person-details>-->
    </v-row>
    <router-view></router-view>
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
