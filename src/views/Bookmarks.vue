<template>
  <div>
    <PageTitle></PageTitle>
    <v-tabs class="rounded-xl" centered
            next-icon="mdi-arrow-right-bold-box-outline"
            prev-icon="mdi-arrow-left-bold-box-outline"
            show-arrows
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab @click="selectedBookmarkPage='PublicBookmarks'" style="text-decoration: none">
        Public
      </v-tab>
      <v-tab @click="selectedBookmarkPage='PrivateBookmarks'" style="text-decoration: none">
        Private
      </v-tab>
    </v-tabs>
    <transition name="slide-fade" mode="out-in">
      <component :is="selectedBookmarkPage"></component>
    </transition>
    <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import PageTitle from "../components/PageTitle";
import PublicBookmarks from "./Bookmarks/PublicBookmarks";
import PrivateBookmarks from "./Bookmarks/PrivateBookmarks";

export default {
  name: "Bookmarks",
  components: {PageTitle, PublicBookmarks, PrivateBookmarks},
  data: () => {
    return {
      selectedBookmarkPage: 'PublicBookmarks'
    }
  }
}
</script>

<style scoped>

</style>