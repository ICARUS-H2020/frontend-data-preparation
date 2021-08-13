<template>
    <vue-perfect-scrollbar class="scroll-area-lg" :settings="{ maxScrollbarLength: 50 }" v-once v-html="terms" />
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { terms } from '@/config/terms-of-use.json';

export default {
    name: 'Terms',
    components: { VuePerfectScrollbar },
    data() {
        return {
            terms,
        };
    },
};
</script>
