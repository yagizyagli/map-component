/* ===========================================================
 *
 * PAGINATION MANAGER
 *
 * Production Grade Pagination Engine
 *
 * ===========================================================
 */

export default class PaginationManager {

    constructor(component = null) {

        this.component = component;

        this.page = 1;

        this.pageSize = 10;

        this.total = 0;

    }

    bind(component) {

        this.component = component;

    }

    setPage(page) {

        page = Number(page);

        if (!Number.isFinite(page))
            return;

        this.page = Math.max(1, page);

        this.commit();

    }

    next() {

        if (this.page < this.getPageCount()) {

            this.page++;

            this.commit();

        }

    }

    previous() {

        if (this.page > 1) {

            this.page--;

            this.commit();

        }

    }

    first() {

        this.page = 1;

        this.commit();

    }

    last() {

        this.page = this.getPageCount();

        this.commit();

    }

    setPageSize(size) {

        size = Number(size);

        if (
            !Number.isFinite(size) ||
            size <= 0
        )
            return;

        this.pageSize = size;

        this.page = 1;

        this.commit();

    }

    apply(rows = []) {

        this.total = rows.length;

        const start =
            (this.page - 1) *
            this.pageSize;

        return rows.slice(
            start,
            start + this.pageSize
        );

    }

    getPageCount() {

        return Math.max(
            1,
            Math.ceil(
                this.total /
                this.pageSize
            )
        );

    }

    getInfo() {

        return {

            page: this.page,

            pageSize: this.pageSize,

            total: this.total,

            pages: this.getPageCount(),

            hasNext:
                this.page <
                this.getPageCount(),

            hasPrevious:
                this.page > 1

        };

    }

    reset() {

        this.page = 1;

        this.commit();

    }

    commit() {

        if (
            !this.component
        )
            return;

        if (
            typeof this.component.render ===
            "function"
        ) {

            this.component.render();

        }

    }

    destroy() {

        this.component = null;

    }

}
export default PaginationManager;
