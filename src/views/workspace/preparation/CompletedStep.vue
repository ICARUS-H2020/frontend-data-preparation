<template>
    <div class="alert alert-secondary mt-1">
        <ul class="mb-0">
            <li v-for="(rule, idx) in step.applied_rules" :key="idx">
                {{ rule }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'CompletedStep',
    props: {
        step: {
            type: Object,
            required: true,
        },
    },
};
</script>

<style lang="scss">
ul {
    list-style-type: none;
    padding-inline-start: 0;
}
</style>
