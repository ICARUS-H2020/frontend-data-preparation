import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueSweetalert2 from 'vue-sweetalert2';
import Toastr from 'vue-toastr';
import ToggleButton from 'vue-js-toggle-button';
import VeeValidate from 'vee-validate';
import Spinner from 'vue-spinkit';
import { abilitiesPlugin } from '@casl/vue';
import { ability } from '@/store/plugins/ability';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueSweetalert2);
Vue.use(Toastr, { clickClose: true, timeout: 3000, defaultPosition: 'toast-bottom-right' });
Vue.use(ToggleButton);
Vue.use(abilitiesPlugin, ability);
Vue.use(VeeValidate);
Vue.component('Spinner', Spinner);

VeeValidate.Validator.extend('strong_password', {
    getMessage: (field) =>
        `The ${field} must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)`,
    validate: (value) => {
        const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'); // eslint-disable-current-line
        return strongRegex.test(value);
    },
});

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
