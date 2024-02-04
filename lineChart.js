import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let width = 300;
let height = 300;

let margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
}

// Random dataset of x and y values --TESTING--
let randomData = [
    {x: 0, y: 40},
    {x: 10, y: 50},
    {x: 20, y: 30},
    {x: 30, y: 70},
    {x: 40, y: 90}
];

// Current x value --TESTING--
let globX = 40
let globY = 90

// Transistion instance used for animation

// Function for updating the graph
class Graph {

    constructor(width, height, marginObj, container, dataset) {

        // Defines the margin, width, height, and container for the object
        this.marginObj = marginObj;
        this.width = width;
        this.height = height;
        this.container = document.querySelector(container);


        // Defines the initial x-scale for the object
        this.xScale = d3.scaleLinear(d3.extent(dataset, (d) => { return d.x}), [marginObj.left, width - marginObj.right]);

        // Defines the initial y-scale for the object
        this.yScale = d3.scaleLinear(d3.extent(dataset, (d) => { return d.y}), [height - marginObj.bottom, marginObj.top]);

        // Definies the svg for this object
        this.svg = d3.create('svg')
        .attr("width", width)
        .attr("height", height)
        .attr("color", "white")
        .attr("class", "svg");

        // Definies and creaates the axes for this object
        this.xAxis = createXAxis(this.svg, "xAxis", this.xScale);
        this.yAxis = createYAxis(this.svg, "yAxis", this.yScale);

        // Defines the axis labels for the object
        this.xAxisLabel = createAxisLabel(this.svg, "x", "Time", "label");
        this.yAxisLabel = createAxisLabel(this.svg, "y", "Number", "label");


        // Defines the line path for this object
        this.linePath = createLine(this.svg, dataset, "yellow", this.xScale, this.yScale);

        // Defines the area path for this object
        this.areaPath = createArea(this.svg, dataset, "#041537", this.xScale, this.yScale);

        // datapoint circles
        this.circles = createCircles(this.svg, dataset, "yellow", this.xScale, this.yScale);
    }

    create(dataset) {
        // Append the chart to the container
        this.container.append(this.svg.node());


        // Interval that updates the graph every 1 second --USED FOR TESTING--
        setInterval(() => {
            this.update(dataset);
        }, 1000);
    }

    update(dataset) {

        // Global x and y values --USED FOR TESTING--
        globX += 6;
        globY += 6;

        // Pushes the global values to the dataset --USED FOR TESTING--
        dataset.push({x: globX, y: globY});


        // Re-definies the x and y scales for this object
        this.xScale = d3.scaleLinear(d3.extent(dataset, (d) => { return d.x}), [this.marginObj.left, width - this.marginObj.right]);
        this.yScale = d3.scaleLinear(d3.extent(dataset, (d) => { return d.y}), [height - this.marginObj.bottom, this.marginObj.top]);


        // Creates a new line generator
        let lineGen = d3.line()
        .x((d) => this.xScale(d.x))
        .y((d) => this.yScale(d.y))

        // Creates a new area generator
        let areaGen = d3.area()
        .x((d) => this.xScale(d.x))
        .y0(this.yScale(d3.min(dataset, (e) => {return e.y})))
        .y1((d) => this.yScale(d.y));

        // Calls this objects axes using the objects new scales
        this.xAxis.call(d3.axisBottom(this.xScale));
        this.yAxis.call(d3.axisLeft(this.yScale));


        // Resets the datum used for this object's line path and redraws the line
        this.linePath.datum(dataset)
        .attr("d", lineGen);

        // Resets the datum used for this object's area path and redraws the area
        this.areaPath.datum(dataset)
        .attr("d", areaGen);


        // Adds circles to all the new data points
        this.circles = this.svg.selectAll("circle")
            .data(dataset)
            .join("circle")
            .attr("r", 2.5)
            .attr("cx", (d) => {return this.xScale(d.x)})
            .attr("cy", (d) => {return this.yScale(d.y)})
            .attr("fill", "yellow")
            .attr("class", "circle");
    }

    changeDomain(domainLength, dataset) {
    
    }
}
let test = new Graph(300, 300, margin, ".chartContainer", randomData);

test.create(randomData);

function createAxisLabel(svgVar, axis, label, className) {
    let axisLabel = svgVar.append("text")
        .attr("class", className)
        .attr("text-anchor", "middle")
        .attr("y", (axis == 'x') ? height-40 : width/5)
        .attr("x", (axis == 'x') ? (width)/2 : height/2)
        .text(label);

    if (axis !== 'x'){
        axisLabel
            .attr("transform-origin", "center")
            .attr("transform", "rotate(-90)");
    }

    return axisLabel;
}

function createLine(svgVar, dataset, color, xScale, yScale) {

    //line generator
    let lineGen = d3.line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y))
    
    // line path generator
    let lineSVG = svgVar.append("path")
        .datum(dataset)
        .attr("d", lineGen)
        .attr("stroke", color)
        .attr("fill", "none")
        .attr("class", "line");

    return lineSVG;
}

function createArea(svgVar, dataset, color, xScale, yScale){
    
    let areaGen = d3.area()
        .x((d) => xScale(d.x))
        .y0(yScale(d3.min(randomData, (e) => {return e.y})))
        .y1((d) => yScale(d.y));

        // area path generator
    let areaSVG = svgVar.append("path")
        .datum(dataset)
        .attr("d", areaGen)
        .attr("stroke", "none")
        .attr("fill", color)
        .attr("fill-opacity", "0.3")
        .attr("class", "area");

    return areaSVG;
}

function createCircles(svgVar, dataset, color, xScale, yScale) {
    let circle = svgVar.selectAll("circle")
        .data(dataset)
        .join("circle")
        .attr("r", 2.5)
        .attr("cx", (d) => {return xScale(d.x)})
        .attr("cy", (d) => {return yScale(d.y)})
        .attr("fill", color);

    return circle;
}

function createXAxis(svgVar, className, xScale) {

    let xAxis = svgVar.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .attr("class", className)
    .call(d3.axisBottom(xScale));

    return xAxis;
}

function createYAxis(svgVar, className, yScale) {

    let yAxis = svgVar.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .attr("class", className)
    .call(d3.axisLeft(yScale));

    return yAxis;
}

function changeDomain(domainLength, dataset, xAxis){

    let higherDomainBound = d3.max(dataset, (d) => { return d.x});

    // If the domain Length results in a zero or negative lowerDomainBound, then it will defalut to higherDomainBound - 10;
    let lowerDomainBound = (higherDomainBound - domainLength) <= 1 ? higherDomainBound - 10 : higherDomainBound - domainLength;
    console.log(`[${lowerDomainBound}, ${higherDomainBound}]`)
    // x-axis scale definition
    let xScale = d3.scaleLinear([lowerDomainBound, higherDomainBound], [margin.left, width - margin.right]);

    let filteredData = dataset.filter((d) => { return d.x >= lowerDomainBound })

    xAxis.call(d3.axisBottom(xScale))


}

let valueDisplay = document.querySelector(".sliderNumInput")
valueDisplay.onkeydown = async function(key){

    if(key.keyCode == 13){
        changeDomain(valueDisplay.value, randomData)

        valueDisplay.blur();

    }
    
}

valueDisplay.addEventListener('input', () => {

    if (valueDisplay.value.length > valueDisplay.maxLength){
        valueDisplay.value = valueDisplay.value.slice(0, valueDisplay.maxLength);
    }
});
