<template>
  <div class="card bg-light col-lg-8 col-md-12 col-sm-12 p-3" style="height: fit-content">
    <div class="animated fadeInDown" v-if="searchResultShown">
      <div class="alert alert-secondary">
        Found {{numOfDonor}} donors
      </div>
    </div>
    <div v-if="searchResultShown" class="animated fadeInDown">
      <div v-for="(obj,index) in personGroups">
        <div class="alert alert-primary card" role="alert">
          Batch {{obj.batch}}:
        </div>
              <person-card v-for="(person,personIndex) in obj.people"
                           :phone="person.phone"
                           :name="person.name"
                           :availableIn="person.availableIn"
                           :bloodGroup="person.bloodGroup"
                           :studentID="person.studentID"
                           :lastDonation="person.lastDonation"
                           :key="personIndex"
              ></person-card>
      </div>
    </div>
  </div>
</template>
<script>
    import {eventBus} from "@/main";
    import PersonCard from "./PersonCard";
    import _ from 'underscore';
    export default {
        name: "SearchResults",
        data: function(){
            return {
                searchResultShown: false,
                personGroups: {},
                numOfDonor: 0
            }
        },
        methods: {
          compare(a,b){
              if(a.studentID> b.studentID){
                  return 1;
              }else {
                  return -1;
              }
              return 0;
          },
            compareObject(a,b){
              if(a.batch< b.batch){
                  return 1;
              }else{
                  return -1;
              }
              return 0;
            }

        },
        created(){
            eventBus.$on('searchComplete',(data)=>{
                this.numOfDonor =  data.data.length;

                data.data.forEach((human,index)=>{
                  human.availableIn=120-Math.round((Math.round((new Date()).getTime())-human.lastDonation)/(1000*3600*24));
                  //REDUNTANT PROPERTY USED!! NEED TO OPTIMIZE IN FUTURE
                  human.studentID = Number(human.studentId);
                });
                let persons = data.data;
                //persons.sort(this.compare);
                let groupedPersons = persons.reduce(function (obj, person) {
                    let batch = person.studentID.toString().substr(0,2);
                    if (!obj.hasOwnProperty(batch)) {
                        obj[batch] = [];
                    }
                    obj[batch].push(person);
                    return obj;
                },{});

                let sortedBatches=[];

                Object.keys(groupedPersons).forEach(function(key) {
                    sortedBatches.push({
                        batch: key,
                        people: groupedPersons[key]
                    });
                });
                sortedBatches.sort(this.compareObject);

                console.log('after grouping, converting to array and sorting batches: ',sortedBatches);


                this.personGroups = sortedBatches;

                this.searchResultShown=true;
            });
            eventBus.$on('clearSearch',()=>{
                this.searchResultShown=false;
            });
        },
        components:{
            'person-card':PersonCard
        }
    }
</script>

<style scoped>

</style>
