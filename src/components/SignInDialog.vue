<template>
    <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
    >
        <v-card class="d-flex justify-center">
            <v-progress-circular
                :size="300"
                :width="15"
                color="red"
                indeterminate
                class="ma-auto"
                style="align-content: center"
            >
                <h3>Signing into <br>Badhan Sync</h3>
            </v-progress-circular>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['dialog'],
    data () {
        return {
            // dialog: false,
            notifications: false,
            sound: true,
            widgets: false,
        }
    },
}
</script>

<style scoped>

</style>