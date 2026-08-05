/* ===========================================================
 *
 * VALIDATION MANAGER
 *
 * Production Grade Validation Engine
 *
 * ===========================================================
 */

export default class ValidationManager {

    constructor(component = null) {

        this.component = component;

        this.validators = new Map();

        this.errors = new Map();

    }

    bind(component) {

        this.component = component;

    }

    register(name, validator) {

        if (typeof validator !== "function")
            throw new TypeError(
                "Validator must be a function."
            );

        this.validators.set(
            name,
            validator
        );

    }

    unregister(name) {

        return this.validators.delete(name);

    }

    validateField(field) {

        if (!field)
            return true;

        const name = field.name;

        this.errors.delete(name);

        if (
            field.required &&
            !String(field.value ?? "").trim()
        ) {

            this.errors.set(
                name,
                "This field is required."
            );

            return false;

        }

        const validator =
            this.validators.get(name);

        if (validator) {

            const result =
                validator(
                    field.value,
                    field
                );

            if (result !== true) {

                this.errors.set(
                    name,
                    result || "Invalid value."
                );

                return false;

            }

        }

        return true;

    }

    validate(fields = []) {

        this.errors.clear();

        let valid = true;

        for (const field of fields) {

            if (!this.validateField(field)) {

                valid = false;

            }

        }

        return valid;

    }

    hasErrors() {

        return this.errors.size > 0;

    }

    getError(name) {

        return this.errors.get(name);

    }

    getErrors() {

        return Object.fromEntries(
            this.errors
        );

    }

    clear() {

        this.errors.clear();

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

        this.validators.clear();

        this.errors.clear();

        this.component = null;

    }

}
