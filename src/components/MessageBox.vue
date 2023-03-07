<template>
  <v-dialog
      v-model="dialogOpened"
      width="500"
      persistent
  >
    <v-card rounded>
      <v-card-title>
        Message
      </v-card-title>
      <v-card-text>
        {{ getMessage }}
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn rounded color="primary" @click="confirmed">
          Ok
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'MessageBox',
  props: {

  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters('messageBox', ['getNotificationFlag', 'getMessage']),
    dialogOpened: {
      // getter
      get () {
        return this.getNotificationFlag
      },
      // setter
      set (newValue) {
        this.setMessageFlag(newValue)
      }
    }
  },
  methods: {
    ...mapMutations('messageBox', ['setMessage', 'setMessageFlag']),
    confirmed () {
      this.setMessageFlag(false)
    }
  }
}
</script>

<style scoped>

</style>
