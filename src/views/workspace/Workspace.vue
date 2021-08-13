<template>
    <div class="workspace">
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'Workspace',
};
</script>

<style lang="scss">
@import '~font-awesome/css/font-awesome.css';

.workspace {
    .input-group-text {
        background-color: var(--light);
    }
    .table th {
        border-top: 0;
    }
}
</style>
