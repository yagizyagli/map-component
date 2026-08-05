/* ===========================================================
 *
 * THEME MANAGER
 *
 * Production Grade Badge Theme Engine
 *
 * ===========================================================
 */

export default class ThemeManager {

    constructor(component = null) {

        this.component = component;

        this.theme = "light";

        this.themes = new Map();

        this.register("light", {

            "--badge-bg": "#2563eb",

            "--badge-color": "#ffffff",

            "--badge-border": "#2563eb",

            "--badge-success": "#16a34a",

            "--badge-warning": "#f59e0b",

            "--badge-danger": "#dc2626",

            "--badge-info": "#0ea5e9"

        });

        this.register("dark", {

            "--badge-bg": "#3b82f6",

            "--badge-color": "#f9fafb",

            "--badge-border": "#60a5fa",

            "--badge-success": "#22c55e",

            "--badge-warning": "#fbbf24",

            "--badge-danger": "#ef4444",

            "--badge-info": "#38bdf8"

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
