<template>
    <v-dialog
      v-model="confirmationOpened"
      width="500"
      persistent
      content-class="rounded-xl"
    >
      <v-card>
        <v-card-title>
          Confirm
        </v-card-title>
        <v-card-text>
          {{getConfirmationMessage}}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn rounded
                 color="secondary" @click="cancelClicked"
          >
            Cancel
          </v-btn>
          <v-btn rounded color="primary" @click="confirmClicked" id="confirmationBoxButtonId">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations('confirmationBox', ['setConfirmationFlag', 'setConfirmationMessage', 'resetConfirmationBox']),
    confirmClicked () {
      this.getConfirmationAction()
      this.resetConfirmationBox()
    },
    cancelClicked () {
      this.setConfirmationFlag(false)
    }
  },
  computed: {
    ...mapGetters('confirmationBox', ['getConfirmationMessage', 'getConfirmationFlag', 'getConfirmationAction']),
    confirmationOpened: {
      // getter
      get () {
        return this.getConfirmationFlag
      },
      // setter
      set (newValue) {
        this.setConfirmationFlag(newValue)
      }
    }
  },

  name: 'ConfirmationBox'
}
</script>

<style scoped>
</style>
