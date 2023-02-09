<template>
  <ContainerOutlined>
    <v-avatar
        size="100"
        color="grey"
        class="ma-2"
    >
      <v-img :src="person.imageUrl" lazy-src="../../assets/account.png">
        <template v-slot:placeholder>
          <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
          >
            <v-skeleton-loader type="avatar"></v-skeleton-loader>
          </v-row>
        </template>
      </v-img>
    </v-avatar>
    <v-card-title>
      {{ person.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ person.calender }}
    </v-card-subtitle>

    <v-card-text class="text--primary">
      <div v-for="(description, index) in person.contribution" :key="index">{{ description }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn
          v-for="(link,linkIndex) in person.links"
          :key="linkIndex"
          :color="link.color"
          class="white--text"
          rounded
          @click="goTo(link.link)"
          small
      >
        <v-icon
            left
            dark
        >
          mdi-{{ link.icon }}
        </v-icon>
      </v-btn>
    </v-card-actions>
  </ContainerOutlined>
</template>

<script>
/* eslint-disable */
import ContainerOutlined from '../Wrappers/ContainerOutlined'

export default {
  props: ['person'],
  components: {
    ContainerOutlined
  },
  name: 'PersonCredit',
  methods: {
    goTo (url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style scoped>

</style>
