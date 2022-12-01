parseData = async () => {

    let divvy = await d3.csv("Data/Divvy_2019_Viz2_Sample.csv");
    //multiLink();
    const scatter = brushableScatterplot();
    const bar = barChart();
    //console.log(scatter)
    
    d3.select(scatter).on('input', () => {
      bar.update(scatter.value);
    });
    bar.update(scatter.value);
  
};

function brushableScatterplot(){

  let margin = ({top: 10, right: 70, bottom: 50, left: 75});
  let width = 810;
  let height = 650;

  const initialValue = divvy;

  let partOfDay = Array.from(new Set(divvy.map(d => d.Part_of_day)));
        
  let partColor = d3.scaleOrdinal().domain(partOfDay).range(d3.schemeCategory10);
          
  const svg = d3.select('#scatter')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .property('value', initialValue);
          
  let xScale = d3.scaleLinear()
                  .domain(d3.extent(divvy, function(d) {return d.age;}))
                  .range([margin.left, width - margin.right])
        
  let yScale = d3.scaleLinear()
                  .domain(d3.extent(divvy, function(d) {return d.tripduration;}))
                  .range([height - margin.bottom, margin.top])
        
  svg.append('g')
      .call(d3.axisBottom(xScale))
      .attr('transform', `translate(0,${height - margin.bottom})`)
          
  svg.append('g')
      .call(d3.axisLeft(yScale))
      .attr('transform', `translate(${margin.left},0)`)
        
  // draw points
  let dots = svg.selectAll('circle')
                .data(divvy.filter(d => d.Part_of_day))
                .join('circle')
                .attr('cx', d => xScale(d.age))
                .attr('cy', d => yScale(d.tripduration))
                .attr('fill', d =>  partColor(d.Part_of_day))
                .attr('opacity', 1)
                .attr('r', 3);
        
  svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width/2)
      .attr("y", height - 6)
      .text("Age");
        
  svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("x", -200 )
      .attr("y", 20)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Trip Duration");


  const brush = d3.brush()
    .extent([[0, 0], [width, height]])
    .on('brush', onBrush)
    .on('end', onEnd);

  svg.append('g')
      .call(brush);
          
  function onBrush(event) {
    const [[x1, y1], [x2, y2]] = event.selection;

    function isBrushed(d) {
      const cx = xScale(d.age);
      const cy = yScale(d.tripduration)
      return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2;
    } 
        
    dots.attr('fill', d => isBrushed(d) ? partColor(d.Part_of_day) : 'gray');

    svg.property('value', divvy.filter(isBrushed)).dispatch('input');
  }
        
  function onEnd(event) {
    if (event.selection === null) {
      dots.attr('fill', d => partColor(d.Part_of_day));
      svg.property('value', initialValue).dispatch('input');
    }
  }
  return svg.node();
};



function barChart(){

  const margin = {top: 10, right: 20, bottom: 50, left: 50};
  
  const width = 450;
  const height = 300;

  const initialValue = divvy;

  let partOfDay = Array.from(new Set(divvy.map(d => d.Part_of_day)));
  let partColor = d3.scaleOrdinal().domain(partOfDay).range(d3.schemeCategory10);
  
  const svg = d3.select('#scatterbar').property('value', initialValue);

  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const x = d3.scaleLinear()
      .range([0, width]);
  
  const y = d3.scaleBand()
      .domain(partColor.domain())
      .range([0, height])
      .padding(0.2);
  
  const xAxis = d3.axisBottom(x).tickSizeOuter(0);
  
  const xAxisGroup = g.append("g")
      .attr("transform", `translate(0, ${height})`);
  
  xAxisGroup.append("text")
      .attr("x", 200)
      .attr("y", 40)
      .attr("fill", "black")
      .attr("font_size",12)
      .attr("text-anchor", "middle")
      .text("Count");
  
  const yAxis = d3.axisLeft(y);
  
  const yAxisGroup = g.append("g")
      .call(yAxis)
      .call(g => g.select(".domain").remove());
    
  let barsGroup = g.append("g");

  function update(data) {
    const partOfDayCounts = d3.rollup(
      data,
      group => group.length,
      d => d.Part_of_day
    );

    // update x scale
    x.domain([0, d3.max(partOfDayCounts.values())]).nice()


    const t = svg.transition()
        .ease(d3.easeLinear)
        .duration(200);

    xAxisGroup
      .transition(t)
      .call(xAxis);
    
    barsGroup.selectAll("rect")
      .data(partOfDayCounts, ([Part_of_day, count]) => Part_of_day)
      .join("rect")
        .attr("fill", ([Part_of_day, count]) => partColor(Part_of_day))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("y", ([Part_of_day, count]) => y(Part_of_day))
      .transition(t)
        .attr("width", ([Part_of_day, count]) => x(count))
  }
  
  return Object.assign(svg.node(), { update });;

};

window.onload = parseData();
