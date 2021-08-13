<template>
    <div class="card-item-overview col-sm-6 col-md-6 col-lg-4">
        <div
            class="wrapper"
            :class="{ 'default-bg-image': !hasImage }"
            :style="{ 'background-image': getImageUrl() }"
            @click="goToTargetRoute()"
        >
            <div class="overlay"></div>
            <slot name="before" />
            <div class="col-sm-12 content">
                <div class="title-wrapper mt-2">
                    <h1 class="title">{{ name }}</h1>
                </div>
                <div class="details">
                    <div class="row">
                        <div class="col-sm-12">
                            <h6>
                                Date:
                                <b>{{ date }}</b>
                            </h6>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
                            <h6>
                                Downloads:
                                <b>{{ downloads }}</b>
                            </h6>
                        </div>
                    </div>
                    <div class="row" v-if="tags">
                        <div class="col-sm-12 tag-container">
                            <div class="tag-title">Tags:</div>
                            <div class="badge badge-info tag" v-for="tag in tags" :key="tag">{{ tag }}</div>
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
                    <slot name="actions" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { DataAsset } from '@/api';

const baseURL = process.env.VUE_APP_API_URL;

export default {
    name: 'CardItemOverview',
    props: {
        targetRoute: {
            type: Object,
            required: true,
        },
        id: {
            type: [String, Number],
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        tags: {
            type: Array,
            default: () => null,
        },
        categories: {
            type: Array,
            default: () => null,
        },
        downloads: {
            type: [String, Number],
            default: '-',
        },
        imageId: {
            type: [String, Number, null],
            default: null,
        },
    },
    data: () => ({
        baseURL,
        hasImage: false,
    }),
    async created() {
        if (this.imageId) {
            const { data } = await DataAsset.getImage(this.imageId);
            this.hasImage = data.length > 0;
        }
    },
    methods: {
        goToTargetRoute() {
            this.$router.push(this.targetRoute);
        },
        getImageUrl() {
            if (this.hasImage) {
                return `url(${baseURL}/data-asset/coverphoto-image/${this.imageId})`;
            }
            return 'inherit';
        },
    },
};
</script>

<style lang="scss">
.card-item-overview {
    margin-bottom: 2rem;

    .overlay {
        position: absolute;
        top: 0;
        left: 15px;
        right: 15px;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 0.3rem;
    }

    .default-bg-image {
        background-image: url('../assets/images/banner.png') !important;
    }

    .wrapper {
        height: 14rem;
        background-size: cover;
        background-position: center center;
        display: flex;
        border-radius: 0.3rem;
        cursor: pointer;

        .content {
            padding: 0.5rem 1rem;
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

            .edit-button {
                position: absolute;
                bottom: 15px;
                right: 10px;
                font-size: 0.6rem;
            }
        }
    }
}
</style>
