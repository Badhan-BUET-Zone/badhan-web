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
                tertiary: colors.grey.lighten3,
                error: colors.purple,
                success: colors.green,
                errorLight: colors.purple.lighten4,
                successLight: colors.green.lighten4,
            },
            dark: {
                primary: colors.red.darken4,
                secondary: colors.pink.darken4,
                tertiary: colors.grey.darken4,
                error: colors.purple.darken2,
                success: colors.green.darken4,
                errorLight: colors.purple.darken4,
                successLight: colors.green.darken4,
            }
        },
    },
});
