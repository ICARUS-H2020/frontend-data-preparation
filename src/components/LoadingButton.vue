<template>
    <b-button :variant="variant" class="text-white" disabled v-if="loading">
        <b-spinner small></b-spinner>
        Loading...
    </b-button>
</template>

<script>
export default {
    name: 'LoadingButton',
    props: {
        variant: {
            type: String,
            required: true,
        },
        loading: {
            type: Boolean,
            required: true,
        },
    },
};
</script>
