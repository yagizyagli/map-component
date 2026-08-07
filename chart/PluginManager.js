/* ===========================================================
 *
 * PLUGIN MANAGER
 *
 * Production Grade Plugin Registry
 *
 * ===========================================================
 */

export default class PluginManager {

    constructor() {

        this.chart = null;

        this.plugins = new Map();

    }

    bind(chart) {

        this.chart = chart;

        this.commit();

    }

    register(plugin) {

        if (!plugin || !plugin.id)
            throw new Error(
                "Plugin must contain a unique id."
            );

        this.plugins.set(plugin.id, plugin);

        this.commit();

        return plugin.id;

    }

    unregister(id) {

        if (!this.plugins.has(id))
            return false;

        this.plugins.delete(id);

        this.commit();

        return true;

    }

    has(id) {

        return this.plugins.has(id);

    }

    get(id) {

        return this.plugins.get(id);

    }

    getAll() {

        return [...this.plugins.values()];

    }

    clear() {

        this.plugins.clear();

        this.commit();

    }

    commit() {

        if (!this.chart)
            return;

        this.chart.config.plugins = this.getAll();

        this.chart.update("none");

    }

    destroy() {

        this.plugins.clear();

        this.chart = null;

    }

}
export default PluginManager;
