/* global $, d3, CONFIG */

import './includes/adLoader';
import './includes/jquery.waypoints.js';
import './includes/sticky.js';
import './includes/inview.js';
import './includes/demographics.waypoints.js';

var height;

function getHeight() {

  // // Find browser height
  var windowHeight = $(window).height();

  // // Find max-height of all explainer texts
  var maxTextHeight = Math.max.apply(null, $('.chart__explainer--text')
    .map(function () { 
      return $(this).height(); 
    }).get());

  var chartHeaderHeight = $('#chart__header').height(), // Chart headline
      chartHeaderRowHeight = $('.chart__header--demographics').height(),
      chartBottomHeight = $('#chart__bottom').height() + 32, // Chart bottom / legend
      chartTopHeight = chartHeaderHeight + chartHeaderRowHeight + maxTextHeight + 16,
      notAvailableHeight = chartTopHeight + chartBottomHeight + 32;

  height = windowHeight - notAvailableHeight;

  $('#chart__top').height(chartTopHeight);
}

getHeight();

var margin = {top: 10, right: 0, bottom: 30, left: 30},
    width = parseInt(d3.select('.chart__container').style('width'), 10) - margin.left - margin.right;

var parseDate = d3.time.format('%Y%m%d').parse;

var x = d3.time.scale()
    .range([0, width]);
    
var y = d3.scale.linear()
    .range([height,0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

var line = d3.svg.line()
    .interpolate('basis')
    .x(function(d) { return x(d.date); })
    .y(function(d) { 
      return y(d.percent); 
    });

var charts = ['white', 'black', 'hispanic'];

charts.forEach(function(race, index) {
  // Build SVG Container
  var svg = d3.select('#' + race).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Load Data
  d3.csv(CONFIG.projectPath + 'assets/data/data.csv', function(error, data) {

    // Color assignments
    var color = d3.scale.ordinal().range(['#99cc33','#356D97']);
        
    // Map the data to key values in an array
    data = data.map( function (d) { 
      return { 
        group: d.group,
        race: d.race,
        date: parseDate(d.date),
        percent: +d.percent }; 
    });   
    
    // Nest the data on group & race
    // so we can call/draw the chart in different steps
    data = d3.nest().key(function(d) { return d.group; }).key(function(d) { return d.race; }).entries(data);

    // Set X Domain on min/max of dates in nested data
    x.domain([d3.min(data, function(d, i) { return d3.min(d.values[i].values, function (d) { return d.date; }); }),
              d3.max(data, function(d, i) { return d3.max(d.values[i].values, function (d) { return d.date; }); })]);

    // Draw initial chart w/ yAxis 0-70%;
    y.domain([0, .7]);

    // Create various data arrays for chart stages
    var dataUT = [],
        dataTX = [],
        dataRace = [],
        dataRaceTX = [],
        dataRaceUT = [];

    dataUT = data[0].values;
    dataTX = data[1].values;
    dataRace.push(dataTX[index], dataUT[index]);
    dataRaceTX.push(dataTX[index]);
    dataRaceUT.push(dataUT[index]);

    // Call resize() on each chart
    d3.select(window).on('resize.' + race, resize).transition();

    // Functions to remove chart elements
    function removeBars() {
      var bars = svg.selectAll('rect');
      bars.remove();
    }

    function removeXAxis() {
      var axis = svg.select('.x.axis');
      axis.remove();
    }

    function removeYAxis() {
      var axis = svg.select('.y.axis');
      axis.remove();
    }

    function removeSeries() {
      var series = svg.selectAll('.group');
      series.remove();
    }

    // Functions to add chart elements
    function addYAxis() {
     svg.append('g')
         .attr('class', 'y axis')
         .call(yAxis.ticks('5', '%').outerTickSize(0).tickPadding(0));   
    }

    function addBars(data) {
      if (data === 'dataRaceTX') {
        removeBars();
      }

      var bars = svg.selectAll('.bar')
        .data(data, function(d) {
          return d.values[0].group;
        });
    
      bars.exit()
        .transition()
          .duration(300)
        .attr('y', y(0))
        .attr('height', height - y(0))
        .style('fill-opacity', 1e-6)
        .remove();

      // data that needs DOM = enter() (a set/selection, not an event!)
      bars.enter().append('rect')
        .attr('class', 'bar')
        .attr('fill', function(d, i) { return color(d.values[i].group); })
        .attr('y', y(0))
        .attr('height', height - y(0));

      // the 'UPDATE' set:
      bars.transition().duration(1000)
        .attr('x', function(d, i) { return x(d.values[i].date) + (width/4 * (i) + 4); })              .attr('width', width/4)
        .attr('y', function(d, i) { return y(d.values[i].percent); })
        .attr('height', function(d, i) { return y(0) - y(d.values[i].percent); }); // flip the height, because y's domain is bottom up, but SVG renders top down
    }

    function addXAxis() {
      svg.select('.x.axis').remove();
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis.outerTickSize(0))
        .selectAll('text')
          .attr('x', '-.25em')
          .attr('dy', '-.25em')
          .attr('transform', 'rotate(-65)')
          .style('text-anchor', 'end');
    }

    function addSeries(addData) {
      removeBars();
      removeSeries();

      var series = svg.selectAll('.group')
        .data(addData, function(d, i) {
          return d.values[i].group;
        })
        .enter().append('g')
          .attr('class', 'group');

      var path = series.append('path')
        .attr('class', 'line')
        .attr('d', function(d) { 
            return line(d.values);
        })
        .style('stroke', function(d, i) { return color(d.values[i].group); });

      path.each(function(d) { d.totalLength = this.getTotalLength(); })
        .attr('stroke-dasharray', function(d) { return d.totalLength + ' ' + d.totalLength; })
        .attr('stroke-dashoffset', function(d) { return d.totalLength; })
        .transition()
          .duration(500)
          .ease('linear')
          .attr('stroke-dashoffset', 0);
    }

    function resize() {
      getHeight();

      // update width
      width = parseInt(d3.select('.chart__container').style('width'), 10) - margin.left - margin.right;
      height = height - margin.top - margin.bottom;

      d3.select('#' + race).select('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      // resize the chart width & xAxis
      x.range([0, width]);
      y.range([height,0]);

      xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

      yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

      removeYAxis();
      addYAxis();

      // Check if series exists, if yes - resize xAxis
      if (!svg.selectAll('.group').empty()) {
        addXAxis();
      }

      var series = svg.selectAll('.group');    

      // Remove and redraw paths on resize
      series.select('path').remove();

      var path = series.append('path')
        .attr('class', 'line')
        .attr('d', function(d) { 
            return line(d.values);
        })
        .style('stroke', function(d, i) { return color(d.values[i].group); });
    
      path.each(function(d) { d.totalLength = this.getTotalLength(); })
        .attr('stroke-dasharray', function(d) { return d.totalLength + ' ' + d.totalLength; })
        .attr('stroke-dashoffset', function(d) { return d.totalLength; })
        .transition()
          .duration(500)
          .ease('linear')
          .attr('stroke-dashoffset', 0);

      // Resize bar width/position
      var bars = svg.selectAll('rect');

      bars.attr('x', function(d, i) { return x(d.values[i].date) + ((width/4) * (i) + 4); })
        .attr('width', width/4)
        .attr('y', function(d, i) { return y(d.values[i].percent); })
        .attr('height', function(d, i) { return y(0) - y(d.values[i].percent); });
    }

    addBars(dataRaceTX);
    addYAxis();
    removeXAxis();

    var inview2 = new Waypoint.Inview({
      element: $('#waypoint2')[0],
      enter: function(direction) {
        if (direction === 'down') {
          addBars(dataRace);
          removeXAxis();
        }
      },
      exit: function(direction) {
        if (direction === 'up') {
          addBars(dataRaceTX);
          removeXAxis();
        }
      }
    });

    var inview3 = new Waypoint.Inview({
      element: $('#waypoint3')[0],
      enter: function(direction) {
        if (direction === 'down') {
          addXAxis();
          addSeries(dataRace);
        }
      },
      exit: function(direction) {
        if (direction === 'up') {
          addBars(dataRace);
          removeSeries();
          removeXAxis();
        }
      }
    });
  });

});
