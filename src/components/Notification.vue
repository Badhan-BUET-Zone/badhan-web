<template>
    <div>
        <v-snackbar
            v-model="notification"
            :color="getNotificationColor"
            left
            bottom
            :timeout="-1"
        >
            {{ getNotification }}
            <template v-slot:action="{ attrs }">
                <v-btn
                    text
                    v-bind="attrs"
                    @click="setNotificationFlag(false)"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Snackbar.vue',
  computed: {
    ...mapGetters('notification', ['getNotification', 'getNotificationFlag', 'getNotificationColor']),
    notification: {
      get: function () {
        return this.getNotificationFlag
      },
      set: function (newValue) {
        this.setNotificationFlag = newValue
      }
    }
  },
  methods: {
    ...mapActions('notification', ['setNotificationFlag'])
  }
}
</script>

<style scoped>

</style>
