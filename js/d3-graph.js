//Draw overall contribution by candidates
function draw_total(data) {
    var header= d3.select("#total-graph")
        .append('h2').text("Kasich Received the Most Female Donation in Ohio")
        .style('text-align', "center")
        .attr('id', 'total_heading');

    var subheading = d3.select("#total_heading")
        .insert('div', ':first-child')
        .attr('id', 'total_subheading')
        .append('text').text('Click on the candidates bar below to compare his/her donation by gender to average')
        .style('text-align', 'center')
    
    var svg = dimple.newSvg("#total-graph", 600,550);
    var myChart = new dimple.chart(svg, data);
    
    myChart.defaultColors = [
        new dimple.color("#3498db", "#2980b9", 1), //red for women
        new dimple.color("#e74c3c", "#c0392b", 1)  // blue for men
    ];     
    
    myChart.width = 1200;
    myChart.x = 100;
    myChart.y = 200;
    
    myChart.setBounds('10%', '10%', '80%', '70%')
    
    x = myChart.addCategoryAxis("x", 'cand_last');
    y = myChart.addMeasureAxis("y", "contb_receipt_amt");
    
    var mySeries= myChart.addSeries('contbr_gender', dimple.plot.bar);
    myChart.addLegend(65, 10, 510, 20, "right");

    //add labels to bars
    mySeries.afterDraw = function (shape, data) {
        // Get the shape as a d3 selection
        var s = d3.select(shape),
          rect = {
            x: parseFloat(s.attr("x")),
            y: parseFloat(s.attr("y")),
            width: parseFloat(s.attr("width")),
            height: parseFloat(s.attr("height"))
          };
        // Only label bars where the text can fit
        if (rect.height >= 5) {
          svg.append("text")
            .attr("x", rect.x + rect.width / 2)
            .attr("y", rect.y + rect.height / 2 + 3.5)
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-family", "sans-serif")
            .style("opacity", 0.8)
            .style("fill", 'white')
            .text(d3.format(",.0f")(data.yValue / 1000) + "k");
        }
      };

    //Event handler to respond to user clicking on candidate from bar chart and draw Gender pie chart
    mySeries.addEventHandler("click", function (e) {
    	// $('#instructions').hide();
        $('#gender').html('');
        var filtered = dimple.filterData(data, "cand_last", e.xValue);
        draw_gender(filtered, e.xValue); //Draw the donation distribution by gender for the selected candidate by calling draw_gender function
        draw_average(data); //Draw the overall average donation distribution by gender by calling draw_average function
    });

    myChart.draw();

    //Draw Clinton donut chart and average pie chart as the default view comparison
    clinton = dimple.filterData(data, "cand_last", 'Clinton');
    draw_gender(clinton, 'Clinton');
    draw_average(data);
    
    //Add title to the two charts
    x.titleShape.text("2016 Presidential Candidates");
    y.titleShape.text("Total Donations Received in Ohio (million)");


}; 

//Draw gender comparison pie and ring chart
function draw_gender(data, cand) {
    var header= d3.select("#gender")
        .append('h2').text("Donations Received by Gender: "+ cand+ " vs. Avg.")
        .style('text-align', "center")
        .attr('id', 'gender_heading');
    
    var svg = dimple.newSvg("#gender", 500, 530);
    svg.attr('id', 'gender-svg')
    
    svg.append('text').text(cand)
     .attr("text-anchor", "middle")
     .attr("dx", "9.8em")
     .attr("dy", "1.5em")
     .attr('id', 'average-heading')
     .style("font-size", 32)
     .style("font-style", 'italic');
    
    var myChart2 = new dimple.chart(svg, data);

    myChart2.setBounds('8%', '10%', '85%', '85%')
    myChart2.addMeasureAxis("p", "contb_receipt_amt");
    var mySeries2 = myChart2.addSeries("contbr_gender", dimple.plot.pie);
    
    myChart2.assignColor("female", "#FB8072");
    myChart2.assignColor("male", "#80B1D3");
    myChart2.addLegend(65, 10, '90%', 20, "right");
    mySeries2.innerRadius = "70%"

    myChart2.draw();
    compare(cand, svg, mySeries2);
};

function compare(cand, svg, series){
    var pct_format = d3.format(".0%");
    var gender_key = series.shapes[0][1].__data__.key;
    var male = gender_key =='male____' ? series.shapes[0][1].__data__.piePct : series.shapes[0][0].__data__.piePct;
    var female = gender_key == 'female____' ? series.shapes[0][1].__data__.piePct : series.shapes[0][0].__data__.piePct;
    var compare = (female-0.388)/0.388;
    var diff = compare < 0 ? 'LOWER' : 'HIGHER';
    var f_support = compare < 0 ? 'fewer' : 'more';

    //Set the size and position of the popup
    var width = 220,
    height = 80,
    x = 1, 
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

    // Female donation percentage
    popup
    .append('text')
    .attr('x', x + 10)
    .attr('y', y + 25)
    .text(pct_format(female) + ' donations from female')
    .style("font-size", 16)
    .style("font-family", 'Arial')
    .style("text-align", 'middle')
    .style("fill", 'white');

    //Comparison
    popup
    .append('text')
    .attr('x', x + 10)
    .attr('y', y + 55)
    .text('(' + pct_format(Math.abs(compare)) + " " + diff + " than average.)")
    .style("font-size", 14)
    .style("font-family", 'Arial')
    .style("text-align", 'middle')
    .style("fill", 'white');

    //add dynamic subheading
    var subheading = d3.select("#gender_heading")
    .insert('div', ':first-child')
    .attr('id', 'gender_subheading')
    .append('text').text(cand + ' has '+  f_support + " donations from female in the supporter base")
    .style('text-align', 'center')
    .style('font-size', 'smaller');
};

//Draw overall contribution by gender
function draw_average(data) {
    var svg = dimple.newSvg("#gender-svg", '80%', '80%');
    
    svg.attr('id', 'average');
    svg.append('text').text("Average")
     .style("text-anchor", "middle")
     .attr("dx", "16em")
     .attr("dy", "11em")
     .attr('id', 'average-heading')
     .style("font-size", '18')
     .style("font-style", 'italic');

    
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