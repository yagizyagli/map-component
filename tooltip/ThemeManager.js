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

            "--tooltip-bg": "#111827",
            "--tooltip-color": "#ffffff",
            "--tooltip-border": "#111827",
            "--tooltip-shadow": "0 8px 24px rgba(0,0,0,.18)"

        });

        this.register("dark", {

            "--tooltip-bg": "#f9fafb",
            "--tooltip-color": "#111827",
            "--tooltip-border": "#374151",
            "--tooltip-shadow": "0 8px 24px rgba(0,0,0,.35)"

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

        const variables =
            this.getVariables();

        if (!variables)
            return;

        for (const [key, value] of Object.entries(variables)) {

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
