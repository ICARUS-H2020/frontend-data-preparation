<template>
    <div class="header-dots">
        <router-link
            class="mr-2"
            :to="{ name: 'query-history' }"
            v-b-tooltip.hover
            title="Query History"
            v-if="!isAdmin"
        >
            <div class="icon-wrapper icon-wrapper-alt rounded-circle text-secondary">
                <div class="icon-wrapper-bg bg-secondary"></div>
                <i class="pe-7s-search text-secondary"></i>
            </div>
        </router-link>
        <router-link class="mr-2" :to="{ name: 'favorites' }" v-b-tooltip.hover title="Favorites" v-if="!isAdmin">
            <div class="icon-wrapper icon-wrapper-alt rounded-circle text-alternate">
                <div class="icon-wrapper-bg bg-alternate"></div>
                <i class="pe-7s-star text-alternate"></i>
            </div>
        </router-link>
        <b-dropdown
            toggle-class="p-0"
            menu-class="dropdown-menu-xl"
            variant="link"
            :class="{ active: areNotificationsActive }"
            v-b-tooltip.hover
            title="Notifications"
            no-caret
            right
            ref="dropdownMenu"
            v-if="!isAdmin"
        >
            <span slot="button-content">
                <div class="icon-wrapper icon-wrapper-alt rounded-circle text-primary">
                    <div class="icon-wrapper-bg bg-primary"></div>
                    <i class="pe-7s-bell text-primary"></i>
                    <div class="badge badge-dot badge-dot-md badge-danger" v-if="countNotifications > 0">
                        Notifications
                    </div>
                </div>
            </span>
            <div class="dropdown-menu-header mb-0">
                <div class="dropdown-menu-header-inner" :class="$store.state.pagecolor">
                    <div class="menu-header-content">
                        <h5 class="menu-header-title">Notifications</h5>
                        <h6 class="menu-header-subtitle">
                            You have
                            <b>{{ countNotifications }}</b>
                            unread notifications
                        </h6>
                    </div>
                </div>
            </div>
            <div class="nav-justified" v-if="getNotifications.length > 0">
                <div class="scroll-gradient p-2">
                    <div class="scroll-area">
                        <VuePerfectScrollbar class="scrollbar-container">
                            <div
                                class="vertical-without-time vertical-timeline vertical-timeline--animate vertical-timeline--one-column"
                            >
                                <div
                                    class="vertical-timeline-item vertical-timeline-element"
                                    v-for="notification in getNotifications"
                                    :key="notification._notif_id"
                                    :class="{ 'new-notification': notification.seen_on === null }"
                                >
                                    <div>
                                        <span
                                            class="vertical-timeline-element-icon bounce-in"
                                            v-html="formatStage(notification.notif_type)"
                                        ></span>
                                        <div
                                            class="vertical-timeline-element-content bounce-in"
                                            v-if="notificationTypes"
                                        >
                                            <h4 class="timeline-title">
                                                {{ notificationTypes[notification.notif_type].title() }}
                                                <p v-if="notification.meta.assetName != undefined">
                                                    {{ notification.meta.assetName }}
                                                </p>
                                            </h4>
                                            <div class="mr-3">
                                                {{ notificationTypes[notification.notif_type].body(notification.meta) }}

                                                <div
                                                    class="notification-container"
                                                    v-if="
                                                        notification.notif_type === 'DATASET_DOWNLOAD_COMPLETED_VALID'
                                                    "
                                                >
                                                    <a
                                                        :href="
                                                            notificationTypes[notification.notif_type].link(
                                                                notification.meta,
                                                            )
                                                        "
                                                    >
                                                        {{
                                                            notificationTypes[notification.notif_type].link(
                                                                notification.meta,
                                                            )
                                                        }}
                                                    </a>
                                                </div>
                                            </div>
                                            <p class="float-right mr-3">
                                                <button
                                                    title="Mark as read"
                                                    class="btn btn-link btn-icon btn-icon-only btn-sm"
                                                    v-if="notification.seen_on === null"
                                                    @click="markOneAsSeen(notification._notif_id)"
                                                >
                                                    <font-awesome-icon icon="eye" />
                                                </button>
                                                <time-ago :datetime="notification._created_on" long />
                                            </p>
                                            <span class="vertical-timeline-element-date"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </VuePerfectScrollbar>
                    </div>
                </div>
                <ul class="nav flex-column">
                    <li class="nav-item-divider nav-item mt-0"></li>
                    <li class="nav-item-btn text-center nav-item">
                        <button type="button" class="btn-shadow btn-wide btn btn-focus btn-sm" @click="viewAll">
                            View All
                        </button>
                    </li>
                </ul>
            </div>
            <div class="empty-notifications-container" v-else>
                <p>There are no notifications yet.</p>
            </div>
        </b-dropdown>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { filter } from 'ramda';
import { mapState, mapGetters } from 'vuex';
import { Notifications } from '@/api';
import TimeAgo from 'vue2-timeago';
import notificationTypes from '@/config/notification-types';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { MARK_NOTIFICATION_AS_SEEN, SET_NOTIFICATIONS } from '@/store/mutation-types';

library.add(faEye);

const R = { filter };

export default {
    components: {
        FontAwesomeIcon,
        VuePerfectScrollbar,
        TimeAgo,
    },
    data: () => ({
        R,
        notificationTypes: null,
    }),
    computed: {
        ...mapState(['user']),
        ...mapGetters(['isAdmin', 'getNotifications', 'unreadNotifications']),
        countNotifications() {
            return this.unreadNotifications.length || 'no';
        },
        areNotificationsActive() {
            return this.$route.name === 'notifications';
        },
    },
    async created() {
        const { data } = await Notifications.get(20, 0);
        this.$store.commit(SET_NOTIFICATIONS, data);
        this.notificationTypes = notificationTypes;
    },
    methods: {
        viewAll() {
            this.$refs.dropdownMenu.hide();
            this.$router.push({ name: 'notifications' });
        },
        formatStage(stage) {
            switch (stage) {
                case 'REQUEST_REJECTED':
                case 'CONTRACT_REJECTED':
                case 'CONTRACT_OFFER_REJECTED':
                case 'SUGGESTION_REJECTED':
                case 'JOB_FAILED':
                case 'DATASET_FAILURE':
                case 'DATA_CHECKIN_JOB_FAILED':
                case 'DATA_ASSET_UPDATE_FAILED':
                case 'DATASET_DOWNLOAD_FAILED':
                    return '<i class="badge badge-dot badge-dot-xl badge-danger"> </i>';
                case 'CONTRACT_ACCEPTED':
                case 'SUGGESTION_PROPOSED':
                case 'JOB_STARTED':
                case 'DATASET_ADDED':
                case 'INFORM_DATASET_UPDATED':
                case 'DATASET_DOWNLOAD_COMPLETED_INVALID':
                    return '<i class="badge badge-dot badge-dot-xl badge-info"> </i>';
                case 'CONTRACT_PAID':
                case 'SUGGESTION_ACCEPTED':
                case 'CONTRACT_OFFER_ACCEPTED':
                case 'JOB_COMPLETED':
                case 'DATA_CHECKIN_JOB_COMPLETED':
                case 'DATA_ASSET_UPDATE_COMPLETED':
                case 'DATASET_DOWNLOAD_COMPLETED_VALID':
                    return '<i class="badge badge-dot badge-dot-xl badge-success"> </i>';
                case 'CONTRACT_OFFERED':
                case 'CONTRACT_NEGOTIATED':
                case 'CONTRACT_COUNTERED':
                    return '<i class="badge badge-dot badge-dot-xl badge-warning"> </i>';
                case 'REQUEST':
                    return '<i class="badge badge-dot badge-dot-xl badge-alternate"> </i>';
                default:
                    return '<i class="badge badge-dot badge-dot-xl badge-light"> </i>';
            }
        },
        async markOneAsSeen(id) {
            this.$refs.dropdownMenu.show();
            try {
                this.$store.commit(MARK_NOTIFICATION_AS_SEEN, id);
                await Notifications.seen(id);
            } catch {
                console.log('Something went wrong');
            }
        },
    },
};
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
.header-dots a {
    text-decoration: none;
    &:hover {
        text-decoration: none;
    }
}
.header-dots a.active .icon-wrapper,
.header-dots .btn-group.b-dropdown.dropdown.active .icon-wrapper {
    border-width: 2px;
    border-style: solid;
    border-radius: 40px;
}
.header-dots .icon-wrapper-alt .icon-wrapper-bg {
    opacity: 0.2;
}

.empty-notifications-container {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.new-notification {
    background-color: $transparent-bg-info;
}

.btn-icon-only {
    margin-bottom: -3px;
}

.notification-container {
    max-width: 300px !important;
}
</style>
