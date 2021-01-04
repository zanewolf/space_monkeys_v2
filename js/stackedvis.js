/*
* StackedVizVis - Object constructor function
* @param _parentElement 	-- the HTML element in which to draw the visualization
* @param _data						-- the actual data
*/

class StackedVis {


    constructor(parentElement, data, practiceData) {
        this.parentElement = parentElement;
        this.data = data;
        this.pracData = practiceData;

        // console.log(this.data)

        this.colors=["#3957ff", "#d3fe14", "#c9080a", "#fec7f8", "#0b7b3e", "#0bf0e9", "#c203c8", "#fd9b39", "#888593", "#906407", "#98ba7f", "#fe6794", "#10b0ff", "#ac7bff", "#fee7c0", "#964c63", "#1da49c", "#0ad811", "#bbd9fd", "#fe6cfe", "#297192", "#d1a09c", "#78579e", "#81ffad", "#739400", "#ca6949", "#d9bf01", "#646a58", "#d5097e", "#bb73a9", "#ccf6e9", "#9cb4b6", "#b6a7d4", "#9e8c62", "#6e83c8", "#01af64", "#a71afd", "#cfe589", "#d4ccd1", "#fd4109", "#bf8f0e", "#2f786e", "#4ed1a5", "#d8bb7d", "#a54509", "#6a9276", "#a4777a", "#fc12c9", "#606f15", "#3cc4d9", "#f31c4e", "#73616f", "#f097c6", "#fc8772", "#92a6fe", "#875b44", "#699ab3", "#94bc19", "#7d5bf0", "#d24dfe", "#c85b74", "#68ff57", "#b62347", "#994b91", "#646b8c", "#977ab4", "#d694fd", "#c4d5b5", "#fdc4bd", "#1cae05", "#7bd972", "#e9700a", "#d08f5d", "#8bb9e1", "#fde945", "#a29d98", "#1682fb", "#9ad9e0", "#d6cafe", "#8d8328", "#b091a7", "#647579", "#1f8d11", "#e7eafd", "#b9660b", "#a4a644", "#fec24c", "#b1168c", "#188cc1", "#7ab297"]

        this.initVis();
    }

    /*
     * Initialize visualization (static content, e.g. SVG area or axes)
     */

    initVis() {
        let vis = this;

        // vis.selectedCategory = "Country";

        vis.margin = {top: 100, right: 50, bottom: 100, left: 50};
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

        vis.selectedCategory = selectedCategory;
        // vis.selectedCategory = "Country";
        // vis.selectedCategory = "CompanyName";

        console.log(vis.selectedCategory)
        // extract unique values of Country/Company
        vis.dataKeys = [];
        vis.data.forEach((d, i) => {
            vis.dataKeys[i] = vis.data[i][vis.selectedCategory];
        })
        // console.log(vis.dataKeys)
        vis.dataCategories = [...new Set(vis.dataKeys)];

        // transform data into stacked layer format

        // vis.groupedMap = d3.group(vis.data,
        //     d => d[vis.selectedCategory],
        //     d => d.Datum);

        vis.tableData = vis.groupToStack(vis.data, "year", vis.selectedCategory)

        // console.log(vis.tableData)

        // vis.stackedData = d3.stack().keys()(vis.tableData)

        let stack = d3.stack()
            .keys(vis.dataCategories);
        // vis.stackedData = d3.stack().keys(vis.dataCategories)(vis.tableData)

        vis.stackedData = stack(vis.tableData)
        // console.log(vis.stackedData.key)

    // }



        // prepare colors for range
        let colorArray = vis.dataCategories.map( (d,i) => {
            return vis.colors[i%30]
        })
        // // Set ordinal color scale
        vis.colorScale = d3.scaleOrdinal()
            .domain(vis.dataCategories)
            .range(colorArray);

        vis.dataCategories.forEach((d,i)=>{
            console.log(d, vis.colorScale(d));
            // vis.colorScale(d)
        })
        //
        vis.area = d3.area()
            .curve(d3.curveCardinal)
            .x(d => vis.x(d.data.year))
            .y0(d => vis.y(d[0]))
            .y1(d => vis.y(d[1]));

        // add the tooltip placeholder
        vis.svg.append("g")
            .append("text")
            .attr("class", "categories")
            .style("opacity", 0.8)
            .style("top", vis.margin.left+20+"px")
            .style("left",vis.margin.top+20+"px")
            .style("z-index", "10000");

        vis.displayData = vis.stackedData


        vis.updateVis();
    //
    }


    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        vis.y.domain([0, d3.max(vis.displayData, function(d) {
            return d3.max(d, function(e) {
                // console.log(e[1])
                return e[1];
            });
        })
        ]);

        // Draw the layers
        vis.categories = vis.svg.selectAll(".area")
            .data(vis.displayData);

        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);

        // console.log(vis.categories)

        vis.categories.enter().append("path")
            .attr("class", "area")
            .merge(vis.categories)
            .style("fill", d => {
                // console.log(d, vis.colorScale(d))
                return vis.colorScale(d)
            })
            .attr("d", vis.area)
            .on("click", function(event,d){
                console.log("clicked!");
                console.log(d.key);
                vis.svg.selectAll(".categories")
                    .text(d.key);

            });


        // TO-DO (Activity IV): update tooltip text on hover


        // vis.categories.exit().remove();


        // vis.svg.select(".categories")
        // 	.append("text");
        // vis.svg.select(".area").call(vis.area);
        // vis.svg
        //     .selectAll(".area")
        //     .data(vis.stackedData)
        //     .enter()
        //     .append('path')
        //     .attr("class", "area")
        //     .attr("d", vis.area)

    }

    // from: https://observablehq.com/@john-guerra/d3-stack-with-d3-group
    groupToStack(data, groupBy, colorBy, reducer = v => v.length) {

        const groupedMap = d3.group(data, d => d[groupBy], d => d[colorBy]);

        // extracts the unique keys
        const keys = Array.from(new Set(data.map(d => d[colorBy])).values());

        // console.log(keys)

        return Array.from(groupedMap.entries()).map(g => {
            const obj = {};
            obj[groupBy] = g[0];
            for (let col of keys) {
                const vals = g[1].get(col);
                obj[col] = !vals ? 0 : reducer(Array.from(vals.values()));
            }
            return obj;
        });
    }


}


