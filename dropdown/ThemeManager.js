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

            "--dropdown-bg": "#ffffff",
            "--dropdown-color": "#111827",
            "--dropdown-border": "#e5e7eb",
            "--dropdown-shadow": "0 12px 32px rgba(0,0,0,.15)",
            "--dropdown-hover-bg": "#f3f4f6",
            "--dropdown-active-bg": "#e5e7eb"

        });

        this.register("dark", {

            "--dropdown-bg": "#1f2937",
            "--dropdown-color": "#f9fafb",
            "--dropdown-border": "#374151",
            "--dropdown-shadow": "0 12px 32px rgba(0,0,0,.5)",
            "--dropdown-hover-bg": "#374151",
            "--dropdown-active-bg": "#4b5563"

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
