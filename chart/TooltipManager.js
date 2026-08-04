/* ===========================================================
 *
 * TOOLTIP MANAGER
 *
 * Production Grade Tooltip Manager
 *
 * ===========================================================
 */

export default class TooltipManager {

    constructor() {

        this.chart = null;

        this.enabled = true;

        this.theme = "light";

        this.position = "average";

        this.mode = "nearest";

        this.intersect = true;

        this.padding = 12;

        this.cornerRadius = 8;

        this.displayColors = true;

        this.usePointStyle = true;

        this.formatter = null;

        this.titleFormatter = null;

    }

    bind(chart) {

        this.chart = chart;

        this.apply();

    }

    apply() {

        if (!this.chart)
            return;

        const tooltip = this.chart.options.plugins.tooltip ??= {};

        tooltip.enabled = this.enabled;

        tooltip.position = this.position;

        tooltip.mode = this.mode;

        tooltip.intersect = this.intersect;

        tooltip.padding = this.padding;

        tooltip.cornerRadius = this.cornerRadius;

        tooltip.displayColors = this.displayColors;

        tooltip.usePointStyle = this.usePointStyle;

        tooltip.backgroundColor =
            this.theme === "dark"
                ? "#1f2937"
                : "#ffffff";

        tooltip.titleColor =
            this.theme === "dark"
                ? "#ffffff"
                : "#111827";

        tooltip.bodyColor =
            this.theme === "dark"
                ? "#f3f4f6"
                : "#374151";

        tooltip.borderColor =
            this.theme === "dark"
                ? "#374151"
                : "#d1d5db";

        tooltip.borderWidth = 1;

        tooltip.callbacks ??= {};

        tooltip.callbacks.label = context => {

            if (this.formatter)
                return this.formatter(context);

            return `${context.dataset.label}: ${context.formattedValue}`;

        };

        tooltip.callbacks.title = context => {

            if (this.titleFormatter)
                return this.titleFormatter(context);

            return context[0]?.label ?? "";

        };

        this.update();

    }

    update(mode = "none") {

        if (!this.chart)
            return;

        this.chart.update(mode);

    }

    enable() {

        this.enabled = true;

        this.apply();

    }

    disable() {

        this.enabled = false;

        this.apply();

    }

    setTheme(theme = "light") {

        this.theme = theme;

        this.apply();

    }

    setFormatter(callback) {

        this.formatter = callback;

        this.apply();

    }

    setTitleFormatter(callback) {

        this.titleFormatter = callback;

        this.apply();

    }

    setPosition(position) {

        this.position = position;

        this.apply();

    }

    setMode(mode) {

        this.mode = mode;

        this.apply();

    }

    setIntersect(value = true) {

        this.intersect = value;

        this.apply();

    }

    setPadding(value) {

        this.padding = value;

        this.apply();

    }

    setCornerRadius(value) {

        this.cornerRadius = value;

        this.apply();

    }

    setDisplayColors(value = true) {

        this.displayColors = value;

        this.apply();

    }

    setPointStyle(value = true) {

        this.usePointStyle = value;

        this.apply();

    }

    reset() {

        this.enabled = true;

        this.theme = "light";

        this.position = "average";

        this.mode = "nearest";

        this.intersect = true;

        this.padding = 12;

        this.cornerRadius = 8;

        this.displayColors = true;

        this.usePointStyle = true;

        this.formatter = null;

        this.titleFormatter = null;

        this.apply();

    }

    destroy() {

        this.chart = null;

        this.formatter = null;

        this.titleFormatter = null;

    }

}
