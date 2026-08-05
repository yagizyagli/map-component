/* ===========================================================
 *
 * EXPORT MANAGER
 *
 * Production Grade Export Engine
 *
 * ===========================================================
 */

export default class ExportManager {

    constructor(component = null) {

        this.component = component;

        this.filename = "table";

    }

    bind(component) {

        this.component = component;

    }

    setFilename(name) {

        if (typeof name !== "string")
            return;

        this.filename = name.trim() || "table";

    }

    exportJSON(rows = []) {

        const blob = new Blob(
            [
                JSON.stringify(
                    rows,
                    null,
                    2
                )
            ],
            {
                type: "application/json"
            }
        );

        this.download(
            blob,
            `${this.filename}.json`
        );

    }

    exportCSV(rows = []) {

        if (!rows.length)
            return;

        const headers =
            Object.keys(rows[0]);

        const csv = [

            headers.join(","),

            ...rows.map(row =>

                headers
                    .map(key =>

                        `"${String(
                            row[key] ?? ""
                        ).replace(/"/g, "\"\"")}"`

                    )
                    .join(",")

            )

        ].join("\n");

        const blob = new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        this.download(
            blob,
            `${this.filename}.csv`
        );

    }

    exportText(rows = []) {

        const blob = new Blob(
            [
                JSON.stringify(
                    rows,
                    null,
                    4
                )
            ],
            {
                type: "text/plain"
            }
        );

        this.download(
            blob,
            `${this.filename}.txt`
        );

    }

    download(blob, filename) {

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download = filename;

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);

    }

    destroy() {

        this.component = null;

    }

}
