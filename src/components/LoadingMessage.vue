<template>
<v-card flat>
  <v-card-text class="d-flex align-content-center">
    <v-avatar class="ma-auto" :class="{'invert-color': invertColor}" size="100">
      <v-img src="../assets/loading.gif"/>
    </v-avatar>
  </v-card-text>
</v-card>
</template>

<script>
import ldb from '@/localDatabase'

export default {
  name: 'LoadingMessage',
  computed:{
    invertColor(){
      return ldb.theme.load()
    }
  }
}
</script>

<style scoped>
.invert-color {
  -webkit-filter: invert(1);
  filter: invert(1);
}
</style>