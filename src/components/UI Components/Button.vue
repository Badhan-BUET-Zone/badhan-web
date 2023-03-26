<template>
  <v-btn small rounded class="ma-1" :color="color" @click="click" :disabled="disabled">
    <v-icon left>{{ icon }}</v-icon>
    {{ text }}
  </v-btn>
</template>
<script>
export default {
  name: 'ButtonComponent',
  props: {
    color: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    click: {
      type: Function,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
