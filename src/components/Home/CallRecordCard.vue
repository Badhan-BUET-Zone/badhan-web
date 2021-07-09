<template>
  <v-card
      class="mb-2"
      dense
  >
    <v-card-text>
      <v-row>
        <v-col cols="9">
          <p>
            {{callRecord.callerId.name}}
            <br>
            {{new Date(callRecord.date).toLocaleString()}}
          </p>
        </v-col>
        <v-col cols="3">
          <v-btn @click="deleteClicked" :loading="deleteLoaderFlag" :disabled="deleteLoaderFlag" color="error" x-small fab depressed><v-icon>mdi-delete</v-icon></v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import {mapActions} from "vuex";

export default {
name: "CallRecordCard",
  props:["callRecord","calleeId"],
  data:()=>{
    return{
      deleteLoaderFlag: false,
    }
  },
  methods:{
    ...mapActions('callrecord',['deleteCallRecord']),
    async deleteClicked(){
      let confirmation = await this.$bvModal.msgBoxConfirm('Delete call record?',{
        centered:true
      })
      if(!confirmation){
        return;
      }
      this.deleteLoaderFlag = true;
      await this.deleteCallRecord({donorId: this.calleeId, callRecordId: this.callRecord._id});
      this.deleteLoaderFlag = false;
    }
  },
  mounted(){
  }
}
</script>

<style scoped>

</style>
