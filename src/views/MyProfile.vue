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
      </Container>
    </transition>

  </div>
</template>

<script>
import PersonDetails from "../components/Home/PersonDetails";
import {mapGetters} from "vuex";
import PageTitle from "../components/PageTitle";
import ShareProfileButton from "../components/ShareProfileButton";
import Container from "../components/Wrappers/Container";
import ldb from "../localDatabase";

export default {
  name: "MyProfile",
  data: () => {
    return {
      showTooltip: false,
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
    Container,
    ShareProfileButton,
    PageTitle,
    PersonDetails
  }
}
</script>

<style scoped>

</style>
