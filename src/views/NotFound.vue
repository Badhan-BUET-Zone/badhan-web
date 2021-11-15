<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <v-container fluid>
      <Container>
        <v-card-title>
          Not Found
        </v-card-title>
      </Container>
    </v-container>
  </div>
</template>

<script>
import PageTitle from '../components/PageTitle'
import Container from '../components/Wrappers/Container'

export default {
  name: 'Release.vue',
  components: {
    Container,
    PageTitle
  }
}
</script>

<style scoped>

</style>
