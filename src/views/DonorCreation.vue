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
        Upload Excel File
      </v-card-title>
      <v-card-text>
        <Button
          :loading="excelUploadRedirectionFlag"
          :disabled="excelUploadRedirectionFlag"
          :color="'primary'"
          :icon="'mdi-upload'"
          :text="'Upload Excel File'" :click="redirectExcelUpload"></Button>
      </v-card-text>
    </Container>
  </div>
</template>

<script>
import PageTitle from '../components/PageTitle'
import { required } from 'vuelidate/lib/validators'
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
      jsonFile: null,
      invalidJSONError: null,
      listOfDonors: [],
      donorPage: 1,
      excelUploadRedirectionFlag: false
    }
  },

  validations: {
    jsonFile: {
      required
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
      window.open(`https://badhan-datainput-test1.netlify.app/#/home?token=${redirectionTokenResponse.data.token}`, '_blank')
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
