<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-icon
          color="info"
          dark
          v-bind="attrs"
          v-on="on"
          class="ml-5"
      >
        mdi-help-circle-outline
      </v-icon>
    </template>
    <span>
      <slot></slot>
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'HelpTooltip'
}
</script>

<style scoped>

</style>
