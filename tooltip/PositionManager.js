/* ===========================================================
 *
 * POSITION MANAGER
 *
 * Production Grade Position Engine
 *
 * ===========================================================
 */

export default class PositionManager {

    constructor(component = null) {

        this.component = component;

        this.target = null;

        this.position = "top";

        this.offset = 8;

    }

    bind(component) {

        this.component = component;

    }

    setTarget(element) {

        this.target = element;

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
            !this.target ||
            !this.component.tooltip
        )
            return;

        const targetRect =
            this.target.getBoundingClientRect();

        const tooltipRect =
            this.component.tooltip.getBoundingClientRect();

        let top = 0;

        let left = 0;

        switch (this.position) {

            case "bottom":

                top =
                    targetRect.bottom +
                    this.offset;

                left =
                    targetRect.left +
                    (targetRect.width - tooltipRect.width) / 2;

                break;

            case "left":

                top =
                    targetRect.top +
                    (targetRect.height - tooltipRect.height) / 2;

                left =
                    targetRect.left -
                    tooltipRect.width -
                    this.offset;

                break;

            case "right":

                top =
                    targetRect.top +
                    (targetRect.height - tooltipRect.height) / 2;

                left =
                    targetRect.right +
                    this.offset;

                break;

            default:

                top =
                    targetRect.top -
                    tooltipRect.height -
                    this.offset;

                left =
                    targetRect.left +
                    (targetRect.width - tooltipRect.width) / 2;

        }

        this.component.tooltip.style.top =
            `${top + window.scrollY}px`;

        this.component.tooltip.style.left =
            `${left + window.scrollX}px`;

    }

    destroy() {

        this.target = null;

        this.component = null;

    }

}
