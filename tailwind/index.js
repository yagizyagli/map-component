const plugin = require("tailwindcss/plugin");

module.exports = plugin(function ({ addBase }) {

    addBase({

        ":root": {

            "--ui-primary": "#2563eb",
            "--ui-secondary": "#64748b",
            "--ui-success": "#16a34a",
            "--ui-warning": "#f59e0b",
            "--ui-danger": "#dc2626",

            "--ui-background": "#ffffff",
            "--ui-surface": "#f8fafc",
            "--ui-border": "#e5e7eb",

            "--ui-text": "#111827",
            "--ui-muted": "#6b7280",

            "--ui-radius": "10px",
            "--ui-shadow":
                "0 10px 25px rgba(0,0,0,.08)"

        }

    });

});
