<template>
    <div>
      <PageTitle :title="$route.meta.title"></PageTitle>
        <p>Page under maintenance</p>
    </div>
</template>
<script>
import PageTitle from "../components/PageTitle";

export default {
    components:{
      PageTitle
    }
}
</script>