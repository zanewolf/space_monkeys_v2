/*
* FreqVis - Object constructor function
* @param _parentElement 	-- the HTML element in which to draw the visualization
* @param _data						-- the actual data
*/

class FreqVis {


    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis();
    }

    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        vis.margin = {top: 0, right: 0, bottom: 0, left: 0};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // vis.marginLegend = {top: 0, right: 0, bottom: 100, left: 0};
        // vis.widthLegend = $("#" + vis.legendElement).width() - vis.marginLegend.left - vis.marginLegend.right;
        // vis.heightLegend = $("#" + vis.legendElement).height() - vis.marginLegend.top - vis.marginLegend.bottom;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")
            .style("overflow", "visible");

        // vis.svg2 = d3.select("#" + vis.legendElement).append("svg")

        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;


        vis.updateVis();

    }


    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;


    }
}


