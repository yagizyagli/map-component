/* ===========================================================
 *
 * THEME MANAGER
 *
 * Production Grade Theme Manager
 *
 * ===========================================================
 */

export default class ThemeManager {

    constructor() {

        this.chart = null;

        this.theme = "light";

        this.palette = {

            light: {

                background: "#ffffff",

                text: "#111827",

                grid: "#e5e7eb",

                border: "#d1d5db",

                tooltipBackground: "#ffffff",

                tooltipText: "#111827"

            },

            dark: {

                background: "#111827",

                text: "#f9fafb",

                grid: "#374151",

                border: "#4b5563",

                tooltipBackground: "#1f2937",

                tooltipText: "#ffffff"

            }

        };

    }

    bind(chart) {

        this.chart = chart;

        this.apply();

    }

    getTheme() {

        return this.theme;

    }

    setTheme(theme = "light") {

        if (!this.palette[theme])
            return;

        this.theme = theme;

        this.apply();

    }

    toggle() {

        this.setTheme(

            this.theme === "light"

                ? "dark"

                : "light"

        );

    }

    registerTheme(name, colors) {

        this.palette[name] = {

            ...colors

        };

    }

    getColor(name) {

        return this.palette[this.theme]?.[name];

    }

    apply() {

        if (!this.chart)
            return;

        const colors = this.palette[this.theme];

        this.chart.options.color = colors.text;

        this.chart.options.borderColor = colors.border;

        this.chart.options.backgroundColor = colors.background;

        Object.values(this.chart.options.scales ?? {}).forEach(scale => {

            scale.grid ??= {};

            scale.ticks ??= {};

            scale.border ??= {};

            scale.grid.color = colors.grid;

            scale.ticks.color = colors.text;

            scale.border.color = colors.border;

        });

        this.chart.options.plugins ??= {};

        this.chart.options.plugins.tooltip ??= {};

        this.chart.options.plugins.tooltip.backgroundColor =
            colors.tooltipBackground;

        this.chart.options.plugins.tooltip.titleColor =
            colors.tooltipText;

        this.chart.options.plugins.tooltip.bodyColor =
            colors.tooltipText;

        this.chart.options.plugins.legend ??= {};

        this.chart.options.plugins.legend.labels ??= {};

        this.chart.options.plugins.legend.labels.color =
            colors.text;

        this.update();

    }

    update(mode = "none") {

        if (!this.chart)
            return;

        this.chart.update(mode);

    }

    reset() {

        this.theme = "light";

        this.apply();

    }

    destroy() {

        this.chart = null;

    }

}
