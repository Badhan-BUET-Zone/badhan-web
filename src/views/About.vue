<template>
  <div>
    <PageTitle :title="$route.meta.title"></PageTitle>
    <!--    <iframe style="height: 100vh; width: 100%"-->
    <!--            src="https://docs.google.com/document/d/e/2PACX-1vTamaAg-1VswXa2Zd2UScuNBbQAgoIA0AYb1r_Z9Nl7rotLh2_AQEf24kiX4XfL210gCXTKY4_JNB3c/pub?embedded=true"></iframe>-->
    <Container>
      <v-card-text>
        <VueMarkdown>{{text}}</VueMarkdown>
      </v-card-text>
    </Container>

  </div>

</template>

<script>
import PageTitle from "../components/PageTitle";
import VueMarkdown from 'vue-markdown';
import readme from '../../README.md';
import Container from "../components/Wrappers/Container";
export default {
  name: "About",
  components: {Container, PageTitle,VueMarkdown},
  data() {
    return {
      text:readme
    }

  },
  mounted(){
    let result = this.text.match(/Java(Script)/);
  }
}
</script>

<style scoped>

</style>
