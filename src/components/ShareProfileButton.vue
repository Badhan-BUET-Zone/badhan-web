<template>
  <v-tooltip
      v-model="showTooltip"
      bottom
  >
    <template v-slot:activator="{ on, attrs }">
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
export default {
  props:["id"],
  name: "ShareProfileButton",
  data: () => {
    return {
      showTooltip: false,
    }
  },
  methods:{
    shareClicked() {
      let routeData = this.$router.resolve({
        name: 'Details',
        query: {
          id: this.id,
        }
      });
      // navigator.clipboard.writeText(process.env.VUE_APP_FRONTEND_BASE+routeData.href);
      this.$copyText(process.env.VUE_APP_FRONTEND_BASE + routeData.href).then((e) => {
        this.showTooltip = true;
        setTimeout(() => {
          this.showTooltip = false
        }, 2000);
      }, (e) => {
      })
    },
  }
}
</script>

<style scoped>

</style>
