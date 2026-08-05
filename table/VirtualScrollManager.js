/* ===========================================================
 *
 * VIRTUAL SCROLL MANAGER
 *
 * Production Grade Virtual Rendering Engine
 *
 * ===========================================================
 */

export default class VirtualScrollManager {

    constructor(component = null) {

        this.component = component;

        this.enabled = false;

        this.rowHeight = 40;

        this.overscan = 10;

        this.scrollTop = 0;

        this.viewportHeight = 0;

    }

    bind(component) {

        this.component = component;

    }

    enable() {

        this.enabled = true;

    }

    disable() {

        this.enabled = false;

    }

    isEnabled() {

        return this.enabled;

    }

    setRowHeight(height) {

        if (
            !Number.isFinite(height) ||
            height <= 0
        )
            return;

        this.rowHeight = height;

    }

    setOverscan(count) {

        if (
            !Number.isFinite(count) ||
            count < 0
        )
            return;

        this.overscan = count;

    }

    update(scrollTop, viewportHeight) {

        this.scrollTop = scrollTop;

        this.viewportHeight = viewportHeight;

    }

    getRange(totalRows) {

        if (!this.enabled) {

            return {

                start: 0,

                end: totalRows,

                offset: 0,

                height:
                    totalRows *
                    this.rowHeight

            };

        }

        const start = Math.max(

            0,

            Math.floor(
                this.scrollTop /
                this.rowHeight
            ) - this.overscan

        );

        const visible =

            Math.ceil(
                this.viewportHeight /
                this.rowHeight
            ) +

            this.overscan * 2;

        const end = Math.min(

            totalRows,

            start + visible

        );

        return {

            start,

            end,

            offset:
                start *
                this.rowHeight,

            height:
                totalRows *
                this.rowHeight

        };

    }

    slice(rows = []) {

        const range =
            this.getRange(
                rows.length
            );

        return {

            ...range,

            rows:
                rows.slice(
                    range.start,
                    range.end
                )

        };

    }

    destroy() {

        this.component = null;

    }

}
