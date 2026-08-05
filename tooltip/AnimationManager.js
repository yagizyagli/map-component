/* ===========================================================
 *
 * ANIMATION MANAGER
 *
 * Production Grade Animation Engine
 *
 * ===========================================================
 */

export default class AnimationManager {

    constructor(component = null) {

        this.component = component;

        this.duration = 180;

        this.easing = "ease";

        this.running = false;

    }

    bind(component) {

        this.component = component;

    }

    show() {

        if (
            !this.component ||
            !this.component.tooltip
        )
            return;

        this.running = true;

        const tooltip =
            this.component.tooltip;

        tooltip.style.transition = `
            opacity ${this.duration}ms ${this.easing},
            transform ${this.duration}ms ${this.easing}
        `;

        tooltip.style.opacity = "1";

        tooltip.style.transform = "scale(1)";

    }

    hide() {

        if (
            !this.component ||
            !this.component.tooltip
        )
            return;

        this.running = true;

        const tooltip =
            this.component.tooltip;

        tooltip.style.transition = `
            opacity ${this.duration}ms ${this.easing},
            transform ${this.duration}ms ${this.easing}
        `;

        tooltip.style.opacity = "0";

        tooltip.style.transform = "scale(.95)";

    }

    setDuration(duration) {

        this.duration = Number(duration);

    }

    setEasing(easing) {

        this.easing = easing;

    }

    stop() {

        this.running = false;

    }

    destroy() {

        this.running = false;

        this.component = null;

    }

}
