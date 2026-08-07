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

            "--form-bg": "#ffffff",
            "--form-color": "#111827",
            "--form-border": "#d1d5db",
            "--form-placeholder": "#9ca3af",
            "--form-focus": "#2563eb",
            "--form-error": "#dc2626",
            "--form-success": "#16a34a",
            "--form-disabled": "#f3f4f6"

        });

        this.register("dark", {

            "--form-bg": "#111827",
            "--form-color": "#f9fafb",
            "--form-border": "#374151",
            "--form-placeholder": "#6b7280",
            "--form-focus": "#3b82f6",
            "--form-error": "#ef4444",
            "--form-success": "#22c55e",
            "--form-disabled": "#1f2937"

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

    unregister(name) {

        return this.themes.delete(name);

    }

    has(name) {

        return this.themes.has(name);

    }

    is(name) {

        return this.theme === name;

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

        return this.themes.get(
            this.theme
        );

    }

    apply() {

        if (!this.component)
            return;

        const variables =
            this.getVariables();

        if (!variables)
            return;

        const target =
            this.component.shadowRoot ??
            this.component;

        for (const [key, value] of Object.entries(variables)) {

            target.host
                ? target.host.style.setProperty(key, value)
                : target.style.setProperty(key, value);

        }

    }

    destroy() {

        this.themes.clear();

        this.component = null;

    }

}
export default ThemeManager;
