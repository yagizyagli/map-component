/* ===========================================================
 *
 * THEME MANAGER
 *
 * Production Grade Spinner Theme Engine
 *
 * ===========================================================
 */

export default class ThemeManager {

    constructor(component = null) {

        this.component = component;

        this.theme = "light";

        this.themes = new Map();

        this.register("light", {

            "--spinner-color": "#2563eb",

            "--spinner-track": "#e5e7eb"

        });

        this.register("dark", {

            "--spinner-color": "#60a5fa",

            "--spinner-track": "#374151"

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
