<template>
  <div>
    <PageTitle>
      <ShareProfileButton :id="getID"></ShareProfileButton>
    </PageTitle>
    <PersonDetails :donorId="getID"></PersonDetails>
    <transition appear name="slide-fade-down">
      <Container>
        <v-card-title>Settings</v-card-title>
        <v-card-text>
          <v-switch
              v-model="darkTheme"
              inset
              label="Switch to dark theme"
          ></v-switch>
        </v-card-text>
        <v-card-title>List of Logins</v-card-title>
        <transition name="slide-fade-down" mode="out-in">
        <div v-if="loginsFetched" :key="'loginsFetched'">
          <v-card-text>Current Device</v-card-text>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <LoginCard
                    v-if="currentLogin"
                    :show-delete="false"
                    :click="deleteLogin"
                    :browser-family="currentLogin.browserFamily"
                    :device="currentLogin.device"
                    :ip-address="currentLogin.ipAddress"
                    :os="currentLogin.os"
                    :_id="currentLogin._id"
                ></LoginCard>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text>Other Devices</v-card-text>
          <v-card-text v-if="logins.length===0 && loginsFetched">This is the only logged in device for your account
          </v-card-text>
          <v-card-text>
            <v-row>
              <v-col v-for="(login) in logins" :key="login._id" cols="12" sm="6">
                <LoginCard
                    :show-delete="true"
                    :click="deleteLogin"
                    :browser-family="login.browserFamily"
                    :device="login.device"
                    :ip-address="login.ipAddress"
                    :os="login.os"
                    :_id="login._id"
                ></LoginCard>
              </v-col>
            </v-row>
            <Button
                id="logoutFromAllDevices"
                :color="'primary'"
                :disabled="logoutAllLoader"
                :icon="'mdi-delete'"
                :text="'Signout from all devices'"
                :click="logoutFromAllDevices"
            ></Button>
          </v-card-text>
        </div>
        <v-card-actions v-if="!loginsFetched" :key="'loginFetchAction'">
          <Button
            id="getListOfLoginButtonId"
              :color="'primary'"
              :disabled="getLoginsLoader"
              :icon="'mdi-refresh'"
              :text="'Get recent logins'"
              :click="getLogins">
          </Button>
        </v-card-actions>
        </transition>
        <v-card-actions :key="'deleteAccountButtom'">
          <Button
            id="deleteAccountButtonId"
              :color="'warning'"
              :icon="'mdi-delete'"
              :text="'Delete Account'"
              :click="deleteAccount">
          </Button>
        </v-card-actions>
      </Container>
    </transition>

  </div>
</template>

<script>
import PersonDetails from '../components/Home/PersonDetails'
import { mapActions, mapGetters } from 'vuex'
import PageTitle from '../components/PageTitle'
import ShareProfileButton from '../components/ShareProfileButton'
import Container from '../components/Wrappers/Container'
import ldb from '../localDatabase'
import Button from '../components/UI Components/Button'
import LoginCard from '../components/MyProfile/LoginCard'
import { handleGETLogins, handleDELETELogins } from '@/api'
import { environmentService } from '@/mixins/environment'

export default {
  name: 'MyProfile',
  data: () => {
    return {
      showTooltip: false,
      getLoginsLoader: false,
      logins: [],
      loginsFetched: false,
      currentLogin: null,

      logoutAllLoader: false
    }
  },
  computed: {
    ...mapGetters(['getID']),
    darkTheme: {
      // getter
      get () {
        return this.$vuetify.theme.dark
      },
      // setter
      set (newValue) {
        this.$vuetify.theme.dark = newValue
        ldb.theme.save(newValue)
      }
    }
  },
  methods: {
    ...mapActions('notification', ['notifySuccess', 'notifyError']),
    ...mapActions(['logoutAll']),
    async deleteAccount(){
      await this.notifyError('Account deletion is still under under construction');
    },
    async getLogins () {
      this.getLoginsLoader = true
      const response = await handleGETLogins()
      this.getLoginsLoader = false
      if (response.status !== 200) return
      this.logins = response.data.logins
      this.currentLogin = response.data.currentLogin
      this.loginsFetched = true
    },
    async deleteLogin (tokenId) {
      const response = await handleDELETELogins({ tokenId })
      if (response.status !== 200) return
      this.logins = this.logins.filter(login => login._id !== tokenId)
      this.notifySuccess(response.data.message)
    },
    shareClicked () {
      const routeData = this.$router.resolve({
        name: 'DetailsPage',
        query: {
          id: this.getID
        }
      })
      this.$copyText(environmentService.getFrontendBaseURL() + '/' + routeData.href).then((_e) => {
        this.showTooltip = true
        setTimeout(() => {
          this.showTooltip = false
        }, 2000)
      })
    },
    async logoutFromAllDevices(){
      this.logoutAllLoader = true
      await this.logoutAll()
      this.logoutAllLoader = false
      await this.$router.push('/')

    }
  },

  components: {
    LoginCard,
    Button,
    Container,
    ShareProfileButton,
    PageTitle,
    PersonDetails
  }
}
</script>

<style scoped>

</style>
