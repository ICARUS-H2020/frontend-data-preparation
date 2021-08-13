<template>
    <div :class="headerbg" class="app-header header-shadow">
        <div class="logo-src"></div>
        <div class="app-header__content">
            <div class="app-header-left">
                <h5 class="pt-2">
                    <i :class="$route.meta.icon" />
                    &nbsp;
                    {{ $route.meta.title }}
                    <span v-if="subtitle">:</span>
                    <span class="text-muted">{{ subtitle }}</span>
                </h5>
            </div>
            <div class="app-header-right">
                <HeaderDots />
                <UserArea />
            </div>
        </div>
        <div class="app-header__mobile-menu">
            <div>
                <button
                    type="button"
                    class="hamburger close-sidebar-btn hamburger--elastic"
                    v-bind:class="{ 'is-active': isOpen }"
                    @click="toggleMobile('closed-sidebar-open')"
                >
                    <span class="hamburger-box">
                        <span class="hamburger-inner"></span>
                    </span>
                </button>
            </div>
        </div>
        <div class="app-header__menu">
            <span>
                <b-button
                    class="btn-icon btn-icon-only"
                    variant="primary"
                    size="sm"
                    v-bind:class="{ active: isOpenMobileMenu }"
                    @click="toggleMobile2('header-menu-open')"
                >
                    <div class="btn-icon-wrapper">
                        <font-awesome-icon icon="ellipsis-v" />
                    </div>
                </b-button>
            </span>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import HeaderDots from './header/HeaderDots.vue';
import UserArea from './header/HeaderUserArea.vue';

library.add(faEllipsisV);

export default {
    name: 'Header',
    components: {
        HeaderDots,
        UserArea,
        'font-awesome-icon': FontAwesomeIcon,
    },
    props: {
        headerbg: {
            type: String,
            default: () => '',
        },
    },
    data() {
        return {
            isOpen: false,
            isOpenMobileMenu: false,
        };
    },
    computed: {
        ...mapState(['subtitle']),
    },
    methods: {
        toggleMobile(className) {
            const el = document.body;
            this.isOpen = !this.isOpen;

            if (this.isOpen) {
                el.classList.add(className);
            } else {
                el.classList.remove(className);
            }
        },
        toggleMobile2(className) {
            const el = document.body;
            this.isOpenMobileMenu = !this.isOpenMobileMenu;

            if (this.isOpenMobileMenu) {
                el.classList.add(className);
            } else {
                el.classList.remove(className);
            }
        },
    },
};
</script>
