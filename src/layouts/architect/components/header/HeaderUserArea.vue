<template>
    <div class="d-flex user-header">
        <div class="header-btn-lg pr-0" v-if="signedIn">
            <div class="widget-content p-0">
                <div class="widget-content-wrapper">
                    <div class="widget-content-left header-user-info mr-4">
                        <div class="widget-heading">{{ userDisplayName }}</div>
                        <div class="widget-subheading" v-if="organization">{{ organization.businessname }}</div>
                    </div>
                    <div class="widget-content-left">
                        <b-dropdown
                            toggle-class="p-0 mr-2"
                            menu-class="dropdown-menu-lg"
                            variant="link"
                            no-caret
                            right
                            ref="dropdownMenu"
                        >
                            <span slot="button-content">
                                <div class="icon-wrapper icon-wrapper-alt rounded-circle">
                                    <!-- <v-gravatar
                                        :email="user.email"
                                        default-img="mp"
                                        width="42"
                                        class="rounded-circle"
                                    /> -->
                                    <vue-avatar
                                        class="mr-1"
                                        :username="[user.firstname, user.lastname].join(' ')"
                                        :size="42"
                                        :custom-style="{ display: 'inline-block', opacity: 0.4 }"
                                        :lighten="200"
                                    />
                                    <font-awesome-icon class="ml-1" icon="angle-down" />
                                </div>
                            </span>
                            <div class="dropdown-menu-header">
                                <div class="dropdown-menu-header-inner" :class="$store.state.pagecolor">
                                    <div class="menu-header-image opacity-2 dd-header-bg-6"></div>
                                    <div class="menu-header-content text-left">
                                        <div class="widget-content p-0">
                                            <div class="widget-content-wrapper">
                                                <div class="widget-content-left mr-3">
                                                    <vue-avatar
                                                        class="mr-1"
                                                        :username="[user.firstname, user.lastname].join(' ')"
                                                        :size="42"
                                                        :custom-style="{ display: 'inline-block', opacity: 0.4 }"
                                                        :lighten="200"
                                                    />
                                                    <!-- <v-gravatar
                                                        :email="user.email"
                                                        default-img="mp"
                                                        width="42"
                                                        class="rounded-circle"
                                                    /> -->
                                                </div>
                                                <div class="widget-content-left">
                                                    <div class="widget-heading">{{ userDisplayName }}</div>
                                                    <div class="widget-subheading opacity-8" v-if="organization">
                                                        {{ organization.businessname }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="grid-menu grid-menu-2col overflow-hidden">
                                <div class="no-gutters row">
                                    <div class="col-sm-6">
                                        <button
                                            type="button"
                                            class="btn-icon-vertical btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-primary"
                                            @click="editPersonalProfile"
                                        >
                                            <i class="lnr-user icon-gradient bg-primary btn-icon-wrapper mb-2"></i>
                                            <strong>Personal Profile</strong>
                                        </button>
                                    </div>
                                    <div class="col-sm-6">
                                        <button
                                            type="button"
                                            class="btn-icon-vertical btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-alternate"
                                            @click="loadAdministrationPanel"
                                            v-if="isAdmin"
                                        >
                                            <i class="lnr-cog icon-gradient bg-alternate btn-icon-wrapper mb-2"></i>
                                            <strong>Administration</strong>
                                        </button>
                                        <button
                                            type="button"
                                            class="btn-icon-vertical btn-transition btn-transition-alt pt-2 pb-2 btn btn-outline-alternate"
                                            @click="loadOrganizationProfile"
                                            v-else
                                        >
                                            <i
                                                class="lnr-apartment icon-gradient bg-alternate btn-icon-wrapper mb-2"
                                            ></i>
                                            <strong>Organization Profile</strong>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <ul class="nav flex-column">
                                <li class="nav-item-divider nav-item"></li>
                                <li class="nav-item-btn text-center nav-item">
                                    <button
                                        class="btn-wide btn btn-danger btn-sm btn-icon"
                                        type="button"
                                        @click="logout"
                                    >
                                        <i class="btn-icon-wrapper lnr-exit" />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </b-dropdown>
                    </div>
                </div>
            </div>
        </div>
        <div class="header-btn-lg p-0">
            <button
                type="button"
                class="hamburger hamburger--elastic"
                :class="{ 'is-active': showDrawerSection }"
                @click="showDrawerSection = !showDrawerSection"
                v-b-tooltip.hover
                title="ICARUS Aviation Data Model"
            >
                <div class="icon-wrapper icon-wrapper-alt rounded-circle text-info">
                    <i class="pe-7s-plane icon-gradient bg-icarus-blue"></i>
                </div>
            </button>
        </div>

        <div class="app-drawer-wrapper" :class="{ 'drawer-open': showDrawerSection }" v-on-clickaway="closeDrawer">
            <div class="drawer-nav-btn">
                <button
                    type="button"
                    class="hamburger hamburger--elastic"
                    :class="{ 'is-active': showDrawerSection }"
                    @click="showDrawerSection = !showDrawerSection"
                    style="top: 10px;"
                >
                    <span class="hamburger-box"><span class="hamburger-inner"></span></span>
                </button>
            </div>
            <div class="drawer-content-wrapper">
                <aviation-model />
            </div>
        </div>

        <user-modal
            title="editProfile"
            :user-form-data="userData"
            :edit-own-profile="true"
            :organization-form-data="organization"
        />
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
// import VGravatar from 'vue-gravatar';
import { clone, omit } from 'ramda';
import { mixin as clickaway } from 'vue-clickaway';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faAngleDown,
    faCalendarAlt,
    faTrashAlt,
    faCheck,
    faFileAlt,
    faCloudDownloadAlt,
    faFileExcel,
    faFilePdf,
    faFileArchive,
    faEllipsisH,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Auth } from '@/api';
import { CLEAR_STATE } from '@/store/mutation-types';
import UserModal from '@/layouts/architect/components/modals/UserModal.vue';
import { AviationModel } from '@/components';
import VueAvatar from 'vue-avatar';

library.add(
    faAngleDown,
    faCalendarAlt,
    faTrashAlt,
    faCheck,
    faFileAlt,
    faCloudDownloadAlt,
    faFileExcel,
    faFilePdf,
    faFileArchive,
    faEllipsisH,
);
const R = { clone, omit };

export default {
    name: 'HeaderUserArea',
    components: {
        // VGravatar,
        'font-awesome-icon': FontAwesomeIcon,
        AviationModel,
        UserModal,
        VueAvatar,
    },
    mixins: [clickaway],
    data: () => ({
        showDrawerSection: false,
        userData: null,
    }),
    computed: {
        ...mapState(['user', 'organization', 'signedIn']),
        ...mapGetters(['userDisplayName', 'isAdmin']),
    },
    created() {
        this.userData = R.clone(this.user);
    },
    methods: {
        async logout() {
            const { status } = await Auth.logout();
            if (status === 200) {
                this.$store.commit(CLEAR_STATE);
                this.$router.push({ name: 'login' });
            }
        },
        editPersonalProfile() {
            this.$refs.dropdownMenu.hide();
            this.$bvModal.show('editProfile');
        },
        loadOrganizationProfile() {
            this.$refs.dropdownMenu.hide();
            this.$router.push({ name: 'organization-profile' });
        },
        loadAdministrationPanel() {
            this.$refs.dropdownMenu.hide();
            this.$router.push({ name: 'administration-panel' });
        },
        closeDrawer(event) {
            if (event.srcElement.className !== 'pe-7s-plane icon-gradient bg-icarus-blue' && this.showDrawerSection) {
                this.showDrawerSection = false;
            }
        },
    },
};
</script>

<style lang="scss">
.user-header {
    .user-image {
        display: block;
        background-clip: padding-box;
        margin: auto;
        width: 120px;
    }
    .vue-avatar--wrapper {
        display: inline-block;
    }
}
</style>
