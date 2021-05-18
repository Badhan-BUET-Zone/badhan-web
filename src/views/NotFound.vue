<template>
    <div>
      <PageTitle :title="$route.meta.title"></PageTitle>
        <v-container fluid>
            <v-card
                class="mx-auto"
                max-width="500"
            >
                <v-card-title>
                    Not Found
                </v-card-title>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import PageTitle from "../components/PageTitle";

export default {
name: "Release.vue",
  components:{
  PageTitle
  }
}
</script>

<style scoped>

</style>