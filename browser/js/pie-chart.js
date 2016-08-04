'use strict';

app.directive('pieChart', function(d3Service) {
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

                    let margin = {top: 0, right: 40, bottom: 30, left: 40},
                        width = (ele[0].parentNode.offsetWidth - margin.left - margin.right) > 600 ? 600 : ele[0].parentNode.offsetWidth - margin.left - margin.right,
                        height = 420 - margin.top - margin.bottom;

                    let svg = anchor.append('svg')
                            .attr('width', width)
                            .attr('height', height)
                            .append('g')
                            .attr("transform", "translate(" + (width+80) / 2 + "," + height / 2 + ")");   
                    
                    let color = d3.scaleOrdinal(d3.schemeCategory20),
                    formatCurrency = d3.format("($,.2f");

                    let pie = d3.pie()
                        .value(d => d.value);

                    let arc = d3.arc()
                        .outerRadius(.8 * width/3.5) 
                        .innerRadius(.5 * width/3.5);

                    let outerArc = d3.arc()
                        .outerRadius(.95 * width/3.5)
                        .innerRadius(.95 * width/3.5);

                    let innerArc = d3.arc()
                        .outerRadius(.87 * width/3.5)
                        .innerRadius(.8 * width/3.5);

                    let pieChart = svg.selectAll(".arc")
                        .data(pie(scope.data))
                        .enter()
                        .append("g")
                        .attr("class", "arc")
                        .append("path")
                        .attr("d", arc)
                        .attr("fill", (d, i) => color(i));

                    //text
                    svg.append("g")
                        .selectAll("text")
                        .data(pie(scope.data), d => d.data.security.ticker)
                        .enter()
                        .append("text")
                        .attr("dy", ".35em")
                        .attr("fill", "black")
                        .text( d => d.data.security.ticker)
                        .attr("transform", d => "translate(" + outerArc.centroid(d) + ")")
                        .attr("text-anchor", "middle");
                    
                    //polylines
                    svg.append("g")
                        .selectAll("polyline")
                        .data(pie(scope.data), d => d.data.security.ticker)
                        .enter()
                        .append("polyline")
                        .attr("opacity", 0.3)
                        .attr("stroke", "black")
                        .attr("stroke-width", 1)
                        .attr("fill", "none")
                        .attr("points", d => [arc.centroid(d), innerArc.centroid(d)]);

                    //tooltip
                    let tooltip = anchor.append('div')
                        .attr('class', 'tooltip');

                    tooltip.append('div')
                        .attr('class', 'name');

                    tooltip.append('div')
                        .attr('class', 'value');

                    tooltip.append('div')
                        .attr('class', 'percent');

                    pieChart.on('mouseover', function(d) {                          
                      let total = d3.sum(scope.data.map(d => d.value));                                                        // NEW
                      let percent = Math.round(1000 * d.data.value / total) / 10; 
                      tooltip.select('.name').html(d.data.security.name);                
                      tooltip.select('.value').html("<strong>Value:</strong> " + formatCurrency(d.data.value));                
                      tooltip.select('.percent').html("<strong>Share of Portfolio (%):</strong> " + percent + '%');             
                      tooltip.style('opacity', 1); 
                      pieChart.style('opacity', 0.5);                        
                    });                                                           
                    
                    pieChart.on('mouseout', function() {                              
                      tooltip.style('opacity', 0);  
                      pieChart.style('opacity', 1);                         
                    });
 
                };

            });
        }
    };
});
