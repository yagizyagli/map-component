/* ===========================================================
 *
 * THEME MANAGER
 *
 * Production Grade Theme Engine
 *
 * ===========================================================
 */

export default class ThemeManager {

    constructor(component = null) {

        this.component = component;

        this.theme = "light";

        this.themes = new Map();

        this.register("light", {

            "--button-bg": "#2563eb",
            "--button-color": "#ffffff",
            "--button-border": "#2563eb",
            "--button-hover-bg": "#1d4ed8",
            "--button-active-bg": "#1e40af",
            "--button-disabled-bg": "#e5e7eb",
            "--button-disabled-color": "#9ca3af"

        });

        this.register("dark", {

            "--button-bg": "#3b82f6",
            "--button-color": "#ffffff",
            "--button-border": "#3b82f6",
            "--button-hover-bg": "#2563eb",
            "--button-active-bg": "#1d4ed8",
            "--button-disabled-bg": "#374151",
            "--button-disabled-color": "#6b7280"

        });

    }

    bind(component) {

        this.component = component;

        this.apply();

    }

    register(name, variables) {

        this.themes.set(
            name,
            structuredClone(variables)
        );

    }

    has(name) {

        return this.themes.has(name);

    }

    set(name) {

        if (!this.has(name))
            return false;

        this.theme = name;

        this.apply();

        return true;

    }

    get() {

        return this.theme;

    }

    getVariables() {

        return this.themes.get(this.theme);

    }

    apply() {

        if (!this.component)
            return;

        const vars = this.getVariables();

        if (!vars)
            return;

        for (const [key, value] of Object.entries(vars)) {

            this.component.style.setProperty(
                key,
                value
            );

        }

    }

    destroy() {

        this.themes.clear();

        this.component = null;

    }

}
export default ThemeManager;
