<template>
  <div id="app">
      <navbar></navbar>

<!--      <page-body></page-body>-->
      <router-view class="container"></router-view>
  </div>
</template>
<script>
import Navbar from "@/components/UI/Navbar";
import PageBody from "./components/PageBody/PageBody";
export default {
    data () {
        return {
        }
    },
    components:{
        'navbar':Navbar,
        'page-body':PageBody
    }
}
</script>
<style>

</style>
