<template>
  <div>
    <v-dialog
        v-model="dialog"
        width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            x-small
            text
            v-bind="attrs"
            v-on="on"
        >
          Click Me
        </v-btn>
      </template>

      <v-card>
        <v-card-text>
          <VueJsonPretty style="overflow-x: scroll ;max-width: 500px;" :path="'res'" :data="object"> </VueJsonPretty>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog=false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
export default {
  name: "LogObject",
  props:["object"],
  components:{
    VueJsonPretty
  },
  data() {
    return {
      dialog: false
    }
  },
  computed:{

  },
  methods:{

  },
  mounted(){
  }


}
</script>

<style scoped>

</style>
