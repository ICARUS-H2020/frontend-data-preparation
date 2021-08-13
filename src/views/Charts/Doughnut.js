import { Doughnut, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
    extends: Doughnut,
    mixins: [reactiveProp],
    props: ['chartData'],
    // props: ['chartData', 'options'],

    data() {
        return {
            // Chart.js options that controls the appearance of the chart
            options: {
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 10,
                        bottom: 20,
                    },
                },
                legend: {
                    display: true,
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
