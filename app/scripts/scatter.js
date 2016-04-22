/* global $, d3, CONFIG */

import './includes/chosen.jquery.js';

var margin = {top: 10, right: 10, bottom: 40, left: 40},
    width = parseInt(d3.select('.chart__container--scatter').style('width'), 10) - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
    
//   // setup x 
var xScale = d3.scale.linear().range([0, width]), // value -> display
    xAxis = d3.svg.axis().scale(xScale).orient('bottom');

// setup y
var yScale = d3.scale.linear().range([height, 0]), // value -> display
    yAxis = d3.svg.axis().scale(yScale).orient('left');

// add the tooltip area to the webpage
var tooltip = d3.select('.tooltip-container').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

d3.csv(CONFIG.projectPath + 'assets/data/feeder100.csv', function(error, data) {
  data = data.map( function (d) {
    return { 
      id: d.HSCode,
      name: d.Name,
      metro: d.Metro_Area,
      city: d.City,
      seniorcount: d.twelfthcount,
      schoolcount: d.allstudentscount,
      enrolledpct: d.enrolled2015PctSeniors,
      minority: d.BlackHispMulti,
      white: d.WhiteOther,
      atrisk: d.atRiskPct,
      ecodis: d.ecoDisPct,
      collegeready: d.collegeReadyBothPct,
      avgsat: d.avgSAT,
      avgact: d.avgACT,
      admitted: d.Admitted2015,
      enrolled: d.Enrolled2015,
      color: d.Color
    };
  });

  var count = data.length;

  $.each(data, function(d, i) { 

    if (i.metro === 'Austin-Round Rock') {
      $('#austin-group').append($('<option></option>')
        .attr('value', i.id)
        .text(i.name + ' (' + i.city + ')'));
    } else if (i.metro === 'Dallas-Fort Worth-Arlington') {
      $('#dallas-group').append($('<option></option>')
        .attr('value', i.id)
        .text(i.name + ' (' + i.city + ')'));
    } else if (i.metro === 'Houston-The Woodlands-Sugar Land') {
      $('#houston-group').append($('<option></option>')
        .attr('value', i.id)
        .text(i.name + ' (' + i.city + ')'));
    } else if (i.metro === 'San Antonio-New Braunfels') {
      $('#sanantonio-group').append($('<option></option>')
        .attr('value', i.id)
        .text(i.name + ' (' + i.city + ')'));
    } else {
      $('#other-group')
        .append($('<option></option>')
          .attr('value', i.id)
          .text(i.name + ' (' + i.city + ')')); 
    }

    if (!--count) {
      $('#chosen-select').chosen({
        allow_single_deselect: true // not working
      });
    }
  });

});

var charts = ['ecoDis', 'collegeReady'];

charts.forEach(function(chart, index) {

  // Build SVG Container
  var svg = d3.select('#' + chart).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('id', chart)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Load Data
  d3.csv(CONFIG.projectPath + 'assets/data/feeder100.csv', function(error, data) {
    // Color assignments
    var color = d3.scale.ordinal().range(['#356D97','#99cc33']);
      
    data = data.map( function (d) {
      return { 
        id: d.HSCode,
        name: d.Name,
        metro: d.Metro_Area,
        city: d.City,
        enrolledpct: d.enrolled2015PctSeniors,
        minority: d.BlackHispMulti,
        white: d.WhiteOther,
        atrisk: d.atRiskPct,
        ecodis: d.ecoDisPct,
        collegeready: d.collegeReadyBothPct,
        avgsat: d.avgSAT,
        avgact: d.avgACT,
        admitted: d.Admitted2015,
        enrolled: d.Enrolled2015,
        color: d.Color,
        seniorcount: d.twelfthcount,
        schoolcount: d.allstudentscount
      };
    });

    var nest = d3.nest().key(function(d) { return d.metro; }).entries(data);

    var austin = $.grep(nest, function(e){ return e.key === 'Austin-Round Rock'; });
    var dallas = $.grep(nest, function(e){ return e.key === 'Dallas-Fort Worth-Arlington'; });
    var houston = $.grep(nest, function(e){ return e.key === 'Houston-The Woodlands-Sugar Land'; });
    var sanantonio = $.grep(nest, function(e){ return e.key === 'San Antonio-New Braunfels'; });

    var austin = austin[0].values,
        dallas = dallas[0].values,
        houston = houston[0].values,
        sanantonio = sanantonio[0].values;

    var yValue, 
        yLabel,
        dataKey;

    dataKey = data;

    if (chart === 'atRisk') {
      yValue = function(d) { return d.atrisk; };
      yLabel = 'At Risk';   
    } else if (chart === 'ecoDis') {   
      yValue = function(d) { return d.ecodis; };
      yLabel = 'Economically Disadvantaged';
    } else if (chart === 'collegeReady') {
      yValue = function(d) { return d.collegeready; };
      yLabel = 'College Ready';
    }

    var xValue = function(d) { return d.enrolledpct;},
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        yMap = function(d) { return yScale(yValue(d));}; // data -> display

    // Call resize() on each chart
    d3.select(window).on('resize.' + chart, resize).transition();

    function dot(data) {
      var dots = svg.selectAll('.dot');
      dots.remove();

      xScale.domain([0, 0.18]);
      yScale.domain([0, 1]);

      // draw dots
      svg.selectAll('.dot')
          .data(data)
          .enter().append('circle')
            .attr('class', 'dot')
            .attr('r', 1.5)
            .attr('cx', xMap)
            .attr('cy', yMap)
            .style('fill', function(d) { return color(d.color); })
            .on('click', function(d) {
              $('#chosen-select').val(d.id);
              $('#chosen-select').trigger('chosen:updated');
              $('#chosen-select').trigger('change');
            })
            .on('mouseover', function(d) {
              if($(window).width() > 480) {
                 $('#chosen-select').val(d.id);
                 $('#chosen-select').trigger('chosen:updated');
                 $('#chosen-select').trigger('change');            
              }     
            });
    }

    // Call resize() on each chart
    d3.select(window).on('resize.' + chart, resize).transition();

    function resize() {
      width = parseInt(d3.select('.chart__container--scatter').style('width'), 10) - margin.left - margin.right;
      d3.select('#' + chart).select('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      xScale.range([0, width]);
      xAxis = d3.svg.axis().scale(xScale).orient('bottom');

      svg.select('.x.axis').remove();
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis
          .scale(xScale)
          .orient('bottom')
          .ticks(10, '%')
          .outerTickSize(0))
        .append('text')
          .attr('class', 'label')
          .attr('x', 0)
          .attr('y', 34)
          .style('text-anchor', 'start')
          .text('Percentage of high school seniors who enrolled at UT-Austin');

      dot(dataKey);
    }  

    yScale.domain([0, 1]);

    // x-axis
    xScale.domain([0, 0.18]);
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis
          .scale(xScale)
          .orient('bottom')
          .ticks(10, '%')
          .outerTickSize(0))
        .append('text')
          .attr('class', 'label')
          .attr('x', 0)
          .attr('y', 34)
          .style('text-anchor', 'start')
          .text('Percentage of high school seniors who enrolled at UT-Austin');

    // y-axis
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis
          .scale(yScale)
          .orient('left')
          .ticks(4, '%')
          .outerTickSize(0));

    dot(dataKey);

    var metroNames = ['data', 'austin', 'dallas', 'houston', 'sanantonio'];

    $.each(metroNames, function() {
      $('#' + this).click(function() {
        var metro = $(this).attr('id');
        if (metro === 'austin') {
          dot(austin);
          dataKey = austin;
        } else if (metro === 'dallas') {
          dot(dallas);
          dataKey = dallas;
        } else if (metro === 'houston') {
          dot(houston);
          dataKey = houston;
        }  else if (metro === 'sanantonio') {
          dot(sanantonio);
          dataKey = sanantonio;
        } else {
          dot(data);
          dataKey = data;
        }
        $('button').removeClass('active');
        $(this).addClass('active');
        resetValues();
      });
    });

    function resetValues() {
      var highlight = svg.selectAll('.highlight');
          highlight.remove();
      $('#chosen-select').val('').trigger('chosen:updated');
      $('#chosen_seniorcount').empty();
      $('#chosen_enrolledpct').empty();
      $('#chosen_seniorsenrolled').empty();
      $('#chosen_ecodis').empty();
      $('#chosen_collegeready').empty();
      $('#chosen_select_chosen').removeClass('White').removeClass('Minority');
      $('.chart__info--box').hide();
    }

    // $('#reset-highlights').click(resetValues);

    function chosenChange(selected) {
      function addCommas(intNum) {
        return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
      }
      var id = selected,
          object = $.grep(data, function(e){ return e.id === id; }),
          majority = object[0].color,
          seniorcount = addCommas(object[0].seniorcount),
          schoolcount = addCommas(object[0].schoolcount),
          enrolled = addCommas(object[0].enrolled),
          enrolledpct = Math.round(object[0].enrolledpct * 100),
          ecodis = Math.round(object[0].ecodis * 100),
          collegeready = Math.round(object[0].collegeready * 100);

      $('.chart__info--box').show();
      $('#chosen_seniorcount').html(seniorcount);
      $('#chosen_schoolcount').html(schoolcount);
      $('#chosen_enrolledpct').html(enrolledpct+ '%');
      $('#chosen_seniorsenrolled').html(enrolled);
      $('#chosen_ecodis').html(ecodis + '%');
      $('#chosen_collegeready').html(collegeready + '%');
      $('#chosen_select_chosen').removeClass('White').removeClass('Minority').addClass(majority);

      var highlight = svg.selectAll('.highlight');
          highlight.remove();

      xMap = function(d) { return xScale(xValue(d));}; 
      xScale.domain([0, 0.18]);
      yScale.domain([0, 1]);

      svg.selectAll('.highlight')
          .data(data)
          .enter().append('circle')
            .attr('class', 'highlight')
            .filter(function(d){ return d.id === id; })        // <== This line
            .style('fill', 'rgb(163, 31, 58)')                            // <== and this one
            .attr('r', 3)
            .attr('cx', xMap)
            .attr('cy', yMap);
    }

    $('#chosen-select').change(function() {
      var selected = $('option:selected').val();
      chosenChange(selected);
    });
  });

});