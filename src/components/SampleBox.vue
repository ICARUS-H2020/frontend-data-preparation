<template>
    <div class="row sample-box">
        <div class="col-12 mb-2">
            <b-card class="mb-1 card-border">
                <b-card-header header-tag="header" v-b-toggle.sample class="p-1" role="tab">
                    <h5>Data Sample Preview</h5>
                </b-card-header>
                <b-collapse id="sample" accordion="verification" role="tabpanel">
                    <b-card-body class="mt-1 pt-2 pb-2 p-0 hr-line">
                        <vue-scrolling-table>
                            <template slot="thead">
                                <tr>
                                    <th class="text-center">#</th>
                                    <th v-for="col in columns" :key="col" class="text-center">{{ col }}</th>
                                </tr>
                            </template>
                            <template slot="tbody">
                                <tr v-for="(item, idx) in rows" :key="idx">
                                    <td class="text-center">
                                        <strong>{{ idx + 1 }}</strong>
                                    </td>
                                    <td v-for="col in columns" :key="`${idx}-${col}`" class="text-center">
                                        {{ item[col] }}
                                    </td>
                                </tr>
                            </template>
                        </vue-scrolling-table>
                    </b-card-body>
                </b-collapse>
            </b-card>
        </div>
    </div>
</template>

<script>
import VueScrollingTable from 'vue-scrolling-table';

export default {
    name: 'SampleBox',
    components: { VueScrollingTable },
    props: {
        columns: {
            type: Array,
            required: true,
        },
        rows: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style lang="scss">
.sample-box {
    .card-body {
        padding: 0.25rem 1.25rem;
    }

    .card-header {
        border-bottom: 0;
        height: 2.2rem;
        cursor: pointer;
        text-transform: inherit;
        h5 {
            padding-left: 0.5rem;
            margin-bottom: 0.1rem;
        }
    }

    .hr-line {
        border-top: 1px solid #e5e5e5;
    }

    .card-header:before {
        font-family: 'Linearicons-Free';
        content: '\e874';
        float: right;
    }
    .card-header.collapsed:before {
        /* symbol for "collapsed" panels */
        content: '\e876';
    }

    .row .bordered {
        border-right: 1px solid #ddd;
        &:last-child {
            border-right: none;
        }
    }

    th {
        padding: 4px;
    }
    tr {
        font-size: inherit;
        line-height: 1.2;
        td {
            padding: 4px;
        }
    }
    table.scrolling {
        border-left: 1px solid #ddd;
        max-height: 55vh;
    }
    table.scrolling td:first-child,
    table.scrolling th:first-child {
        position: -webkit-sticky;
        position: sticky;
        left: 0;
        background-color: #eee;
        border-left: 0;
        min-width: 5em;
        max-width: 5em;
        width: 5em;
    }
}
</style>
