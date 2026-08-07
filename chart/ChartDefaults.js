/* ===========================================================
 *
 * CHART DEFAULTS
 *
 * Production Grade Default Configuration
 *
 * ===========================================================
 */

export const DEFAULTS = {

    type: "line",

    responsive: true,

    maintainAspectRatio: false,

    animation: true,

    theme: "light",

    title: "",

    interaction: {

        mode: "nearest",

        intersect: false

    },

    layout: {

        padding: 0

    },

    elements: {

        line: {

            tension: 0.35,

            borderWidth: 2,

            fill: false

        },

        point: {

            radius: 4,

            hoverRadius: 6,

            hitRadius: 10

        },

        bar: {

            borderRadius: 6,

            borderSkipped: false

        },

        arc: {

            borderWidth: 2

        }

    },

    plugins: {

        legend: {

            display: true,

            position: "top",

            align: "center"

        },

        tooltip: {

            enabled: true,

            mode: "nearest",

            intersect: false

        },

        title: {

            display: false,

            text: ""

        }

    },

    scales: {

        x: {

            display: true,

            grid: {

                display: true

            },

            ticks: {

                display: true

            }

        },

        y: {

            display: true,

            beginAtZero: false,

            grid: {

                display: true

            },

            ticks: {

                display: true

            }

        }

    },

    data: {

        labels: [],

        datasets: []

    }

};
export default Object.freeze(
    CHART_DEFAULTS
);
