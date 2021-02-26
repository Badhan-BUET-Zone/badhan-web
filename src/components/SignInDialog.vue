<template>
    <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
    >
        <v-card class="d-flex justify-center">
            <v-container>
                <v-row
                    class="fill-height"
                    align-content="center"
                    justify="center"
                >
                    <v-col
                        class="text-center red--text"
                        cols="12"
                    >
                        Signing into Badhan
                    </v-col>
                    <v-col cols="6">
                        <v-progress-linear
                            color="red"
                            indeterminate
                            rounded
                            height="6"
                        ></v-progress-linear>
                    </v-col>
                </v-row>
            </v-container>

        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['dialog'],
    data() {
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