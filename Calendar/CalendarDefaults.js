/* ===========================================================
 *
 * CALENDAR DEFAULTS
 *
 * Production Grade Default Configuration
 *
 * ===========================================================
 */

const CALENDAR_DEFAULTS = {

    theme: "light",

    view: "month",

    locale: navigator.language,

    firstDay: 1,

    readonly: false,

    selectable: true,

    multiSelect: false,

    showWeekNumbers: false,

    showToday: true,

    showHeader: true,

    showFooter: true,

    animation: true,

    minDate: null,

    maxDate: null,

    events: [],

    startHour: 0,

    endHour: 24

};

export default Object.freeze(
    CALENDAR_DEFAULTS
);
