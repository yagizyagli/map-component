/**
 * Custom Chart Component
 *
 * Production Grade Chart.js Web Component
 *
 * Features:
 * - Shadow DOM
 * - Chart.js integration
 * - Line / Bar / Pie charts
 * - Reactive attributes
 * - Memory safe lifecycle
 * - Public API
 * - Custom events
 *
 * Author: yagizyagli
 */


class CustomChart extends HTMLElement {


    static get observedAttributes(){

        return [
            "type",
            "height"
        ];

    }



    constructor(){

        super();


        this.attachShadow({
            mode:"open"
        });



        this.chart = null;

        this.canvas = null;

        this.initialized = false;


        this.shadowRoot.innerHTML = `

        <style>

        :host{

            display:block;

            width:100%;

        }


        .container{

            width:100%;

            height:var(--chart-height,350px);

            position:relative;

        }


        canvas{

            width:100% !important;

            height:100% !important;

        }


        </style>


        <div class="container">

            <canvas></canvas>

        </div>

        `;



        this.canvas =
            this.shadowRoot.querySelector(
                "canvas"
            );


    }





    connectedCallback(){


        if(this.initialized)
            return;



        if(typeof Chart === "undefined"){

            console.error(
                "CustomChart: Chart.js missing."
            );

            return;

        }



        this.initialize();


    }





    initialize(){


        if(this.initialized)
            return;



        this.chart =
            new Chart(
                this.canvas,
                {
                    type:this.getType(),

                    data:this.getData(),

                    options:this.getOptions()

                }
            );



        this.initialized=true;



        this.dispatchEvent(
            new CustomEvent(
                "ready",
                {
                    detail:{
                        chart:this.chart
                    }
                }
            )
        );


    }





    getType(){


        const type =
            this.getAttribute(
                "type"
            );


        return type || "line";


    }





    getData(){


        const source =
            this.querySelector(
                "chart-data"
            );



        if(!source)
            return {
                labels:[],
                datasets:[]
            };



        try{


            const json =
                JSON.parse(
                    source.textContent
                );



            return this.buildDataset(
                json
            );


        }
        catch(error){


            console.error(
                "CustomChart data error:",
                error
            );


            return {
                labels:[],
                datasets:[]
            };


        }


    }





    buildDataset(data){


        return {

            labels:
                data.map(
                    item=>item.label
                ),


            datasets:[

                {

                    label:
                    this.getAttribute(
                        "title"
                    )
                    ||
                    "Dataset",


                    data:
                    data.map(
                        item=>item.value
                    )


                }

            ]

        };


    }





    getOptions(){


        return {

            responsive:true,

            maintainAspectRatio:false,


            plugins:{


                legend:{

                    display:true

                }


            }


        };


    }





    refresh(){


        if(!this.chart)
            return;



        this.chart.data =
            this.getData();



        this.chart.update();



        this.dispatchEvent(
            new CustomEvent(
                "update"
            )
        );


    }





    setData(data){


        if(!this.chart)
            return;



        this.chart.data =
            this.buildDataset(
                data
            );



        this.chart.update();


    }





    attributeChangedCallback(
        name,
        oldValue,
        newValue
    ){


        if(
            oldValue === newValue ||
            !this.chart
        )
            return;



        if(name==="type"){


            this.chart.destroy();


            this.chart =
                new Chart(
                    this.canvas,
                    {

                        type:newValue,

                        data:this.getData(),

                        options:this.getOptions()

                    }
                );


        }



    }





    destroy(){


        if(this.chart){

            this.chart.destroy();

            this.chart=null;

        }



        this.initialized=false;


    }





    disconnectedCallback(){


        this.destroy();


    }


}





if(
    !customElements.get(
        "custom-chart"
    )
){

    customElements.define(
        "custom-chart",
        CustomChart
    );

}
