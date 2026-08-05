/* ===========================================================
 *
 * POSITION MANAGER
 *
 * Production Grade Dropdown Position Engine
 *
 * ===========================================================
 */

export default class PositionManager {

    constructor(component = null) {

        this.component = component;

        this.position = "bottom";

        this.offset = 8;

        this.flip = true;

    }

    bind(component) {

        this.component = component;

    }

    setPosition(position) {

        this.position = position;

    }

    setOffset(offset) {

        this.offset = Number(offset) || 8;

    }

    update() {

        if (
            !this.component ||
            !this.component.trigger ||
            !this.component.menu
        )
            return;

        const trigger =
            this.component.trigger.getBoundingClientRect();

        const menu =
            this.component.menu.getBoundingClientRect();

        let top = 0;

        let left = 0;

        switch (this.position) {

            case "top":

                top =
                    trigger.top -
                    menu.height -
                    this.offset;

                left =
                    trigger.left;

                break;

            case "left":

                top =
                    trigger.top;

                left =
                    trigger.left -
                    menu.width -
                    this.offset;

                break;

            case "right":

                top =
                    trigger.top;

                left =
                    trigger.right +
                    this.offset;

                break;

            default:

                top =
                    trigger.bottom +
                    this.offset;

                left =
                    trigger.left;

        }

        if (this.flip) {

            if (
                left + menu.width >
                window.innerWidth
            ) {

                left =
                    window.innerWidth -
                    menu.width -
                    this.offset;

            }

            if (
                top + menu.height >
                window.innerHeight
            ) {

                top =
                    trigger.top -
                    menu.height -
                    this.offset;

            }

        }

        this.component.menu.style.left =
            `${left + window.scrollX}px`;

        this.component.menu.style.top =
            `${top + window.scrollY}px`;

    }

    destroy() {

        this.component = null;

    }

}
