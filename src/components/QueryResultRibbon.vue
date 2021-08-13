<template>
    <div class="query-result-ribbon">
        <span :class="classes"><slot /></span>
    </div>
</template>

<script>
export default {
    name: 'QueryResultRibbon',
    props: {
        classes: {
            type: String,
            default: 'bg-primary text-light',
        },
    },
};
</script>

<style lang="scss">
.query-result-ribbon {
    position: absolute;
    left: 25px;

    span {
        position: relative;
        display: block;
        text-align: center;
        font-size: 0.8rem;
        font-weight: bold;
        line-height: 1;
        padding: 8px 8px 8px;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        min-width: 100px;
        box-shadow: 2px 2px 3px 0 #333;
    }
}
</style>
