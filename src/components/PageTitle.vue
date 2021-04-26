<template>
    <v-card
        class="mb-2"
    >
        <v-card-title>
            <v-btn
                v-if="$route.name!='Home'"
                class="mx-2"
                icon
                small
                @click="$router.push($store.getters.isLoggedIn?'/home':'/')"
            >
                <v-icon>
                    mdi-arrow-left
                </v-icon>
            </v-btn>
            {{ title }}
        </v-card-title>
    </v-card>
</template>

<script>
export default {
    name: "PageTitle",
    props: ["title"]
}
</script>

<style scoped>

</style>