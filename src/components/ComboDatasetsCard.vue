<template>
    <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
        <div class="d-flex">
            <dataset-in-combo
                :key="combination[0].id"
                :item="combination[0]"
                :active-contracts="activeContracts"
                :pending-contracts="pendingContracts"
                :favorite-items="favoriteItems"
                :organization="organization"
                side="left"
                @open-combo-explanation-modal="openComboExplanationModal"
                @change-favorite-state="changeFavoriteState"
            ></dataset-in-combo>
            <div class="vl"></div>
            <dataset-in-combo
                :key="combination[1].id"
                :item="combination[1]"
                :active-contracts="activeContracts"
                :pending-contracts="pendingContracts"
                :favorite-items="favoriteItems"
                :organization="organization"
                side="right"
                @change-favorite-state="changeFavoriteState"
            ></dataset-in-combo>
        </div>
    </div>
</template>

<script>
import DatasetInCombo from './DatasetInCombo.vue';

export default {
    name: 'ComboDatasetsCard',
    components: { DatasetInCombo },
    props: {
        id: {
            type: [String, Number],
            required: true,
        },
        combination: {
            type: Array,
            required: true,
        },
        activeContracts: {
            type: Array,
            required: true,
        },
        pendingContracts: {
            type: Array,
            required: true,
        },
        favoriteItems: {
            type: Array,
            required: true,
        },
        organization: {
            type: Object,
            required: true,
        },
        activeQuery: {
            type: Array,
            required: true,
        },
    },
    computed: {
        comboDatasetInfo() {
            return [
                { name: this.combination[0].name, queries: this.combination[0].queries },
                { name: this.combination[1].name, queries: this.combination[1].queries },
            ];
        },
    },
    methods: {
        openComboExplanationModal() {
            this.$emit('open-combo-explanation-modal', this.comboDatasetInfo);
        },
        changeFavoriteState(id) {
            this.$emit('change-favorite-state', id);
        },
    },
};
</script>

<style lang="scss">
.vl {
    border-left: 1px solid rgb(71, 71, 71);
    height: 14rem;
}
</style>
