<template>
    <b-modal
        :id="id"
        variant="primary"
        size="lg"
        header-bg-variant="primary"
        header-text-variant="light"
        title="Save query"
        @ok="validateData"
        @cancel="clearData()"
    >
        <div>
            <div class="row">
                <div class="position-relative form-group col-sm-12">
                    <label for="title">Title</label>
                    <input
                        name="title"
                        placeholder="Enter query title"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.has('title') }"
                        v-model="saveQuery.name"
                        v-validate="'required|max:100'"
                        required
                    />
                    <div class="invalid-feedback" v-if="errors.has('title')">
                        {{ errors.first('title') }}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="position-relative form-group col-sm-12">
                    <label for="description">Description</label>
                    <textarea
                        name="description"
                        placeholder="Enter query description"
                        rows="4"
                        class="form-control"
                        v-model="saveQuery.description"
                        v-validate="'required|max:200'"
                        :class="{ 'is-invalid': errors.has('description') }"
                        required
                    />
                    <div class="invalid-feedback" v-if="errors.has('description')">
                        {{ errors.first('description') }}
                    </div>
                </div>
            </div>
        </div>
    </b-modal>
</template>

<script>
export default {
    name: 'SaveQueryModal',
    props: {
        id: {
            type: String,
            default: () => '',
        },
    },
    data() {
        return {
            saveQuery: { name: null, description: null },
        };
    },
    methods: {
        async validateData(event) {
            event.preventDefault();
            const success = await this.$validator.validateAll();
            if (success) {
                this.$emit('save-query-details', this.saveQuery);
            }
        },
        clearData() {
            this.saveQuery = { name: null, description: null };
            this.$validator.reset();
        },
    },
};
</script>
