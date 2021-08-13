import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
    extends: Line,
    mixins: [reactiveProp],
    props: ['chartData'],
    // props: ['chartData', 'options'],

    data() {
        return {
            // Chart.js options that controls the appearance of the chart
            options: {
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 20,
                        bottom: 10,
                    },
                },
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                display: true,
                                beginAtZero: true,
                                autoSkip: true,
                                maxTicksLimit: 7,
                            },
                            gridLines: {
                                display: false,
                            },
                        },
                    ],
                    xAxes: [
                        {
                            ticks: {
                                display: true,
                                autoSkip: true,
                                maxTicksLimit: 15,
                            },
                            gridLines: {
                                display: true,
                            },
                            type: 'time',
                            time: {
                                parser: 'YYYY-MM-DD',
                                tooltipFormat: 'll',
                                unit: 'day',
                                unitStepSize: 1,
                                displayFormats: {
                                    day: 'DD/MM/YYYY',
                                },
                            },
                        },
                    ],
                },
                legend: {
                    display: false,
                },
                responsive: true,
                maintainAspectRatio: true,
            },
        };
    },

    mounted() {
        // this.chartData is created in the mixin.
        this.renderChart(this.chartData, this.options);
    },
    watch: {
        chartData() {
            this.renderChart(this.chartData, this.options);
        },
    },
};
