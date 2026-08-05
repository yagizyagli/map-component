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

            "--calendar-bg": "#ffffff",
            "--calendar-color": "#111827",
            "--calendar-border": "#e5e7eb",
            "--calendar-header-bg": "#f8fafc",
            "--calendar-hover": "#f3f4f6",
            "--calendar-today": "#dbeafe",
            "--calendar-selected": "#2563eb",
            "--calendar-selected-color": "#ffffff",
            "--calendar-event": "#16a34a"

        });

        this.register("dark", {

            "--calendar-bg": "#111827",
            "--calendar-color": "#f9fafb",
            "--calendar-border": "#374151",
            "--calendar-header-bg": "#1f2937",
            "--calendar-hover": "#374151",
            "--calendar-today": "#1d4ed8",
            "--calendar-selected": "#3b82f6",
            "--calendar-selected-color": "#ffffff",
            "--calendar-event": "#22c55e"

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

        const target = this.component;

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
