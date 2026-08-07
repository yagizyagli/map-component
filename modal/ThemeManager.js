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

            "--modal-bg": "#ffffff",
            "--modal-color": "#111827",
            "--modal-border": "#e5e7eb",
            "--modal-shadow": "0 20px 60px rgba(0,0,0,.15)",
            "--modal-overlay": "rgba(0,0,0,.45)",
            "--modal-header-bg": "#f9fafb",
            "--modal-footer-bg": "#f9fafb"

        });

        this.register("dark", {

            "--modal-bg": "#1f2937",
            "--modal-color": "#f9fafb",
            "--modal-border": "#374151",
            "--modal-shadow": "0 20px 60px rgba(0,0,0,.6)",
            "--modal-overlay": "rgba(0,0,0,.7)",
            "--modal-header-bg": "#111827",
            "--modal-footer-bg": "#111827"

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
