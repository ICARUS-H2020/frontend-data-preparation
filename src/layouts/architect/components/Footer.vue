<template>
    <div class="app-footer">
        <div class="app-footer__inner">
            <div class="app-footer-left">
                Copyright &copy; {{ new Date().getFullYear() }}&nbsp;
                <a href="https://www.icarus2020.aero" class="ml-1" target="_BLANK">ICARUS Consortium</a>
                . All rights reserved.
            </div>
            <div class="app-footer-right">
                <template v-if="network">
                    <span class="text-success mr-2"><font-awesome-icon icon="circle" /></span>
                    Connected to {{ networkName }}
                </template>
                <template v-else>
                    <span class="text-danger mr-2"><font-awesome-icon icon="exclamation-triangle" /></span>
                    Disconnected from Ethereum
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCircle);
library.add(faExclamationTriangle);

export default {
    name: 'Footer',
    components: {
        'font-awesome-icon': FontAwesomeIcon,
    },
    computed: {
        ...mapState('eth', ['network']),
        ...mapGetters('eth', ['networkName']),
    },
};
</script>
