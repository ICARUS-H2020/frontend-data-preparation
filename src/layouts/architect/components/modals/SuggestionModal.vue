<template>
    <div id="modal" class="suggestion-modal">
        <b-modal
            :id="id"
            variant="primary"
            size="lg"
            header-bg-variant="primary"
            header-text-variant="light"
            :title="title"
            @hide="clearValues"
        >
            <div class="row mt-3 ml-1 mr-1">
                <div class="position-relative form-group col-sm-6">
                    <label :class="{ bold: isAdmin }" for="conceptTitle">
                        Concept Title
                        <span
                            v-b-tooltip
                            title="The title of the concept that should be added in the ICARUS Aviation Data Model."
                        >
                            <font-awesome-icon icon="info-circle" class="ml-1 text-tooltip" />
                        </span>
                    </label>
                    <div v-if="isAdmin">
                        {{ suggestionFormData.concept_title }}
                        <br />
                        <br />
                    </div>
                    <input
                        name="conceptTitle"
                        placeholder="Enter concept title"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.has('conceptTitle') && formSubmitted }"
                        v-model="suggestionFormData.concept_title"
                        v-validate="'required'"
                        v-else
                    />
                    <div class="invalid-feedback" v-if="errors.has('conceptTitle') && formSubmitted">
                        {{ errors.first('conceptTitle') }}
                    </div>
                </div>
                <div class="position-relative form-group col-sm-6">
                    <label :class="{ bold: isAdmin }" for="dataType">
                        Data Type
                        <span
                            v-b-tooltip
                            title="The data type of the concept that is suggested (e.g. string, integer, datetime, etc.)."
                        >
                            <font-awesome-icon icon="info-circle" class="ml-1 text-tooltip" />
                        </span>
                    </label>
                    <div v-if="isAdmin">
                        {{ suggestionFormData.data_type }}
                        <br />
                        <br />
                    </div>
                    <multiselect
                        name="dataType"
                        placeholder="Select data type"
                        v-model="suggestionFormData.data_type"
                        :options="typeOptions"
                        :searchable="false"
                        :allow-empty="false"
                        :class="{ invalid: errors.has('dataType') && formSubmitted }"
                        deselect-label="Can't remove this value"
                        v-validate="'required'"
                        v-else
                    ></multiselect>
                    <div class="invalid-feedback" v-if="errors.has('dataType') && formSubmitted">
                        {{ errors.first('dataType') }}
                    </div>
                </div>
            </div>
            <div class="row ml-1 mr-1">
                <div class="position-relative form-group col-sm-12">
                    <label :class="{ bold: isAdmin }" for="description">
                        Description
                        <span v-b-tooltip title="A brief description of the concept.">
                            <font-awesome-icon icon="info-circle" class="ml-1 text-tooltip" />
                        </span>
                    </label>
                    <div v-if="isAdmin">
                        {{ suggestionFormData.description }}
                        <br />
                        <br />
                    </div>
                    <textarea
                        name="description"
                        placeholder="Enter description"
                        rows="4"
                        class="form-control"
                        :class="{ 'is-invalid': errors.has('description') && formSubmitted }"
                        v-model="suggestionFormData.description"
                        v-validate="'required'"
                        v-else
                    />
                    <div class="invalid-feedback" v-if="errors.has('description') && formSubmitted">
                        {{ errors.first('description') }}
                    </div>
                </div>
            </div>
            <div class="row ml-1 mr-1">
                <div class="position-relative form-group col-sm-12">
                    <label :class="{ bold: isAdmin }" for="relatedConcepts">
                        Related Concept(s)
                        <span
                            v-b-tooltip
                            title="The related concepts of the ICARUS Aviation Data Model under which the new concept should be placed."
                        >
                            <font-awesome-icon icon="info-circle" class="ml-1 text-tooltip" />
                        </span>
                    </label>
                    <div v-if="isAdmin">
                        <span
                            class="badge badge-info tag"
                            v-for="tag in suggestionFormData.related_concepts"
                            :key="tag"
                        >
                            {{ tag }}
                        </span>
                        <br />
                        <br />
                    </div>
                    <treeselect
                        name="relatedConcepts"
                        placeholder="Select related concepts"
                        :options="rootConcepts"
                        :normalizer="normalizer"
                        :searchable="true"
                        :multiple="true"
                        :class="{ invalid: errors.has('relatedConcepts') && formSubmitted }"
                        v-model="suggestionFormData.related_concepts"
                        style="border-collapse: initial;"
                        v-validate="'required'"
                        v-else
                    />
                    <div class="invalid-feedback" v-if="errors.has('relatedConcepts') && formSubmitted">
                        {{ errors.first('relatedConcepts') }}
                    </div>
                </div>
            </div>
            <div class="row ml-1 mr-1">
                <div class="position-relative form-group col-sm-12">
                    <label :class="{ bold: isAdmin }" for="relatedTerms">
                        Related Term(s)
                        <span v-b-tooltip title="A list of terms that are also used for the specific concept.">
                            <font-awesome-icon icon="info-circle" class="ml-1 text-tooltip" />
                        </span>
                    </label>
                    <div v-if="isAdmin">
                        <div v-if="suggestionFormData.related_terms && suggestionFormData.related_terms.length > 0">
                            <span
                                class="badge badge-info tag"
                                v-for="tag in suggestionFormData.related_terms"
                                :key="tag"
                            >
                                {{ tag }}
                            </span>
                        </div>
                        <div class="text-muted" v-else>N/A</div>
                        <br />
                    </div>
                    <multiselect
                        name="relatedTerms"
                        placeholder="Enter related terms"
                        v-model="suggestionFormData.related_terms"
                        :options="suggestionFormData.related_terms"
                        :multiple="true"
                        :close-on-select="false"
                        :clear-on-select="false"
                        :preserve-search="true"
                        :preselect-first="false"
                        :taggable="true"
                        @tag="addTag"
                        v-else
                    ></multiselect>
                </div>
            </div>
            <div class="row ml-1 mr-1">
                <div class="position-relative form-group col-sm-12">
                    <label :class="{ bold: isAdmin }" for="relatedStandards">
                        Related Standard(s)
                        <span
                            v-b-tooltip
                            title="A list of related standards (e.g. ACRIS, A-CDM, AIXM, etc.) and how the equivalent concept they have defined for the specific concept (e.g. ACRIS: 'Concept Y')."
                        >
                            <font-awesome-icon icon="info-circle" class="ml-1 text-tooltip" />
                        </span>
                    </label>
                    <div v-if="isAdmin">
                        <div v-if="suggestionFormData.related_standards !== ''">
                            {{ suggestionFormData.related_standards }}
                        </div>
                        <div class="text-muted" v-else>N/A</div>
                    </div>
                    <textarea
                        name="relatedStandards"
                        placeholder="Enter related standards"
                        rows="4"
                        class="form-control"
                        v-model="suggestionFormData.related_standards"
                        v-else
                    />
                </div>
            </div>
            <template v-slot:modal-footer>
                <b-button
                    variant="secondary"
                    size="md"
                    class="float-right"
                    @click="$bvModal.hide('suggestNewConcept')"
                    v-if="!isAdmin"
                >
                    Cancel
                </b-button>
                <b-button variant="primary" size="md" class="float-right" @click="validateData" v-if="!isAdmin">
                    OK
                </b-button>
                <b-button
                    variant="primary"
                    size="lg"
                    class="float-right"
                    @click="$bvModal.hide('viewSuggestion')"
                    v-else
                >
                    Close
                </b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { DataModelSuggestion, Notifications } from '@/api';
import Treeselect from '@riophae/vue-treeselect';
import Multiselect from 'vue-multiselect';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faInfoCircle);

export default {
    name: 'SuggestionModal',
    components: {
        Treeselect,
        Multiselect,
        FontAwesomeIcon,
    },
    props: {
        id: {
            type: String,
            default: () => '',
        },
        title: {
            type: String,
            default: () => '',
        },
        suggestionFormData: {
            type: Object,
            default() {
                return {
                    concept_title: '',
                    data_type: '',
                    description: '',
                    related_concepts: [],
                    related_terms: [],
                    related_standards: '',
                };
            },
        },
    },
    data() {
        return {
            normalizer(node) {
                return {
                    label: node.text,
                };
            },
            typeOptions: ['Boolean', 'Date', 'Datetime', 'Double', 'Integer', 'String', 'Time'],
            formSubmitted: false,
        };
    },
    computed: {
        ...mapGetters(['isAdmin', 'dataModel']),
        rootConcepts() {
            if (this.dataModel) {
                const array = [];
                this.dataModel.forEach((concept) => {
                    array.push({ id: concept.id, text: concept.text });
                });
                return array;
            }
            return [];
        },
    },
    methods: {
        addTag(newTag) {
            this.suggestionFormData.related_terms.push(newTag);
        },
        async validateData(event) {
            event.preventDefault();
            this.formSubmitted = true;
            const success = await this.$validator.validateAll();
            if (success) {
                try {
                    const { data: suggestion } = await DataModelSuggestion.create(this.suggestionFormData);
                    await Notifications.publish({
                        eventType: 'SUGGESTION_PROPOSED',
                        properties: {
                            conceptTitle: suggestion.concept_title,
                            targetId: suggestion.id,
                            targetType: 'data-model-suggestion',
                            recipientId: suggestion.organization_id,
                        },
                        timestamp: Math.floor(Date.now() / 1000),
                    });
                    this.$toastr.s('Suggested new concept!', 'Success');
                    this.$bvModal.hide('suggestNewConcept');
                } catch (e) {
                    this.$toastr.e('An error occured', 'Error');
                }
            }
        },
        clearValues() {
            this.formSubmitted = false;
            this.suggestionFormData.concept_title = '';
            this.suggestionFormData.data_type = '';
            this.suggestionFormData.description = '';
            this.suggestionFormData.related_concepts = [];
            this.suggestionFormData.related_terms = [];
            this.suggestionFormData.related_standards = '';
        },
    },
};
</script>

<style lang="scss">
.suggestion-modal {
    .vue-treeselect__control {
        height: 38px;
    }

    .vue-treeselect__placeholder,
    .vue-treeselect__single-value {
        line-height: 36px;
    }

    .vue-treeselect__placeholder {
        color: #8d8f90;
    }
    .invalid-feedback {
        display: block;
    }
    .invalid {
        border: 1px solid red;
        border-radius: 5px;
    }
    .bold {
        font-weight: bold;
    }
    .tag {
        color: #fff;
        font-size: 65%;
        padding: 5px 6px;
        margin-right: 1px;
    }
}
</style>
