var margin = {top: 20, right: 20, bottom: 40, left: 45},
width = 690 - margin.left - margin.right,
height = 240 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var chart_1 = d3.select("#bar1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart_2 = d3.select("#bar2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var chart_3 = d3.select("#bar3")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var scatter = d3.select("#scatter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var borough_colors = {
    "Manhattan": "#66c2a5",
    "Brooklyn": "#fc8d62",
    "Bronx": "#8da0cb",
    "Queens": "#e78ac3",
    "Staten island": "#a6d854"
}

var yuppie_colors = {
    "Manhattan": "#66c2a5",
    "Brooklyn": "#fc8d62",
    "Bronx": "#8da0cb",
    "Queens": "#8da0cb",
    "Staten island": "#8da0cb"
}

var makeLegend = function (chart) {
        var legSpace = 100;
    var legBoxWidth = 25
    var legBoxWordSpace = 5
    var legEntryWidth = legSpace + legBoxWidth;

    var legend = chart.selectAll(".legend")
        .data(["Manhattan", "Brooklyn", "Bronx and Queens"])
        .enter().append("g")
        .attr('class', 'legend')
        .attr("transform", function(d, i) {
            return "translate(" + (130 + i * legEntryWidth) + "," +
                (height + 25) + ")"; });
    
    legend.append("rect")
        .attr("height", 10)
        .attr("width", legBoxWidth)
        .attr("fill", function (d) {
            ret = yuppie_colors[d]
            if (!ret) {
                ret = yuppie_colors['Bronx']
            }
            return ret;
        })

    legend.append("text")
        .attr("x", legBoxWidth + legBoxWordSpace)
        .attr("y", 10)
        .text(function(d) { return d; });

    }

d3.tsv("find_your_tree/out.csv", type, function(error, data) {
    // chart 1
    data.sort(function(a,b) {
        return a.price - b.price;
    });
    // y.domain([0, d3.max(data, function(d) { return d.price; })]);
    x.domain([25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 140])
    .range([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    var agg = {};
    agg['Manhattan'] = new Array(13+1).join('0').split('').map(parseFloat)
    agg['Brooklyn'] = new Array(13+1).join('0').split('').map(parseFloat)
    agg['Queens'] = new Array(13+1).join('0').split('').map(parseFloat)

    var max_freq = 0;
    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        var b = d.borough;
        if (d.borough == "Bronx") {
            b = "Queens"
        }
        agg[b][x(d.price)] += 1;
        if (agg[b][x(d.price)] > max_freq) {
            max_freq = agg[b][x(d.price)];
        }
    }
    var agg_arr = [];
    for (var k in agg) {
        var s = d3.sum(agg[k]);
        for(var i = 0; i < agg[k].length; ++i){
            agg_arr.push({'borough': k,
                          'sum': s,
                          'index': i,
                          'bucket': i * 10 + 25,
                          'val': agg[k][i]})
        }
    }
    // console.log(agg)
    // for (var k in agg) {
    //     var foo = []
    //     for (var i = 0; i < agg[k].length; ++i) {
    //         for (var j = 0; j < agg[k][i]; ++j) {
    //             foo.push(i);
    //         }
    //     }
    //     console.log(k)
    //     console.log(foo.join(','))
    // }
    
    x.domain(d3.set(data.map(function(d) { return d.price }))
             .values().map(function(x) {return parseInt(x);}))
//    y.domain([0, max_freq])
    y.domain([0, 0.3])
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);


    
    // var barWidth = width / data.length;
    var barWidth = width / 13;
    var minibarWidth = (barWidth - 10) / 3;

    var bar = chart_1.selectAll("g")
        // .data(data)
        .data(agg_arr)
        .enter().append("g")
        .attr("transform", function(d, i) {
            var offset = 0;
            if (d.borough == "Manhattan") {
                offset = 0;
            } else if (d.borough == "Brooklyn"){
                offset = minibarWidth;
            } else {
                offset = minibarWidth * 2;
            }
            offset += 7;
            var translation = d.index * barWidth + offset;
            return "translate(" + translation + ",0)"; });

    bar.append("rect")
        .attr("y", function(d) { return y(d.val / d.sum); })
        .attr("height", function(d) { return height - y(d.val / d.sum); })
        .attr("width", minibarWidth - 1)
        .attr("fill", function(d) {
            return yuppie_colors[d.borough]});


    makeLegend(chart_1);
    
    chart_1.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("font-size", 12)
        .attr("transform", "rotate(-90) translate(0,-50)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Proportion of Borough");

    var xaxis_scale = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
        .domain([25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 140]);

    var xAxis = d3.svg.axis()
        // .scale(xaxis_scale)
        .orient("bottom")
        .tickValues([25.5, 73.6, 121.7, 169.8, 217.9, 266.0, 314.1, 362.2, 410.3, 458.4, 506.5, 554.6, 602.7])
        .tickFormat(function(d, i){
            if (i < 12) {
                var lower = 20 + i * 10;
                var upper = lower + 10
                return lower + "-" + upper;
            } else {
                return "140+";
            }
        })

    chart_1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("font-size", 12)
        .attr("transform", "translate(620, 21)") 
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Spent ($)");

    
    // chart 2

    x.domain([13, 26, 39, 52, 65, 78, 91, 104, 117, 130, 143, 156, 169])
    .range([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    var agg = {};
    agg['Manhattan'] = new Array(13+1).join('0').split('').map(parseFloat)
    agg['Brooklyn'] = new Array(13+1).join('0').split('').map(parseFloat)
    agg['Queens'] = new Array(13+1).join('0').split('').map(parseFloat)

    var max_freq = 0;
    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        var b = d.borough;
        if (d.borough == "Bronx") {
            b = "Queens"
        }
        var ind = x(Math.floor(d.sixfeet / 13) * 13 + 13);
        agg[b][ind] += 1;
        if (agg[b][ind] > max_freq) {
            max_freq = agg[b][ind];
        }
    }
    var agg_arr = [];
    for (var k in agg) {
        var s = d3.sum(agg[k]);
        for(var i = 0; i < agg[k].length; ++i){
            agg_arr.push({'borough': k,
                          'sum': s,
                          'index': i,
                          'bucket': i * 10 + 25,
                          'val': agg[k][i]})
        }
    }
    
    x.domain(d3.set(data.map(function(d) { return d.sixfeet }))
             .values().map(function(x) {return parseInt(x);}))
//    y.domain([0, max_freq])
    y.domain([0, 0.3])
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);


    
    // var barWidth = width / data.length;
    var barWidth = width / 13;
    var minibarWidth = (barWidth - 10) / 3;

    var bar = chart_2.selectAll("g")
        // .data(data)
        .data(agg_arr)
        .enter().append("g")
        .attr("transform", function(d, i) {
            var offset = 0;
            if (d.borough == "Manhattan") {
                offset = 0;
            } else if (d.borough == "Brooklyn"){
                offset = minibarWidth;
            } else {
                offset = minibarWidth * 2;
            }
            offset += 7;
            var translation = d.index * barWidth + offset;
            return "translate(" + translation + ",0)"; });

    bar.append("rect")
        .attr("y", function(d) { return y(d.val / d.sum); })
        .attr("height", function(d) { return height - y(d.val / d.sum); })
        .attr("width", minibarWidth - 1)
        .attr("fill", function(d) {
            return yuppie_colors[d.borough]});


    makeLegend(chart_2);
    
    chart_2.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("font-size", 12)
        .attr("transform", "rotate(-90) translate(0,-50)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Proportion of Borough");

    var xaxis_scale = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
        .domain([25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 140]);

    var xAxis = d3.svg.axis()
        // .scale(xaxis_scale)
        .orient("bottom")
        .tickValues([25.5, 73.6, 121.7, 169.8, 217.9, 266.0, 314.1, 362.2, 410.3, 458.4, 506.5, 554.6, 602.7])
        .tickFormat(function(d, i){
                var lower =  i * 13;
                var upper = lower + 13
                return lower + "-" + upper;
        })
    
    chart_2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("font-size", 12)
        .attr("transform", "translate(620, 21)") 
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Est. cost ($)");


    var x2 = d3.scale.linear()
        .domain([1, d3.max(data, function(d) {return d.height;})])
        .range([0, width]);

    var y2 = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) {return d.price;})]);

            
    scatter.selectAll("circle")
        .data(data)
        .enter()
    .append("circle")
    .attr("cx", function(d) {
        return x2(d.height) + (Math.random() - .5) * 18 ;})
    .attr("cy", function(d) {
        return y2(d.price) + (Math.random() - .5) * 18;})
    .attr("r", 2)
    .attr("fill", function(d) {
            return yuppie_colors[d.borough]});

    var yAxis = d3.svg.axis()
        .scale(y2)
        .orient("left")
        .ticks(10);

    var xAxis = d3.svg.axis()
        .scale(x2)
        .orient("bottom")
        .ticks(10);

    
scatter.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("font-size", 12)
        .attr("transform", "rotate(-90) translate(0,-50)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price");

    scatter.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("font-size", 12)
        .attr("transform", "translate(620, 21)") 
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Height (ft.)");

    makeLegend(scatter);
    
    // chart 3

//     x.domain([2, 3, 4, 5, 6, 7, 8, 9, 10])
//     .range([0, 1, 2, 3, 4, 5, 6, 7, 8])

//     var agg = {};
//     agg['Manhattan'] = new Array(9+1).join('0').split('').map(parseFloat)
//     agg['Brooklyn'] = new Array(9+1).join('0').split('').map(parseFloat)
//     agg['Queens'] = new Array(9+1).join('0').split('').map(parseFloat)

//     var max_freq = 0;
//     for (var i = 0; i < data.length; i++) {
//         var d = data[i];
//         var b = d.borough;
//         if (d.borough == "Bronx") {
//             b = "Queens"
//         }
//         agg[b][x(d.height)] += 1;
//         if (agg[b][x(d.height)] > max_freq) {
//             max_freq = agg[b][x(d.height)];
//         }
//     }
//     var agg_arr = [];
//     for (var k in agg) {
//         var s = d3.sum(agg[k]);
//         for(var i = 0; i < agg[k].length; ++i){
//             agg_arr.push({'borough': k,
//                           'sum': s,
//                           'index': i,
//                           'bucket': i * 10 + 25,
//                           'val': agg[k][i]})
//         }
//     }
    
//     x.domain(d3.set(data.map(function(d) { return d.height }))
//              .values().map(function(x) {return parseInt(x);}))
// //    y.domain([0, max_freq])
//     y.domain([0, 0.35])
//     var yAxis = d3.svg.axis()
//         .scale(y)
//         .orient("left")
//         .ticks(10);


    
//     // var barWidth = width / data.length;
//     var barWidth = width / 9;
//     var minibarWidth = (barWidth - 10) / 3;

//     var bar = chart_3.selectAll("g")
//         // .data(data)
//         .data(agg_arr)
//         .enter().append("g")
//         .attr("transform", function(d, i) {
//             var offset = 0;
//             if (d.borough == "Manhattan") {
//                 offset = 0;
//             } else if (d.borough == "Brooklyn"){
//                 offset = minibarWidth;
//             } else {
//                 offset = minibarWidth * 2;
//             }
//             offset += 7;
//             var translation = d.index * barWidth + offset;
//             return "translate(" + translation + ",0)"; });

//     bar.append("rect")
//         .attr("y", function(d) { return y(d.val / d.sum); })
//         .attr("height", function(d) { return height - y(d.val / d.sum); })
//         .attr("width", minibarWidth - 1)
//         .attr("fill", function(d) {
//             return yuppie_colors[d.borough]});


//     makeLegend(chart_3);
    
//     chart_3.append("g")
//         .attr("class", "y axis")
//         .call(yAxis)
//         .append("text")
//         .attr("transform", "translate(100,0)") 
//         .attr("y", 6)
//         .attr("dy", ".71em")
//         .style("text-anchor", "end")
//         .text("Proportion of Borough");

//     var xAxis = d3.svg.axis()
//         .orient("bottom")
//         .tickValues([36, 107, 176, 247, 317, 386, 457, 527, 597])
//         .tickFormat(function(d, i){
//             return i + 2;
//         })
    
//     chart_3.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis)
//         .append("text")
//         .attr("transform", "translate(620, 21)") 
//         .attr("y", 6)
//         .attr("dy", ".71em")
//         .style("text-anchor", "end")
//         .text("Height of Tree (ft.)");

    
});

function type(d) {
    d.price = +d.price; // coerce to number
    d.sixfeet = +d.sixfeet;
    d.height = +d.height;
    return d;
}
