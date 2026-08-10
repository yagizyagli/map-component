/**
 * Professional Form Component
 *
 * Production Grade Form Web Component
 *
 * Features:
 * - Shadow DOM
 * - Input
 * - Textarea
 * - Select
 * - Checkbox
 * - Radio
 * - Switch
 * - Validation
 * - Loading state
 * - Disabled state
 * - Readonly state
 * - Reactive attributes
 * - Custom events
 * - Public API
 * - Lifecycle safe
 * - Memory safe
 *
 * Author: yagizyagli
 */

class Form extends HTMLElement {

    static observedAttributes = [
        "theme",
        "disabled",
        "readonly",
        "loading",
        "autocomplete"
    ];

    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });

        this.form = null;
        this.container = null;

        this.resizeObserver = null;
        this.mutationObserver = null;

        this.fields = new Map();

        this.state = {
            initialized: false,
            loading: false,
            disabled: false,
            readonly: false,
            valid: true,
            dirty: false,
            touched: false,
            focused: false,
            submitted: false,
            theme: "light"
        };

        this.boundSubmit =
            this.handleSubmit.bind(this);

        this.boundReset =
            this.handleReset.bind(this);

        this.boundChange =
            this.handleChange.bind(this);

        this.boundInput =
            this.handleInput.bind(this);

        this.boundFocusIn =
            this.handleFocusIn.bind(this);

        this.boundFocusOut =
            this.handleFocusOut.bind(this);

        this.boundSlotChange =
            this.refreshFields.bind(this);
    }

    connectedCallback() {
        if (this.state.initialized) {
            this.refreshFields();
            return;
        }

        this.readAttributes();

        this.render();

        this.bindEvents();

        this.observe();

        this.refreshFields();

        this.state.initialized = true;

        this.dispatchEvent(
            new CustomEvent("ready", {
                detail: {
                    form: this
                }
            })
        );
    }

    disconnectedCallback() {
        this.destroy();
    }

    attributeChangedCallback(
        name,
        oldValue,
        newValue
    ) {
        if (oldValue === newValue) {
            return;
        }

        this.readAttributes();

        if (
            this.state.initialized
        ) {
            this.updateState();
        }
    }

    readAttributes() {
        this.state.theme =
            this.getAttribute("theme") === "dark"
                ? "dark"
                : "light";

        this.state.disabled =
            this.hasAttribute("disabled");

        this.state.readonly =
            this.hasAttribute("readonly");

        this.state.loading =
            this.hasAttribute("loading");
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>

                :host {
                    display: block;
                    width: 100%;
                    font-family:
                        Inter,
                        system-ui,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                }

                *,
                *::before,
                *::after {
                    box-sizing: border-box;
                }

                .container {
                    width: 100%;
                    padding: 24px;
                    border-radius: 14px;
                    border: 1px solid var(--border);
                    background: var(--background);
                    color: var(--foreground);
                }

                .light {
                    --background: #ffffff;
                    --foreground: #111827;
                    --border: #e5e7eb;
                    --field: #ffffff;
                    --field-border: #d1d5db;
                    --focus: #2563eb;
                    --muted: #6b7280;
                    --error: #dc2626;
                    --success: #16a34a;
                }

                .dark {
                    --background: #111827;
                    --foreground: #f9fafb;
                    --border: #374151;
                    --field: #1f2937;
                    --field-border: #4b5563;
                    --focus: #60a5fa;
                    --muted: #9ca3af;
                    --error: #f87171;
                    --success: #4ade80;
                }

                .form {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                    position: relative;
                }

                .loading {
                    opacity: 0.65;
                    pointer-events: none;
                }

                ::slotted(
                    input,
                ),
                ::slotted(
                    textarea
                ),
                ::slotted(
                    select
                ) {
                    width: 100%;
                    min-height: 42px;
                    padding: 9px 12px;
                    border: 1px solid
                        var(--field-border);
                    border-radius: 8px;
                    background: var(--field);
                    color: var(--foreground);
                    font: inherit;
                    outline: none;
                    transition:
                        border-color 160ms ease,
                        box-shadow 160ms ease;
                }

                ::slotted(
                    textarea
                ) {
                    min-height: 110px;
                    resize: vertical;
                }

                ::slotted(
                    input:focus
                ),
                ::slotted(
                    textarea:focus
                ),
                ::slotted(
                    select:focus
                ) {
                    border-color:
                        var(--focus);
                    box-shadow:
                        0 0 0 3px
                        color-mix(
                            in srgb,
                            var(--focus) 18%,
                            transparent
                        );
                }

                ::slotted(
                    input[type="checkbox"]
                ),
                ::slotted(
                    input[type="radio"]
                ) {
                    width: auto;
                    min-height: auto;
                    padding: 0;
                }

                .actions {
                    display: flex;
                    gap: 10px;
                    padding-top: 6px;
                }

                .actions button {
                    min-height: 40px;
                    padding: 8px 16px;
                    border: 1px solid
                        var(--field-border);
                    border-radius: 8px;
                    background: var(--field);
                    color: inherit;
                    cursor: pointer;
                    font: inherit;
                }

                .actions button[type="submit"] {
                    background: var(--focus);
                    color: white;
                    border-color: var(--focus);
                }

                .error {
                    display: none;
                    color: var(--error);
                    font-size: 13px;
                }

                .error.visible {
                    display: block;
                }

                .status {
                    min-height: 18px;
                    color: var(--muted);
                    font-size: 13px;
                }

                .spinner {
                    display: none;
                    width: 18px;
                    height: 18px;
                    margin-left: 8px;
                    border: 2px solid
                        rgba(255,255,255,.4);
                    border-top-color: white;
                    border-radius: 50%;
                    animation:
                        spin .7s linear infinite;
                }

                .spinner.visible {
                    display: inline-block;
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

            </style>

            <div
                class="
                    container
                    ${this.state.theme}
                ">

                <form
                    class="form"
                    novalidate>

                    <slot></slot>

                    <div
                        class="error"
                        aria-live="polite">
                    </div>

                    <div
                        class="status"
                        aria-live="polite">
                    </div>

                    <div class="actions">

                        <button
                            type="reset">
                            Reset
                        </button>

                        <button
                            type="submit">

                            Submit

                            <span
                                class="spinner">
                            </span>

                        </button>

                    </div>

                </form>

            </div>
        `;

        this.container =
            this.shadowRoot.querySelector(
                ".container"
            );

        this.form =
            this.shadowRoot.querySelector(
                ".form"
            );
    }

    bindEvents() {
        this.form.addEventListener(
            "submit",
            this.boundSubmit
        );

        this.form.addEventListener(
            "reset",
            this.boundReset
        );

        this.form.addEventListener(
            "input",
            this.boundInput
        );

        this.form.addEventListener(
            "change",
            this.boundChange
        );

        this.form.addEventListener(
            "focusin",
            this.boundFocusIn
        );

        this.form.addEventListener(
            "focusout",
            this.boundFocusOut
        );

        const slot =
            this.shadowRoot.querySelector(
                "slot"
            );

        slot?.addEventListener(
            "slotchange",
            this.boundSlotChange
        );
    }

    refreshFields() {
        this.fields.clear();

        const slot =
            this.shadowRoot.querySelector(
                "slot"
            );

        if (!slot) {
            return;
        }

        const elements =
            slot.assignedElements({
                flatten: true
            });

        elements.forEach(
            element => {
                this.collectFields(
                    element
                );
            }
        );

        this.updateState();
    }

    collectFields(element) {
        if (
            element.matches?.(
                "input, textarea, select"
            )
        ) {
            const name =
                element.getAttribute(
                    "name"
                );

            if (name) {
                this.fields.set(
                    name,
                    element
                );
            }
        }

        element
            .querySelectorAll?.(
                "input, textarea, select"
            )
            .forEach(field => {
                const name =
                    field.getAttribute(
                        "name"
                    );

                if (name) {
                    this.fields.set(
                        name,
                        field
                    );
                }
            });
    }

    handleInput(event) {
        const field =
            event.target;

        if (!this.isField(field)) {
            return;
        }

        this.state.dirty = true;
        this.state.touched = true;

        this.clearFieldError(field);

        this.dispatchEvent(
            new CustomEvent(
                "fieldinput",
                {
                    detail: {
                        name:
                            field.name,
                        value:
                            this.getFieldValue(
                                field
                            ),
                        field
                    }
                }
            )
        );
    }

    handleChange(event) {
        const field =
            event.target;

        if (!this.isField(field)) {
            return;
        }

        this.state.dirty = true;
        this.state.touched = true;

        this.dispatchEvent(
            new CustomEvent(
                "fieldchange",
                {
                    detail: {
                        name:
                            field.name,
                        value:
                            this.getFieldValue(
                                field
                            ),
                        field
                    }
                }
            )
        );
    }

    handleFocusIn(event) {
        if (
            this.isField(
                event.target
            )
        ) {
            this.state.focused = true;
        }
    }

    handleFocusOut(event) {
        if (
            this.isField(
                event.target
            )
        ) {
            this.state.focused = false;
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        this.state.submitted = true;

        const valid =
            this.validate();

        if (!valid) {
            this.dispatchEvent(
                new CustomEvent(
                    "invalid",
                    {
                        detail: {
                            form: this
                        }
                    }
                )
            );

            return;
        }

        const data =
            this.getData();

        this.dispatchEvent(
            new CustomEvent(
                "submit",
                {
                    detail: {
                        data,
                        form: this
                    }
                }
            )
        );
    }

    handleReset() {
        requestAnimationFrame(() => {
            this.reset();
        });
    }

    validate() {
        let valid = true;

        this.fields.forEach(
            field => {
                this.clearFieldError(
                    field
                );

                if (
                    !field.checkValidity()
                ) {
                    valid = false;

                    this.showFieldError(
                        field
                    );
                }
            }
        );

        this.state.valid = valid;

        this.updateStatus();

        return valid;
    }

    showFieldError(field) {
        field.setAttribute(
            "aria-invalid",
            "true"
        );

        field.style.borderColor =
            "var(--error)";
    }

    clearFieldError(field) {
        field.removeAttribute(
            "aria-invalid"
        );

        field.style.borderColor = "";
    }

    getFieldValue(field) {
        if (
            field.type === "checkbox"
        ) {
            return field.checked;
        }

        if (
            field.type === "radio"
        ) {
            return field.checked
                ? field.value
                : null;
        }

        return field.value;
    }

    isField(element) {
        return (
            element instanceof
                HTMLInputElement ||
            element instanceof
                HTMLTextAreaElement ||
            element instanceof
                HTMLSelectElement
        );
    }

    getData() {
        const data = {};

        this.fields.forEach(
            (field, name) => {
                if (
                    field.type === "radio"
                ) {
                    if (
                        field.checked
                    ) {
                        data[name] =
                            field.value;
                    }

                    return;
                }

                data[name] =
                    this.getFieldValue(
                        field
                    );
            }
        );

        return data;
    }

    getValue(name) {
        const field =
            this.fields.get(name);

        if (!field) {
            return undefined;
        }

        return this.getFieldValue(
            field
        );
    }

    setValue(
        name,
        value
    ) {
        const field =
            this.fields.get(name);

        if (!field) {
            return false;
        }

        if (
            field.type ===
            "checkbox"
        ) {
            field.checked =
                Boolean(value);
        } else if (
            field.type ===
            "radio"
        ) {
            field.checked =
                field.value ===
                String(value);
        } else {
            field.value =
                value ?? "";
        }

        this.state.dirty = true;

        return true;
    }

    setValues(values = {}) {
        Object.entries(
            values
        ).forEach(
            ([name, value]) => {
                this.setValue(
                    name,
                    value
                );
            }
        );
    }

    reset() {
        this.form?.reset();

        this.fields.forEach(
            field => {
                this.clearFieldError(
                    field
                );
            }
        );

        this.state.dirty = false;
        this.state.touched = false;
        this.state.submitted = false;
        this.state.valid = true;

        this.updateStatus();

        this.dispatchEvent(
            new CustomEvent(
                "reset",
                {
                    detail: {
                        form: this
                    }
                }
            )
        );
    }

    setLoading(value = true) {
        if (value) {
            this.setAttribute(
                "loading",
                ""
            );
        } else {
            this.removeAttribute(
                "loading"
            );
        }
    }

    setDisabled(value = true) {
        if (value) {
            this.setAttribute(
                "disabled",
                ""
            );
        } else {
            this.removeAttribute(
                "disabled"
            );
        }

        this.updateState();
    }

    setReadonly(value = true) {
        if (value) {
            this.setAttribute(
                "readonly",
                ""
            );
        } else {
            this.removeAttribute(
                "readonly"
            );
        }

        this.updateState();
    }

    updateState() {
        if (!this.form) {
            return;
        }

        this.form.classList.toggle(
            "loading",
            this.state.loading
        );

        this.fields.forEach(
            field => {
                field.disabled =
                    this.state.disabled;

                if (
                    "readOnly" in field
                ) {
                    field.readOnly =
                        this.state.readonly;
                }
            }
        );

        const submit =
            this.shadowRoot.querySelector(
                'button[type="submit"]'
            );

        const reset =
            this.shadowRoot.querySelector(
                'button[type="reset"]'
            );

        const spinner =
            this.shadowRoot.querySelector(
                ".spinner"
            );

        if (submit) {
            submit.disabled =
                this.state.disabled ||
                this.state.loading;
        }

        if (reset) {
            reset.disabled =
                this.state.disabled ||
                this.state.loading;
        }

        spinner?.classList.toggle(
            "visible",
            this.state.loading
        );

        this.updateStatus();
    }

    updateStatus() {
        const status =
            this.shadowRoot.querySelector(
                ".status"
            );

        if (!status) {
            return;
        }

        if (this.state.loading) {
            status.textContent =
                "Loading...";
            return;
        }

        if (
            this.state.submitted &&
            !this.state.valid
        ) {
            status.textContent =
                "Please check the highlighted fields.";
            return;
        }

        status.textContent = "";
    }

    observe() {
        if (
            typeof ResizeObserver !==
            "undefined"
        ) {
            this.resizeObserver =
                new ResizeObserver(
                    entries => {
                        this.dispatchEvent(
                            new CustomEvent(
                                "resize",
                                {
                                    detail: {
                                        entries
                                    }
                                }
                            )
                        );
                    }
                );

            this.resizeObserver.observe(
                this
            );
        }

        this.mutationObserver =
            new MutationObserver(
                () => {
                    this.refreshFields();
                }
            );

        this.mutationObserver.observe(
            this,
            {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: [
                    "name",
                    "type",
                    "disabled",
                    "required"
                ]
            }
        );
    }

    focus(name) {
        const field =
            this.fields.get(name);

        field?.focus();
    }

    getFieldNames() {
        return [
            ...this.fields.keys()
        ];
    }

    isValid() {
        return this.state.valid;
    }

    isDirty() {
        return this.state.dirty;
    }

    destroy() {
        if (
            this.resizeObserver
        ) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        if (
            this.mutationObserver
        ) {
            this.mutationObserver.disconnect();
            this.mutationObserver = null;
        }

        this.form?.removeEventListener(
            "submit",
            this.boundSubmit
        );

        this.form?.removeEventListener(
            "reset",
            this.boundReset
        );

        this.form?.removeEventListener(
            "input",
            this.boundInput
        );

        this.form?.removeEventListener(
            "change",
            this.boundChange
        );

        this.form?.removeEventListener(
            "focusin",
            this.boundFocusIn
        );

        this.form?.removeEventListener(
            "focusout",
            this.boundFocusOut
        );

        this.fields.clear();

        this.form = null;
        this.container = null;

        this.state.initialized = false;
    }
}

if (
    !customElements.get(
        "custom-form"
    )
) {
    customElements.define(
        "custom-form",
        Form
    );
}

export default Form;
