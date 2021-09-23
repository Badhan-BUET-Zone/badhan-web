<template>
<ContainerOutlined>
  <v-card-text>
    <b>OS:</b> {{os}},
    <b>Device:</b> {{device}},
    <b>IPAddress: </b> {{ipAddress}},
    <b>Browser:</b> {{browserFamily}}
  </v-card-text>
  <v-card-actions>
    <Button
        :click="deleteClicked"
        :loading="deleteLoaderFlag"
        :disabled="deleteLoaderFlag"
        :text="'Logout'"
        :icon="'mdi-delete'"
        :color="'warning'">
    </Button>
  </v-card-actions>
</ContainerOutlined>
</template>

<script>
import ContainerOutlined from "../Wrappers/ContainerOutlined";
import Button from "../UI Components/Button";
export default {
  name: "LoginCard",
  props:{
    click: {
      type: Function,
      required: true,
    },
    _id:{
      type: String,
      required: true,
    },
    os: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    browserFamily: {
      type: String,
      required: true,
    },
    device: {
      type: String,
      required: true,
    }
  },
  components: {Button, ContainerOutlined},
  data: () => {
    return {
      deleteLoaderFlag: false,
    }
  },
  methods:{
    async deleteClicked(){
      this.deleteLoaderFlag = true;
      await this.click(this._id);
      this.deleteLoaderFlag = false;
    }
  }
}
</script>

<style scoped>

</style>
