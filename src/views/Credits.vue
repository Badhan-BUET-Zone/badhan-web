<template>
    <div>
        <v-container fluid>
            <h5 class="mt-5 mb-5">Developers</h5>
            <v-row dense>
                <ContributorCard
                    v-for="(contributor,index) in contributors"
                    :key="index"
                    :name="contributor.name"
                    :subtitle="contributor.subtitle"
                    :image="contributor.image"
                    :descriptions="contributor.descriptions"
                    :links="contributor.links"
                    data-aos="fade-up"
                >
                </ContributorCard>
            </v-row>
            <h5 class="mt-10 mb-5">Contributors From Badhan</h5>
            <v-row dense>
                <ContributorCard
                    v-for="(contributor,index) in badhanContributors"
                    :key="index"
                    :name="contributor.name"
                    :subtitle="contributor.subtitle"
                    :image="contributor.image"
                    :descriptions="contributor.descriptions"
                    :links="contributor.links"
                    data-aos="fade-up"
                >
                </ContributorCard>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import carousel from "vue-owl-carousel";
import ContributorCard from "@/components/Credits/ContributorCard";

export default {
    name: "Credits",
    components: {carousel, ContributorCard},
    data() {
        return {
            contributors: [
                {
                    name: 'MH Rahat',
                    subtitle: 'Platform Manager',
                    image: 'https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Frahat.jpg?alt=media',
                    descriptions: ['Initiator of Badhan Website and Android App', 'Test and Bug Report'],
                    links: [
                        {icon: 'facebook', color: 'primary', link: 'https://www.facebook.com/mhrahat01'},
                        {icon: 'gmail', color: 'red', link: 'mailto:mahamudulrahat@gmail.com'},
                    ]
                },
                {
                    name: 'Mir Mahathir Mohammad',
                    subtitle: 'Frontend Developer',
                    image: 'https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Fmahathir.jpg?alt=media',
                    descriptions: ['UX Design','Web Frontend Development','Hybrid Android App Development'],
                    links:[
                        {icon: 'facebook',color:'primary',link: 'https://web.facebook.com/MirMahathirMohammad'},
                        {icon: 'gmail',color: 'red',link: 'mailto:mirmahathir1@gmail.com'},
                        {icon: 'linkedin',color:'blue',link:'https://www.linkedin.com/in/mir-mahathir-59bb671a5/'},
                        {icon: 'github',color:'grey',link:'https://github.com/mirmahathir1'}
                    ]
                },
                {
                    name: 'Aniruddha GS',
                    subtitle: 'Backend Developer',
                    image: 'https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Faniruddha.jpg?alt=media',
                    descriptions: ['API Development','Database Administration'],
                    links:[
                        {icon:'facebook',color:'primary',link:'https://www.facebook.com/aniruddhags3927'},
                        {icon:'gmail',color:'red',link:'mailto:aniruddhags3927@gmail.com'},
                        {icon:'linkedin',color:'blue',link: 'https://www.linkedin.com/in/aniruddha-ganguly-91b707136/'},
                        {icon:'github',color:'grey',link:'https://github.com/ags3927'}
                    ]
                },
                {
                    name: 'Priyeta Saha',
                    subtitle: 'Android App Developer',
                    image:'https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Fpriyeta.jpg?alt=media',
                    descriptions: ['Flutter Android App Development'],
                    links: [
                        {icon:'facebook',color:'primary',link:'https://www.facebook.com/profile.php?id=100010509641367'},
                        {icon:'gmail',color:'red',link:'mailto:priyetasaha@gmail.com'},
                        {icon:'github',color:'grey',link:'https://github.com/prism97'},
                        {icon:'linkedin',color:'blue',link:'https://www.linkedin.com/in/priyeta-saha-929629151/'}
                    ]
                },
                {
                    name: 'Anisha Islam',
                    subtitle: 'Backend Developer',
                    image: 'https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Fanisha.jpg?alt=media',
                    descriptions: ['API Development'],
                    links:[
                        {icon:'facebook',color:'primary',link:'https://www.facebook.com/anisha.islam.1690'},
                        {icon:'linkedin',color:'blue',link:'https://www.linkedin.com/in/anishaislam8/'},
                    ]
                }
            ],
            badhanContributors:[
                {
                    name: 'Shadman Sakib Showrov',
                    image:'https://firebasestorage.googleapis.com/v0/b/badhan-buet.appspot.com/o/profilepics%2Fsadman.jpg?alt=media',
                    links:[
                        {icon:'facebook',color:'primary',link:'https://www.facebook.com/Showrov1996'},
                        {icon:'linkedin',color:'blue',link:'https://www.linkedin.com/in/showrov1996/'},
                        {icon:'gmail', color: 'red', link: 'mailto:showrov.ndc16@gmail.com'},
                    ]
                }
            ]
        }
    },
    methods: {
        goTo(url) {
            window.open(url, '_blank');
        }
    }
};
</script>

<style scoped>
</style>