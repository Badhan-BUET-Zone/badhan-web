<template>
  <div>
    <PageTitle></PageTitle>
    <Container>
      <v-card-title>
        বাঁধন বুয়েট জোন
      </v-card-title>
      <v-card-text>
        <span class="title">
          বাঁধনের পক্ষ থেকে আপনাকে স্বাগতম। জরুরি রক্ত ডোনেশন পেতে নিম্নের বাঁধন সদস্যদের সাথে যোগাযোগ করুন।
        </span>
      </v-card-text>
      <transition name="slide-fade-down" mode="out-in">
      <v-card-text v-if="!getPublicContactsLoaderFlag" :key="'publicLoaded'">
        <ContainerOutlined v-for="(group,index) in getPublicContacts" :key="index">
          <v-card-title>
            <span v-if="group.bloodGroup!==-1"> {{ group.bloodGroup | getBloodGroupString }} রক্তের জন্য </span>
            <span v-else>যেকোনো নেগেটিভ রক্তের জন্য</span>
          </v-card-title>
          <ContainerFlat v-for="contact in group.contacts" :key="contact._id">
            <v-card-title>
              {{ contact.name }}
            </v-card-title>
            <v-card-subtitle>
              Phone: +{{ contact.phone }}
            </v-card-subtitle>
            <Button
                :icon="'mdi-phone'"
                :text="'Direct Call'"
                :disabled="false"
                :color="'secondary'"
                :loading="false"
                :click="()=>{directCallClicked(contact.phone)}"
            ></Button>
          </ContainerFlat>
        </ContainerOutlined>
      </v-card-text>
      <v-card-text class="title" v-else :key="'publicLoading'">
        একটু অপেক্ষা করুন
        <v-skeleton-loader type="article"></v-skeleton-loader>
      </v-card-text>
      </transition>
    </Container>
  </div>
</template>

<script>
import PageTitle from "../components/PageTitle";
import Container from "../components/Wrappers/Container";
import {mapActions, mapGetters} from "vuex";
import ContainerOutlined from "../components/Wrappers/ContainerOutlined";
import ContainerFlat from "../components/Wrappers/ContainerFlat";
import Button from "../components/UI Components/Button";
import {directCall} from "../mixins/helpers";

export default {
  name: "PublicContacts",
  components: {Button, ContainerFlat, ContainerOutlined, Container, PageTitle},
  computed: {
    ...mapGetters('publicContacts', ['getPublicContacts', 'getPublicContactsLoaderFlag'])
  },
  methods: {
    ...mapActions('publicContacts', ['fetchPublicContacts']),
    directCallClicked(phone) {
      directCall(phone)
    }
  },
  async mounted() {
    await this.fetchPublicContacts();
  }
}
</script>

<style scoped>

</style>
