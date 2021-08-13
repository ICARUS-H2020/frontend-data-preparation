<template>
    <div class="favorites">
        <div class="row">
            <div class="col-sm-12">
                <div class="card card-border mb-4">
                    <div class="card-header search-header pr-0">
                        <div class="position-relative form-group mb-0 mr-3" style="flex-grow: 1;">
                            <input
                                name="title"
                                placeholder="Enter search terms, use the wildcard operator ? to match any single character and * to match zero or more characters"
                                type="text"
                                class="form-control"
                                v-model="filters.title"
                            />
                        </div>
                        <div class="text-center mr-3 my-1">
                            <b-form-radio-group
                                buttons
                                button-variant="outline-primary"
                                size="md"
                                v-model="filters.items"
                                :options="itemsOptions"
                                @input="retrieveItems()"
                                name="radioBtnOutline"
                            />
                        </div>
                        <div class="sort-button mr-3 my-1">
                            <b-dropdown :text="sortByText" variant="outline-primary">
                                <b-dropdown-item
                                    v-for="option in sortByOptions"
                                    :key="option.value"
                                    :value="option.value"
                                    :active="option.value === params.sort"
                                    @click="selectSortBy(option)"
                                >
                                    {{ option.text }}
                                </b-dropdown-item>
                            </b-dropdown>
                        </div>
                        <div class="mr-3 my-1">
                            <b-button
                                type="button"
                                class="btn-shadow btn btn-warning text-white"
                                v-if="!isLoading"
                                @click="applyFilters()"
                            >
                                Search
                            </b-button>
                            <loading-button variant="warning" :loading="isLoading" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12" v-if="!existingFavItems.length && !isLoading && !hasError">
                <div class="alert alert-warning" role="alert">
                    <font-awesome-icon icon="info-circle" />
                    <span class="ml-2">No results found!</span>
                </div>
            </div>
            <div class="col-12" v-if="hasError">
                <div class="alert alert-danger" role="alert">
                    <font-awesome-icon icon="exclamation-circle" />
                    <span class="ml-2">Something went wrong! Please try again later.</span>
                </div>
            </div>

            <template v-for="item in getFavoritesItems">
                <card-item-overview
                    v-if="
                        paginatedExistingFavItems.find(
                            (fav) =>
                                fav.id === item.id &&
                                ((filters.items === 'Datasets' && fav.item === 'dataset') ||
                                    (filters.items === 'Applications' && fav.item === 'application')),
                        )
                    "
                    :key="item.id"
                    :id="item.id"
                    :target-route="{
                        name: filters.items === 'Applications' ? 'assets.applications.detail' : 'assets.dataset',
                        params: { id: item.id },
                    }"
                    :name="item.name"
                    :date="item.created"
                    :tags="item.tags"
                    :downloads="item.downloads"
                    :image-id="item.coverphoto"
                >
                    <template slot="before">
                        <ribbon classes="bg-success text-white" v-if="item.status === 'Public'">Open Data</ribbon>
                        <ribbon v-if="filters.items === 'Applications'" classes="bg-primary text-white">App</ribbon>
                    </template>

                    <template slot="actions">
                        <div>
                            <font-awesome-icon
                                icon="star"
                                @click="
                                    changeState(item.id);
                                    $event.stopImmediatePropagation();
                                "
                                class="favorite-button"
                                :class="
                                    favoriteItems.find(
                                        (fav) =>
                                            fav.id === item.id &&
                                            ((filters.items === 'Datasets' && fav.item === 'dataset') ||
                                                (filters.items === 'Applications' && fav.item === 'application')),
                                    )
                                        ? 'full-star'
                                        : 'empty-star'
                                "
                                v-b-tooltip.hover="
                                    favoriteItems.find(
                                        (fav) =>
                                            fav.id === item.id &&
                                            ((filters.items === 'Datasets' && fav.item === 'dataset') ||
                                                (filters.items === 'Applications' && fav.item === 'application')),
                                    )
                                        ? 'Remove from favorites'
                                        : 'Add to favorites'
                                "
                            />
                        </div>
                        <template v-if="item.status === 'Public'">
                            <b-button
                                class="btn-sm text-dark purchase-button"
                                variant="light"
                                v-if="activeContracts.indexOf(item.id) === -1"
                                @click="
                                    filters.items === 'Applications'
                                        ? getOpenApplication(item.id)
                                        : getOpenData(item.id);
                                    $event.stopImmediatePropagation();
                                "
                            >
                                <b>GET</b>
                            </b-button>
                        </template>
                        <template v-else-if="item.organization_id === organization.id">
                            <!-- TODO: Edit button -->
                        </template>
                        <template v-else>
                            <!-- params: { assetId: item.id }, -->
                            <b-button
                                class="btn-hover-shine btn-sm btn-shadow btn-transition purchase-button"
                                variant="warning"
                                v-if="
                                    activeContracts.indexOf(item.id) === -1 && pendingContracts.indexOf(item.id) === -1
                                "
                                @click="
                                    $router.push({
                                        name: 'marketplace.quotation',
                                        params: {
                                            assetId: item.id,
                                            assetType: filters.items === 'Applications' ? 'application' : 'dataset',
                                        },
                                    });
                                    $event.stopImmediatePropagation();
                                "
                            >
                                <b>PURCHASE</b>
                            </b-button>

                            <b-button
                                class="btn-sm text-light purchase-button"
                                variant="alternate"
                                v-else-if="pendingContracts.indexOf(item.id) > -1"
                                @click="
                                    $router.push({ name: 'assets.contracts' });
                                    $event.stopImmediatePropagation();
                                "
                            >
                                <b>CONTRACT PENDING</b>
                            </b-button>
                        </template>
                    </template>
                </card-item-overview>
            </template>
            <div
                v-if="!isLoading && !hasError && existingFavItems.length > numOfResultsPerPage"
                class="d-flex align-items-center flex-row col-12 flex-wrap justify-content-md-between justify-content-lg-between justify-content-xl-between align-it-center"
                style="margin-bottom: 2rem;"
            >
                <div style="font-size: 1rem; color: #888; padding-left: 4px; padding-right: 4px;">
                    {{ showPaginationText }}
                </div>
                <div
                    :class="
                        existingFavItems.length <= numOfResultsPerPage * 10
                            ? 'remove-chunks-icon-last rounded-pagination-corners'
                            : 'remove-chunks-icon'
                    "
                >
                    <pagination
                        class="d-flex align-items-center"
                        v-model="page"
                        :records="existingFavItems.length"
                        :per-page="numOfResultsPerPage"
                        :options="{
                            texts: { count: ' ', first: '<<', last: '>>' },
                            chunksNavigation: 'fixed',
                            edgeNavigation: true,
                        }"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { forEachObjIndexed, forEach, prop, sortBy } from 'ramda';
import { Marketplace, Category, Contract, Favorites, UsageAnalytics } from '@/api';
import { CardItemOverview, Ribbon, LoadingButton } from '@/components';
import { library } from '@fortawesome/fontawesome-svg-core';
import Pagination from 'vue-pagination-2';
import { faFilter, faExclamationCircle, faInfoCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import options from '@/config/dataset.json';
import { mapGetters, mapState } from 'vuex';
import { SET_FAVORITES_FILTERS_OBJECT, SET_FAVORITES_ITEMS } from '@/store/mutation-types';

library.add(faFilter, faExclamationCircle, faInfoCircle, faStar);
const R = { forEachObjIndexed, forEach, prop, sortBy };

export default {
    name: 'Favorites',
    components: {
        CardItemOverview,
        FontAwesomeIcon,
        Ribbon,
        LoadingButton,
        Pagination,
    },
    data: () => ({
        itemsOptions: ['Datasets', 'Applications'],
        categoryOptions: [],
        countryOptions: options.countryOptions,
        sortByText: 'Sort By: Date Available',
        selectedSortBy: { text: 'Date Available', value: 'date_created' },
        sortByOptions: [
            { text: 'Date Available', value: 'date_created' },
            { text: 'Date Modified', value: 'date_updated' },
        ],
        params: {
            text: '',
            items: 'Datasets',
            sort: 'date_created',
        },
        filters: {
            title: null,
            tags: null,
            categories: [],
            standards: null,
            temporalCoverage: null,
            spatialCoverage: [],
            dataAssetProvider: null,
            licenses: [],
            relatedDatasets: null,
            status: 'All',
            items: 'Datasets',
            sortBy: 'relevance',
            page: 0,
        },
        activeContracts: [],
        pendingContracts: [],
        isLoading: false,
        hasError: false,
        favoriteItems: [],
        page: 1,
        numOfResultsPerPage: 12,
    }),
    computed: {
        ...mapGetters(['getFavoritesFiltersObject', 'getFavoritesItems']),
        ...mapState(['organization']),
        existingFavItems() {
            const favList = [];
            this.favoriteItems.forEach((favItem) => {
                if (this.favItemExists(favItem)) {
                    favList.push(favItem);
                }
            });

            return favList;
        },
        showPaginationText() {
            if (this.existingFavItems.length > this.numOfResultsPerPage) {
                const from = this.page * this.numOfResultsPerPage - (this.numOfResultsPerPage - 1);
                let to = this.page * this.numOfResultsPerPage;
                if (to > this.existingFavItems.length) {
                    to = this.existingFavItems.length;
                }

                return `Showing ${from} to ${to} of ${this.existingFavItems.length} records`;
            }
            if (this.existingFavItems.length > 1) {
                return `${this.existingFavItems.length} records`;
            }

            return 'One record';
        },
        paginatedExistingFavItems() {
            return this.existingFavItems.slice((this.page - 1) * 12, this.page * 12);
        },
    },
    async created() {
        this.isLoading = true;
        this.$store.commit(SET_FAVORITES_ITEMS, []);
        const { data: favoritesData } = await Favorites.all().catch(() => {
            this.$toastr.e('An error occured.', 'Error');
        });
        this.favoriteItems = favoritesData.map((i) => {
            return { id: i, item: 'dataset' };
        });

        const { data: favoritesApps } = await Favorites.allApps().catch(() => {
            this.$toastr.e('An error occured.', 'Error');
        });
        this.favoriteItems = this.favoriteItems.concat(
            favoritesApps.map((i) => {
                return { id: i, item: 'application' };
            }),
        );

        if (this.organization.id === 1) {
            this.$router.push({ name: 'home' });
            this.$toastr.e('Your organization is not allowed to buy datasets!');
        }
        const [{ data: activePendingContracts }, { data: categories }] = await Promise.all([
            Contract.activePending(),
            Category.all(),
        ]);
        this.categoryOptions = categories;
        this.countryOptions.forEach((global) => {
            global.children = R.sortBy(R.prop('label'), global.children);
            global.children.forEach((continent) => {
                continent.children = R.sortBy(R.prop('label'), continent.children);
            });
        });
        R.forEach((contract) => {
            if (contract.status === 'active') {
                this.activeContracts.push(contract.id);
            } else {
                this.pendingContracts.push(contract.id);
            }
        }, activePendingContracts);
        R.forEachObjIndexed((value, key) => {
            this.filters[key] = value;
        }, this.getFavoritesFiltersObject);
        if (this.getFavoritesItems.length === 0) {
            this.applyFilters();
        }
    },
    methods: {
        onCancel() {
            console.log('User cancelled the loader.');
        },
        selectSortBy(option) {
            this.sortByText = `Sort By: ${option.text}`;
            this.filters.sortBy = option.value;
        },
        async applyFilters() {
            this.hasError = false;
            this.isLoading = true;
            this.$store.commit(SET_FAVORITES_ITEMS, []);
            try {
                const { data: items } = await Marketplace.search(this.filters);

                this.$store.commit(SET_FAVORITES_FILTERS_OBJECT, this.filters);
                this.$store.commit(SET_FAVORITES_ITEMS, items.results);
                this.isLoading = false;
            } catch {
                this.hasError = true;
                this.isLoading = false;
            }
        },
        async getOpenData(id) {
            try {
                await Contract.createVirtualContract(id);
                this.$router.push({ name: 'assets.dataset', params: { id } });
            } catch (error) {
                this.$toastr.e('Error getting dataset');
            }
        },
        async getOpenApplication(id) {
            try {
                await Contract.createAppVirtualContract(id);
                this.$router.push({ name: 'assets.applications.detail', params: { id } });
            } catch (error) {
                this.$toastr.e('Error getting application');
            }
        },

        publishAnalytics(id) {
            UsageAnalytics.publish({
                event_type: 'ASSET_UNSTARRED',
                properties: {
                    asset_id: id,
                    asset_type: 'data_asset',
                    user_id: this.$store.state.user.id,
                    org_id: this.$store.state.organization.id,
                },
                timestamp: Math.floor(Date.now() / 1000),
            }).catch(() => {});
        },
        removeItemFromPage(id) {
            this.favoriteItems = this.favoriteItems.filter(
                (i) =>
                    i.id !== id &&
                    ((this.filters.items === 'Datasets' && i.item === 'dataset') ||
                        (this.filters.items === 'Applications' && i.item === 'application')),
            );

            if (!this.paginatedExistingFavItems.length && this.existingFavItems.length) {
                this.page -= 1;
            }
        },

        async changeState(id) {
            if (this.favoriteItems.find((d) => d.id === id)) {
                if (this.filters.items === 'Datasets') {
                    await Favorites.unlike(id)
                        .then(() => {
                            this.removeItemFromPage(id);
                            this.publishAnalytics(id);
                        })
                        .catch(() => {
                            this.$toastr.e('The dataset could not be removed from Favorites due to an error.', 'Error');
                        });
                } else {
                    await Favorites.unlikeApp(id)
                        .then(() => {
                            this.removeItemFromPage(id);
                            this.publishAnalytics(id);
                        })
                        .catch(() => {
                            this.$toastr.e(
                                'The application could not be removed from Favorites due to an error.',
                                'Error',
                            );
                        });
                }
            }
        },

        retrieveItems() {
            this.applyFilters();
        },
        favItemExists(favItem) {
            return this.getFavoritesItems.find(
                (i) =>
                    i.id === favItem.id &&
                    ((this.filters.items === 'Datasets' && favItem.item === 'dataset') ||
                        (this.filters.items === 'Applications' && favItem.item === 'application')),
            );
        },
    },
};
</script>

<style lang="scss">
.favorites {
    .search-header {
        justify-content: space-between;
        text-transform: none !important;
    }

    input {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
            sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        &::placeholder {
            font-size: 1rem;
            color: #848a90;
        }
    }
}
</style>
