
var d3 = require('d3');

module.exports = function createChart() {
  var width = 1000;
  var height = 200;
  var g = null;
  var data = [];

  var fill = '#878787';
  var active = 'white';

  var margin = {top:10, bottom:10, left:10, right:80};


  var xScale = d3.scale.ordinal();

  var fScale = d3.scale.pow().exponent(0.5)
    .domain([0, 100]).range([30, 5]).clamp(true);


  var restScale = d3.scale.linear().range([5, 10])


  var chart = function(selection) {
    selection.each(function(rawData) {

      console.log(rawData);

      data = rawData.filter((d,i) => i < 100);

      data = data.sort((a,b) => d3.ascending(a.name, b.name));

      var svg = d3.select(this).append('svg')
      svg.attr("width", width + margin.left + margin.right);
      svg.attr("height", height + margin.top + margin.bottom);

      g = svg.append('g')
        .attr('transform', 'translate('+margin.left+','+margin.top+')')

      // g = svg.select("g");

      xScale.domain(data.map((d) => d.name))
        .rangeBands([0, width]);

      restScale.domain(d3.extent(data, (d) => d.count));

      update();
      // d3.select('body').on('mousemove', mousemove);
    });
  };

  function update() {
    var techG = g.selectAll(".tech")
      .data(data);

    var techE = techG.enter()
      .append('rect')
      .attr('x', (d) => xScale(d.name) - 5)
      .attr('y', height / 2 - 30)
      .attr('width', 10)
      .attr('height', 60)
      .attr('fill', fill)
      .attr('opacity', '0.0')
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)

    var techE = techG.enter()
      .append('circle')
      .attr('cx', (d) => xScale(d.name))
      .attr('cy', height / 2)
      .attr('r', 5)
      .attr('fill', '#878787')
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)


    // var techE = techG.enter()
    //   .append("tr")
    //   .attr("class", "tech")
    //   .style('font-size', (d) => fScale(999) + 'px')
    //   .append("td")
    //   .text((d) => d.name)
    //   .style('font-family', 'Avenir')
    //   .style('color', '#F4F1F1')
    //   .on('click', click)
      // .style('background-color', 'steelblue')

      // .attr('transform', (d) => 'translate('+ 0 +','+ yScale(d.name) + ')')

    // techE.append('td')
      // .attr("fill", "steelblue")
      // .attr("x", 0)
      // .attr("y", d => yScale(d.name))
      // .attr("width", 10)
      // .attr("height", yScale.rangeBand())
      // .on("mouseover", function(d) { d3.select(this).attr("fill", "orange"); })
      // .on("mouseout", function(d) { d3.select(this).attr("fill", "steelblue"); });

    // techE.append('text')
    //   .attr('dx', 5)
    //   .attr('dy', (yScale.rangeBand() / 2))
    //   .style('font-size', 5)
    //   .attr('pointer-events', 'none')
    //   .attr("x", 0)
    //   .attr("y", d => yScale(d.name))
    //   .text((d) => d.name)
    // mousemove();
  }

  function mouseover(d,i) {

    g.selectAll('circle')
      .attr('fill', (e,j) => (j === i) ? active : fill)

    g.append('text').classed('textover', true)
      .text(d.name)
      .attr('x', xScale(d.name))
      .attr('dx', -2)
      .attr('y', (height / 2) - 10)
      .attr('fill', 'white')
      .style('font-family', 'Avenir')
      .attr('pointer-events', 'none')
      .style('font-size', '18px')
    var t = d3.select('.textover')
    var bbox = t.node().getBBox();
    if((bbox.x + bbox.width) > width) {
      t.attr('text-anchor', 'end')
    }
    // console.log(bbox)

  }

  function mouseout(d,i) {
    d3.select('.textover').remove()

    g.selectAll('circle')
      .attr('fill', fill)
  }

  function click(d,i) {
    d.clicked = d.clicked ? false : true;
    d3.select(this)
      .style('color', d.clicked ? 'orange' : '#F4F1F1' )
  }

  function mousemove() {
    // var e = d3.event;

    var c = d3.mouse(d3.select('body').node());

    var scrollY = window.scrollY;

    if(c[0] > 300) { c[1] = 99999; }

    var tS = table.selectAll('.tech')
      .each(function(d, i) {


        var box = d3.select(this).node().getBoundingClientRect();

        // if(i === 0) {
        //   console.log(box)
        // }
        var y = (box.top + (box.height / 2) + scrollY);
        var dist = Math.abs(y - c[1]);
        d.dist = dist;
        var f = fScale(d.dist);
        f = f < 2.1 ? restScale(d.count) : f;
        f = d.clicked ? Math.max(14,f) : f;
        d.font = f;

        // d.w = wScale(dist);
        // d.h = hScale(dist);
        // d.y = dy > 0 ? y + (d.h / 2) : y - (d.h / 2) ;

      })
      .style('font-size', (d) => d.font + 'px')
      // tS.select('rect')
      //   .attr('y', (d) => d.y)
      //   .attr('width', (d) => d.w)
      //   .attr('height', (d) => d.h);

      // tS.select('td')
        // .attr('y', (d) => d.y)
        // .attr('dy', (d) => d.h / 2)

    // console.log(c);
  }

  return chart;
};
