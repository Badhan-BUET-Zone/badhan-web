<template>

    <v-snackbar
        v-model="notification"
        color="red"
        left
        bottom
        timeout="3000"
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

</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
    name: "Snackbar.vue",
    computed: {
        ...mapGetters('notification', ['getNotification', "getNotificationFlag"]),
        notification: {
            // getter
            get: function () {
                return this.getNotificationFlag
            },
            // setter
            set: function (newValue) {
                this.setNotificationFlag = newValue;
            }
        }
    },
    methods: {
        ...mapActions('notification', ['notify', 'setNotificationFlag'])
    }
}
</script>

<style scoped>

</style>