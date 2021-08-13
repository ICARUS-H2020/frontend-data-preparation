<template>
    <div class="organization">
        <div class="card overview">
            <div
                class="header"
                :class="{ 'default-bg-image': !hasBannerImage }"
                :style="{ 'background-image': bannerImageUrl }"
            >
                <div class="no-gutters row">
                    <div class="col-sm-12 col-md-12 col-xl-12 content">
                        <div class="widget-content p-0 widget-wrapper">
                            <div class="widget-content-wrapper">
                                <div class="widget-content-left mr-3">
                                    <div class="avatar-icon-wrapper mt-1">
                                        <div class="avatar-icon organization-icon">
                                            <img :src="logoImageUrl" alt="" v-if="hasLogoImage" />
                                            <img src="@/assets/images/org_logo.png" alt="" v-else />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="body">
                <div class="row no-gutters content">
                    <div class="title-wrapper">
                        <h1 class="title">{{ organizationData.legalname }}</h1>
                        <div class="button-wrapper">
                            <b-button
                                class="btn-hover-shine btn-shadow btn-transition btn-sm btn-wide action-button"
                                size="sm"
                                variant="light"
                                v-if="organizationData.manager.id === user.id"
                                @click="$router.push({ name: 'organization-profile-edit' })"
                            >
                                <font-awesome-icon icon="edit" class="btn-icon-wrapper" />
                                Manage
                            </b-button>
                        </div>
                    </div>
                    <div class="location-wrapper">
                        {{ organizationData.city }}, {{ organizationData.country }}, {{ organizationData.address }},
                        {{ organizationData.postalcode }}
                    </div>
                    <div class="website-wrapper">
                        <h2 class="website">{{ organizationData.websiteurl }}</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="row no-gutters">
            <div class="col-sm-8">
                <div class="card description col-sm-12">
                    <h1 class="title">Description</h1>
                    <p class="text">{{ organizationData.description }}</p>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="users col-sm-12">
                    <div class="card inner">
                        <h1 class="title">Members</h1>
                        <div v-for="member in users" :key="member.id">
                            <div class="widget-content p-0 py-2">
                                <div class="widget-content-wrapper">
                                    <div class="widget-content-left mr-3">
                                        <div class="widget-content-left">
                                            <vue-avatar
                                                class="mr-1"
                                                :username="[member.firstname, member.lastname].join(' ')"
                                                :size="32"
                                                :custom-style="{ display: 'inline-block', opacity: 0.4 }"
                                                :lighten="200"
                                            />
                                            <!-- <img width="40" class="rounded-circle" :src="member.image" alt="" v-if="member.image !== null">
                                            <img width="40" class="rounded-circle" src="@/assets/images/user.png" alt="" v-else> -->
                                        </div>
                                    </div>
                                    <div class="widget-content-left flex2">
                                        <div class="widget-heading">
                                            {{ member.firstname }} {{ member.lastname }}
                                            <div
                                                class="badge badge-pill badge-info"
                                                v-if="organizationData.manager.id === member.id"
                                            >
                                                Manager
                                            </div>
                                        </div>
                                        <div class="widget-subheading opacity-7" v-if="member.position">
                                            {{ member.position }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { clone, omit, map } from 'ramda';
import { mapState } from 'vuex';
import { Organization } from '@/api';
import VueAvatar from 'vue-avatar';

library.add(faEdit);
const R = { clone, omit, map };
const baseURL = process.env.VUE_APP_API_URL;

export default {
    name: 'OrganizationProfile',
    components: { FontAwesomeIcon, VueAvatar },
    props: {
        id: {
            type: [String, Number],
            default: null,
        },
    },
    data: () => ({
        users: [],
        organizationData: {},
        organizationFormData: {},
        hasBannerImage: false,
        bannerImageUrl: '',
        hasLogoImage: false,
        logoImageUrl: '',
    }),
    computed: {
        ...mapState(['user', 'organization']),
    },
    async created() {
        if (this.id) {
            const { data: organization } = await Organization.get(this.id);
            this.organizationData = organization;
        } else {
            this.organizationData = this.organization;
            const { data: members } = await Organization.members();
            this.users = members;
        }
        this.organizationFormData = R.clone(this.organizationData);
        if (this.organizationFormData.bannerimage) {
            const { data: bannerImageData } = await Organization.getBannerImage(this.organizationFormData.bannerimage);
            this.hasBannerImage = bannerImageData.length > 0;
            this.bannerImageUrl = `url(${baseURL}/organization/banner-image/${this.organizationFormData.bannerimage})`;
        }
        if (this.organizationFormData.logoimage) {
            const { data: logoImageData } = await Organization.getLogoImage(this.organizationFormData.logoimage);
            this.hasLogoImage = logoImageData.length > 0;
            this.logoImageUrl = `${baseURL}/organization/logo-image/${this.organizationFormData.logoimage}`;
        }
    },
};
</script>

<style lang="scss">
$section-title-font-size: 1.5rem;

.organization {
    .default-bg-image {
        background-image: url('../../assets/images/banner.png') !important;
    }

    .modal-dialog {
        margin-top: 80px !important;
    }

    .overview {
        .header {
            height: 16rem;
            background-color: #dddddd;
            background-size: cover;
            background-position: center center;
            display: flex;
            border-top-left-radius: 0.2rem;
            border-top-right-radius: 0.2rem;

            .content {
                padding: 1rem;
                color: white;
                margin-top: 6rem;

                .widget-wrapper {
                    margin-top: 3.5rem;

                    .organization-icon {
                        display: block;
                        padding: 2px;
                        border: 1px solid #dddddd;
                        width: 150px;
                        height: 150px;
                        border-radius: 0px;
                        background-color: #fff;

                        img {
                            object-fit: cover;
                        }
                    }
                }
            }
        }

        .body {
            .content {
                margin-top: 0rem;
                margin-left: 10rem;
                padding: 0.5rem 1rem 0.5rem 2rem;
                flex-direction: column;

                .title-wrapper {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;

                    .title {
                        font-size: 1.6rem;
                        font-weight: 500;
                        margin-bottom: 0.2rem;
                    }
                }

                .location-wrapper {
                    display: flex;
                    flex-direction: row;
                    font-size: 1rem;
                    font-weight: 400;
                    margin-bottom: 0.2rem;

                    .first-item {
                        margin-right: 0.4rem;
                    }

                    .item {
                        margin-left: 0.4rem;
                        margin-right: 0.4rem;
                    }
                }

                .website-wrapper {
                    .website {
                        color: var(--primary);
                        font-size: 1rem;
                        font-weight: 400;
                        margin-bottom: 0.2rem;
                        cursor: pointer;
                    }
                }
            }
        }
    }

    .description {
        margin-top: 1rem;

        .title {
            font-size: $section-title-font-size;
            margin: 1rem 0;
        }
    }

    .users {
        margin-top: 1rem;
        margin-right: 1rem;
        padding-right: 0;

        .inner {
            padding-left: 15px;
            padding-bottom: 1.5rem;

            .title {
                font-size: $section-title-font-size;
                margin: 1rem 0;
            }

            .vue-avatar--wrapper {
                display: inline-block;
            }
        }
    }
}
</style>
