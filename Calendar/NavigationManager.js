/* ===========================================================
 *
 * NAVIGATION MANAGER
 *
 * Production Grade Navigation Engine
 *
 * ===========================================================
 */

export default class NavigationManager {

    constructor(component = null) {

        this.component = component;

        this.dateManager = null;

    }

    bind(component) {

        this.component = component;

    }

    bindDateManager(dateManager) {

        this.dateManager = dateManager;

    }

    next() {

        if (!this.dateManager)
            return;

        this.dateManager.next();

    }

    previous() {

        if (!this.dateManager)
            return;

        this.dateManager.previous();

    }

    today() {

        if (!this.dateManager)
            return;

        this.dateManager.today();

    }

    goTo(date) {

        if (!this.dateManager)
            return;

        this.dateManager.setDate(date);

    }

    setView(view) {

        if (!this.dateManager)
            return;

        this.dateManager.setView(view);

    }

    getView() {

        return this.dateManager
            ? this.dateManager.getView()
            : null;

    }

    getDate() {

        return this.dateManager
            ? this.dateManager.getDate()
            : null;

    }

    commit() {

        if (
            this.component &&
            typeof this.component.render === "function"
        ) {

            this.component.render();

        }

    }

    destroy() {

        this.dateManager = null;

        this.component = null;

    }

}
