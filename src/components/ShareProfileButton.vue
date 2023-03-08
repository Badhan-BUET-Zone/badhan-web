<template>
  <v-tooltip
      v-model="showTooltip"
      bottom
  >
    <template>
      <v-btn rounded class="ml-3" text x-small @click="shareClicked">
        <v-icon left>
          mdi-share
        </v-icon>
        Share
      </v-btn>
    </template>
    <span>Donor link copied to clipboard</span>
  </v-tooltip>
</template>

<script>
import { environmentService } from '@/mixins/environment'

export default {
  props: ['id'],
  name: 'ShareProfileButton',
  data: () => {
    return {
      showTooltip: false
    }
  },
  methods: {
    shareClicked () {
      const routeData = this.$router.resolve({
        name: 'DetailsPage',
        query: {
          id: this.id
        }
      })
      this.$copyText(environmentService.getFrontendBaseURL() + '/' + routeData.href).then((_e) => {
        this.showTooltip = true
        setTimeout(() => {
          this.showTooltip = false
        }, 2000)
      })
    }
  }
}
</script>

<style scoped>

</style>
