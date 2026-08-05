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

            "--drawer-bg": "#ffffff",
            "--drawer-color": "#111827",
            "--drawer-border": "#e5e7eb",
            "--drawer-shadow": "0 20px 60px rgba(0,0,0,.15)",
            "--drawer-overlay": "rgba(0,0,0,.45)",
            "--drawer-header-bg": "#f9fafb",
            "--drawer-footer-bg": "#f9fafb"

        });

        this.register("dark", {

            "--drawer-bg": "#1f2937",
            "--drawer-color": "#f9fafb",
            "--drawer-border": "#374151",
            "--drawer-shadow": "0 20px 60px rgba(0,0,0,.6)",
            "--drawer-overlay": "rgba(0,0,0,.7)",
            "--drawer-header-bg": "#111827",
            "--drawer-footer-bg": "#111827"

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
