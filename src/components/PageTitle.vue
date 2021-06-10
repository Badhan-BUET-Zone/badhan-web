<template>
<!--    <v-card-->
<!--        class="mb-2"-->
<!--    >-->
<!--        <v-card-title>-->
<!--            <v-btn-->
<!--                v-if="$route.name!='Home'"-->
<!--                class="mx-2"-->
<!--                icon-->
<!--                small-->
<!--                @click="$router.push(isLoggedIn?'/home':'/')"-->
<!--            >-->
<!--                <v-icon>-->
<!--                    mdi-arrow-left-->
<!--                </v-icon>-->
<!--            </v-btn>-->
<!--            {{ title }}-->
<!--        </v-card-title>-->
<!--    </v-card>-->

    <v-toolbar class="rounded-xl" floating dense elevation="1" width="100%">
        <v-btn
            v-if="$route.name!='Home'"
            class="mx-2"
            icon
            small
            @click="$router.push(getIsLoggedIn?'/home':'/')"
        >
            <v-icon>
                mdi-arrow-left
            </v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>

        <v-spacer></v-spacer>
    </v-toolbar>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "PageTitle",
    props: ["title"],
    computed:{
        ...mapGetters(['getIsLoggedIn']),
    }
}
</script>

<style scoped>

</style>
