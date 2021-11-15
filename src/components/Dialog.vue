<template>
  <v-dialog
      v-model="dialogOpened"
      width="500"
      persistent
  >
    <v-card rounded>
      <v-card-title>
        Confirm
      </v-card-title>
      <v-card-text>
        {{message}}
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn rounded
            color="secondary" @click="canceled"
        >
          Cancel
        </v-btn>
        <v-btn rounded color="primary" @click="confirmed">
          Ok
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    dialogOpened: {
      type: Boolean,
      required: true
    },
    confirmed: {
      type: Function,
      required: true
    },
    canceled: {
      type: Function,
      required: true
    }

  },
  name: 'Dialog',
  data () {
    return {
      dialog: false
    }
  }
}
</script>

<style scoped>

</style>
