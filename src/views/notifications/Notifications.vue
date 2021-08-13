<template>
    <div class="notifications">
        <div class="row">
            <div class="col-sm-12 col-lg-12">
                <div class="card-hover-shadow-2x mb-3 card">
                    <div class="card-header-tab card-header">
                        <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                            <i class="header-icon lnr-alarm icon-gradient bg-malibu-beach"></i>
                            Notifications List
                        </div>
                        <div class="btn-actions-pane-right text-capitalize actions-icon-btn">
                            <button
                                class="btn btn-link btn-sm"
                                @click="markAllAsSeen()"
                                :disabled="unreadNotifications.length === 0"
                            >
                                Mark all as seen
                            </button>
                        </div>
                    </div>
                    <div class="scroll-area-lg content-container">
                        <VuePerfectScrollbar class="scrollbar-container w-100" v-if="getNotifications.length > 0">
                            <ul class="todo-list-wrapper list-group list-group-flush">
                                <li
                                    class="list-group-item"
                                    v-for="notification in getNotifications"
                                    :key="notification._notif_id"
                                    :class="{ 'new-notification': notification.seen_on === null }"
                                >
                                    <div class="todo-indicator" :class="formatStage(notification.notif_type)"></div>
                                    <div class="widget-content p-0">
                                        <div class="widget-content-wrapper">
                                            <div class="widget-content-left ml-2">
                                                <div class="widget-heading">
                                                    {{ notificationTypes[notification.notif_type].title() }}
                                                </div>
                                                <div class="widget-subheading">
                                                    {{
                                                        notificationTypes[notification.notif_type].body(
                                                            notification.meta,
                                                        )
                                                    }}
                                                </div>
                                                <div class="widget-subheading">
                                                    <time-ago :datetime="notification._created_on" long />
                                                </div>
                                            </div>

                                            <div class="widget-content-right notification-actions text-right">
                                                <button
                                                    title="Mark as read"
                                                    class="btn btn-link btn-icon btn-icon-only btn-sm"
                                                    v-if="notification.seen_on === null"
                                                    @click="markOneAsSeen(notification._notif_id)"
                                                >
                                                    <font-awesome-icon icon="eye" />
                                                </button>
                                                <button
                                                    title="Delete Notification"
                                                    class="btn btn-link btn-icon btn-icon-only btn-sm"
                                                    @click="deleteNotification(notification._notif_id)"
                                                >
                                                    <font-awesome-icon icon="trash-alt" style="color: red;" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </VuePerfectScrollbar>
                        <div class="text-center" v-else>
                            <p>There are no notifications yet.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { mapState, mapGetters } from 'vuex';
import { Notifications } from '@/api';
import TimeAgo from 'vue2-timeago';
import notificationTypes from '@/config/notification-types';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { MARK_NOTIFICATION_AS_SEEN, MARK_ALL_NOTIFICATIONS_AS_SEEN, DELETE_NOTIFICATION } from '@/store/mutation-types';

library.add(faEye, faTrashAlt);

export default {
    name: 'Notifications',
    components: { FontAwesomeIcon, TimeAgo, VuePerfectScrollbar },
    msg: 'msg',
    data: () => ({
        notificationTypes: null,
    }),
    computed: {
        ...mapState(['user']),
        ...mapGetters(['getNotifications', 'unreadNotifications']),
    },
    async created() {
        this.notificationTypes = notificationTypes;
    },
    methods: {
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
                    return 'bg-danger';
                case 'CONTRACT_ACCEPTED':
                case 'SUGGESTION_PROPOSED':
                case 'JOB_STARTED':
                case 'DATASET_ADDED':
                case 'INFORM_DATASET_UPDATED':
                case 'DATASET_DOWNLOAD_COMPLETED_INVALID':
                    return 'bg-info';
                case 'CONTRACT_PAID':
                case 'SUGGESTION_ACCEPTED':
                case 'CONTRACT_OFFER_ACCEPTED':
                case 'JOB_COMPLETED':
                case 'DATA_CHECKIN_JOB_COMPLETED':
                case 'DATA_ASSET_UPDATE_COMPLETED':
                case 'DATASET_DOWNLOAD_COMPLETED_VALID':
                    return 'bg-success';
                case 'CONTRACT_OFFERED':
                case 'CONTRACT_NEGOTIATED':
                case 'CONTRACT_COUNTERED':
                    return 'bg-warning';
                case 'REQUEST':
                    return 'bg-alternate';
                default:
                    return 'bg-light';
            }
        },
        async markAllAsSeen() {
            try {
                this.$store.commit(MARK_ALL_NOTIFICATIONS_AS_SEEN);
                await Notifications.seenAll();
            } catch {
                console.log('Something went wrong');
            }
        },
        async markOneAsSeen(id) {
            try {
                this.$store.commit(MARK_NOTIFICATION_AS_SEEN, id);
                await Notifications.seen(id);
            } catch {
                console.log('Something went wrong');
            }
        },
        async deleteNotification(id) {
            this.$store.commit(DELETE_NOTIFICATION, id);
            await Notifications.delete(id);
        },
    },
};
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';

.notifications {
    .content-container {
        height: 70vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-actions {
        min-width: 75px;
    }

    .new-notification {
        background-color: $transparent-bg-info;
    }

    .asset-name {
        color: #495057;
    }

    .widget-heading {
        color: black;
    }
}
</style>
