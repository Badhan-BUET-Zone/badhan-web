<template>
        <v-card class="d-flex justify-center" style="z-index: 90;position: fixed;left: 0px;top: 0px;height: 100vh;width: 100vw;">
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
                        Loading... Please wait...
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