/* ===========================================================
 *
 * DATE MANAGER
 *
 * Production Grade Date Engine
 *
 * ===========================================================
 */

export default class DateManager {

    constructor(component = null) {

        this.component = component;

        this.current = new Date();

        this.view = "month";

    }

    bind(component) {

        this.component = component;

    }

    setDate(date) {

        this.current = new Date(date);

        this.commit();

    }

    getDate() {

        return new Date(this.current);

    }

    today() {

        this.current = new Date();

        this.commit();

    }

    next() {

        switch (this.view) {

            case "day":
                this.current.setDate(
                    this.current.getDate() + 1
                );
                break;

            case "week":
                this.current.setDate(
                    this.current.getDate() + 7
                );
                break;

            default:
                this.current.setMonth(
                    this.current.getMonth() + 1
                );

        }

        this.commit();

    }

    previous() {

        switch (this.view) {

            case "day":
                this.current.setDate(
                    this.current.getDate() - 1
                );
                break;

            case "week":
                this.current.setDate(
                    this.current.getDate() - 7
                );
                break;

            default:
                this.current.setMonth(
                    this.current.getMonth() - 1
                );

        }

        this.commit();

    }

    setView(view) {

        if (
            ![
                "day",
                "week",
                "month"
            ].includes(view)
        )
            return;

        this.view = view;

        this.commit();

    }

    getView() {

        return this.view;

    }

    getYear() {

        return this.current.getFullYear();

    }

    getMonth() {

        return this.current.getMonth();

    }

    getDaysInMonth() {

        return new Date(

            this.getYear(),

            this.getMonth() + 1,

            0

        ).getDate();

    }

    getFirstDay() {

        return new Date(

            this.getYear(),

            this.getMonth(),

            1

        ).getDay();

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

        this.component = null;

    }

}
export default DateManager;
