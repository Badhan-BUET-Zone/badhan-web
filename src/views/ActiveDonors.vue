<template>
  <div>
    <PageTitle></PageTitle>
    <Container>
      <v-card-text>
        Page under construction <v-icon>mdi-hammer</v-icon>
      </v-card-text>
    </Container>
    <div style="max-width: 700px" class="mx-auto">
      <PersonCardNew v-for="donor in activeDonors" :key="donor._id" :donor="donor">

      </PersonCardNew>
    </div>
    <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import PageTitle from "../components/PageTitle";

import Container from "../components/Wrappers/Container";
import ContainerFlat from "../components/Wrappers/ContainerFlat";
import {mapActions, mapGetters} from "vuex";
import PersonCardNew from "../components/PersonCardNew";
export default {
  name: "ActiveDonors",
  components: {PersonCardNew, PageTitle,ContainerFlat, Container},
  methods:{
    ...mapActions('activeDonors',['fetchActiveDonors']),
    async searchActiveDonorsAndSet(){
      let payloadForGetActiveDonors = {
        bloodGroup:-1,
        hall:5,
        batch:"",
        name:"",
        address:"",
        isAvailable:true,
        isNotAvailable:true,
        availableToAll:true,
        markedByMe:true,
      }
      this.activeDonorsLoader=true;
      await this.fetchActiveDonors(payloadForGetActiveDonors);
      this.activeDonors = this.getActiveDonors;
      this.activeDonorsLoader=false;
    }
  },
  computed:{
    ...mapGetters('activeDonors',['getActiveDonors']),
  },
  mounted() {
    this.searchActiveDonorsAndSet();
  },
  data: () => {
    return {
      activeDonors:[],
      activeDonorsLoader: false,
    }
  }
}
</script>

<style scoped>

</style>