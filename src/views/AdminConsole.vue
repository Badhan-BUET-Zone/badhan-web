<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <transition-group name="slide-fade-down-snapout" mode="out-in">
      <Container :key="'versionLoaded'">
        <v-card-text>
          You will be redirected to the admin console
        </v-card-text>
        <v-card-actions>
          <Button
            text="Go to Admin Console"
            :loading="redirectionLoaderFlag"
            color="primary"
            :click="redirectToAdminConsole"
            :icon="'mdi-upload'"
            :disabled="redirectionLoaderFlag"
          ></Button>
        </v-card-actions>
      </Container>
    </transition-group>
  </div>
</template>

<script>
import Container from '../components/Wrappers/Container'
import PageTitle from '../components/PageTitle'
import Button from '../components/UI Components/Button'
import { handlePOSTRedirection } from '../api'

export default {
  name: 'AdminConsole',
  components: { Button, Container, PageTitle },
  data: () => {
    return {
      redirectionLoaderFlag: false
    }
  },
  methods: {
    async redirectToAdminConsole () {
      this.redirectionLoaderFlag = true
      const redirectionTokenResponse = await handlePOSTRedirection()
      this.redirectionLoaderFlag = false
      if (redirectionTokenResponse.status !== 201) return
      window.open(`${process.env.VUE_APP_ADMIN_CONSOLE_URL}/redirection?token=${redirectionTokenResponse.data.token}`, '_blank')
    }
  }
}
</script>

<style scoped>

</style>
