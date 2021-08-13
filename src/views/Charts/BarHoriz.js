import { HorizontalBar, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
    extends: HorizontalBar,
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
                        right: 20,
                        top: 0,
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
                                beginAtZero: true,
                                stepSize: 1,
                            },
                            gridLines: {
                                display: true,
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
};
