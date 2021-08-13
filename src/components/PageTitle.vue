<template>
    <div class="app-page-title bg-royal text-white">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i :class="icon" />
                </div>
                <div>
                    {{ title }}
                    <div class="badge ml-2" :class="badgeClass" v-if="badgeText">{{ badgeText }}</div>
                    <div class="page-title-subheading">
                        {{ description }}
                    </div>
                </div>
            </div>
            <div class="page-title-actions">
                <slot name="actions" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageTitle',
    props: {
        icon: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: '',
        },
        badgeText: {
            type: String,
            default: '',
        },
        badgeClass: {
            type: String,
            default: 'badge-info',
        },
    },
};
</script>
