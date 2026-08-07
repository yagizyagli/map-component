/* ===========================================================
 *
 * ANIMATION MANAGER
 *
 * Production Grade Animation Manager
 *
 * ===========================================================
 */

export default class AnimationManager {

    constructor() {

        this.chart = null;

        this.enabled = true;

        this.duration = 1000;

        this.easing = "easeOutQuart";

        this.delay = 0;

        this.loop = false;

        this.onProgress = null;

        this.onComplete = null;

    }

    bind(chart) {

        this.chart = chart;

        this.apply();

    }

    apply() {

        if (!this.chart)
            return;

        this.chart.options.animation = {

            duration: this.enabled
                ? this.duration
                : 0,

            easing: this.easing,

            delay: this.delay,

            loop: this.loop,

            onProgress: this.onProgress,

            onComplete: this.onComplete

        };

        this.update();

    }

    update(mode = "none") {

        if (!this.chart)
            return;

        this.chart.update(mode);

    }

    enable() {

        this.enabled = true;

        this.apply();

    }

    disable() {

        this.enabled = false;

        this.apply();

    }

    toggle() {

        this.enabled = !this.enabled;

        this.apply();

    }

    setDuration(duration) {

        this.duration = Math.max(0, duration);

        this.apply();

    }

    setEasing(easing) {

        this.easing = easing;

        this.apply();

    }

    setDelay(delay) {

        this.delay = Math.max(0, delay);

        this.apply();

    }

    setLoop(loop = true) {

        this.loop = loop;

        this.apply();

    }

    setOnProgress(callback) {

        this.onProgress = callback;

        this.apply();

    }

    setOnComplete(callback) {

        this.onComplete = callback;

        this.apply();

    }

    reset() {

        this.enabled = true;

        this.duration = 1000;

        this.easing = "easeOutQuart";

        this.delay = 0;

        this.loop = false;

        this.onProgress = null;

        this.onComplete = null;

        this.apply();

    }

    destroy() {

        this.chart = null;

        this.onProgress = null;

        this.onComplete = null;

    }

}
export default AnimationManager;
