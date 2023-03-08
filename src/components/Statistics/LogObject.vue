<template>
    <v-dialog
        v-model="dialog"
        width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :id="`logObjectClickMeButtonId_${date}`"
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
<!--          <VueJsonPretty style="overflow-x: scroll ;max-width: 500px;" :path="'res'" :data="object"> </VueJsonPretty>-->
          under construction...
        </v-card-text>
        <v-card-actions>
          <v-btn :id="`logObjectClickMeCloseButtonId_${date}`" @click="dialog=false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
// import VueJsonPretty from 'vue-json-pretty'
// import 'vue-json-pretty/lib/styles.css'
export default {
  name: 'LogObject',
  props: ['object', 'date'],
  components: {
    // VueJsonPretty
  },
  data () {
    return {
      dialog: false
    }
  },
  computed: {

  },
  methods: {

  },
}
</script>

<style scoped>

</style>
