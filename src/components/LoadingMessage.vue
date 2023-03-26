<template>
<ContainerFlat>
  <v-card-text class="d-flex align-center">
    <v-avatar class="ma-auto" :class="{'invert-color': invertColor}" size="100">
      <v-img src="../assets/loading.gif"/>
    </v-avatar>
  </v-card-text>
</ContainerFlat>
</template>

<script>
import ldb from '@/localDatabase'
import ContainerFlat from '@/components/Wrappers/ContainerFlat.vue'

export default {
  name: 'LoadingMessage',
  components: { ContainerFlat },
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