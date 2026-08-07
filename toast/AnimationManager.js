/* ===========================================================
 *
 * ANIMATION MANAGER
 *
 * Production Grade Toast Animation Engine
 *
 * ===========================================================
 */

export default class AnimationManager {

    constructor(component = null) {

        this.component = component;

        this.duration = 200;

        this.easing = "ease-out";

    }


    bind(component) {

        this.component = component;

    }


    show(element = null) {

        const target =
            element ??
            this.component?.container;


        if (!target)
            return;


        target.style.transition = `
            opacity ${this.duration}ms ${this.easing},
            transform ${this.duration}ms ${this.easing}
        `;


        target.style.opacity = "1";

        target.style.transform =
            "translateY(0)";

    }


    hide(element = null) {

        const target =
            element ??
            this.component?.container;


        if (!target)
            return;


        target.style.transition = `
            opacity ${this.duration}ms ${this.easing},
            transform ${this.duration}ms ${this.easing}
        `;


        target.style.opacity = "0";

        target.style.transform =
            "translateY(-12px)";

    }


    setDuration(duration) {

        this.duration =
            Number(duration) || 200;

    }


    setEasing(easing) {

        this.easing = easing;

    }


    destroy() {

        this.component = null;

    }

}
export default AnimationManager;
