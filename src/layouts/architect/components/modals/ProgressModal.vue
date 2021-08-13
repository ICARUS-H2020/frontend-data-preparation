<template>
    <b-modal id="progressModal" hide-footer hide-header no-close-on-backdrop no-close-on-esc>
        <div class="loading-indicator">
            <Spinner name="wave" color="var(--primary)" no-fade-in />
            <br />
            <h6 class="message">{{ message }}</h6>
        </div>
    </b-modal>
</template>

<script>
export default {
    name: 'ProgressModal',
    props: {
        message: {
            type: String,
            required: true,
        },
    },
};
</script>
