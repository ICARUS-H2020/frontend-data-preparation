<template>
    <div class="app-page-title">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i :class="icon" />
                </div>
                <div>
                    {{ heading }}
                    <div class="page-title-subheading">
                        {{ subheading }}
                    </div>
                </div>
            </div>
            <div class="page-title-actions" v-if="hasContentSlot">
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        icon: {
            type: String,
            required: true,
        },
        heading: {
            type: String,
            required: true,
        },
        subheading: {
            type: String,
            default: () => '',
        },
    },
    computed: {
        hasContentSlot() {
            return !!this.$slots.default;
        },
    },
};
</script>
