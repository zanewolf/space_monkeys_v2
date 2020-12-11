/*
* StackedVizVis - Object constructor function
* @param _parentElement 	-- the HTML element in which to draw the visualization
* @param _data						-- the actual data
*/

class StackedVis {


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



        // set scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width])
            .domain(d3.extent(vis.data, d=> d.year));

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
        this.dataCategories = Object.keys(this.data[0]).filter(d=>d !== "Year")

        // prepare colors for range
        let colorArray = this.dataCategories.map( (d,i) => {
            return colors[i%10]
        })
        // Set ordinal color scale
        this.colorScale = d3.scaleOrdinal()
            .domain(this.dataCategories)
            .range(colorArray);


        vis.updateVis();

    }


    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;


    }
}


