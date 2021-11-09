<template>
  <div class="mb-2">
    <v-card
        style="width: 100%; height: 100%;" rounded
    >
      <v-row no-gutters>
        <v-col align-self="center" cols="4">
          <v-card
              class="text-center"
              color="grey"
              flat rounded
          >
            <v-card-text>
              <v-skeleton-loader type="text@2"></v-skeleton-loader>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
            cols="8"
            align-self="center"
            class="d-flex align-content-center"
        >
          <div style="font-size: small; width: 100%" class="text-wrap pa-2">
            <v-skeleton-loader type="text@3"></v-skeleton-loader>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "PersonCardNewSkeleton"
}
</script>

<style scoped>

</style>