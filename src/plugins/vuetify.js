import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);
import colors from 'vuetify/lib/util/colors'
export default new Vuetify({
    theme: {
        dark: localStorage.getItem('darkTheme')==='true',
        themes: {
            light: {
                primary: colors.red.darken3,
                secondary: colors.pink.darken3,
                accent: colors.red.lighten3,
                tertiary: colors.red.lighten4,
                error: colors.purple,
                warning: colors.orange.lighten3,
                success: colors.green.lighten4,
            },
            dark: {
                primary: colors.red.darken3,
                secondary: colors.pink.darken3,
                accent: colors.red.lighten3,
                tertiary: colors.red.lighten4,
                error: colors.purple,
                warning: colors.orange.lighten3,
                success: colors.green.lighten4,
            }
        },
    },
});
