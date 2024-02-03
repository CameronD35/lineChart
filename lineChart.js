import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let width = 300;
let height = 300;
let marginTop = 20;
let marginRight = 20;
let marginBottom = 30;
let marginLeft = 40;

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
let axisTransition = d3.transition()
.duration(500)
.ease(d3.easeLinear)

// x-axis scale definition
let x = d3.scaleLinear(d3.extent(randomData, (d) => { return d.x}), [marginLeft, width - marginRight]);

// y-axis scale definition
let y = d3.scaleLinear(d3.extent(randomData, (d) => { return d.y}), [height - marginBottom, marginTop]);

// Line generator
let line = d3.line()
.x((d) => x(d.x))
.y((d) => y(d.y))

// Area generator
// y0 is set to the minimum y value and y1 is set the y value at any given x value
let area = d3.area()
.x((d) => x(d.x))
.y0(y(d3.min(randomData, (e) => {return e.y})))
.y1((d) => y(d.y));

// Container for the chart
let chartCont = document.querySelector(".chartContainer")

// SVG generator
let svg = d3.create('svg')
.attr("width", width)
.attr("height", height)
.attr("color", "white")
.attr("class", "svg");

// x-axis generator
let xAxis = svg.append("g")
.attr("transform", `translate(0, ${height - marginBottom})`)
.attr("class", "xAxis")
.call(d3.axisBottom(x));

// y-axis generator
let yAxis = svg.append("g")
.attr("transform", `translate(${marginLeft}, 0)`)
.attr("class", "yAxis")
.call(d3.axisLeft(y));

// line path generator
let lineSVG = svg.append("path")
.datum(randomData)
.attr("d", line)
.attr("stroke", "yellow")
.attr("fill", "none")
.attr("class", "line");

// area path generator
let areaSVG = svg.append("path")
.attr("d", area(randomData))
.attr("stroke", "none")
.attr("fill", "#041537")
.attr("fill-opacity", "0.3")
.attr("class", "area");

// circle generator
let circle = svg.selectAll("circle")
.data(randomData)
.join("circle")
.attr("r", 5)
.attr("cx", (d) => {return x(d.x)})
.attr("cy", (d) => {return y(d.y)})
.attr("fill", "yellow");

// Append the chart to the container
chartCont.append(svg.node());

// Function for updating the graph
function updateGraph() {
    globX += 6;
    globY -= 6;
    randomData.push({x: globX, y: globY});

    x = d3.scaleLinear(d3.extent(randomData, (d) => { return d.x}), [marginLeft, width - marginRight]);

    y = d3.scaleLinear(d3.extent(randomData, (d) => { return d.y}), [height - marginBottom, marginTop]);

    xAxis.call(d3.axisBottom(x));
    yAxis.call(d3.axisLeft(y));

    lineSVG
    .datum(randomData)
    .attr("d", line);

    areaSVG
    .datum(randomData)
    .attr("d", area);

    let circle = svg.selectAll("circle")
    .data(randomData);

    circle.join("circle")
    .attr("r", 5)
    .attr("cx", (d) => {return x(d.x)})
    .attr("cy", (d) => {return y(d.y)})
    .attr("fill", "yellow")
    .attr("class", "circle");

//    d3.selectAll(".xAxis").transition(axisTransition);
}

setInterval(updateGraph, 1000);