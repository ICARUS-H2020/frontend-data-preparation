<template>
    <div class="user-profile">
        <div class="main-card mb-3 card">
            <div class="card-body profile-body">
                <div class="pane-left">
                    <div class="avatar-icon-wrapper mb-2 avatar-icon-xl profile-image">
                        <div class="avatar">
                            <img src="@/assets/images/1.jpg" alt="User Image" />
                        </div>
                    </div>
                    <div class="user-info">
                        <h3>User name</h3>
                        <h5>BI Developer at Visio</h5>
                        <h6>Athens, Greece</h6>
                        <br />
                        <h6>Joined a year ago</h6>
                    </div>
                </div>
                <div class="pane-right">
                    <b-button class="mb-2 mr-2 btn-icon edit-button" variant="primary">
                        <i class="pe-7s-note btn-icon-wrapper edit-button-icon"></i>
                        Edit Profile
                    </b-button>
                </div>
            </div>
            <div class="card-body">
                <h5 class="card-title">Biography</h5>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PersonalProfile',
    data: () => ({}),
    methods: {},
};
</script>

<style lang="scss">
.user-profile {
    .profile-body {
        display: flex;
    }

    .user-info {
        display: block;
        margin-left: 15px;
    }

    .avatar {
        width: 180px;
        height: 180px;
        border: 1px solid #eee;

        img {
            width: 100%;
            height: 100%;
        }
    }

    .pane-left {
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }

    .pane-right {
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: flex-start;
        margin-left: auto;
    }

    .edit-button {
        margin: 0 auto;
    }

    .edit-button-icon {
        margin-bottom: 2px;
    }
}
</style>
