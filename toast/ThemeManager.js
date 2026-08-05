/* ===========================================================
 *
 * THEME MANAGER
 *
 * Production Grade Toast Theme Engine
 *
 * ===========================================================
 */

export default class ThemeManager {

    constructor(component = null) {

        this.component = component;

        this.theme = "light";

        this.themes = new Map();


        this.register("light", {

            "--toast-bg": "#ffffff",

            "--toast-color": "#111827",

            "--toast-border": "#e5e7eb",

            "--toast-shadow": "0 12px 32px rgba(0,0,0,.15)",

            "--toast-success": "#16a34a",

            "--toast-error": "#dc2626",

            "--toast-warning": "#f59e0b",

            "--toast-info": "#2563eb"

        });


        this.register("dark", {

            "--toast-bg": "#1f2937",

            "--toast-color": "#f9fafb",

            "--toast-border": "#374151",

            "--toast-shadow": "0 12px 32px rgba(0,0,0,.5)",

            "--toast-success": "#22c55e",

            "--toast-error": "#ef4444",

            "--toast-warning": "#fbbf24",

            "--toast-info": "#60a5fa"

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
