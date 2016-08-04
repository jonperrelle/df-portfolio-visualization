'use strict';

app.directive('lineGraph', function(d3Service) {
    return {
        restrict: 'E',
        scope: {
            data: '=',
        },
        link: function(scope, ele, attrs) {

            d3Service.d3().then(function(d3) {

                scope.$watch(function() {
                      return scope.data; 
                  }, function() {
                      scope.render();
                  });

                window.onresize = function() {
                  scope.render();
                };

                scope.render = function () { 

                    let anchor = d3.select(ele[0]);
                    anchor.selectAll('*').remove();

                    let margin = {top: 50, right: 40, bottom: 30, left: 40},
                        width = (ele[0].parentNode.offsetWidth - margin.left - margin.right) > 600 ? 600 : ele[0].parentNode.offsetWidth - margin.left - margin.right,
                        height = 350 - margin.top - margin.bottom;

                    let svg = anchor.append('svg')
                            .attr('width', width)
                            .attr('height', height);   
                          
                    let parseDate = d3.timeParse("%Y-%m-%d"),
                    bisectDate = d3.bisector(d => parseDate(d.date)).left,
                    initialValue = +scope.data[0].notional === 34871 ? 35000 : +scope.data[0].notional, 
                    formatCurrency = d3.format("($,.2f"),
                    maxY = d3.max(scope.data, d => +d.notional),
                    minY = d3.min(scope.data, d=> +d.notional);

                    minY = minY - (maxY-minY)/10    

                    let x = d3.scaleTime(),
                        y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

                    let line = d3.line()
                        .x( d => x(parseDate(d.date)))
                        .y( d => y(+d.notional));

                    let initialValueLine = d3.line()
                        .x( d => x(parseDate(d.date)))
                        .y( d => y(initialValue));

                    x.range([margin.left, width - margin.right]);
                    x.domain(d3.extent(scope.data, d => parseDate(d.date)));
                    y.domain([minY, maxY]);

                    //xAxis
                    let xAxis = d3.axisBottom(x);
                    xAxis.ticks(5);

                    svg.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + (height - margin.bottom) + ")")
                      .call(xAxis);

                    //yAxis
                    svg.append("g")
                      .attr("class", "y axis")
                      .attr("transform", "translate(" + margin.left + ",0)")
                      .call(d3.axisLeft(y))
                      .append("text")
                      .attr("y", 6)
                      .attr("dy", ".71em")
                      .style("text-anchor", "end")
                      .attr('fill', 'black')
                      .attr("transform", "rotate(-90)translate(-20,0)")
                      .text('Value ($)');

                    //main line 
                    let mainLine = svg.append("path")
                        .datum(scope.data)
                        .attr("d", line)
                        .attr('fill', 'none')
                        .attr("stroke", 'steelblue')
                        .attr("stroke-width", 2);


                    //initial value line
                    let baseLine = svg.append("path")
                        .datum(scope.data)
                        .attr("d", initialValueLine)
                        .attr('fill', 'none')
                        .attr("stroke", 'black')
                        .style("stroke-dasharray", ("3, 3"));
                    
                    svg.append("text")
                        .attr('fill', 'black')
                        .attr("transform", "translate(" + (width) + "," + (y(initialValue) + 10) + ")")
                        .attr("font-size", "10")
                        .attr("dy", ".35em")
                        .attr("text-anchor", "end")
                        .text(formatCurrency(initialValue));

                    //lineLegend
                    let focus = svg.append("g")
                            .attr("fill", "none")
                            .style("display", "none");

                        focus.append("circle")
                            .attr("r", 4.5)
                            .attr("stroke", "black");

                    let lineLegend = anchor.append('div')
                          .attr('class', 'lineLegend');

                        lineLegend.append('div')
                              .attr('class', 'date');

                        lineLegend.append('div')
                              .attr('class', 'value-total');

                        lineLegend.append('div')
                              .attr('class', 'value-change');

                        lineLegend.append('div')
                              .attr('class', 'value-percent');

                        svg.append("rect")
                            .attr("fill", "none")
                            .attr('pointer-events', 'all')
                            .attr("width", width)
                            .attr("height", height)
                            .on("mouseover", function() { 
                              focus.style("display", null);
                              lineLegend.style("opacity", 1);
                              mainLine.style("opacity", 0.5); 
                              baseLine.style("opacity", 0.5);
                            })
                            .on("mouseout", function() { 
                              focus.style("display", "none"); 
                              lineLegend.style("opacity", 0);
                              mainLine.style("opacity", 1);
                              baseLine.style("opacity", 1);
                            })
                            .on("mousemove", mousemove);

                    function mousemove() {
                        let x0 = x.invert(d3.mouse(this)[0]),
                        i = bisectDate(scope.data, x0, 1),
                        d0 = scope.data[i - 1],
                        d1 = scope.data[i],
                        d = x0 - parseDate(d0.date) > parseDate(d1.date) - x0 ? d1 : d0;
                        
                        focus.attr("transform", "translate(" + x(parseDate(d.date)) + "," + y(d.notional) + ")");
                        lineLegend.select('.date').html("<strong>Date:</strong> " + d.date + "  |  <strong>Value:</strong> " + formatCurrency(d.notional));              
                        lineLegend.select('.value-change').html("<strong>Change in Value ($):</strong> " + formatCurrency(d.notional - initialValue) + "  |  <strong>(%):</strong> " + d3.format(".2%")((d.notional - initialValue)/d.notional));                           
                        lineLegend.style('opacity', 1);
                    }
                };
            });
        }
    };
});
