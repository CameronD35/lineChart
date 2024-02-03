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

function createGraph() {
    let axisTransition = d3.transition()
        .duration(500)
        .ease(d3.easeLinear)

        // x-axis scale definition
        let x = d3.scaleLinear(d3.extent(randomData, (d) => { return d.x}), [margin.left, width - margin.right]);
        console.log(x)
        // y-axis scale definition
        let y = d3.scaleLinear(d3.extent(randomData, (d) => { return d.y}), [height - margin.bottom, margin.top]);

        // Container for the chart
        let chartCont = document.querySelector(".chartContainer")

        // SVG generator
        let svg = d3.create('svg')
        .attr("width", width)
        .attr("height", height)
        .attr("color", "white")
        .attr("class", "svg");

        // x-axis generator
        let xAxis = createXAxis(svg, "xAxis", x);
        // y-axis generator
        let yAxis = createYAxis(svg, "yAxis", y);

        // x-axis label
        let xAxisLabel = createAxisLabel(svg, "x", "Time", "label")

        // y -axis label
        let yAxisLabel = createAxisLabel(svg, "y", "Number", "label")

        // line path
        let linePath = createLine(svg, randomData, "yellow", x, y);

        // area path
        let areaPath = createArea(svg, randomData, "#041537", x, y);

        // datapoint circles
        let circles = createCircles(svg, randomData, "yellow", x, y);

        // Append the chart to the container
        chartCont.append(svg.node());

        setInterval(() => {
            updateGraph(svg, linePath, areaPath, randomData, xAxis, yAxis);
        }, 1000);
}

function updateGraph(svgVar, lineVar, areaVar, dataset, xAxis, yAxis) {

    globX += 6;
    globY -= 6;

    dataset.push({x: globX, y: globY});

    // x-axis scale definition
    let xScale = d3.scaleLinear(d3.extent(randomData, (d) => { return d.x}), [margin.left, width - margin.right]);
    
    // y-axis scale definition
    let yScale = d3.scaleLinear(d3.extent(randomData, (d) => { return d.y}), [height - margin.bottom, margin.top]);


    let lineGen = d3.line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y))

    let areaGen = d3.area()
        .x((d) => xScale(d.x))
        .y0(yScale(d3.min(dataset, (e) => {return e.y})))
        .y1((d) => yScale(d.y));

    xAxis.call(d3.axisBottom(xScale));
    yAxis.call(d3.axisLeft(yScale));

    lineVar
        .datum(dataset)
        .attr("d", lineGen);

    areaVar
        .datum(dataset)
        .attr("d", areaGen);

    let circle = svgVar.selectAll("circle")
        .data(dataset);

    circle.join("circle")
        .attr("r", 2.5)
        .attr("cx", (d) => {return xScale(d.x)})
        .attr("cy", (d) => {return yScale(d.y)})
        .attr("fill", "yellow")
        .attr("class", "circle");

//    d3.selectAll(".xAxis").transition(axisTransition);
}

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

createGraph();
