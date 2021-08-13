<template>
    <div class="app-container app-theme-white">
        <transition name="fade" mode="out-in" appear>
            <Header :headerbg="$store.state.headercolor" />
        </transition>
        <transition name="fade" mode="out-in" appear>
            <Sidebar :sidebarbg="$store.state.sidebarcolor" />
        </transition>
        <div class="app-main__outer">
            <div class="app-main__inner" :class="{ 'p-0': isApp }">
                <slot></slot>
            </div>
            <transition name="fade" mode="out-in" appear>
                <Footer />
            </transition>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import Footer from './components/Footer.vue';
import { Organization } from '@/api';
import { NEW_NOTIFICATION } from '@/store/mutation-types';
import { SET_WALLET } from '@/store/modules/eth/mutation-types';
import PushNotifications from '@/views/notifications/PushNotifications';

export default {
    name: 'app',
    components: {
        Header,
        Sidebar,
        Footer,
        // PushNotifications,
    },
    data() {
        return {
            isApp: false,
            socket: null,
        };
    },
    async created() {
        const { data } = await Organization.mine();
        this.$store.commit(SET_WALLET, data.ethwallet);

        // Websocket Notifications
        // if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
        if (!this.socket) {
            this.socket = io(process.env.VUE_APP_WEBSOCKET, { path: '/ws/socket.io', secure: true });
            this.socket.on('connect', () => {
                console.log('WebSocket connected');
            });
            this.socket.on('new_notification', this.newNotification);
        }
        // }
    },
    beforeDestroy() {
        if (this.socket) {
            this.socket.disconnect();
        }
    },
    methods: {
        newNotification({ msg }) {
            this.$store.commit(NEW_NOTIFICATION, JSON.parse(msg));
            console.log(msg);
            PushNotifications.pushNotifications(JSON.parse(msg));
        },
    },
};
</script>
