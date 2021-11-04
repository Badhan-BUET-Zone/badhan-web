<template>
  <v-app-bar dense floating width="100%" class="rounded-xl">
    <v-btn icon @click="$router.go(-1)">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
    <slot></slot>
  </v-app-bar>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "PageTitle",
  props: ["title"],
  computed: {
    ...mapGetters(['getIsLoggedIn']),
  }
}
</script>

<style scoped>

</style>
