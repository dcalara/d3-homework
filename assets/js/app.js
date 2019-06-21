var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv", function(err, data) {
  if (err) throw err;


  // parse data
  data.forEach(function(d) {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
  });

// Initial Params
// var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
// function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.poverty) -0.5,
      d3.max(data, d => d.poverty) + 0.5
    ])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.healthcare) -1, 
      d3.max(data, d => d.healthcare) + 1.0])
    .range([height, 0]);



// function used for updating xAxis var upon click on axis label
// function renderAxes(newXScale, xAxis) {
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);


  // append x axis
  chartGroup.append("g")
  //  .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("opacity", ".5")
    

  circlesGroup.append("text")
    .classed("stateText", true)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("stroke", "orange")
    .attr("font-size", "10px")  
    .text(d => d.abbr)

// ToolTip
var toolTip = d3.tip()
.attr("class", "d3-tip")
.offset([-5, 0])
.html(function(d) {
  return (`${d.state}<br>Poverty: ${d.poverty}%<br>Without Healthcare: ${d.healthcare}%`);
});

circlesGroup.call(toolTip);

circlesGroup.on("mouseover", function(d) {
d3.select(this).style("stroke", "black")
toolTip.show(d, this);
})

// onmouseout event
.on("mouseout", function(d, index) {
  d3.select(this).style("stroke", "red")
.attr("r", "20")
toolTip.show(d);
});

return circlesGroup;
});


// x & y-axis labels
// Create group for  2 x- axis labels
 chartGroup.append("g")
     .attr("transform", `translate(${width / 2}, ${height + 20})`);

  

  // append x axis
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "aText")
    .text("In Poverty (%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("aText", true)
    .text("Population Without Healthcare (%)");

  

     
