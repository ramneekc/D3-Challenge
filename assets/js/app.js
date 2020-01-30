// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 40,
  right: 40,
  bottom: 40,
  left: 40
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.csv("./assets/data/data.csv").then(function(data){
    console.log(data);

    data.forEach(function(d){
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    var xScale = d3.scaleLinear()
        .domain([8, d3.max(data, d => d.poverty)+1])
        .range([0,chartWidth]);        
    
    var yScale = d3.scaleLinear()
        .domain([3, d3.max(data, d => d.healthcare)+1])
        .range([chartHeight,0]);
    
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);
    
    chartGroup.append('g')
        .attr("transform", `translate(0,${chartHeight})`)
        .call(bottomAxis);

    chartGroup.append('g')
        .call(leftAxis);
    
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "15")
        .attr("fill","skyblue")
        // .attr("stroke","blue")
        .attr("opacity",".8");
     
    var textGroup = chartGroup.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.poverty))             
        .attr("y", d => yScale(d.healthcare)+4)
        .attr("text-anchor", "middle")  
        .style("font-size", "14px")
        .text(function(d){return d.abbr;})
        .style("fill", "blue");    

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
           return (`<strong>${d.state}<br>Healthcare(%): ${d.healthcare}<br>Poverty(%): ${d.poverty}`);
                });
    
    chartGroup.call(toolTip);
    circlesGroup.on("mouseover", function(data) {
                    toolTip.show(data, this);})
                .on("mouseout", function(data, index) {
                    toolTip.hide(data);});

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left -5)
        .attr("x", -10 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare(%)");
  
    chartGroup.append("text")
        .attr("transform", `translate(${(chartWidth / 2)-35}, ${chartHeight + chartMargin.top - 5})`)
        .attr("class", "axisText")
        .text("In Poverty(%)");    


}).catch(function(error){
    console.log(error);
});  