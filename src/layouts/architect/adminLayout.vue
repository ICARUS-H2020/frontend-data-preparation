<template>
    <div class="app-container app-theme-white">
        <transition name="fade" mode="out-in" appear>
            <Header :headerbg="$store.state.headercolor" />
        </transition>
        <transition name="fade" mode="out-in" appear>
            <Sidebar :sidebarbg="$store.state.sidebarcolor" />
        </transition>
        <div class="app-main__outer">
            <div class="app-main__inner">
                <slot></slot>
            </div>
            <transition name="fade" mode="out-in" appear>
                <Footer />
            </transition>
        </div>
    </div>
</template>

<script>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import Footer from './components/Footer.vue';
import { SET_SIDEBAR_COLOR } from '@/store/mutation-types';

export default {
    name: 'AdminLayout',
    components: {
        Header,
        Sidebar,
        Footer,
    },
    async created() {
        this.$store.commit(SET_SIDEBAR_COLOR, 'bg-dark text-lighter');
    },
};
</script>
