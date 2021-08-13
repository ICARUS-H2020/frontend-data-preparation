<template>
    <div class="aviation-model">
        <div class="header bg-icarus-blue text-lighter">
            <h5 class="text-white">ICARUS Aviation Data Model</h5>
        </div>
        <div class="navigation">
            <div class="card navigation-details">
                <div class="card-body">
                    <template v-if="selectedNode">
                        <div class="d-flex align-center justify-content-between">
                            <div class="card-title text-truncate mb-0">{{ selectedNode.data.text }}</div>
                            <span class="badge badge-secondary">{{ selectedNode.data.type }}</span>
                        </div>
                        <p class="cart-text">{{ selectedNode.data.definition }}</p>
                        <div class="footer">
                            <div class="float-left" v-if="!selectedNode.hasChildren()">
                                <button
                                    class="btn btn-sm btn-link p-0"
                                    v-b-tooltip.click="'Copied!'"
                                    @click="copyConcept(selectedNode.id)"
                                >
                                    Copy Concept
                                </button>
                            </div>
                            <div class="float-right" v-if="selectedNode.data.version !== 1">
                                <em>Added in</em>
                                &nbsp;
                                <b class="text-muted">{{ selectedNode.data.version }}</b>
                            </div>
                        </div>
                    </template>
                    <div v-else>
                        <font-awesome-icon icon="info-circle" />
                        Select a concept below to see more information
                    </div>
                </div>
            </div>
            <div class="navigation-filter">
                <div class="input-group input-group-sm">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <font-awesome-icon icon="search" />
                        </div>
                    </div>
                    <input
                        placeholder="Search..."
                        type="text"
                        class="form-control form-control-sm"
                        v-model="searchInput"
                        @input="search = null"
                        @keyup.enter="searchModel"
                    />
                </div>
                <div
                    class="tree-filter-empty mt-1"
                    v-if="search && Object.keys(search).length === 0 && model === search"
                >
                    No concepts found
                </div>
                <div class="tree-filter-empty mt-1" v-if="!model && !search">
                    <span v-if="loading">Loading...</span>
                    <span v-else>Press enter to search</span>
                </div>
            </div>

            <VuePerfectScrollbar class="scrollbar-container" v-if="model && !hideTree">
                <div class="navigation-tree">
                    <tree :data="model" :key="searchInput" :options="options" v-model="selectedNode">
                        <div class="tree-scope" slot-scope="{ node }">
                            <template>
                                <span class="text">
                                    {{ node.text }}
                                </span>
                            </template>
                        </div>
                    </tree>
                </div>
            </VuePerfectScrollbar>

            <div class="navigation-footer">
                <em class="text-dark">Current version:</em>
                <span class="text-primary">
                    <strong>{{ $store.state.modelVersion }}</strong>
                </span>
                <a
                    href="javascript:void(0)"
                    class="float-right"
                    @click="$bvModal.show('suggestNewConcept')"
                    v-if="!isAdmin"
                >
                    Suggest new concept
                </a>
            </div>
        </div>

        <suggestion-modal id="suggestNewConcept" title="Suggest new concept" />
    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import LiquorTree from 'liquor-tree';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { mapGetters } from 'vuex';
import SuggestionModal from '@/layouts/architect/components/modals/SuggestionModal.vue';
import { Model } from '@/api';
import { SET_COPIED_CONCEPT } from '@/store/mutation-types';

library.add(faSearch, faInfoCircle);

export default {
    name: 'AviationDataModel',
    components: { [LiquorTree.name]: LiquorTree, FontAwesomeIcon, VuePerfectScrollbar, SuggestionModal },
    filters: {
        formatVersion(version) {
            return `v${version}.0.0`;
        },
    },
    data: () => ({
        searchInput: null,
        selectedNode: null,
        options: {
            multiple: false,
        },
        search: null,
        loading: false,
    }),
    computed: {
        ...mapGetters(['isAdmin', 'dataModel']),
        model() {
            if (this.searchInput !== null && this.searchInput !== '') {
                if (this.search) {
                    return this.search;
                }
                return null;
            }
            return this.dataModel;
        },
        hideTree() {
            if (this.search && Object.keys(this.search).length === 0 && this.model === this.search) {
                return true;
            }
            return false;
        },
    },
    methods: {
        async searchModel() {
            this.loading = true;
            const { data: search } = await Model.search({ term: this.searchInput });
            this.loading = false;
            this.search = search;
        },
        copyConcept(conceptId) {
            this.$store.commit(SET_COPIED_CONCEPT, conceptId);
            setTimeout(() => {
                this.$root.$emit('bv::hide::tooltip');
            }, 1000);
        },
    },
};
</script>

<style lang="scss">
.aviation-model {
    .header {
        height: 60px;
        h5 {
            padding-top: 20px;
            padding-left: 20px;
        }
    }

    .navigation-filter {
        padding: 10px 10px 10px 10px;
    }

    .navigation-details {
        margin: 10px 10px 0 10px;
        border: 1px solid #e5e5e5;
        background-color: var(--light);
        border-radius: 4px;

        .card-body {
            padding: 10px;
        }

        .card-title {
            text-transform: inherit;
        }
    }

    .navigation-footer {
        position: absolute;
        left: 10px;
        right: 10px;
        bottom: 0;
        padding: 10px;
        background-color: white;
    }

    .tree-root {
        padding: 10px;
    }

    .tree-arrow {
        margin-left: 20px;
    }

    .tree-arrow.has-child {
        margin-left: 0;
        width: 20px;
    }

    .tree-node:not(.selected) {
        .tree-content:hover {
            .tree-arrow.has-child:after {
                border-color: #fff;
            }
        }
    }

    .tree-node.selected > .tree-content {
        background: var(--light);
        .text {
            font-weight: bolder;
            color: var(--dark);
        }
        border-radius: 4px;
    }

    .tree-node.selected > .tree-content > .tree-anchor {
        color: #fff;
    }

    .tree-node:not(.selected) > .tree-content:hover {
        background: var(--primary);
        border-radius: 4px;
        .text {
            color: #fff;
        }
    }

    .tree-content {
        padding: 2px 0;
    }

    .tree-scope {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .tree-filter-empty {
        margin-bottom: 10px;
        text-align: center;
    }

    .input-group-text {
        background-color: var(--light);
    }

    .scrollbar-sidebar,
    .scrollbar-container {
        height: 75vh;
    }
}
</style>
