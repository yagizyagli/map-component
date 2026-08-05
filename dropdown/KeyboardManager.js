/* ===========================================================
 *
 * KEYBOARD MANAGER
 *
 * Production Grade Keyboard Engine
 *
 * ===========================================================
 */

export default class KeyboardManager {

    constructor(component = null) {

        this.component = component;

        this.activeIndex = -1;

    }

    bind(component) {

        this.component = component;

    }

    handle(event) {

        if (!this.component)
            return;

        const items = this.component.items ?? [];

        switch (event.key) {

            case "ArrowDown":

                event.preventDefault();

                this.activeIndex = Math.min(
                    this.activeIndex + 1,
                    items.length - 1
                );

                this.focus();

                break;

            case "ArrowUp":

                event.preventDefault();

                this.activeIndex = Math.max(
                    this.activeIndex - 1,
                    0
                );

                this.focus();

                break;

            case "Home":

                event.preventDefault();

                this.activeIndex = 0;

                this.focus();

                break;

            case "End":

                event.preventDefault();

                this.activeIndex =
                    items.length - 1;

                this.focus();

                break;

            case "Enter":

            case " ":

                if (this.activeIndex >= 0) {

                    event.preventDefault();

                    items[this.activeIndex]?.click();

                }

                break;

            case "Escape":

                this.component.stateManager.close();

                this.component.trigger?.focus();

                break;

        }

    }

    focus() {

        this.component
            ?.items?.[this.activeIndex]
            ?.focus();

    }

    reset() {

        this.activeIndex = -1;

    }

    destroy() {

        this.reset();

        this.component = null;

    }

}
