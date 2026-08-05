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

            "--card-bg": "#ffffff",

            "--card-color": "#111827",

            "--card-border": "#e5e7eb",

            "--card-shadow": "0 2px 8px rgba(0,0,0,.08)",

            "--card-header-bg": "#f9fafb",

            "--card-footer-bg": "#f9fafb"

        });

        this.register("dark", {

            "--card-bg": "#1f2937",

            "--card-color": "#f9fafb",

            "--card-border": "#374151",

            "--card-shadow": "0 8px 24px rgba(0,0,0,.45)",

            "--card-header-bg": "#111827",

            "--card-footer-bg": "#111827"

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
