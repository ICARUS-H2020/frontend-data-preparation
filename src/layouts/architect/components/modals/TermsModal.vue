<template>
    <div>
        <b-modal
            id="termsModal"
            variant="primary"
            size="lg"
            header-bg-variant="primary"
            header-text-variant="light"
            title="ICARUS Platform Terms of Use"
            @ok="accept()"
            @cancel="reject()"
            ok-title="Accept"
            ok-variant="primary"
            cancel-title="Reject"
            :hide-footer="hideFooter"
        >
            <vue-perfect-scrollbar
                class="scroll-area-lg"
                :settings="{ maxScrollbarLength: 50 }"
                v-once
                v-html="terms"
            />
        </b-modal>
        <unlock-wallet-modal :id="'unlockWalletCreate'" :callback="acceptCallback" />
    </div>
</template>

<script>
import { terms } from '@/config/terms-of-use.json';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import UnlockWalletModal from './UnlockWalletModal.vue';

export default {
    name: 'TermsModal',
    components: { UnlockWalletModal, VuePerfectScrollbar },
    props: {
        acceptCallback: {
            type: Function,
            default: null,
        },
        rejectCallback: {
            type: Function,
            default: null,
        },
        hideFooter: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            terms,
        };
    },
    methods: {
        accept() {
            this.$bvModal.show('unlockWalletCreate');
        },
        reject() {
            this.$swal({
                title: 'Do you want to proceed with writing the license only in the ICARUS core platform?',
                text: '',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#31679B',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
            }).then(async (result) => {
                if (result.value) {
                    this.rejectCallback();
                }
            });
        },
    },
};
</script>
