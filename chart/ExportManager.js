/* ===========================================================
 *
 * EXPORT MANAGER
 *
 * Production Grade Export Manager
 *
 * ===========================================================
 */

export default class ExportManager {

    constructor() {

        this.chart = null;

    }

    bind(chart) {

        this.chart = chart;

    }

    getCanvas() {

        return this.chart?.canvas ?? null;

    }

    toDataURL(type = "image/png", quality = 1) {

        const canvas = this.getCanvas();

        if (!canvas)
            return null;

        return canvas.toDataURL(type, quality);

    }

    toBlob(type = "image/png", quality = 1) {

        return new Promise(resolve => {

            const canvas = this.getCanvas();

            if (!canvas) {

                resolve(null);

                return;

            }

            canvas.toBlob(
                blob => resolve(blob),
                type,
                quality
            );

        });

    }

    async download(options = {}) {

        const {

            filename = "chart",

            type = "png",

            quality = 1

        } = options;

        const mimeTypes = {

            png: "image/png",

            jpeg: "image/jpeg",

            jpg: "image/jpeg",

            webp: "image/webp"

        };

        const mime = mimeTypes[type.toLowerCase()];

        if (!mime)
            throw new Error(
                `Unsupported export format: ${type}`
            );

        const url = this.toDataURL(
            mime,
            quality
        );

        if (!url)
            return false;

        const link = document.createElement("a");

        link.href = url;

        link.download = `${filename}.${type}`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        return true;

    }

    async saveAsBlob(type = "image/png", quality = 1) {

        return await this.toBlob(
            type,
            quality
        );

    }

    print(title = document.title) {

        const image = this.toDataURL();

        if (!image)
            return false;

        const win = window.open(
            "",
            "_blank"
        );

        if (!win)
            return false;

        win.document.write(`

            <html>

                <head>

                    <title>${title}</title>

                </head>

                <body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:white;">

                    <img
                        src="${image}"
                        style="max-width:100%;height:auto;"
                    >

                </body>

            </html>

        `);

        win.document.close();

        win.focus();

        win.print();

        return true;

    }

    destroy() {

        this.chart = null;

    }

}
