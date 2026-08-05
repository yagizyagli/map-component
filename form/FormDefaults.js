/* ===========================================================
 *
 * FORM DEFAULTS
 *
 * Production Grade Default Configuration
 *
 * ===========================================================
 */

const FORM_DEFAULTS = {

    theme: "light",

    disabled: false,

    readonly: false,

    loading: false,

    autocomplete: "on",

    validateOn: "submit",

    resetOnSubmit: false,

    preventSubmit: true,

    debounce: 300,

    animation: true,

    autoFocus: false,

    showErrors: true,

    errorClass: "is-invalid",

    successClass: "is-valid",

    requiredIndicator: "*",

    submitText: "Submit",

    resetText: "Reset"

};

export default Object.freeze(
    FORM_DEFAULTS
);
