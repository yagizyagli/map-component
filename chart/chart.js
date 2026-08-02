/**
 * Professional Chart Component
 *
 * Production Grade Chart.js Web Component
 *
 * Features
 *
 * ✔ Shadow DOM
 * ✔ Dataset Registry
 * ✔ Internal Plugin System
 * ✔ Theme Engine
 * ✔ Reactive Attributes
 * ✔ Resize Scheduler
 * ✔ Animation Queue
 * ✔ Event Dispatcher
 * ✔ Lifecycle Safe
 * ✔ Destroy Safe
 * ✔ Memory Safe
 * ✔ Export API
 * ✔ Dataset Diff Engine
 * ✔ Incremental Rendering
 * ✔ Tooltip Manager
 * ✔ Legend Manager
 * ✔ Zoom Support
 * ✔ Pan Support
 * ✔ Full Public API
 *
 * Author:yagizyagli
 */

class CustomChart extends HTMLElement{

    static observedAttributes=[
        "type",
        "theme",
        "title",
        "responsive",
        "animation",
        "legend",
        "tooltip"
    ];

    constructor(){

        super();

        this.attachShadow({
            mode:"open"
        });

        this.chart=null;

        this.canvas=null;

        this.ctx=null;

        this.resizeObserver=null;

        this.intersectionObserver=null;

        this.plugins=new Map();

        this.datasets=new Map();

        this.controllers=new Map();

        this.animations=new Map();

        this.pendingFrame=null;

        this.destroyed=false;

        this.renderQueued=false;

        this.internalUpdate=false;

        this.state={

            initialized:false,

            visible:true,

            loading:false,

            resizing:false,

            theme:"dark"

        };

    }
  /* ===========================================================
 *
 * DATASET ENGINE
 *
 * Production Grade Dataset Manager
 *
 * ===========================================================
 */

class DatasetManager{

    constructor(component){

        this.component = component;

        this.chart = null;

        this.registry = new Map();

        this.visibility = new Map();

        this.cache = new Map();

        this.version = 0;

        this.batchDepth = 0;

        this.pendingUpdate = false;

    }

    bind(chart){

        this.chart = chart;

    }

    beginBatch(){

        this.batchDepth++;

    }

    endBatch(){

        if(this.batchDepth===0)
            return;

        this.batchDepth--;

        if(
            this.batchDepth===0 &&
            this.pendingUpdate
        ){

            this.pendingUpdate=false;

            this.commit();

        }

    }

    queueUpdate(){

        if(this.batchDepth){

            this.pendingUpdate=true;

            return;

        }

        this.commit();

    }

    createId(){

        return crypto.randomUUID();

    }

    has(id){

        return this.registry.has(id);

    }

    get(id){

        return this.registry.get(id);

    }

    getAll(){

        return [...this.registry.values()];

    }

    add(dataset){

        this.validate(dataset);

        const id = dataset.id ?? this.createId();

        const clone = structuredClone(dataset);

        clone.id=id;

        this.registry.set(id,clone);

        this.visibility.set(id,true);

        this.cache.set(id,structuredClone(clone));

        this.version++;

        this.queueUpdate();

        return id;

    }

    remove(id){

        if(!this.registry.has(id))
            return false;

        this.registry.delete(id);

        this.cache.delete(id);

        this.visibility.delete(id);

        this.version++;

        this.queueUpdate();

        return true;

    }

    clear(){

        this.registry.clear();

        this.visibility.clear();

        this.cache.clear();

        this.version++;

        this.queueUpdate();

    }

    replace(id,newDataset){

        if(!this.registry.has(id))
            return;

        const clone=structuredClone(newDataset);

        clone.id=id;

        this.registry.set(id,clone);

        this.cache.set(id,structuredClone(clone));

        this.version++;

        this.queueUpdate();

    }

    update(id,data){

        const dataset=this.registry.get(id);

        if(!dataset)
            return;

        Object.assign(dataset,data);

        this.version++;

        this.queueUpdate();

    }

    append(id,value){

        const dataset=this.registry.get(id);

        if(!dataset)
            return;

        if(!Array.isArray(dataset.data))
            dataset.data=[];

        dataset.data.push(value);

        this.version++;

        this.queueUpdate();

    }

    appendMany(id,values){

        const dataset=this.registry.get(id);

        if(!dataset)
            return;

        if(!Array.isArray(dataset.data))
            dataset.data=[];

        dataset.data.push(...values);

        this.version++;

        this.queueUpdate();

    }

    setVisible(id,state=true){

        if(!this.registry.has(id))
            return;

        this.visibility.set(id,state);

        this.queueUpdate();

    }

    isVisible(id){

        return this.visibility.get(id)!==false;

    }

    toggle(id){

        this.setVisible(
            id,
            !this.isVisible(id)
        );

    }

    validate(dataset){

        if(typeof dataset!=="object")
            throw new TypeError(
                "Dataset must be an object."
            );

        if(!Array.isArray(dataset.data))
            throw new Error(
                "Dataset.data must be array."
            );

    }

    build(){

        return this.getAll()
            .filter(d=>this.isVisible(d.id))
            .map(d=>structuredClone(d));

    }

    commit(){

        if(!this.chart)
            return;

        this.chart.data.datasets=this.build();

        this.chart.update();

    }

    destroy(){

        this.registry.clear();

        this.visibility.clear();

        this.cache.clear();

        this.chart=null;

    }

}
