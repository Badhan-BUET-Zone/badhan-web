<template>
  <v-progress-linear rounded height="5" :active="getAppBarLoadingFlag" :indeterminate="true" class="top_progress_bar" top color="primary" background-color="white" background-opacity="1"/>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'BottomProgressBar',
  computed:{
    ...mapGetters(['getAppBarLoadingFlag'])
  }
}
</script>

<style scoped>
.top_progress_bar {
  position: fixed; z-index:99999; top: 0;
}
</style>