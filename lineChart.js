import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let width = 300;
let height = 300;
let marginTop = 20;
let marginRight = 20;
let marginBottom = 30;
let marginLeft = 40;

let randomData = [
    {x: 0, y: 40},
    {x: 10, y: 50},
    {x: 20, y: 30},
    {x: 30, y: 70},
    {x: 40, y: 90}
];


let x = d3.scaleLinear([0, d3.max(randomData, (d) => {return d.x})], [marginLeft, width - marginRight]);

let y = d3.scaleLinear([0, d3.max(randomData, (d) => {return d.y})], [height - marginBottom, marginTop]);

let line = d3.line()
.x((d) => x(d.x))
.y((d) => y(d.y))

let area = d3.area()
.x((d) => x(d.x))
.y0(y(0))
.y1((d) => y(d.y))

let chartCont = document.querySelector(".chartContainer")

let svg = d3.create('svg')
.attr("width", width)
.attr("height", height)
.attr("color", "white")

svg.append("g")
.attr("transform", `translate(0, ${height - marginBottom})`)
.attr("class", "xAxis")
.call(d3.axisBottom(x));

svg.append("g")
.attr("transform", `translate(${marginLeft}, 0)`)
.attr("class", "yAxis")
.call(d3.axisLeft(y));

svg.append("path")
.attr("d", line(randomData))
.attr("stroke", "yellow")
.attr("fill", "none")

svg.append("path")
.attr("d", area(randomData))
.attr("stroke", "none")
.attr("fill", "black")
.attr("fill-opacity", "0.3")

let circle = svg.selectAll("circle")
.data(randomData)


circle.enter().append("circle")
.attr("r", 5)
.attr("cx", (d) => {return x(d.x)})
.attr("cy", (d) => {return y(d.y)})
.attr("fill", "yellow")

chartCont.append(svg.node());