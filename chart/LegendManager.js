/* ===========================================================
 *
 * LEGEND MANAGER
 *
 * Production Grade Legend Manager
 *
 * ===========================================================
 */

export default class LegendManager {

    constructor() {

        this.chart = null;

        this.enabled = true;

        this.position = "top";

        this.align = "center";

        this.fullSize = true;

        this.reverse = false;

        this.rtl = false;

        this.maxHeight = undefined;

        this.maxWidth = undefined;

        this.labels = {

            boxWidth: 40,
            boxHeight: 12,
            padding: 12,
            usePointStyle: false,
            pointStyleWidth: 12

        };

        this.onClick = null;

        this.onHover = null;

        this.onLeave = null;

    }

    bind(chart) {

        this.chart = chart;

        this.apply();

    }

    apply() {

        if (!this.chart)
            return;

        const legend = this.chart.options.plugins.legend ??= {};

        legend.display = this.enabled;

        legend.position = this.position;

        legend.align = this.align;

        legend.fullSize = this.fullSize;

        legend.reverse = this.reverse;

        legend.rtl = this.rtl;

        legend.maxHeight = this.maxHeight;

        legend.maxWidth = this.maxWidth;

        legend.labels ??= {};

        Object.assign(
            legend.labels,
            this.labels
        );

        legend.onClick = (...args) => {

            if (this.onClick) {

                this.onClick(...args);

                return;

            }

            const defaultHandler =
                Chart.defaults.plugins.legend.onClick;

            defaultHandler?.(...args);

        };

        legend.onHover = (...args) => {

            this.onHover?.(...args);

        };

        legend.onLeave = (...args) => {

            this.onLeave?.(...args);

        };

        this.update();

    }

    update(mode = "none") {

        if (!this.chart)
            return;

        this.chart.update(mode);

    }

    show() {

        this.enabled = true;

        this.apply();

    }

    hide() {

        this.enabled = false;

        this.apply();

    }

    toggle() {

        this.enabled = !this.enabled;

        this.apply();

    }

    setPosition(position) {

        this.position = position;

        this.apply();

    }

    setAlign(align) {

        this.align = align;

        this.apply();

    }

    setReverse(value = true) {

        this.reverse = value;

        this.apply();

    }

    setRTL(value = true) {

        this.rtl = value;

        this.apply();

    }

    setFullSize(value = true) {

        this.fullSize = value;

        this.apply();

    }

    setMaxHeight(value) {

        this.maxHeight = value;

        this.apply();

    }

    setMaxWidth(value) {

        this.maxWidth = value;

        this.apply();

    }

    setLabels(options = {}) {

        Object.assign(
            this.labels,
            options
        );

        this.apply();

    }

    setOnClick(callback) {

        this.onClick = callback;

        this.apply();

    }

    setOnHover(callback) {

        this.onHover = callback;

        this.apply();

    }

    setOnLeave(callback) {

        this.onLeave = callback;

        this.apply();

    }

    reset() {

        this.enabled = true;

        this.position = "top";

        this.align = "center";

        this.fullSize = true;

        this.reverse = false;

        this.rtl = false;

        this.maxHeight = undefined;

        this.maxWidth = undefined;

        this.labels = {

            boxWidth: 40,
            boxHeight: 12,
            padding: 12,
            usePointStyle: false,
            pointStyleWidth: 12

        };

        this.onClick = null;

        this.onHover = null;

        this.onLeave = null;

        this.apply();

    }

    destroy() {

        this.chart = null;

        this.onClick = null;

        this.onHover = null;

        this.onLeave = null;

    }

}
export default LegendManager;
