<template>
    <div class="virtual-dataset-step">
        <div v-if="!loading">
            <div class="alert alert-secondary mt-1">
                <div v-for="(rule, idx) in config" :key="`rule-${idx}`">
                    <div class="row pl-2 pr-2 pt-3 pb-3 mt-1">
                        <strong>Rule [{{ step.order }}.{{ idx + 1 }}]</strong>
                    </div>
                    <div class="row separated pl-0 pr-0 pt-2 pb-3">
                        <div class="col-6 pl-2 pr-2">
                            <div class="form-group">
                                <label>
                                    <strong>Function</strong>
                                </label>
                                <select
                                    :name="`function_${step.order}_${idx}`"
                                    class="form-control"
                                    v-model="rule.function"
                                    @change="clearRule(rule)"
                                    v-validate="'required'"
                                    :class="{ invalid: errors.has(`function_${step.order}_${idx}`) && rule.submitted }"
                                >
                                    <option :value="null" disabled>Select function</option>
                                    <template v-if="categories.length > 1">
                                        <optgroup
                                            v-for="category in categories"
                                            :key="`category-${category.label}`"
                                            :label="category.label"
                                        >
                                            <option v-for="f in category.functions" :key="`function-${f}`" :value="f">
                                                {{ preparationConfig.functions[f].label || f }}
                                            </option>
                                        </optgroup>
                                    </template>
                                    <template v-else>
                                        <option
                                            v-for="f in Object.keys(preparationConfig.functions)"
                                            :value="f"
                                            :key="f"
                                        >
                                            {{ preparationConfig.functions[f].label || f }}
                                        </option>
                                    </template>
                                </select>
                                <div
                                    class="form-text text-danger pl-1 pr-1"
                                    v-if="errors.has(`function_${step.order}_${idx}`) && rule.submitted"
                                >
                                    <small>This field is required</small>
                                </div>
                                <div class="form-text text-muted pl-1 pr-1" v-if="rule.function">
                                    <small>{{ preparationConfig.functions[rule.function].description }}</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 pl-2 pr-2">
                            <div class="form-group" v-if="rule.function && preparationConfig.output">
                                <label>
                                    <strong>Output Column</strong>
                                </label>
                                <input
                                    :name="`output_${step.order}_${idx}`"
                                    type="text"
                                    class="form-control"
                                    v-model="rule.output"
                                    v-validate="{ required: true, regex: /^[a-z_][a-z0-9_]*$/ }"
                                    :class="{ invalid: errors.has(`output_${step.order}_${idx}`) && rule.submitted }"
                                />
                                <div
                                    class="form-text text-danger pl-1 pr-1"
                                    v-if="errors.has(`output_${step.order}_${idx}`) && rule.submitted"
                                >
                                    <small>
                                        Output column is required and should start with a lowercase character and
                                        contain only lowercase characters, numbers and underscores
                                    </small>
                                </div>
                                <div class="form-text text-muted pl-1 pr-1" v-else>
                                    <small>{{ preparationConfig.output }}</small>
                                </div>
                            </div>
                        </div>
                        <template v-if="rule.function">
                            <div
                                class="col-6 pl-2 pr-2 mb-1"
                                :class="{
                                    'col-12':
                                        preparationConfig.functions[rule.function].parameters[param].type ===
                                            'join_datasets' ||
                                        preparationConfig.functions[rule.function].parameters[param].type ===
                                            'bucket_clauses',
                                }"
                                v-for="param in Object.keys(preparationConfig.functions[rule.function].parameters)"
                                :key="param"
                            >
                                <template
                                    v-if="
                                        preparationConfig.functions[rule.function].parameters[param].type === 'column'
                                    "
                                >
                                    <label>
                                        <strong>
                                            {{ preparationConfig.functions[rule.function].parameters[param].label }}
                                        </strong>
                                    </label>
                                    <multiselect
                                        :name="`parameter_${step.order}_${idx}_${
                                            preparationConfig.functions[rule.function].parameters[param].label
                                        }`"
                                        v-model="rule.parameters[param]"
                                        :options="
                                            getColumns(
                                                rule,
                                                preparationConfig.functions[rule.function].parameters[param],
                                            )
                                        "
                                        :close-on-select="
                                            !preparationConfig.functions[rule.function].parameters[param].facets
                                                .multiple
                                        "
                                        :multiple="
                                            preparationConfig.functions[rule.function].parameters[param].facets.multiple
                                        "
                                        :limit="1"
                                        placeholder="Select..."
                                        v-validate="
                                            preparationConfig.functions[rule.function].parameters[param].facets
                                                .validation
                                        "
                                        :class="{
                                            invalid:
                                                errors.has(
                                                    `parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .label
                                                    }`,
                                                ) && rule.submitted,
                                        }"
                                    >
                                        <template slot="singleLabel" slot-scope="props">
                                            <span>{{ props.option | truncate(35) }}</span>
                                        </template>
                                    </multiselect>
                                    <div
                                        class="form-text text-danger pl-1 pr-1"
                                        v-if="
                                            errors.has(
                                                `parameter_${step.order}_${idx}_${
                                                    preparationConfig.functions[rule.function].parameters[param].label
                                                }`,
                                            ) && rule.submitted
                                        "
                                    >
                                        <small>
                                            {{
                                                getValidationErrorMessage(
                                                    `parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .label
                                                    }`,
                                                )
                                            }}
                                        </small>
                                    </div>
                                    <div class="form-text text-muted pl-1 pr-1" v-else>
                                        <small>
                                            {{
                                                preparationConfig.functions[rule.function].parameters[param].description
                                            }}
                                        </small>
                                    </div>
                                </template>
                                <template
                                    v-if="
                                        preparationConfig.functions[rule.function].parameters[param].type ===
                                            'join_datasets' &&
                                        rule.parameters['join_type'] &&
                                        rule.parameters['join_type'] !== 'cross join'
                                    "
                                >
                                    <label class="mt-4">
                                        <strong>
                                            {{ preparationConfig.functions[rule.function].parameters[param].label }}
                                        </strong>
                                        &nbsp;
                                        <span @click="addCondition(rule)" class="add-condition">Add</span>
                                    </label>
                                    <div
                                        class="row"
                                        v-for="conditionIndex in rule.parameters[param].length"
                                        :key="conditionIndex"
                                    >
                                        <div class="col-12 d-flex">
                                            <div class="flex-grow-1 w-100">
                                                <multiselect
                                                    :name="`parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .inner_parameters.dataset_a_column.label
                                                    }_${conditionIndex}`"
                                                    v-model="
                                                        rule.parameters[param][conditionIndex - 1].dataset_a_column
                                                    "
                                                    :options="
                                                        getColumns(
                                                            rule,
                                                            preparationConfig.functions[rule.function].parameters[param]
                                                                .inner_parameters.dataset_a_column,
                                                        )
                                                    "
                                                    :close-on-select="
                                                        !preparationConfig.functions[rule.function].parameters[param]
                                                            .inner_parameters.dataset_a_column.facets.multiple
                                                    "
                                                    :multiple="
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .inner_parameters.dataset_a_column.facets.multiple
                                                    "
                                                    :limit="1"
                                                    :placeholder="`Select ${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .inner_parameters.dataset_a_column.label
                                                    }`"
                                                    v-validate="
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .inner_parameters.dataset_a_column.facets.validation
                                                    "
                                                    :class="{
                                                        invalid:
                                                            errors.has(
                                                                `parameter_${step.order}_${idx}_${
                                                                    preparationConfig.functions[rule.function]
                                                                        .parameters[param].inner_parameters
                                                                        .dataset_a_column.label
                                                                }_${conditionIndex}`,
                                                            ) && rule.submitted,
                                                    }"
                                                >
                                                    <template slot="singleLabel" slot-scope="props">
                                                        <span>{{ props.option | truncate(35) }}</span>
                                                    </template>
                                                </multiselect>
                                                <div
                                                    class="form-text text-danger pl-1 pr-1"
                                                    v-if="
                                                        errors.has(
                                                            `parameter_${step.order}_${idx}_${
                                                                preparationConfig.functions[rule.function].parameters[
                                                                    param
                                                                ].inner_parameters.dataset_a_column.label
                                                            }_${conditionIndex}`,
                                                        ) && rule.submitted
                                                    "
                                                >
                                                    <small>
                                                        {{
                                                            getValidationErrorMessage(
                                                                `parameter_${step.order}_${idx}_${
                                                                    preparationConfig.functions[rule.function]
                                                                        .parameters[param].inner_parameters
                                                                        .dataset_a_column.label
                                                                }_${conditionIndex}`,
                                                            )
                                                        }}
                                                    </small>
                                                </div>
                                                <div class="form-text text-muted pl-1 pr-1" v-else>
                                                    <small>
                                                        {{
                                                            preparationConfig.functions[rule.function].parameters[param]
                                                                .inner_parameters.dataset_a_column.description
                                                        }}
                                                    </small>
                                                </div>
                                            </div>
                                            <div>
                                                <font-awesome-icon
                                                    icon="arrows-alt-h"
                                                    size="2x"
                                                    class="mt-1 ml-1 mr-1 pl-2 pr-2"
                                                    style="color: grey;"
                                                />
                                            </div>
                                            <div class="flex-grow-1 w-100">
                                                <multiselect
                                                    :name="`parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .inner_parameters.dataset_b_column.label
                                                    }_${conditionIndex}`"
                                                    v-model="
                                                        rule.parameters[param][conditionIndex - 1].dataset_b_column
                                                    "
                                                    :options="
                                                        getColumns(
                                                            rule,
                                                            preparationConfig.functions[rule.function].parameters[param]
                                                                .inner_parameters.dataset_b_column,
                                                        )
                                                    "
                                                    :close-on-select="
                                                        !preparationConfig.functions[rule.function].parameters[param]
                                                            .inner_parameters.dataset_b_column.facets.multiple
                                                    "
                                                    :multiple="
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .inner_parameters.dataset_b_column.facets.multiple
                                                    "
                                                    :limit="1"
                                                    :placeholder="`Select ${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .inner_parameters.dataset_b_column.label
                                                    }`"
                                                    v-validate="
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .inner_parameters.dataset_b_column.facets.validation
                                                    "
                                                    :class="{
                                                        invalid:
                                                            errors.has(
                                                                `parameter_${step.order}_${idx}_${
                                                                    preparationConfig.functions[rule.function]
                                                                        .parameters[param].inner_parameters
                                                                        .dataset_b_column.label
                                                                }_${conditionIndex}`,
                                                            ) && rule.submitted,
                                                    }"
                                                >
                                                    <template slot="singleLabel" slot-scope="props">
                                                        <span>{{ props.option | truncate(35) }}</span>
                                                    </template>
                                                </multiselect>
                                                <div
                                                    class="form-text text-danger pl-1 pr-1"
                                                    v-if="
                                                        errors.has(
                                                            `parameter_${step.order}_${idx}_${
                                                                preparationConfig.functions[rule.function].parameters[
                                                                    param
                                                                ].inner_parameters.dataset_b_column.label
                                                            }_${conditionIndex}`,
                                                        ) && rule.submitted
                                                    "
                                                >
                                                    <small>
                                                        {{
                                                            getValidationErrorMessage(
                                                                `parameter_${step.order}_${idx}_${
                                                                    preparationConfig.functions[rule.function]
                                                                        .parameters[param].inner_parameters
                                                                        .dataset_b_column.label
                                                                }_${conditionIndex}`,
                                                            )
                                                        }}
                                                    </small>
                                                </div>
                                                <div class="form-text text-muted pl-1 pr-1" v-else>
                                                    <small>
                                                        {{
                                                            preparationConfig.functions[rule.function].parameters[param]
                                                                .inner_parameters.dataset_b_column.description
                                                        }}
                                                    </small>
                                                </div>
                                            </div>
                                            <div>
                                                <font-awesome-icon
                                                    @click="deleteCondition(rule)"
                                                    icon="times"
                                                    size="2x"
                                                    class="mt-1 ml-1 mr-1 pl-1 pr-1 delete-condition"
                                                    style="color: grey;"
                                                    v-if="conditionIndex > 1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <template
                                    v-if="
                                        preparationConfig.functions[rule.function].parameters[param].type ===
                                        'bucket_clauses'
                                    "
                                >
                                    <label class="mt-4">
                                        <strong>
                                            {{ preparationConfig.functions[rule.function].parameters[param].label }}
                                        </strong>
                                        &nbsp;
                                        <span @click="addCondition(rule)" class="add-condition">Add</span>
                                    </label>
                                    <div
                                        class="row"
                                        v-for="conditionIndex in rule.parameters[param].length"
                                        :key="conditionIndex"
                                    >
                                        <div class="col-12 d-flex">
                                            <div class="flex-grow-1 w-100">
                                                <label>
                                                    <strong>Interval</strong>
                                                </label>
                                                <input
                                                    :name="`parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .inner_parameters.interval.label
                                                    }_${conditionIndex}`"
                                                    type="text"
                                                    class="form-control"
                                                    v-model="rule.parameters[param][conditionIndex - 1].interval"
                                                    v-validate="
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .inner_parameters.interval.facets.validation
                                                    "
                                                    :class="{
                                                        invalid:
                                                            errors.has(
                                                                `parameter_${step.order}_${idx}_${
                                                                    preparationConfig.functions[rule.function]
                                                                        .parameters[param].inner_parameters.interval
                                                                        .label
                                                                }_${conditionIndex}`,
                                                            ) && rule.submitted,
                                                    }"
                                                />
                                                <div
                                                    class="form-text text-danger pl-1 pr-1"
                                                    v-if="
                                                        errors.has(
                                                            `parameter_${step.order}_${idx}_${
                                                                preparationConfig.functions[rule.function].parameters[
                                                                    param
                                                                ].inner_parameters.interval.label
                                                            }_${conditionIndex}`,
                                                        ) && rule.submitted
                                                    "
                                                >
                                                    <small>
                                                        {{
                                                            getValidationErrorMessage(
                                                                `parameter_${step.order}_${idx}_${
                                                                    preparationConfig.functions[rule.function]
                                                                        .parameters[param].inner_parameters.interval
                                                                        .label
                                                                }_${conditionIndex}`,
                                                            )
                                                        }}
                                                    </small>
                                                </div>
                                                <div class="form-text text-muted pl-1 pr-1" v-else>
                                                    <small>
                                                        {{
                                                            preparationConfig.functions[rule.function].parameters[param]
                                                                .inner_parameters.interval.description
                                                        }}
                                                    </small>
                                                </div>
                                            </div>
                                            <div style="margin: auto;">
                                                <font-awesome-icon
                                                    icon="arrow-right"
                                                    size="2x"
                                                    class="mt-1 ml-1 mr-1 pl-1 pr-1 delete-condition"
                                                    style="color: grey;"
                                                />
                                            </div>
                                            <div class="flex-grow-1 w-100">
                                                <label>
                                                    <strong>New value</strong>
                                                </label>
                                                <input
                                                    :name="`parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .inner_parameters.new_value.label
                                                    }_${conditionIndex}`"
                                                    type="text"
                                                    class="form-control"
                                                    v-model="rule.parameters[param][conditionIndex - 1].new_value"
                                                    v-validate="
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .inner_parameters.new_value.facets.validation
                                                    "
                                                    :class="{
                                                        invalid:
                                                            errors.has(
                                                                `parameter_${step.order}_${idx}_${
                                                                    preparationConfig.functions[rule.function]
                                                                        .parameters[param].inner_parameters.new_value
                                                                        .label
                                                                }_${conditionIndex}`,
                                                            ) && rule.submitted,
                                                    }"
                                                />
                                                <div
                                                    class="form-text text-danger pl-1 pr-1"
                                                    v-if="
                                                        errors.has(
                                                            `parameter_${step.order}_${idx}_${
                                                                preparationConfig.functions[rule.function].parameters[
                                                                    param
                                                                ].inner_parameters.new_value.label
                                                            }_${conditionIndex}`,
                                                        ) && rule.submitted
                                                    "
                                                >
                                                    <small>
                                                        {{
                                                            getValidationErrorMessage(
                                                                `parameter_${step.order}_${idx}_${
                                                                    preparationConfig.functions[rule.function]
                                                                        .parameters[param].inner_parameters.new_value
                                                                        .label
                                                                }_${conditionIndex}`,
                                                            )
                                                        }}
                                                    </small>
                                                </div>
                                                <div class="form-text text-muted pl-1 pr-1" v-else>
                                                    <small>
                                                        {{
                                                            preparationConfig.functions[rule.function].parameters[param]
                                                                .inner_parameters.new_value.description
                                                        }}
                                                    </small>
                                                </div>
                                            </div>
                                            <div style="margin: auto;">
                                                <font-awesome-icon
                                                    @click="deleteCondition(rule)"
                                                    icon="times"
                                                    size="2x"
                                                    class="mt-1 ml-1 mr-1 pl-1 pr-1 delete-condition"
                                                    style="color: grey;"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <template
                                    v-if="
                                        preparationConfig.functions[rule.function].parameters[param].type === 'numeric'
                                    "
                                >
                                    <label>
                                        <strong>
                                            {{ preparationConfig.functions[rule.function].parameters[param].label }}
                                        </strong>
                                    </label>
                                    <input
                                        :name="`parameter_${step.order}_${idx}_${
                                            preparationConfig.functions[rule.function].parameters[param].label
                                        }`"
                                        type="number"
                                        class="form-control"
                                        v-model.number="rule.parameters[param]"
                                        v-validate="
                                            preparationConfig.functions[rule.function].parameters[param].facets
                                                .validation
                                        "
                                        :class="{
                                            invalid:
                                                errors.has(
                                                    `parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .label
                                                    }`,
                                                ) && rule.submitted,
                                        }"
                                    />
                                    <div
                                        class="form-text text-danger pl-1 pr-1"
                                        v-if="
                                            errors.has(
                                                `parameter_${step.order}_${idx}_${
                                                    preparationConfig.functions[rule.function].parameters[param].label
                                                }`,
                                            ) && rule.submitted
                                        "
                                    >
                                        <small>
                                            {{
                                                getValidationErrorMessage(
                                                    `parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .label
                                                    }`,
                                                )
                                            }}
                                        </small>
                                    </div>
                                    <div class="form-text text-muted pl-1 pr-1" v-else>
                                        <small>
                                            {{
                                                preparationConfig.functions[rule.function].parameters[param].description
                                            }}
                                        </small>
                                    </div>
                                </template>
                                <template
                                    v-if="
                                        preparationConfig.functions[rule.function].parameters[param].type === 'string'
                                    "
                                >
                                    <label>
                                        <strong>
                                            {{ preparationConfig.functions[rule.function].parameters[param].label }}
                                        </strong>
                                    </label>
                                    <input
                                        :name="`parameter_${step.order}_${idx}_${
                                            preparationConfig.functions[rule.function].parameters[param].label
                                        }`"
                                        type="text"
                                        class="form-control"
                                        v-model="rule.parameters[param]"
                                        v-validate="
                                            preparationConfig.functions[rule.function].parameters[param].facets
                                                .validation
                                        "
                                        :class="{
                                            invalid:
                                                errors.has(
                                                    `parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .label
                                                    }`,
                                                ) && rule.submitted,
                                        }"
                                    />
                                    <div
                                        class="form-text text-danger pl-1 pr-1"
                                        v-if="
                                            errors.has(
                                                `parameter_${step.order}_${idx}_${
                                                    preparationConfig.functions[rule.function].parameters[param].label
                                                }`,
                                            ) && rule.submitted
                                        "
                                    >
                                        <small>
                                            {{
                                                getValidationErrorMessage(
                                                    `parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .label
                                                    }`,
                                                )
                                            }}
                                        </small>
                                    </div>
                                    <div class="form-text text-muted pl-1 pr-1" v-else>
                                        <small>
                                            {{
                                                preparationConfig.functions[rule.function].parameters[param].description
                                            }}
                                        </small>
                                    </div>
                                </template>
                                <template
                                    v-if="
                                        preparationConfig.functions[rule.function].parameters[param].type === 'datetime'
                                    "
                                >
                                    <label>
                                        <strong>
                                            {{ preparationConfig.functions[rule.function].parameters[param].label }}
                                        </strong>
                                    </label>
                                    <date-picker
                                        :name="`parameter_${step.order}_${idx}_${
                                            preparationConfig.functions[rule.function].parameters[param].label
                                        }`"
                                        input-class="form-control"
                                        width="100%"
                                        v-model="rule.parameters[param]"
                                        type="datetime"
                                        :lang="'en'"
                                        :shortcuts="false"
                                        :format="'YYYY-MM-DD HH:mm:ss.SSS'"
                                        value-type="date"
                                        v-validate="'required'"
                                        :class="{
                                            invalid:
                                                errors.has(
                                                    `parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .label
                                                    }`,
                                                ) && rule.submitted,
                                        }"
                                    ></date-picker>
                                    <div
                                        class="form-text text-danger pl-1 pr-1"
                                        v-if="
                                            errors.has(
                                                `parameter_${step.order}_${idx}_${
                                                    preparationConfig.functions[rule.function].parameters[param].label
                                                }`,
                                            ) && rule.submitted
                                        "
                                    >
                                        <small>
                                            {{
                                                getValidationErrorMessage(
                                                    `parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .label
                                                    }`,
                                                )
                                            }}
                                        </small>
                                    </div>
                                    <div class="form-text text-muted pl-1 pr-1" v-else>
                                        <small>
                                            {{
                                                preparationConfig.functions[rule.function].parameters[param].description
                                            }}
                                        </small>
                                    </div>
                                </template>
                                <template
                                    v-if="preparationConfig.functions[rule.function].parameters[param].type === 'enum'"
                                >
                                    <label>
                                        <strong>
                                            {{ preparationConfig.functions[rule.function].parameters[param].label }}
                                        </strong>
                                    </label>
                                    <multiselect
                                        :name="`parameter_${step.order}_${idx}_${
                                            preparationConfig.functions[rule.function].parameters[param].label
                                        }`"
                                        v-model="rule.parameters[param]"
                                        :ref="param"
                                        :options="preparationConfig.functions[rule.function].parameters[param].options"
                                        :close-on-select="
                                            !preparationConfig.functions[rule.function].parameters[param].facets
                                                .multiple
                                        "
                                        :multiple="
                                            preparationConfig.functions[rule.function].parameters[param].facets.multiple
                                        "
                                        :limit="1"
                                        placeholder="Select..."
                                        v-validate="
                                            preparationConfig.functions[rule.function].parameters[param].facets
                                                .validation
                                        "
                                        :class="{
                                            invalid:
                                                errors.has(
                                                    `parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .label
                                                    }`,
                                                ) && rule.submitted,
                                        }"
                                    >
                                        <template slot="singleLabel" slot-scope="props">
                                            <span>{{ props.option | truncate(35) }}</span>
                                        </template>
                                    </multiselect>
                                    <div
                                        class="form-text text-danger pl-1 pr-1"
                                        v-if="
                                            errors.has(
                                                `parameter_${step.order}_${idx}_${
                                                    preparationConfig.functions[rule.function].parameters[param].label
                                                }`,
                                            ) && rule.submitted
                                        "
                                    >
                                        <small>
                                            {{
                                                getValidationErrorMessage(
                                                    `parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .label
                                                    }`,
                                                )
                                            }}
                                        </small>
                                    </div>
                                    <div class="form-text text-muted pl-1 pr-1" v-else>
                                        <small>
                                            {{
                                                preparationConfig.functions[rule.function].parameters[param].description
                                            }}
                                        </small>
                                    </div>
                                </template>
                                <template
                                    v-if="
                                        preparationConfig.functions[rule.function].parameters[param].type === 'dataset'
                                    "
                                >
                                    <label>
                                        <strong>
                                            {{ preparationConfig.functions[rule.function].parameters[param].label }}
                                        </strong>
                                    </label>
                                    <select
                                        :name="`parameter_${step.order}_${idx}_${
                                            preparationConfig.functions[rule.function].parameters[param].label
                                        }`"
                                        class="form-control"
                                        v-model="rule.parameters[param]"
                                        @change="
                                            clearDataset(
                                                rule,
                                                param,
                                                preparationConfig.functions[rule.function].parameters,
                                            )
                                        "
                                        v-validate="
                                            preparationConfig.functions[rule.function].parameters[param].facets
                                                .validation
                                        "
                                        :class="{
                                            invalid:
                                                errors.has(
                                                    `parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .label
                                                    }`,
                                                ) && rule.submitted,
                                        }"
                                    >
                                        <option :value="null || undefined" disabled>Select Dataset</option>
                                        <optgroup label="Datasets">
                                            <option
                                                v-for="dataset in datasets"
                                                :key="`dataset-${dataset.name}`"
                                                :value="`dataset_${dataset.id}`"
                                            >
                                                {{ dataset.name }}
                                            </option>
                                        </optgroup>
                                        <optgroup label="Virtual Datasets" v-if="virtualDatasets.length > 0">
                                            <option
                                                v-for="dataset in virtualDatasets"
                                                :key="`virtual-dataset-${dataset.name}`"
                                                :value="`virtual_dataset_${dataset.id}`"
                                            >
                                                {{ dataset.name }}
                                            </option>
                                        </optgroup>
                                    </select>
                                    <div
                                        class="form-text text-danger pl-1 pr-1"
                                        v-if="
                                            errors.has(
                                                `parameter_${step.order}_${idx}_${
                                                    preparationConfig.functions[rule.function].parameters[param].label
                                                }`,
                                            ) && rule.submitted
                                        "
                                    >
                                        <small>
                                            {{
                                                getValidationErrorMessage(
                                                    `parameter_${step.order}_${idx}_${
                                                        preparationConfig.functions[rule.function].parameters[param]
                                                            .label
                                                    }`,
                                                )
                                            }}
                                        </small>
                                    </div>
                                    <div class="form-text text-muted pl-1 pr-1" v-else>
                                        <small>
                                            {{
                                                preparationConfig.functions[rule.function].parameters[param].description
                                            }}
                                        </small>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="row pl-2 mt-2 text-left">
                    <button
                        type="button"
                        class="btn btn-wide btn-primary btn-sm btn-shadow text-white mr-2"
                        @click="addRule"
                        v-if="preparationConfig.facets.multiple"
                    >
                        Add Rule
                    </button>
                    <button
                        type="button"
                        class="btn btn-wide btn-secondary btn-sm btn-shadow text-white mr-2"
                        @click="deleteRule"
                        v-if="preparationConfig.facets.multiple && config.length > 1"
                    >
                        <font-awesome-icon icon="trash-alt" size="1x" />
                    </button>
                    <span v-else>&nbsp;</span>
                </div>

                <div class="row pl-2 pr-2 mt-2">
                    <div
                        class="text-danger pt-1"
                        v-if="step.error && step.action === 'merge' && step.error.includes('specified more than once')"
                    >
                        <strong>Error!</strong>
                        It seems you are trying to include two columns with the same title ({{
                            step.error.match(/'([^']+)'/)[1]
                        }}) in the new dataset, but the column titles must be unique. If you need to keep column
                        {{ step.error.match(/'([^']+)'/)[1] }} from both datasets in the result, please rename this
                        column in one of them before attempting to merge. You will need to delete the current merge step
                        in order to do so.
                    </div>
                    <div class="text-danger pt-1" v-else-if="step.error">
                        <strong>Error!</strong>
                        {{ step.error }}
                    </div>
                </div>
                <div class="clearfix" />
            </div>
            <div class="text-right">
                <button
                    type="button"
                    class="btn btn-wide btn-warning btn-sm btn-shadow text-white mr-2"
                    @click="saveStep"
                >
                    Save
                </button>
                <button type="button" class="btn btn-wide btn-danger btn-sm btn-shadow text-white" @click="discardStep">
                    Delete
                </button>
            </div>
        </div>
        <div class="alert alert-secondary mt-1" v-else>
            <div class="loading-indicator">
                <Spinner name="wave" color="var(--primary)" no-fade-in />
                <h6 class="message">Applying rules... Please wait...</h6>
            </div>
        </div>
    </div>
</template>

<script>
import * as R from 'ramda';
import multiselect from 'vue-multiselect';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowsAltH, faTrashAlt, faTimes, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import DatePicker from 'vue2-datepicker';
import preparationOptions from '@/config/preparation.json';

library.add(faArrowsAltH, faTrashAlt, faTimes, faArrowRight);

export default {
    name: 'PreparationStep',
    components: { multiselect, FontAwesomeIcon, DatePicker },
    filters: {
        truncate(text, length) {
            if (text != null) {
                return text.length > length ? `${text.slice(0, length)}...` : text;
            }
            return null;
        },
    },
    props: {
        step: {
            type: Object,
            required: true,
        },
        datasets: {
            type: Array,
            default: () => [],
        },
        virtualDatasets: {
            type: Array,
            default: () => [],
        },
        columns: {
            type: Array,
            required: true,
        },
        loading: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            preparationConfig: preparationOptions[this.step.action],
            categories: [],
            config: null,
        };
    },
    created() {
        this.config = R.clone(this.step.rules);
        Object.keys(this.preparationConfig.functions).forEach((func) => {
            if (this.preparationConfig.functions[func]) {
                const idx = R.findIndex(R.propEq('label', this.preparationConfig.functions[func].category))(
                    this.categories,
                );
                if (~idx) {
                    this.categories[idx].functions.push(func);
                } else if (this.preparationConfig.functions[func].category) {
                    this.categories.push({
                        label: this.preparationConfig.functions[func].category,
                        functions: [func],
                    });
                }
            }
        });
        this.step.rules.forEach((rule) => {
            if (rule.parameters.dataset_b) {
                this.checkDataset(rule.parameters.dataset_b);
            }
        });
    },
    methods: {
        getColumns(rule, parameter) {
            if (this.preparationConfig.functions[rule.function]) {
                if (parameter.parent_parameter) {
                    if (rule.parameters[parameter.parent_parameter]) {
                        const id = rule.parameters[parameter.parent_parameter].split('_').pop();
                        if (rule.parameters[parameter.parent_parameter].includes('virtual')) {
                            const idx = R.findIndex(R.propEq('id', Number(id)))(this.virtualDatasets);
                            if (~idx) {
                                const filteredColumns = this.virtualDatasets[idx].columns.reduce((columns, column) => {
                                    if (
                                        parameter.facets.filter &&
                                        Array.isArray(parameter.facets.filter) &&
                                        parameter.facets.filter.length > 0
                                    ) {
                                        if (parameter.facets.filter.includes(column.type)) {
                                            columns.push(column);
                                        }
                                    } else {
                                        columns.push(column);
                                    }
                                    return columns;
                                }, []);
                                return R.pluck('title', filteredColumns);
                            }
                        } else {
                            const idx = R.findIndex(R.propEq('id', Number(id)))(this.datasets);
                            if (~idx) {
                                const filteredColumns = this.datasets[idx].columns.reduce((columns, column) => {
                                    if (
                                        parameter.facets.filter &&
                                        Array.isArray(parameter.facets.filter) &&
                                        parameter.facets.filter.length > 0
                                    ) {
                                        if (parameter.facets.filter.includes(column.type)) {
                                            columns.push(column);
                                        }
                                    } else {
                                        columns.push(column);
                                    }
                                    return columns;
                                }, []);
                                R.forEachObjIndexed((value, key) => {
                                    filteredColumns[key].title = value.title.toLowerCase().replace(/\./g, '__');
                                }, filteredColumns);
                                return R.pluck('title', filteredColumns);
                            }
                        }
                    }
                    return [];
                }
                const filteredColumns = this.columns.reduce((columns, column) => {
                    if (
                        parameter.facets.filter &&
                        Array.isArray(parameter.facets.filter) &&
                        parameter.facets.filter.length > 0
                    ) {
                        if (parameter.facets.filter.includes(column.type)) {
                            columns.push(column);
                        }
                    } else {
                        columns.push(column);
                    }
                    return columns;
                }, []);
                return R.pluck('title', filteredColumns);
            }
            return [];
        },
        getValidationErrorMessage(field) {
            const errorObject = R.find(R.propEq('field', field))(this.errors.items);
            switch (errorObject.rule) {
                case 'required':
                    return 'This field is required';
                case 'decimal':
                    return 'This field is required';
                case 'integer':
                    return 'This field should be integer';
                case 'regex':
                    return 'Should start with a lowercase character and contain only lowercase characters, numbers and underscores';
                default:
                    console.log(errorObject);
                    return 'Validation error';
            }
        },
        addRule() {
            this.config.forEach((rule) => {
                rule.submitted = true;
            });
            this.$validator.validateAll().then((success) => {
                if (success) {
                    this.config.push({ function: null, parameters: {}, submitted: false });
                } else {
                    this.$toastr.e('One or more rules require your attention', 'Error');
                }
            });
        },
        clearRule(rule) {
            if (this.step.action === 'merge') {
                rule.parameters = {
                    conditions: [{ dataset_a_column: null, dataset_b_column: null }],
                };
            } else if (this.step.action === 'add' && rule.function === 'add_group') {
                rule.parameters = {
                    conditions: [{ interval: null, new_value: null }],
                };
            } else {
                rule.parameters = {};
            }
            rule.output = null;
            rule.submitted = false;
        },
        checkDataset(dataset) {
            if (dataset) {
                const inputDatasetSplit = dataset.split('_');
                if (dataset.includes('virtual_dataset')) {
                    this.$emit('showWarning', 'virtualDataset', inputDatasetSplit[2], 'activeStep');
                } else if (dataset.includes('dataset')) {
                    this.$emit('showWarning', 'dataset', inputDatasetSplit[1], 'activeStep');
                }
            }
        },
        clearDataset(rule, paramKey, params) {
            this.checkDataset(rule.parameters.dataset_b);
            if (this.step.action === 'merge') {
                R.forEachObjIndexed((value, key) => {
                    if (value.parent_parameter === paramKey) {
                        rule.parameters[key] = null;
                    }
                }, params);
                rule.parameters.conditions = [{ dataset_a_column: null, dataset_b_column: null }];
            }
        },
        deleteRule() {
            this.config.pop();
        },
        addCondition(rule) {
            if (this.step.action === 'merge') {
                rule.parameters.conditions.push({ dataset_a_column: null, dataset_b_column: null });
            } else if (this.step.action === 'add' && rule.function === 'add_group') {
                rule.parameters.conditions.push({ interval: null, new_value: null });
            }
        },
        deleteCondition(rule) {
            if (this.step.action === 'merge') {
                if (rule.parameters.conditions.length === 1) {
                    this.$toastr.e("'Merge Dataset' action should have at least one condition", 'Error');
                } else {
                    rule.parameters.conditions.pop();
                }
            } else if (this.step.action === 'add' && rule.function === 'add_group') {
                if (rule.parameters.conditions.length === 1) {
                    this.$toastr.e("'Add  Buckets' action should have at least one bucket", 'Error');
                } else {
                    rule.parameters.conditions.pop();
                }
            }
        },
        saveStep() {
            this.config.forEach((rule) => {
                rule.submitted = true;
            });
            this.$validator.validateAll().then((success) => {
                if (success) {
                    const config = this.config.reduce((rules, rule) => {
                        if (rule.function) {
                            if (rule.function === 'rename_cols') {
                                const idx = R.findIndex(R.propEq('function', 'rename_cols'))(rules);
                                if (~idx) {
                                    rules[idx].parameters.new_names.push({
                                        original_column: rule.parameters.col_a,
                                        renamed_column: rule.output,
                                    });
                                } else {
                                    const alteredRenameRule = {
                                        category: this.preparationConfig.functions[rule.function].category,
                                        function: 'rename_cols',
                                        parameters: {
                                            new_names: [
                                                {
                                                    original_column: rule.parameters.col_a,
                                                    renamed_column: rule.output,
                                                },
                                            ],
                                        },
                                    };
                                    rules.push(alteredRenameRule);
                                }
                            } else if (rule.function === 'time_comparison_val') {
                                const utcRule = R.clone(rule);
                                utcRule.parameters.val = new Date(
                                    utcRule.parameters.val.getTime() -
                                        utcRule.parameters.val.getTimezoneOffset() * 60 * 1000,
                                );
                                rules.push(
                                    R.omit(
                                        ['submitted'],
                                        R.assoc(
                                            'category',
                                            this.preparationConfig.functions[utcRule.function].category,
                                            utcRule,
                                        ),
                                    ),
                                );
                            } else {
                                rules.push(
                                    R.omit(
                                        ['submitted'],
                                        R.assoc(
                                            'category',
                                            this.preparationConfig.functions[rule.function].category,
                                            rule,
                                        ),
                                    ),
                                );
                            }
                        }
                        return rules;
                    }, []);
                    if (config.length) {
                        this.$emit('save', R.assoc('rules', config, this.step));
                    } else {
                        this.step.error = 'You need at least one valid rule to save a step';
                    }
                } else {
                    this.$toastr.e('One or more rules require your attention', 'Error');
                }
            });
        },
        discardStep() {
            this.$emit('discard', this.step);
        },
    },
};
</script>

<style lang="scss">
.virtual-dataset-step {
    .separated {
        border-bottom: 1px solid #bfc1c5;
    }

    .btn.btn-block {
        display: block;
    }

    .invalid {
        border-color: red;
    }

    .multiselect.invalid .multiselect__tags {
        border-color: red;
    }

    .mx-datepicker.invalid .mx-input-wrapper .form-control {
        border-color: red;
    }

    .add-condition {
        color: var(--primary);
        font-size: 0.75rem;
        text-decoration: underline;
        cursor: pointer;
    }

    .delete-condition {
        cursor: pointer;
    }
}
</style>
