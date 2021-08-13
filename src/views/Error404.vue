<template>
    <div class="h-100 bg-animation" :class="$store.state.pagecolor">
        <div class="d-flex h-75 justify-content-center align-items-center">
            <b-col md="4" class="mx-auto app-login-box">
                <div class="app-logo-inverse mx-auto mb-3" />

                <div>
                    <div class="modal-content" style="border-radius: 0;">
                        <div class="modal-header text-center pr-5 pl-5">
                            <div class="modal-title w-100">
                                <div class="d-flex justify-content-center align-items-center">
                                    <h4 class="mt-2 mb-2">Resource Not Found</h4>
                                </div>
                            </div>
                        </div>
                        <div class="modal-body text-center pb-4 pt-4">
                            <div class="d-flex justify-content-center align-items-center mb-4">
                                <div class="ml-1 lead text-dark">
                                    We can't find the resource you are looking for.
                                </div>
                            </div>
                            <b-button variant="warning shadow" @click="toHome">Back to Home</b-button>
                        </div>
                    </div>
                </div>
                <div class="text-center text-white opacity-8 mt-3">
                    Copyright &copy; {{ new Date().getFullYear() }}
                    <a href="https://www.icarus2020.aero" class="text-warning" target="_BLANK">ICARUS Consortium</a>
                    . All rights reserved.
                </div>
            </b-col>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Error404',
    methods: {
        toHome() {
            this.$router.push({ name: 'home' });
        },
    },
};
</script>
