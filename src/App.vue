<template>
    <component :is="layout">
        <router-view :layout.sync="layout" />
    </component>
</template>

<script>
import { AdminLayout, AppLayout, BaseLayout, PagesLayout } from '@/layouts';
import { SET_FLAT_MODEL, SET_DATA_MODEL } from '@/store/mutation-types';
import { Model } from '@/api';

export default {
    name: 'App',
    components: { AdminLayout, AppLayout, BaseLayout, PagesLayout },
    computed: {
        layout() {
            switch (this.$route.name) {
                case 'error404':
                case 'error500':
                case 'login':
                case 'register':
                case 'register-organization':
                case 'password-recovery':
                case 'forgot-password':
                case null: // To avoid displaying dashboard temporarily before loading the correct route
                    return PagesLayout;
                default:
                    if (this.$store.getters.isAdmin) {
                        return AdminLayout;
                    }
                    return BaseLayout;
            }
        },
    },
    async created() {
        if (this.$store.state.signedIn) {
            Promise.all([Model.getDataModel(), Model.getFlatModel()]).then(([{ data: model }, { data: flatModel }]) => {
                this.$store.commit(SET_DATA_MODEL, model);
                this.$store.commit(SET_FLAT_MODEL, flatModel);
            });
        }
    },
};
</script>

<style lang="scss">
@import '@/assets/scss/style.scss';
</style>
