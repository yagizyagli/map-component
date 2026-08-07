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

            "--table-bg": "#ffffff",
            "--table-color": "#111827",
            "--table-border": "#e5e7eb",
            "--table-header-bg": "#f8fafc",
            "--table-hover": "#f3f4f6",
            "--table-selected": "#dbeafe"

        });

        this.register("dark", {

            "--table-bg": "#111827",
            "--table-color": "#f9fafb",
            "--table-border": "#374151",
            "--table-header-bg": "#1f2937",
            "--table-hover": "#374151",
            "--table-selected": "#1d4ed8"

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

        const target =
            this.component.shadowRoot.host;

        for (const [key, value] of Object.entries(vars)) {

            target.style.setProperty(
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
