<template>
  <v-progress-linear rounded height="10" :active="getAppBarLoadingFlag" :indeterminate="true" class="bottom_progress_bar" bottom color="primary"/>
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
.bottom_progress_bar {
  position: fixed; z-index:99999; bottom: 0;
}
</style>