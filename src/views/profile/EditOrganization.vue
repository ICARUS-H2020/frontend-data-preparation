<template>
    <div class="edit-organization">
        <page-title
            title="Manage Organization"
            description="Edit metadata for organization, manage current members and invite new users, edit preferences"
            icon="pe-7s-pen icon-gradient bg-malibu-beach"
            v-slot:actions
        >
            <button
                type="button"
                class="btn-shadow d-inline-flex align-items-center btn btn-light"
                @click="$router.push({ name: 'organization-profile' })"
            >
                Back to Organization
            </button>
        </page-title>

        <div class="row">
            <div class="col-md-12 col-lg-12 col-xl-12">
                <b-card class="mb-3" no-body>
                    <b-tabs class="card-header-tab-animation" v-model="tabIndex" card>
                        <b-tab class="custom-tab">
                            <template slot="title">
                                <span
                                    class="tab-error"
                                    v-if="
                                        errors.has('legalname') ||
                                        errors.has('businessname') ||
                                        errors.has('country') ||
                                        errors.has('city') ||
                                        errors.has('address') ||
                                        errors.has('postalcode') ||
                                        errors.has('websiteurl') ||
                                        errors.has('type')
                                    "
                                >
                                    <font-awesome-icon class="btn-icon-wrapper" icon="exclamation-circle" />
                                    &nbsp;Details
                                </span>
                                <span v-else>Details</span>
                            </template>
                            <div class="row">
                                <div class="position-relative form-group col-sm-6">
                                    <label for="legalname">Legal Name</label>
                                    <input
                                        name="legalname"
                                        placeholder="Enter legal name"
                                        type="text"
                                        class="form-control"
                                        v-model="organizationFormData.legalname"
                                        v-validate="'required'"
                                        :class="{ 'is-invalid': errors.has('legalname') }"
                                        disabled
                                    />
                                </div>
                                <div class="position-relative form-group col-sm-6">
                                    <label for="businessname">Business Name</label>
                                    <input
                                        name="businessname"
                                        placeholder="Enter business name"
                                        type="text"
                                        class="form-control"
                                        v-model="organizationFormData.businessname"
                                        v-validate="'required'"
                                        :class="{ 'is-invalid': errors.has('businessname') }"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div class="row">
                                <div class="position-relative form-group col-sm-6">
                                    <label for="country">Country</label>
                                    <input
                                        name="country"
                                        placeholder="Enter country"
                                        type="text"
                                        class="form-control"
                                        v-model="organizationFormData.country"
                                        v-validate="'required'"
                                        :class="{ 'is-invalid': errors.has('country') }"
                                        disabled
                                    />
                                </div>
                                <div class="position-relative form-group col-sm-6">
                                    <label for="city">City</label>
                                    <input
                                        name="city"
                                        placeholder="Enter city"
                                        type="text"
                                        class="form-control"
                                        v-model="organizationFormData.city"
                                        v-validate="'required'"
                                        :class="{ 'is-invalid': errors.has('city') }"
                                    />
                                </div>
                            </div>
                            <div class="row">
                                <div class="position-relative form-group col-sm-6">
                                    <label for="address">Address</label>
                                    <input
                                        name="address"
                                        placeholder="Enter address"
                                        type="text"
                                        class="form-control"
                                        v-model="organizationFormData.address"
                                        v-validate="'required'"
                                        :class="{ 'is-invalid': errors.has('address') }"
                                    />
                                </div>
                                <div class="position-relative form-group col-sm-6">
                                    <label for="postalcode">Postal Code</label>
                                    <input
                                        name="postalcode"
                                        placeholder="Enter postal code"
                                        type="text"
                                        class="form-control"
                                        v-model="organizationFormData.postalcode"
                                        v-validate="'required'"
                                        :class="{ 'is-invalid': errors.has('postalcode') }"
                                    />
                                </div>
                            </div>
                            <div class="row">
                                <div class="position-relative form-group col-sm-6">
                                    <label for="websiteurl">Website</label>
                                    <input
                                        name="websiteurl"
                                        placeholder="Enter website"
                                        type="text"
                                        class="form-control"
                                        v-model="organizationFormData.websiteurl"
                                        v-validate="'required'"
                                        :class="{ 'is-invalid': errors.has('websiteurl') }"
                                    />
                                </div>
                                <div class="position-relative form-group col-sm-6">
                                    <label for="type">Type</label>
                                    <input
                                        name="type"
                                        placeholder="Enter type"
                                        type="text"
                                        class="form-control"
                                        v-model="organizationFormData.type"
                                        v-validate="'required'"
                                        :class="{ 'is-invalid': errors.has('type') }"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div class="row">
                                <div class="position-relative form-group col-sm-6">
                                    <label for="logoimage">Logo Image</label>
                                    <b-form-file
                                        name="logoimage"
                                        v-model="logoImage"
                                        accept="image/jpeg, image/png"
                                        placeholder="Choose an image or drop it here..."
                                        drop-placeholder="Drop image here..."
                                    ></b-form-file>
                                </div>
                                <div class="col-sm-6">
                                    <label for="bannerimage">Banner Image</label>
                                    <b-form-file
                                        name="bannerimage"
                                        v-model="bannerImage"
                                        accept="image/jpeg, image/png"
                                        placeholder="Choose an image or drop it here..."
                                        drop-placeholder="Drop image here..."
                                    ></b-form-file>
                                </div>
                            </div>
                            <div class="row">
                                <div class="position-relative form-group col-sm-12">
                                    <label for="description">Description</label>
                                    <textarea
                                        name="description"
                                        placeholder="Enter description"
                                        rows="4"
                                        class="form-control"
                                        v-model="organizationFormData.description"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                class="btn-shadow d-inline-flex align-items-center btn btn-warning text-white float-right mb-3"
                                @click="submit()"
                            >
                                Submit
                            </button>
                        </b-tab>
                        <b-tab class="custom-tab">
                            <template slot="title">
                                <span>Members</span>
                            </template>
                            <b-button
                                class="btn-wide btn-hover-shine btn-shadow btn-transition btn-warning text-white float-right mb-3"
                                variant="warning"
                                size="sm"
                                @click="openModal()"
                            >
                                <font-awesome-icon icon="plus" />
                                Invite User
                            </b-button>
                            <div class="alert alert-info mt-5" role="alert" v-if="members.length == 0">
                                <font-awesome-icon icon="info-circle" />
                                <span class="ml-3">No members found!</span>
                            </div>
                            <div v-else>
                                <div class="checkin-table table-responsive">
                                    <table class="align-middle text-truncate mb-0 table table-hover">
                                        <thead>
                                            <tr>
                                                <th class="text-center" width="5%">#</th>
                                                <th class="text-left" width="25%" @click="sortMembers('name')">Name</th>
                                                <th class="text-left">
                                                    <b-button
                                                        variant="white"
                                                        size="sm"
                                                        @click="sortMembers('name')"
                                                        v-b-tooltip="'Sort'"
                                                    >
                                                        <font-awesome-icon
                                                            icon="sort-up"
                                                            v-if="enableSortByName && sortingByName === -1"
                                                        />
                                                        <font-awesome-icon
                                                            icon="sort-down"
                                                            v-if="enableSortByName && sortingByName === 1"
                                                        />
                                                        <font-awesome-icon icon="sort" v-if="!enableSortByName" />
                                                    </b-button>
                                                </th>
                                                <th class="text-left" width="20%" @click="sortMembers('email')">
                                                    Email
                                                </th>
                                                <th class="text-left">
                                                    <b-button
                                                        variant="white"
                                                        size="sm"
                                                        @click="sortMembers('email')"
                                                        v-b-tooltip="'Sort'"
                                                    >
                                                        <font-awesome-icon
                                                            icon="sort-up"
                                                            v-if="enableSortByEmail && sortingByEmail === -1"
                                                        />
                                                        <font-awesome-icon
                                                            icon="sort-down"
                                                            v-if="enableSortByEmail && sortingByEmail === 1"
                                                        />
                                                        <font-awesome-icon icon="sort" v-if="!enableSortByEmail" />
                                                    </b-button>
                                                </th>
                                                <th class="text-left" width="15%" @click="sortMembers('phone')">
                                                    Phone
                                                </th>
                                                <th class="text-left">
                                                    <b-button
                                                        variant="white"
                                                        size="sm"
                                                        @click="sortMembers('phone')"
                                                        v-b-tooltip="'Sort'"
                                                    >
                                                        <font-awesome-icon
                                                            icon="sort-up"
                                                            v-if="enableSortByPhone && sortingByPhone === -1"
                                                        />
                                                        <font-awesome-icon
                                                            icon="sort-down"
                                                            v-if="enableSortByPhone && sortingByPhone === 1"
                                                        />
                                                        <font-awesome-icon icon="sort" v-if="!enableSortByPhone" />
                                                    </b-button>
                                                </th>
                                                <th class="text-left" width="15%" @click="sortMembers('department')">
                                                    Department
                                                </th>
                                                <th class="text-left">
                                                    <b-button
                                                        variant="white"
                                                        size="sm"
                                                        @click="sortMembers('department')"
                                                        v-b-tooltip="'Sort'"
                                                    >
                                                        <font-awesome-icon
                                                            icon="sort-up"
                                                            v-if="enableSortByDepartment && sortingByDepartment === -1"
                                                        />
                                                        <font-awesome-icon
                                                            icon="sort-down"
                                                            v-if="enableSortByDepartment && sortingByDepartment === 1"
                                                        />
                                                        <font-awesome-icon icon="sort" v-if="!enableSortByDepartment" />
                                                    </b-button>
                                                </th>
                                                <th class="text-left" width="15%" @click="sortMembers('position')">
                                                    Position
                                                </th>
                                                <th class="text-left">
                                                    <b-button
                                                        variant="white"
                                                        size="sm"
                                                        @click="sortMembers('position')"
                                                        v-b-tooltip="'Sort'"
                                                    >
                                                        <font-awesome-icon
                                                            icon="sort-up"
                                                            v-if="enableSortByPosition && sortingByPosition === -1"
                                                        />
                                                        <font-awesome-icon
                                                            icon="sort-down"
                                                            v-if="enableSortByPosition && sortingByPosition === 1"
                                                        />
                                                        <font-awesome-icon icon="sort" v-if="!enableSortByPosition" />
                                                    </b-button>
                                                </th>
                                                <th class="text-center" width="5%">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="(member, idx) in sortedMembers"
                                                :key="member.email"
                                                :class="{
                                                    'text-muted': !member.enabled,
                                                    'table-warning': invitedUsers.find(
                                                        (invitedUser) => invitedUser.email === member.email,
                                                    ),
                                                }"
                                            >
                                                <td class="text-center text-muted pl-4 pr-4" style="width: 80px;">
                                                    {{ idx + 1 }}
                                                </td>
                                                <td class="text-left">
                                                    <span
                                                        v-if="
                                                            !invitedUsers.find(
                                                                (invitedUser) => invitedUser.email === member.email,
                                                            )
                                                        "
                                                    >
                                                        <vue-avatar
                                                            class="mr-1"
                                                            :username="[member.firstname, member.lastname].join(' ')"
                                                            :size="32"
                                                            :custom-style="{ display: 'inline-block', opacity: 0.4 }"
                                                            :lighten="200"
                                                        />
                                                        <!-- <img :src="member.image" class="avatar-sm rounded-circle" v-if="member.image" />
                                                        <img src="/img/user.png" class="avatar-sm rounded-circle" v-else /> -->
                                                    </span>
                                                    {{ member.firstname }} {{ member.lastname }}
                                                    <div
                                                        class="badge badge-pill badge-info"
                                                        v-if="organizationFormData.manager.email === member.email"
                                                    >
                                                        Manager
                                                    </div>
                                                </td>
                                                <td></td>
                                                <td class="text-left">{{ member.email }}</td>
                                                <td></td>
                                                <td class="text-left">{{ member.phone }}</td>
                                                <td></td>
                                                <td class="text-left">{{ member.department }}</td>
                                                <td></td>
                                                <td class="text-left">{{ member.position }}</td>
                                                <td></td>
                                                <td class="text-center pl-4 pr-4" v-if="!(member.email === user.email)">
                                                    <b-button-group
                                                        v-if="
                                                            !invitedUsers.find(
                                                                (invitedUser) => invitedUser.email === member.email,
                                                            )
                                                        "
                                                    >
                                                        <b-button
                                                            variant="danger"
                                                            size="sm"
                                                            @click="suspendMember(member)"
                                                            v-b-tooltip="'Suspend'"
                                                            v-if="member.enabled"
                                                        >
                                                            <font-awesome-icon icon="user-slash" />
                                                        </b-button>
                                                        <b-button
                                                            variant="success"
                                                            size="sm"
                                                            @click="reactivateMember(member)"
                                                            v-b-tooltip="'Reactivate'"
                                                            v-else
                                                        >
                                                            <font-awesome-icon icon="user" />
                                                        </b-button>
                                                    </b-button-group>
                                                    <b-button-group v-else>
                                                        <b-button
                                                            variant="light"
                                                            size="sm"
                                                            @click="resendInvitation(member)"
                                                            v-b-tooltip="'Resend Invitation'"
                                                        >
                                                            <font-awesome-icon icon="paper-plane" />
                                                        </b-button>
                                                        <b-button
                                                            variant="danger"
                                                            size="sm"
                                                            @click="revokeInvitation(member)"
                                                            v-b-tooltip="'Revoke Invitation'"
                                                        >
                                                            <font-awesome-icon icon="ban" />
                                                        </b-button>
                                                    </b-button-group>
                                                </td>
                                                <td v-else></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </b-tab>
                        <b-tab class="custom-tab">
                            <template slot="title">
                                <span>Preferences</span>
                            </template>
                            <ul class="list-group list-group-flush">
                                <b class="list-group-item">
                                    <div class="row">
                                        <div class="col-6">Interests</div>
                                        <div class="col-6">
                                            <div class="float-right">
                                                <span class="mr-3 px-1">Notifications</span>
                                                <span class="ml-4 mr-3">Email</span>
                                            </div>
                                        </div>
                                    </div>
                                </b>
                                <li v-for="preference in preferences" :key="preference.label" class="list-group-item">
                                    <div class="mt-2 row">
                                        <div class="col-6">
                                            {{ preference.description }}
                                            <div v-if="preference.label === 'datasets'">
                                                <br />
                                                <div class="row categories" v-if="categoryOptions.length != 0">
                                                    <div
                                                        class="ml-3"
                                                        v-for="(category, idx) in categoryOptions"
                                                        :key="category.id"
                                                    >
                                                        <div class="custom-checkbox custom-control">
                                                            <input
                                                                type="checkbox"
                                                                :id="category.id"
                                                                class="custom-control-input"
                                                                :checked="preference.categories.includes(category.id)"
                                                                @change="updateCategories(preference, category)"
                                                            />
                                                            <label class="custom-control-label" :for="category.id">
                                                                {{ category.name }}
                                                            </label>
                                                        </div>
                                                        <div v-if="idx % 4 == 0">
                                                            <br />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="float-right">
                                                <toggle-button
                                                    class="ml-1"
                                                    :value="preference.notifications"
                                                    :sync="true"
                                                    :width="55"
                                                    :height="22"
                                                    :disabled="false"
                                                    :labels="{ checked: 'YES', unchecked: 'NO' }"
                                                    @change="preference.notifications = !preference.notifications"
                                                />
                                                <toggle-button
                                                    class="ml-5 mr-2"
                                                    :value="preference.email"
                                                    :sync="true"
                                                    :width="55"
                                                    :height="22"
                                                    :disabled="false"
                                                    :labels="{ checked: 'YES', unchecked: 'NO' }"
                                                    @change="preference.email = !preference.email"
                                                />
                                            </div>
                                            <div>
                                                <br />
                                                <br />
                                            </div>
                                            <div v-if="preference.label === 'datasets'">
                                                <div class="float-right">
                                                    <b-dropdown
                                                        :text="options[preference.target].text"
                                                        class="mr-2"
                                                        variant="outline-primary"
                                                        style="margin-top: -0.3rem; width: 158px;"
                                                        size="sm"
                                                        :disabled="
                                                            preference.notifications === false &&
                                                            preference.email === false
                                                        "
                                                        right
                                                    >
                                                        <b-dropdown-item
                                                            style="width: 220px;"
                                                            v-for="option in options"
                                                            :key="option.id"
                                                            :value="preference.target"
                                                            @click="preference.target = option.id"
                                                        >
                                                            {{ option.text }}
                                                        </b-dropdown-item>
                                                    </b-dropdown>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <button
                                type="button"
                                class="btn-shadow d-inline-flex align-items-center btn btn-warning text-white float-right pl-3 pr-3 mt-3 mr-4 mb-3"
                                @click="save()"
                            >
                                Save
                            </button>
                        </b-tab>
                        <b-tab class="custom-tab" v-if="organization.id !== 1">
                            <template slot="title">
                                <span>Contract Templates</span>
                            </template>
                            <b-button
                                class="btn-wide btn-hover-shine btn-shadow btn-transition btn-warning text-white float-right mb-3"
                                variant="warning"
                                size="sm"
                                @click="$router.push({ name: 'organization-profile.contract-template' })"
                            >
                                <font-awesome-icon icon="plus" />
                                Create Contract Template
                            </b-button>
                            <div class="alert alert-info mt-5" role="alert" v-if="contractTemplates.length == 0">
                                <font-awesome-icon icon="info-circle" />
                                <span class="ml-3">No contract templates found!</span>
                            </div>
                            <div v-else>
                                <div class="checkin-table table-responsive">
                                    <table class="align-middle text-truncate mb-0 table table-hover">
                                        <thead>
                                            <tr>
                                                <th class="text-center" width="5%">#</th>
                                                <th class="text-left" width="50%">Name</th>
                                                <th class="text-left" width="20%">Created At</th>
                                                <th class="text-left" width="20%">Last Updated At</th>
                                                <th class="text-center" width="5%">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="(contractTemplate, idx) in contractTemplates"
                                                :key="contractTemplate.id"
                                            >
                                                <td class="text-center text-muted pl-4 pr-4" style="width: 80px;">
                                                    {{ idx + 1 }}
                                                </td>
                                                <td class="text-left">
                                                    {{ contractTemplate.name }}
                                                    <div
                                                        class="badge badge-pill badge-info"
                                                        v-if="defaultContractTemplate === contractTemplate.id"
                                                    >
                                                        Default
                                                    </div>
                                                </td>
                                                <td class="text-left">{{ contractTemplate.created }}</td>
                                                <td class="text-left">{{ contractTemplate.updated }}</td>
                                                <td class="text-center pl-4 pr-4">
                                                    <b-button-group>
                                                        <b-button
                                                            variant="light"
                                                            size="sm"
                                                            @click="makeDefault(contractTemplate)"
                                                            v-if="defaultContractTemplate !== contractTemplate.id"
                                                            v-b-tooltip="'Make Default'"
                                                        >
                                                            <font-awesome-icon icon="file-alt" />
                                                        </b-button>
                                                        <b-button
                                                            variant="light"
                                                            size="sm"
                                                            @click="
                                                                $router.push({
                                                                    name: 'organization-profile.contract-template.edit',
                                                                    params: { id: contractTemplate.id },
                                                                })
                                                            "
                                                            v-b-tooltip="'Edit'"
                                                        >
                                                            <font-awesome-icon icon="edit" />
                                                        </b-button>
                                                        <b-button
                                                            variant="danger"
                                                            size="sm"
                                                            @click="deleteContractTemplate(contractTemplate)"
                                                            v-b-tooltip="'Delete'"
                                                            v-if="defaultContractTemplate !== contractTemplate.id"
                                                        >
                                                            <font-awesome-icon icon="trash" />
                                                        </b-button>
                                                    </b-button-group>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </b-tab>
                    </b-tabs>
                </b-card>
            </div>
        </div>
        <b-modal
            id="inviteUser"
            variant="primary"
            size="md"
            header-bg-variant="primary"
            header-text-variant="light"
            title="Invite User"
            :ok-title="invitingUser ? 'Inviting User...' : 'Invite'"
            :ok-disabled="invitingUser"
            :cancel-disabled="invitingUser"
            :no-close-on-backdrop="invitingUser"
            :no-close-on-esc="invitingUser"
            :hide-header-close="invitingUser"
            @ok="validateData"
        >
            <div class="row">
                <div class="col-md-6 pr-2">
                    <b-form-group label-for="firstname">
                        <b-form-input
                            name="firstname"
                            type="text"
                            placeholder="Name"
                            v-model="invitedUser.firstname"
                            v-validate="'required'"
                            :class="{ 'is-invalid': errors.has('invitation.firstname') }"
                            data-vv-scope="invitation"
                        />
                        <div class="invalid-feedback" v-if="errors.has('invitation.firstname')">
                            {{ errors.first('invitation.firstname') }}
                        </div>
                    </b-form-group>
                </div>
                <div class="col-md-6 pl-2">
                    <b-form-group label-for="lastname">
                        <b-form-input
                            name="lastname"
                            type="text"
                            placeholder="Surname"
                            v-model="invitedUser.lastname"
                            v-validate="'required'"
                            :class="{ 'is-invalid': errors.has('invitation.lastname') }"
                            data-vv-scope="invitation"
                        />
                        <div class="invalid-feedback" v-if="errors.has('invitation.lastname')">
                            {{ errors.first('invitation.lastname') }}
                        </div>
                    </b-form-group>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <b-form-group label-for="email">
                        <b-form-input
                            name="email"
                            type="email"
                            placeholder="Email"
                            v-model="invitedUser.email"
                            v-validate="'required|email'"
                            :class="{ 'is-invalid': errors.has('invitation.email') }"
                            data-vv-scope="invitation"
                        />
                        <div class="invalid-feedback" v-if="errors.has('invitation.email')">
                            {{ errors.first('invitation.email') }}
                        </div>
                    </b-form-group>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { omit } from 'ramda';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faExclamationCircle,
    faInfoCircle,
    faUser,
    faUserSlash,
    faSort,
    faSortUp,
    faSortDown,
    faPlus,
    faPaperPlane,
    faBan,
    faAngleUp,
    faAngleDown,
    faEdit,
    faTrash,
    faFileAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { PageTitle } from '@/components';
import datasetOptions from '@/config/dataset.json';
import typeOptions from '@/config/organization-types.json';
import defaultPreferences from '@/config/organization-preferences.json';
import { SET_ORGANIZATION } from '@/store/mutation-types';
import { Organization, Category, User, Contract } from '@/api';
import VueAvatar from 'vue-avatar';

const R = { omit };

library.add(
    faExclamationCircle,
    faInfoCircle,
    faUser,
    faUserSlash,
    faSort,
    faSortUp,
    faSortDown,
    faPlus,
    faPaperPlane,
    faBan,
    faAngleUp,
    faAngleDown,
    faEdit,
    faTrash,
    faFileAlt,
);

export default {
    name: 'EditOrganization',
    components: {
        FontAwesomeIcon,
        PageTitle,
        VueAvatar,
    },
    data: () => ({
        sortBy: null,
        enableSortByName: false,
        sortingByName: -1,
        enableSortByEmail: false,
        sortingByEmail: -1,
        enableSortByPhone: false,
        sortingByPhone: -1,
        enableSortByDepartment: false,
        sortingByDepartment: -1,
        enableSortByPosition: false,
        sortingByPosition: -1,
        options: [
            { id: 0, text: 'Manager' },
            { id: 1, text: 'Members' },
            { id: 2, text: 'Both' },
        ],
        organizationFormData: {},
        invitedUser: {
            firstname: '',
            lastname: '',
            email: '',
        },
        organizationMembers: [],
        members: [],
        invitedUsers: [],
        categoryOptions: [],
        countryOptions: datasetOptions.countryOptions,
        typeOptions,
        logoImage: null,
        bannerImage: null,
        contractTemplates: [],
        defaultContractTemplate: null,
        tabIndex: 0,
        preferences: [],
        defaultPreferences,
        categories: [],
        invitingUser: false,
    }),
    computed: {
        ...mapState(['user', 'organization']),
        sortedMembers() {
            if (this.sortBy === 'name') {
                return this.members
                    .slice(0)
                    .sort((a, b) => (a.firstname < b.firstname ? this.sortingByName : -this.sortingByName));
            }
            if (this.sortBy === 'email') {
                return this.members
                    .slice(0)
                    .sort((a, b) => (a.email < b.email ? this.sortingByEmail : -this.sortingByEmail));
            }
            if (this.sortBy === 'phone') {
                return this.members
                    .slice(0)
                    .sort((a, b) => (a.phone < b.phone ? this.sortingByPhone : -this.sortingByPhone));
            }
            if (this.sortBy === 'department') {
                return this.members
                    .slice(0)
                    .sort((a, b) =>
                        a.department < b.department ? this.sortingByDepartment : -this.sortingByDepartment,
                    );
            }
            if (this.sortBy === 'position') {
                return this.members
                    .slice(0)
                    .sort((a, b) => (a.position < b.position ? this.sortingByPosition : -this.sortingByPosition));
            }
            return this.members;
        },
    },
    async created() {
        this.organizationFormData = this.organization;
        this.preferences = this.organization.preferences;
        this.categories = this.organization.categories;
        if (!this.preferences) {
            this.preferences = defaultPreferences.notifications;
        } else {
            this.preferences = this.preferences.notifications;
            if (!('target' in this.preferences[0])) {
                this.preferences[0].target = 0;
            }
        }

        const [{ data: members }, { data: categories }, { data: invitedUsers }] = await Promise.all([
            Organization.members(),
            Category.all(),
            User.getInvitations(),
        ]);
        this.categoryOptions = categories;
        this.organizationMembers = members;
        this.members = members;
        this.invitedUsers = invitedUsers;
        this.members = this.members.concat(this.invitedUsers);
        if (this.organization.id !== 1) {
            const { data: contractTemplates } = await Contract.getAllTemplates();
            this.contractTemplates = contractTemplates;
            this.contractTemplates.forEach((template) => {
                if (template.is_default) {
                    this.defaultContractTemplate = template.id;
                }
            });
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.previousRoute = from;
            if (
                from.name === 'organization-profile.contract-template' ||
                from.name === 'organization-profile.contract-template.edit'
            ) {
                vm.tabIndex = 3;
            }
        });
    },
    methods: {
        submit() {
            this.$validator.validateAll().then((success) => {
                if (success) {
                    this.updateOrganization();
                } else {
                    this.$toastr.e('One or more fields require your attention', 'Error');
                }
            });
        },
        async updateOrganization() {
            try {
                if (this.logoImage) {
                    const logoImageData = new FormData();
                    logoImageData.append('file', this.logoImage);
                    await Organization.updateLogoImage(logoImageData);
                }

                if (this.bannerImage) {
                    const bannerImageData = new FormData();
                    bannerImageData.append('file', this.bannerImage);
                    await Organization.updateBannerImage(bannerImageData);
                }

                const payload = R.omit(['manager', 'type'], this.organizationFormData);
                const { data: organization } = await Organization.update(payload);
                this.$store.commit(SET_ORGANIZATION, { organization });
                this.$toastr.s('Organization updated!', 'Success');
            } catch (e) {
                this.$toastr.e('An error occured', 'Error');
            }
        },
        async save() {
            try {
                const payload = R.omit(['manager', 'type'], this.organization);
                payload.preferences = { notifications: this.preferences };
                payload.categories = this.categories;
                const { data: organization } = await Organization.update(payload);
                this.$store.commit(SET_ORGANIZATION, { organization });
                this.$toastr.s('Preferences updated!', 'Success');
            } catch (e) {
                this.$toastr.e('An error occured', 'Error');
            }
        },
        suspendMember(member) {
            this.$swal({
                title: 'Are you sure?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d92550',
                confirmButtonText: 'Suspend',
            }).then(async (result) => {
                if (result.value) {
                    await User.disable(member.id);
                    const { data: members } = await Organization.members();
                    this.organizationMembers = members;
                    this.members = members;
                    this.members = this.members.concat(this.invitedUsers);
                }
            });
        },
        reactivateMember(member) {
            this.$swal({
                title: 'Are you sure?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#62C68B',
                confirmButtonText: 'Reactivate',
            }).then(async (result) => {
                if (result.value) {
                    await User.enable(member.id);
                    const { data: members } = await Organization.members();
                    this.organizationMembers = members;
                    this.members = members;
                    this.members = this.members.concat(this.invitedUsers);
                }
            });
        },
        revokeInvitation(member) {
            this.$swal({
                title: 'Are you sure?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d92550',
                confirmButtonText: 'Revoke Invitation',
            }).then(async (result) => {
                if (result.value) {
                    try {
                        await User.revokeInvitation(member.id);
                        const { data: invitations } = await User.getInvitations();
                        this.invitedUsers = invitations;
                        this.members = this.organizationMembers;
                        this.members = this.members.concat(this.invitedUsers);
                        this.$toastr.s('Invitation Revoked!', 'Success');
                    } catch (e) {
                        this.$toastr.e('An error occured', 'Error');
                    }
                }
            });
        },
        resendInvitation(member) {
            this.$swal({
                title: 'Are you sure?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#62C68B',
                confirmButtonText: 'Resend Invitation',
            }).then(async (result) => {
                if (result.value) {
                    try {
                        await User.invite(member);
                        this.$toastr.s('Invitation Resent!', 'Success');
                    } catch (e) {
                        this.$toastr.e('An error occured', 'Error');
                    }
                }
            });
        },
        sortMembers(sortBy) {
            this.sortBy = sortBy;
            if (sortBy === 'name') {
                this.enableSortByEmail = false;
                this.sortingByEmail = -1;
                this.enableSortByPhone = false;
                this.sortingByPhone = -1;
                this.enableSortByDepartment = false;
                this.sortingByDepartment = -1;
                this.enableSortByPosition = false;
                this.sortingByPosition = -1;
                if (!this.enableSortByName) {
                    this.enableSortByName = !this.enableSortByName;
                } else {
                    this.sortingByName *= -1;
                }
            }
            if (sortBy === 'email') {
                this.enableSortByName = false;
                this.sortingByName = -1;
                this.enableSortByPhone = false;
                this.sortingByPhone = -1;
                this.enableSortByDepartment = false;
                this.sortingByDepartment = -1;
                this.enableSortByPosition = false;
                this.sortingByPosition = -1;
                if (!this.enableSortByEmail) {
                    this.enableSortByEmail = !this.enableSortByEmail;
                } else {
                    this.sortingByEmail *= -1;
                }
            }
            if (sortBy === 'phone') {
                this.enableSortByName = false;
                this.sortingByName = -1;
                this.enableSortByEmail = false;
                this.sortingByEmail = -1;
                this.enableSortByDepartment = false;
                this.sortingByDepartment = -1;
                this.enableSortByPosition = false;
                this.sortingByPosition = -1;
                if (!this.enableSortByPhone) {
                    this.enableSortByPhone = !this.enableSortByPhone;
                } else {
                    this.sortingByPhone *= -1;
                }
            }
            if (sortBy === 'department') {
                this.enableSortByName = false;
                this.sortingByName = -1;
                this.enableSortByEmail = false;
                this.sortingByEmail = -1;
                this.enableSortByPhone = false;
                this.sortingByPhone = -1;
                this.enableSortByPosition = false;
                this.sortingByPosition = -1;
                if (!this.enableSortByDepartment) {
                    this.enableSortByDepartment = !this.enableSortByDepartment;
                } else {
                    this.sortingByDepartment *= -1;
                }
            }
            if (sortBy === 'position') {
                this.enableSortByName = false;
                this.sortingByName = -1;
                this.enableSortByEmail = false;
                this.sortingByEmail = -1;
                this.enableSortByPhone = false;
                this.sortingByPhone = -1;
                this.enableSortByDepartment = false;
                this.sortingByDepartment = -1;
                if (!this.enableSortByPosition) {
                    this.enableSortByPosition = !this.enableSortByPosition;
                } else {
                    this.sortingByPosition *= -1;
                }
            }
        },
        async validateData(event) {
            event.preventDefault();
            const success = await this.$validator.validateAll('invitation');
            if (success) {
                this.inviteUser();
            }
        },
        openModal() {
            this.invitedUser.firstname = '';
            this.invitedUser.lastname = '';
            this.invitedUser.email = '';
            this.$bvModal.show('inviteUser');
        },
        async inviteUser() {
            try {
                this.invitingUser = true;
                if (this.invitedUsers.find((invitedUser) => invitedUser.email === this.invitedUser.email)) {
                    this.$toastr.e('User has already been invited!', 'Error');
                } else {
                    await User.invite(this.invitedUser);
                    const { data: invitations } = await User.getInvitations();
                    this.invitedUsers = invitations;
                    this.members = this.organizationMembers;
                    this.members = this.members.concat(this.invitedUsers);
                    this.$toastr.s('User invited!', 'Success');
                }
                this.$bvModal.hide('inviteUser');
            } catch (e) {
                if (e.response.status === 400) {
                    this.errors.add({
                        field: 'invitation.email',
                        msg: e.response.data.message,
                    });
                } else {
                    this.$toastr.e('An error occured', 'Error');
                    this.$bvModal.hide('inviteUser');
                }
            }
            this.invitingUser = false;
        },
        async deleteContractTemplate(contractTemplate) {
            this.$swal({
                title: 'Are you sure?',
                text: 'This action cannot be undone',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d92550',
                confirmButtonText: 'Delete',
            }).then(async (result) => {
                if (result.value) {
                    await Contract.deleteTemplate(contractTemplate.id);
                    const idx = this.contractTemplates.indexOf(contractTemplate);
                    if (~idx) {
                        this.contractTemplates.splice(idx, 1);
                    }
                    this.$toastr.s('Contract Template deleted successfuly!');
                }
            });
        },
        async makeDefault(contractTemplate) {
            await Contract.makeTemplateDefault(contractTemplate.id);
            this.defaultContractTemplate = contractTemplate.id;
        },
        async updateCategories(preference, category) {
            if (preference.categories.includes(category.id)) {
                preference.categories.splice(preference.categories.indexOf(category.id), 1);
            } else {
                preference.categories.push(category.id);
            }

            let found = false;
            this.categories.forEach((categoryElement) => {
                if (categoryElement && categoryElement.id === category.id) {
                    found = true;
                    const categoryIndex = this.categories.indexOf(categoryElement);
                    this.categories.splice(categoryIndex, 1);
                }
            });
            if (!found) {
                this.categories.push(category);
            }
        },
    },
};
</script>

<style lang="scss">
.edit-organization {
    .scroll-area-lg {
        height: 69vh;
    }
    td > a {
        display: block;
        text-decoration: none;
    }
    .table th {
        cursor: pointer;
    }
    .custom-tab {
        outline: none;
    }
    .invalid {
        border-color: red;
    }
    .tab-error {
        color: red;
    }
    ul {
        list-style-type: none;
    }
    .categories {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }
    .vue-avatar--wrapper {
        display: inline-block;
    }
}
</style>
