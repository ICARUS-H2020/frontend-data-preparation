<template>
    <analytics-jobs :organization="organizationDTO" />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'WorkspaceJobs',
    computed: {
        ...mapGetters(['userDTO', 'organizationDTO']),
    },
};
</script>
