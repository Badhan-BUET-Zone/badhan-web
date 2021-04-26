<template>
    <v-col :cols="12" lg="4">

        <v-card>
            <v-img
                class="white--text align-end"
                height="300px"
                :src="image"
                lazy-src="../../assets/account.png"
            >
                <template v-slot:placeholder>
                    <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                    >
                        <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                        ></v-progress-circular>
                    </v-row>
                </template>
                <v-card-title>{{ name }}</v-card-title>
            </v-img>

            <v-card-subtitle class="pb-0">{{ subtitle }}</v-card-subtitle>

            <v-card-text class="text--primary">
                <div v-for="(description, index) in descriptions">{{description}}</div>
            </v-card-text>

            <v-card-actions class="pa-5">
                <v-btn
                    v-for="(link,index) in links"
                    :key="index"
                    :color="link.color"
                    class="white--text"
                    rounded
                    @click="goTo(link.link)"
                >
                    <v-icon
                        left
                        dark
                    >
                        mdi-{{link.icon}}
                    </v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-col>
</template>

<script>
export default {
    name: "Card",
    props: ['name', 'subtitle', 'image','descriptions','links'],
    methods:{
        goTo(url) {
            window.open(url, '_blank');
        }
    }

}
</script>

<style scoped>

</style>