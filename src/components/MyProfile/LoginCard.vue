<template>
<ContainerOutlined>
  <v-card-text style="white-space: pre-line">
    {{loginInformation}}
  </v-card-text>
  <v-card-actions v-if="showDelete">
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
    },
    showDelete: {
      type: Boolean,
      required: true,
    }
  },
  computed:{
    loginInformation(){
      let infoString = "";
      let device = this.device.split(' ')[0];
      let os = this.os.split(' ')[0];
      if(os!=='Other'){
        infoString += "OS: "+os+"\n";
      }
      if(device!=='Other'){
        infoString += "Device: "+device+"\n";
      }
      if(this.ipAddress!=="::1" && this.ipAddress!=="0.0.0.0"){
        infoString += "IP Address: "+this.ipAddress+ "\n";
      }
      if(this.browserFamily!=="Other" ){
        if(this.browserFamily==="Chrome Mobile WebView"){
          infoString += "Client App: Badhan App\n";
        }else{
          infoString += "Client App: "+this.browserFamily+"\n";
        }
      }
      if(infoString===""){
        infoString = "Unknown device";
      }
      return infoString;
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
