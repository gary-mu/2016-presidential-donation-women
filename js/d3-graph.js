//Draw overall contribution by candidates
function draw_total(data) {
    var header= d3.select("#total-graph")
        .append('h2').text("Total Contribution by Candidates (Ohio State)*")
        .style('text-align', "center")
        .attr('id', 'total_heading');
    var svg = dimple.newSvg("#total-graph", 600,500);
    var myChart = new dimple.chart(svg, data);
    myChart.defaultColors = [
    new dimple.color("#e74c3c", "#c0392b", 1), // red	
    new dimple.color("#3498db", "#2980b9", 1)// blue
    ];     
    myChart.width = 1200;
    myChart.x = 100;
    myChart.y = 200;
    myChart.setBounds('10%', '10%', '80%', '70%')
    x = myChart.addCategoryAxis("x", 'cand_last');
    y = myChart.addMeasureAxis("y", "contb_receipt_amt");
    var mySeries= myChart.addSeries('party', dimple.plot.bar);
    myChart.addLegend(65, 10, 510, 20, "right");
    mySeries.addEventHandler("click", function (e) {
    	$('#instructions').hide();
    	$('#gender').html('');
    var filtered = dimple.filterData(data, "cand_last", e.xValue);
    draw_gender(filtered, e.xValue);
    draw_average(data);
    });
    myChart.draw();
    x.titleShape.text("2016 Presidential Candidates");
    y.titleShape.text("Total Donations Received in Ohio (million)");
};        

//Helper funtion to toggle instruction text and comparison chart
function instructions(){
    $('#gender').html('');
    $('#instructions').show();
};

//Draw gender comparison pie and ring chart
function draw_gender(data, cand) {
    var header= d3.select("#gender")
        .append('h2').text("Donations Received by Gender: Candidate vs. Average")
        .style('text-align', "center")
        .attr('id', 'gender_heading');
    var subheader = d3.select("#gender")
        .append('p').text("Hover on rings to see candidate comparison to average")
        .attr('id', 'total_subheading');
    var svg = dimple.newSvg("#gender", 500, 500);
    svg.attr('id', 'gender-svg')
    svg.append('text').text(cand)
     .attr("text-anchor", "middle")
     .attr("dx", "18.5em")
     .attr("dy", "2em")
     .attr('id', 'average-heading')
    var myChart2 = new dimple.chart(svg, data);

    myChart2.setBounds('8%', '10%', '85%', '85%')
    myChart2.addMeasureAxis("p", "contb_receipt_amt");
    var mySeries2 = myChart2.addSeries("contbr_gender", dimple.plot.pie);
    myChart2.assignColor("female", "#FB8072");
    myChart2.assignColor("male", "#80B1D3");
    myChart2.addLegend(65, 10, '90%', 20, "right");
    mySeries2.innerRadius = "70%"
    // Handle the hover event - overriding the default behaviour
    mySeries2.addEventHandler("mouseover", onHover);
    // Handle the leave event - overriding the default behaviour
    mySeries2.addEventHandler("mouseleave", onLeave);
    myChart2.draw();

//Hover event to display label for candidate's contribution by gender
function onHover(e) { 
    var pct_format = d3.format(".2%");
    var amt_format = d3.format(".2s");
    var path = e.selectedShape[0][0];
    var pct = e.selectedShape[0][0].__data__.piePct;
    var d3path = d3.select(path);
    var selectedGender = e.seriesValue[0];
    if (selectedGender == 'male'){
    var compare = (pct-0.612)/0.612;
    } if (selectedGender == 'female'){
    var compare = (pct-0.388)/0.388;
    } 
    var diff = compare < 0 ? 'lower' : 'higher';
    var box = d3path.node().getBBox();

    // Get the properties of the selected shape
    var cx = parseFloat(e.selectedShape.attr("x")),
    cy = parseFloat(e.selectedShape.attr("y"));

    // Set the size and position of the popup
    var width = 180,
    height = 60,
    x = 15, 
    y = 15;

    // Create a group for the popup objects
    popup = svg.append("g");

    // Add a rectangle surrounding the text
    popup
    .append("rect")
    .attr("x",x)
    .attr("y",y)
    .attr("width", width)
    .attr("height", height)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("opacity", "0.8")
    .style("fill", 'black')
    .style("stroke", 'black')
    .style("stroke-width", 2);

    // Add multiple lines of text
    popup
    .append('text')
    .attr('x', x + 15)
    .attr('y', y + 25)
    .text(e.seriesValue[0] + ": " + pct_format(pct) + ' ($' + amt_format(e.pValue) + ')')
    .style("font-size", 14)
    .style("font-family", 'Arial')
    .style("text-align", 'middle')
    .style("fill", 'white');

    popup
    .append('text')
    .attr('x', x + 15)
    .attr('y', y + 45)
    .text(pct_format(Math.abs(compare)) + " " + diff + " than average.")
    .style("font-size", 12)
    .style("font-family", 'Arial')
    .style("text-align", 'middle')
    .style("fill", 'white');
    }

    function onLeave(e) {
    // Remove the popup
    if (popup !== null) {
    popup.remove();
    }
    }
};

//Draw overall contribution by gender
function draw_average(data) {
    var svg = dimple.newSvg("#gender-svg", '80%', '80%');
    svg.attr('id', 'average');
    svg.append('text').text("Average")
     .style("text-anchor", "middle")
     .attr("dx", "18.5em")
     .attr("dy", "12em")
     .attr('id', 'average-heading')
    var myChart3 = new dimple.chart(svg, data);
    myChart3.setBounds('36%', '40%', '28%', '28%')
    myChart3.addMeasureAxis("p", "contb_receipt_amt");
    var mySeries3 = myChart3.addSeries("contbr_gender", dimple.plot.pie);

    mySeries3.afterDraw = function(shape, data) {
    var ctm = shape.getCTM();
    var bbox = shape.getBBox();
    //Add pie chart label for average
    myChart3.svg.append("text")
    .attr("dx", ctm.e + bbox.x + bbox.width*.4)
    .attr("dy", ctm.f + bbox.y + bbox.height*.6)
    .text(Math.round(1000*data.piePct)/10 + "%");
    myChart3.svg.append("text")
    .attr("dx", ctm.e + bbox.x + bbox.width*.4)
    .attr("dy", ctm.f + bbox.y*2+ bbox.height*1)
    .text(data.aggField[0]+":");
    };

    myChart3.draw();
};
