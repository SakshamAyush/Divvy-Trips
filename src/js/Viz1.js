vizbar = async () =>{
    let data = await d3.csv("../Divvy_2019.csv");

    let monthData = {0:{0:0,1:0,2:0,3:0,4:0,5:0,6:0},
                     1:{0:0,1:0,2:0,3:0,4:0,5:0,6:0},
                     2:{0:0,1:0,2:0,3:0,4:0,5:0,6:0},
                     3:{0:0,1:0,2:0,3:0,4:0,5:0,6:0},
                     4:{0:0,1:0,2:0,3:0,4:0,5:0,6:0},
                     5:{0:0,1:0,2:0,3:0,4:0,5:0,6:0},
                     6:{0:0,1:0,2:0,3:0,4:0,5:0,6:0},
                     7:{0:0,1:0,2:0,3:0,4:0,5:0,6:0},
                     8:{0:0,1:0,2:0,3:0,4:0,5:0,6:0},
                     9:{0:0,1:0,2:0,3:0,4:0,5:0,6:0},
                     10:{0:0,1:0,2:0,3:0,4:0,5:0,6:0},
                     11:{0:0,1:0,2:0,3:0,4:0,5:0,6:0}};
    for(let i=0;i<data.length;i++)
    {
        let date = data[i].start_time;
        let month = new Date(date).getMonth()
        let day = new Date(date).getDay()
        monthData[month][day] = monthData[month][day] + 1;
    }

    let barsvg = d3.select("#barchart")
    let monthName =["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"]
    let monthCount = [0,0,0,0,0,0,0,0,0,0,0,0]
    let monthValues = []
    let monthmax = 0
    for(let i=0;i<12;i++)
    {
        let sum=0
        for(let j=0;j<7;j++)
        {
            sum = sum+monthData[i][j]
            if(sum>monthmax)
            {
                monthmax = sum
            }
        }
        let temp = {"Month": monthName[i], "Value":sum}
        monthValues.push(temp)
    }
    let barwidth = 700;
    let barheight = 550
    const margin = { left: 70, top: 10, right: 30, bottom: 50 }
    let xScale = d3.scaleBand()
                   .padding(0.1)
                   .range([margin.left, barwidth - margin.right])
                   .domain(monthName)

    barsvg.append('g').call(d3.axisBottom(xScale)).attr('transform', `translate(0,${barheight - margin.bottom})`)

    let yScale = d3.scaleLinear()
                   .range([barheight - margin.bottom, margin.top])
                   .domain([0,monthmax+10000])

    barsvg.append('g').call(d3.axisLeft(yScale)).attr('transform', `translate(${margin.left},0)`)

    barsvg.selectAll('rect')
    .data(monthValues)
    .enter()
    .append('rect')
      .attr('x', d => xScale(d.Month))
      .attr('y', d => yScale(d.Value))
      .attr('height', d => yScale(0) - yScale(d.Value))
      .attr('width', xScale.bandwidth())
      .attr('fill', "blue");

}
vizbar()