<template>
    <div>
        <div class="alert alert-primary card" role="alert">
            Batch 16:
        </div>
        <ArchivedPerson
            v-for="i in 5"
            :key="i"
            :phone="'8801521438557'"
            :name="'Mir Mahathir'"
            :bloodGroup="2"
            :studentID="1605011"
            :id="'sghwekinknbbws'"
        ></ArchivedPerson>
    </div>
</template>

<script>
import ArchivedPerson from './ArchivedPerson'
export default {
  name: 'ArchivedPersonList',
  components: {
    ArchivedPerson
  }
}
</script>

<style scoped>

</style>
