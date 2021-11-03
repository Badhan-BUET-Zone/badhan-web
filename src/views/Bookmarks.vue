<template>
<div>
  <PageTitle></PageTitle>
  <v-tabs class="rounded-xl" centered
          next-icon="mdi-arrow-right-bold-box-outline"
          prev-icon="mdi-arrow-left-bold-box-outline"
          show-arrows
  >
    <v-tabs-slider></v-tabs-slider>
    <v-tab to="/bookmarks/public" style="text-decoration: none">
      Public
    </v-tab>
    <v-tab to="/bookmarks/private" style="text-decoration: none">
      Private
    </v-tab>
  </v-tabs>
  <transition name="slide-fade" mode="out-in">
    <router-view></router-view>
  </transition>
</div>
</template>

<script>
import PageTitle from "../components/PageTitle";
export default {
  name: "Bookmarks",
  components: {PageTitle}
}
</script>

<style scoped>

</style>