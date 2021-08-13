<template>
    <div class="dataset-in-combo col-sm-6 col-md-6 col-lg-6" style="padding: 0;">
        <div
            class="wrapper"
            :class="[!hasImage ? 'default-bg-image no-image' : 'has-image', side === 'left' ? 'left' : 'right']"
            :style="{ 'background-image': getImageUrl() }"
            @click="goToTargetRoute()"
        >
            <div class="overlay" :class="side === 'left' ? 'left' : 'right'"></div>
            <ribbon classes="bg-success text-white" v-if="item.status === 'Public'">
                Open Data
            </ribbon>

            <div class="col-sm-12 content">
                <b-button
                    v-if="side === 'left'"
                    class="btn-hover-shine btn-sm btn-shadow btn-transition info-button"
                    variant="info"
                    @click="
                        openComboExplanationModal();
                        $event.stopImmediatePropagation();
                    "
                >
                    <font-awesome-icon icon="info" />
                </b-button>
                <div class="title-wrapper mt-2">
                    <h1 class="title">{{ item.name }}</h1>
                </div>
                <div class="details">
                    <div class="row">
                        <div class="col-sm-12">
                            <h6>
                                Date:
                                <b>{{ item.created }}</b>
                            </h6>
                        </div>
                    </div>
                    <div class="row" v-if="categories">
                        <div class="col-sm-12 tag-container">
                            <div class="tag-title">Categories:</div>
                            <div class="badge badge-info tag" v-for="category in categories" :key="category">
                                {{ category }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-item-actions">
                    <font-awesome-icon
                        icon="star"
                        @click="
                            changeState(item.id);
                            $event.stopImmediatePropagation();
                        "
                        class="favorite-button"
                        :class="
                            favoriteItems.find((fav) => fav.id === item.id && fav.item === 'dataset')
                                ? 'full-star'
                                : 'empty-star'
                        "
                        v-b-tooltip.hover="
                            favoriteItems.find((fav) => fav.id === item.id && fav.item === 'dataset')
                                ? 'Remove from favorites'
                                : 'Add to favorites'
                        "
                    />

                    <template v-if="item.status === 'Public'">
                        <b-button
                            class="btn-sm text-dark purchase-button"
                            variant="light"
                            v-if="activeContracts.indexOf(item.id) === -1"
                            @click="
                                getOpenData(item.id);
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
                        <b-button
                            class="btn-hover-shine btn-sm btn-shadow btn-transition purchase-button"
                            variant="warning"
                            v-if="activeContracts.indexOf(item.id) === -1 && pendingContracts.indexOf(item.id) === -1"
                            @click="
                                $router.push({ name: 'marketplace.quotation', params: { assetId: item.id } });
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
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Contract, DataAsset } from '@/api';
import Ribbon from './Ribbon.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faInfo);

const baseURL = process.env.VUE_APP_API_URL;

export default {
    name: 'DatasetInCombo',
    components: { FontAwesomeIcon, Ribbon },
    props: {
        categories: {
            type: Array,
            default: () => null,
        },
        item: {
            type: Object,
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
        side: {
            type: String,
            required: true,
        },
    },
    data: () => ({
        baseURL,
        hasImage: false,
        queryDatasets: [],
    }),
    async created() {
        if (this.item.coverphoto) {
            const { data } = await DataAsset.getImage(this.item.coverphoto);
            this.hasImage = data.length > 0;
        }
    },
    methods: {
        async getOpenData(id) {
            try {
                await Contract.createVirtualContract(id);
                this.$router.push({ name: 'assets.dataset', params: { id } });
            } catch (error) {
                this.$toastr.e('Error getting dataset');
            }
        },
        changeState() {
            this.$emit('change-favorite-state', this.item.id);
        },
        goToTargetRoute() {
            this.$router.push({
                name: 'assets.dataset',
                params: { id: this.item.id },
            });
        },
        getImageUrl() {
            if (this.hasImage) {
                return `url(${baseURL}/data-asset/coverphoto-image/${this.item.coverphoto})`;
            }
            return 'inherit';
        },
        openComboExplanationModal() {
            this.$emit('open-combo-explanation-modal');
        },
    },
};
</script>

<style lang="scss">
.dataset-in-combo {
    margin-bottom: 2rem;

    .overlay {
        position: absolute;
        top: 0;
        left: 0px;
        right: 0px;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .left {
        border-top-left-radius: 0.3rem;
        border-bottom-left-radius: 0.3rem;
    }

    .right {
        border-top-right-radius: 0.3rem;
        border-bottom-right-radius: 0.3rem;
    }

    .default-bg-image {
        background-image: url('../assets/images/banner.png') !important;
    }

    .has-image {
        background-size: cover;
    }

    .no-image {
        background-size: 250%;
    }

    .wrapper {
        height: 14rem;
        background-repeat: no-repeat;
        background-position: center center;
        display: flex;
        cursor: pointer;

        .content {
            padding: 0.25rem 0.5rem;
            color: white;

            .title-wrapper {
                height: 5rem;
                display: flex;
                align-items: center;
                justify-content: center;

                .title {
                    text-align: center;
                    font-size: 1.3rem;
                    margin-bottom: 0.6rem;
                }
            }

            .details {
                position: absolute;
                bottom: 4rem;

                h6 {
                    font-size: 0.9rem;
                    margin-bottom: 0.3rem;
                }

                .tag-container {
                    display: flex;
                    align-items: baseline;
                    justify-content: flex-start;

                    .tag-title {
                        font-size: 0.9rem;
                        margin-bottom: 0.3rem;
                        margin-right: 0.3rem;
                    }

                    .tag {
                        color: #fff;
                        font-size: 0.6rem;
                        padding: 5px 6px;
                        margin-right: 3px;
                    }
                }
            }

            .purchase-button {
                position: absolute;
                bottom: 15px;
                right: 10px;
                color: white;
                font-size: 0.6rem;
            }

            .favorite-button {
                position: absolute;
                bottom: 20px;
            }

            .info-button {
                position: absolute;
                z-index: 1;
                left: 0px;
                top: 10px;
                color: white;
                font-size: 0.6rem;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
    }
}
</style>
