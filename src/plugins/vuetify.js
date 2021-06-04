import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);
import colors from 'vuetify/lib/util/colors'
export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: colors.red.darken3,
                secondary: colors.pink.darken3,
                accent: colors.red,
                error: colors.purple,
                warning: colors.orange.lighten3
            }
        },
    },
});
