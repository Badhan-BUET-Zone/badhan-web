<template>
  <v-card
      class="mb-2"
      dense
  >
    <v-card-text>
      <v-row>
        <v-col cols="9">
          <p>
            {{callRecord.callerId.name}}<br>
            <b>Hall: </b>{{halls[callRecord.callerId.hall]}}<br>
            <b>Designation: </b>{{designations[callRecord.callerId.designation]}}<br>
            <b>Time: </b>{{dateString}} at {{time}}
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
import {halls,designations} from "@/mixins/constants";

export default {
name: "CallRecordCard",
  props:["callRecord"],
  data:()=>{
    return{
      deleteLoaderFlag: false,
      halls,
      designations,
      date:0,
      month:0,
      year:0,
      time:"0",
      dateString: "0",
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
      await this.deleteCallRecord({donorId: this.callRecord.calleeId, callRecordId: this.callRecord._id});
      this.deleteLoaderFlag = false;
    }
  },
  mounted(){
    let dateObject = new Date(this.callRecord.date);


    this.dateString = dateObject.toDateString();
    this.time = dateObject.toLocaleTimeString();
  }
}
</script>

<style scoped>

</style>
