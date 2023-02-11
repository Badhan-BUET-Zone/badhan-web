<template>
<Container>
  <v-avatar
      size="100"
      color="grey"
      class="ma-2"
  >
    <v-img dark>
    </v-img>
  </v-avatar>
  <v-card-title class="grey--text">
    Name
  </v-card-title>
  <v-card-subtitle class="grey--text">
    Work Period
  </v-card-subtitle>
  <v-card-text>
    <v-skeleton-loader type="text@2"></v-skeleton-loader>
  </v-card-text>
  <v-card-actions>
    <v-btn v-for="i in 2" :key="i" class="white--text" rounded small>
      <v-icon left dark>mdi-web</v-icon>
    </v-btn>
  </v-card-actions>
</Container>
</template>

<script>
/* eslint-disable */
import Container from '../Wrappers/Container'
export default {
  name: 'SkeletonPersonCredit',
  components: { Container }
}
</script>

<style scoped>

</style>
