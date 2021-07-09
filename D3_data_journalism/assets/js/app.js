// Set up chart
  var svgWidth = 960;
  var svgHeight = 500;

  var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
    };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
   .append("svg")
   .attr("width", svgWidth)
   .attr("height", svgHeight);

// Group charts in container
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {
  // console.log(healthData);

// Step 1: Parse Data and cast as numbers
      healthData.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
    });

// Step 2: Create scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(healthData, d => d.age)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.smokes)])
    .range([height, 0]);

// Step 3: Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

// Step 4: Append Axes to the chart
      chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("stroke", "maroon")
    .call(bottomAxis);

    chartGroup.append("g")
    .attr("stroke", "blue") 
    .call(leftAxis);

// Step 5: Create Circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.age))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5");

// Step 6: Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([25, -2])
    .html(function(d) {
       return (`${d.abbr}`);
     });

// Step 7: Create tooltip in the chart
     chartGroup.call(toolTip);

// Step 8: Create event listeners to display and hide the tooltip
      circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
    })
      // Mouseout event to hide tooltip
    .on("mouseout", function (data) {
          toolTip.hide(data, this);
        });
  
    // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Age");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Smokes");
      })
    .catch(function(error) {
    console.log(error);
      });
