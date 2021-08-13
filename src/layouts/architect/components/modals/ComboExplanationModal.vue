<template>
    <b-modal
        :id="id"
        variant="primary"
        size="lg"
        header-bg-variant="primary"
        header-text-variant="light"
        title="Combo Dataset Explanation"
    >
        <div v-if="datasets.length">
            <div class="row">
                <div v-for="dataset in datasets" :key="dataset.id" class="position-relative form-group col-sm-12">
                    <label for="title">
                        <h6>
                            Dataset
                            <!-- eslint-disable-next-line prettier/prettier -->
                        <strong>{{ dataset.name }}</strong>:
                            <!-- eslint-disable-next-line prettier/prettier -->
                        Matched
                            <strong>{{ calculateSatisfiedSubQueries(dataset.queries) }}</strong>
                            out of
                            <strong>{{ activeQuery.length }}</strong>
                            sub-queries
                        </h6>
                    </label>
                    <div v-for="query in activeQuery" :key="query.id">
                        <div class="d-flex self-align-start pl-4 pr-4">
                            <label class="mr-2">
                                <font-awesome-icon
                                    v-if="satisfiedStatus(query.id, dataset.queries)"
                                    icon="check"
                                    class="text-success"
                                />

                                <font-awesome-icon
                                    v-else
                                    icon="times"
                                    class="text-danger fa-lg svg-inline--fa fa-w-12"
                                />
                                <!-- <font-awesome-icon
                                    v-else
                                    icon="times"
                                    class="text-danger svg-inline--fa fa-w-16"
                                /> -->
                            </label>

                            <label>
                                Dataset
                                <strong>{{ query.operator.toLowerCase() }}</strong>
                                column title
                                <strong>{{ query.columnTitle }}</strong>

                                with value(s)
                                <strong>{{ query.values }}</strong>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </b-modal>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCheck, faTimes);
export default {
    name: 'ComboExplanationModal',
    components: { FontAwesomeIcon },
    props: {
        id: {
            type: String,
            default: () => '',
        },
        activeQuery: {
            type: Array,
            required: true,
        },
        datasets: {
            type: Array,
            required: true,
        },
    },
    methods: {
        calculateSatisfiedSubQueries(queries) {
            return queries.filter((q) => q.satisfied).length;
        },
        satisfiedStatus(queryId, datasetQueries) {
            return datasetQueries.find((q) => q.id === queryId).satisfied;
        },
    },
};
</script>
