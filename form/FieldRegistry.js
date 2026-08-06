/* ===========================================================
 *
 * FIELD REGISTRY
 *
 * Production Grade Field Registry
 *
 * ===========================================================
 */

export default class FieldRegistry {

    constructor(component = null) {

        this.component = component;

        this.fields = new Map();

        this.version = 0;

    }

    bind(component) {

        this.component = component;

    }

    register(field) {

        if (!field)
            throw new TypeError(
                "Field is required."
            );

        const name =
            field.name ||
            field.getAttribute?.("name");

        if (!name)
            throw new Error(
                "Field name is required."
            );

        this.fields.set(
            name,
            field
        );

        this.version++;

        this.commit();

        return name;

    }

    unregister(name) {

        if (!this.fields.has(name))
            return false;

        this.fields.delete(name);

        this.version++;

        this.commit();

        return true;

    }

    has(name) {

        return this.fields.has(name);

    }

    get(name) {

        return this.fields.get(name);

    }

    getAll() {

        return [...this.fields.values()];

    }

    getNames() {

        return [...this.fields.keys()];

    }

    clear() {

        this.fields.clear();

        this.version++;

        this.commit();

    }

    getValues() {

        const values = {};

        for (const [name, field] of this.fields) {

            values[name] =
                typeof field.getValue === "function"
                    ? field.getValue()
                    : field.value;

        }

        return values;

    }

    setValues(data = {}) {

        for (const [name, value] of Object.entries(data)) {

            const field =
                this.fields.get(name);

            if (!field)
                continue;

            if (
                typeof field.setValue === "function"
            ) {

                field.setValue(value);

            } else {

                field.value = value;

            }

        }

        this.commit();

    }

    updateRadioGroup(group, currentField) {

        for (const field of this.fields.values()) {

            if (
                field === currentField
            )
                continue;

            if (
                field.group === group &&
                typeof field.setChecked === "function"
            ) {

                field.setChecked(false);

            }

        }

    }

    reset() {

        for (const field of this.fields.values()) {

            if (
                typeof field.reset === "function"
            ) {

                field.reset();

            } else if (
                typeof field.clear === "function"
            ) {

                field.clear();

            } else {

                field.value = "";

            }

        }

        this.commit();

    }

    forEach(callback) {

        this.fields.forEach(callback);

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

        this.fields.clear();

        this.component = null;

    }

}
