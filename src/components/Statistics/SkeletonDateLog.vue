<template>
  <v-card flat color="grey lighten-4">
    <v-card-title>
      <span style="color: white">.</span>
    </v-card-title>
    <v-card-subtitle>
      <v-skeleton-loader type="text"></v-skeleton-loader>
    </v-card-subtitle>
    <v-card-text>
      <v-btn rounded color="primary" x-small disabled>Details</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "SkeletonDateLog"
}
</script>

<style scoped>

</style>
