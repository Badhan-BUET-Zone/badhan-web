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

        <v-card-actions>
          <Button v-if="!loginsFetched"
                  :color="'primary'"
                  :disabled="getLoginsLoader"
                  :icon="'mdi-refresh'"
                  :text="'Get recent logins'"
                  :loading="getLoginsLoader"
                  :click="getLogins">
          </Button>
        </v-card-actions>

        <v-card-text>
          <p v-if="logins.length===0 && loginsFetched">This is the only logged in device for your account</p>

          <v-row>
            <v-col v-for="(login,index) in logins" :key="login._id" cols="12" sm="6">
              <LoginCard
                  :click="deleteLogin"
                  :browser-family="login.browserFamily"
                  :device="login.device"
                  :ip-address="login.ipAddress"
                  :os="login.os"
                  :_id="login._id"
              ></LoginCard>
            </v-col>
          </v-row>
        </v-card-text>
      </Container>
    </transition>

  </div>
</template>

<script>
import PersonDetails from "../components/Home/PersonDetails";
import {mapActions, mapGetters} from "vuex";
import PageTitle from "../components/PageTitle";
import ShareProfileButton from "../components/ShareProfileButton";
import Container from "../components/Wrappers/Container";
import ldb from "../localDatabase";
import Button from "../components/UI Components/Button";
import ContainerOutlined from "../components/Wrappers/ContainerOutlined";
import LoginCard from "../components/MyProfile/LoginCard";
import {handleGETLogins, handleDELETELogins} from "../api";

export default {
  name: "MyProfile",
  data: () => {
    return {
      showTooltip: false,
      getLoginsLoader: false,
      logins: [],
      loginsFetched: false,
    }
  },
  computed: {
    ...mapGetters(['getID']),
    darkTheme: {
      // getter
      get() {
        return this.$vuetify.theme.dark;
      },
      // setter
      set(newValue) {
        this.$vuetify.theme.dark = newValue
        ldb.theme.save(newValue)
      }
    },
  },
  methods: {
    ...mapActions('notification', ['notifySuccess']),
    async getLogins() {
      this.getLoginsLoader = true;
      let response = await handleGETLogins();
      this.getLoginsLoader = false;
      if (response.status !== 200) return;
      this.logins = response.data.logins;
      this.loginsFetched = true;
    },
    async deleteLogin(tokenId) {
      let response = await handleDELETELogins({tokenId});
      if (response.status !== 200) return;
      this.logins = this.logins.filter(login => login._id !== tokenId);
      this.notifySuccess(response.data.message);
    },
    shareClicked() {
      let routeData = this.$router.resolve({
        name: 'Details',
        query: {
          id: this.getID,
        }
      });
      // navigator.clipboard.writeText(process.env.VUE_APP_FRONTEND_BASE+routeData.href);
      this.$copyText(process.env.VUE_APP_FRONTEND_BASE + routeData.href).then((e) => {
        this.showTooltip = true;
        setTimeout(() => {
          this.showTooltip = false
        }, 2000);
      }, (e) => {
      })
    },
  },

  components: {
    LoginCard,
    ContainerOutlined,
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
