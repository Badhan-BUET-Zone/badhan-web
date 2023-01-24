<template>
  <div :key="'donorCreation'">
    <PageTitle :title="$route.meta.title"></PageTitle>
    <ContainerFlat>
      <v-btn rounded to="/singleDonorCreation" color="secondary" style="text-decoration: none" text>
        <v-icon left>
          mdi-arrow-left
        </v-icon>
        Return to simple form
      </v-btn>
    </ContainerFlat>
    <Container>
      <v-card-title>
        Advanced Donor Creation
      </v-card-title>
      <v-card-text>
        You will be securely redirected to a supporting website for advanced options for creating donors
      </v-card-text>
      <v-card-actions>
        <Button
          :loading="excelUploadRedirectionFlag"
          :disabled="excelUploadRedirectionFlag"
          :color="'primary'"
          :icon="'mdi-upload'"
          :text="'Go to Advanced Donor Creation'" :click="redirectExcelUpload">
        </Button>
      </v-card-actions>
    </Container>
  </div>
</template>

<script>
/* eslint-disable */
import PageTitle from '../components/PageTitle'
import { mapActions, mapGetters } from 'vuex'
import { getIsNative } from '../plugins/android_support'
import { isGuestEnabled, handlePOSTRedirection } from '../api'
import Container from '../components/Wrappers/Container'
import ContainerFlat from '../components/Wrappers/ContainerFlat'
import Button from '../components/UI Components/Button'

export default {
  name: 'BatchInsertion',
  data: () => {
    return {
      excelUploadRedirectionFlag: false
    }
  },
  computed: {
    ...mapGetters(['getHall', 'getDesignation']),
    isGuestEnabled () {
      return isGuestEnabled()
    },
    isNative () {
      return getIsNative()
    }
  },
  methods: {
    ...mapActions('notification', ['notifyError', 'notifySuccess', 'notifyInfo']),
    ...mapActions(['requestRedirectionToken']),
    async redirectExcelUpload () {
      this.excelUploadRedirectionFlag = true
      const redirectionTokenResponse = await handlePOSTRedirection()
      this.excelUploadRedirectionFlag = false
      if (redirectionTokenResponse.status !== 201) return
      window.open(`${process.env.VUE_APP_DATAINPUT_URL}/#/home?token=${redirectionTokenResponse.data.token}`, '_blank')
    }
  },
  mounted () {
  },
  components: {
    Button,
    ContainerFlat,
    Container,
    PageTitle
  }
}
</script>

<style scoped>

</style>
