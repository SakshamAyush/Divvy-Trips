vizbar = async () =>{
    let data = await d3.csv("../Divvy_2019.csv");
    let stationData = await d3.csv("Data/Divvy_Stations_2017_Q1Q2.csv")

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
    for(let i=0; i<stationData.length; i++)
    {
        stationData[i]['trip_count']=0;
        stationData[i].dpcapacity = parseInt(stationData[i].dpcapacity)
    }
    for(let i=0;i<data.length;i++)
    {
        let date = data[i].start_time;
        let month = new Date(date).getMonth()
        let day = new Date(date).getDay()
        monthData[month][day] = monthData[month][day] + 1;
        for(let j=0;j<stationData.length;j++)
        {
            if(stationData[j].name == data[i].from_station_name)
            {
                stationData[j]['trip_count']= stationData[j]['trip_count'] + 1
            }
        }
    }
    console.log(stationData)

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

    let linesvgtext = d3.select("#linechart")

    linesvgtext.append("text")
        .attr("class", "title")
        .attr("text-anchor", "end")
        .attr("x", 550)
        .attr("y", 280)
        .attr("font-family", "sans-serif")
        .attr("font-size","20")
        .text("Click on month to get weekday distribution");

    linesvgtext.append("line")
                .attr("x1", 5)
                .attr("y1", 0)
                .attr("x2", 5)
                .attr("y2", 600)
                .attr("stroke","black")
                .attr("stroke-width","2");

    let barwidth = 709;
    let barheight = 550
    const margin = { left: 80, top: 10, right: 20, bottom: 50 }
    let xScale = d3.scaleBand()
                   .padding(0.1)
                   .range([margin.left, barwidth - margin.right])
                   .domain(monthName)

    barsvg.append('g').call(d3.axisBottom(xScale)).attr('transform', `translate(0,${barheight - margin.bottom})`)

    let yScale = d3.scaleLinear()
                   .range([barheight - margin.bottom, margin.top])
                   .domain([0,monthmax+10000])

    barsvg.append('g').call(d3.axisLeft(yScale)).attr('transform', `translate(${margin.left},0)`)

    barsvg.append("text")
       .attr("class", "x label")
       .attr("text-anchor", "end")
       .attr("x", barwidth-275)
       .attr("y", barheight-10)
       .attr("font-family", "sans-serif")
       .text("Months");

    barsvg.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("x", -220)
          .attr("y", 20)
          .attr("transform", "rotate(-90)")
          .attr("font-family", "sans-serif")
          .text("Count");

    barsvg.append("text")
          .attr("class", "title")
          .attr("text-anchor", "end")
          .attr("x", barwidth-160)
          .attr("y", barheight+30)
          .attr("font-family", "sans-serif")
          .attr("font-size","20")
          .text("Trip distribution for each month");


    barsvg.selectAll('rect')
          .data(monthValues)
          .enter()
          .append('rect')
          .attr('x', d => xScale(d.Month))
          .attr('y', d => yScale(d.Value))
          .attr('height', d => yScale(0) - yScale(d.Value))
          .attr('width', xScale.bandwidth())
          .attr('fill', "#029C8D")
          .on("click",function(d){
            barsvg.selectAll("rect").attr("fill","#029C8D")
            d3.select(this).attr("fill","#232323e8")
            linechart(monthData[monthName.indexOf(d.Month)],monthName.indexOf(d.Month))
          });


    //Map-1
    let map = L.map('map1').setView([41.85, -87.68], 12); // Chicago origins
    L.tileLayer( // 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png')
      'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, &copy; <a href=\"http://cartodb.com/attributions\">CartoDB</a>',
      detectRetina: false,
      noWrap: false,
      subdomains: 'abc'
    }).addTo(map);
  
     map.scrollWheelZoom.disable();

    let geoData = getGeoDataPoints(stationData)
    console.log(geoData)

    let geoLayer = L.geoJson(geoData, {
        pointToLayer: function (feature, latlng) {
          var marker = {}
          if((feature.properties.dpcapacity)>25)
          {
            marker = {
              radius: 6,
              fillColor: "yellow",
              color: "black",
              weight: 1,
              opacity: 1,
              fillOpacity: 1
            };
      
          }
          else 
          {
            marker = {
              radius: 5,
              fillColor: "black",
              color: "black",
              weight: 1,
              opacity: 0.5,
              fillOpacity: 0.5
            };
      
          }
        return L.circleMarker(latlng, marker);
      },
        onEachFeature: function (feature, layer) {
          const data = feature.properties;
          layer.bindTooltip(`<b>Station Name:</b> ${data.name} <br />
            <b>Station Capacity:</b> ${data.dpcapacity}`, {sticky: true});
        }
      });  
    
      map.addLayer(geoLayer);
    
      //Map-2
      let map2 = L.map('map2').setView([41.85, -87.68], 12); // Chicago origins
        let osmLayer = L.tileLayer( // 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png')
    'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, &copy; <a href=\"http://cartodb.com/attributions\">CartoDB</a>',
    detectRetina: false,
    noWrap: false,
    subdomains: 'abc'
  }).addTo(map2);

  let geoLayer2 = L.geoJson(geoData, {
    pointToLayer: function (feature, latlng) {
      var marker = {}
      if((feature.properties.trip_count)>=30000)
        {
           marker = {
              radius: 11,
              fillColor: "#06382B",
              color: "black",
              weight: 1,
              opacity: 0.8,
              fillOpacity: 0.8
            };
        }
      if((feature.properties.trip_count)<30000 && (feature.properties.trip_count)>20000)
        {
          marker = {
              radius: 7,
              fillColor: "#0B6F56",
              color: "black",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            };
        }
      if((feature.properties.trip_count)<20000 && (feature.properties.trip_count)>10000)
        {
             marker = {
              radius: 5,
              fillColor: "#14CC9E",
              color: "black",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            };
        }
   if((feature.properties.trip_count)<10000)
        {
           marker = {
              radius: 5,
              fillColor: "#D1F2EB",
              color: "black",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            };
        }
    return L.circleMarker(latlng, marker);
  },
    onEachFeature: function (feature, layer) {
      const data = feature.properties;
      layer.bindTooltip(`<b>Station Name:</b> ${data.name} <br />
        <b>Trips Taken:</b> ${data.trip_count}`, {sticky: true});
    }
  });  

  map2.addLayer(geoLayer2);

}
vizbar()

function linechart(weekData,month)
{
    let monthName2 =["January","February","March","April","May","June","July","August","September","October","November","December"]
    let dayCount = [0,0,0,0,0,0,0]
    let mon
    let dayName = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"]
    let tempName = dayName
    let weekValues = []
    let weekmax = Number.NEGATIVE_INFINITY;
    let weekmin = Number.POSITIVE_INFINITY;
    for(let i=0;i<7;i++)
    {
        let temp = {"Day": dayName[i], "Value":weekData[i]}
        weekValues.push(temp)
        if(weekmax<weekData[i])
        {
            weekmax = weekData[i]
        }
        if(weekmin>weekData[i])
        {
            weekmin = weekData[i]
        }
    }
    weekValues.push(weekValues.shift());
    tempName.push(tempName.shift());

    let linesvg = d3.select("#linechart")
    d3.selectAll("#linechart > *").remove(); 
    let linewidth = 700;
    let lineheight = 550
    const margin = { left: 90, top: 10, right: 10, bottom: 50 }

    let xScaleLine = d3.scaleBand()
    .padding(1)
    .range([margin.left, linewidth - margin.right])
    .domain(tempName)

    linesvg.append('g').call(d3.axisBottom(xScaleLine)).attr('transform', `translate(0,${lineheight - margin.bottom})`)

    const yScaleLine = d3.scaleLinear()
    .range([lineheight - margin.bottom, margin.top])
    .domain([weekmin-4000,weekmax+1000])

    linesvg.append('g').call(d3.axisLeft(yScaleLine)).attr('transform', `translate(${margin.left},0)`)

    linesvg.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr("x", linewidth-275)
          .attr("y", lineheight-10)
          .attr("font-family", "sans-serif")
          .text("Week Days");

    linesvg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -220)
        .attr("y", 30)
        .attr("transform", "rotate(-90)")
        .attr("font-family", "sans-serif")
        .text("Count");

    linesvg.append("text")
          .attr("class", "title")
          .attr("text-anchor", "end")
          .attr("x", linewidth-130)
          .attr("y", lineheight+30)
          .attr("font-family", "sans-serif")
          .attr("font-size","20")
          .text("Trip distribution for each day for "+monthName2[month]);    

    const line = d3.line()
    .x(d => xScaleLine(d.Day))
    .y(d => yScaleLine(d.Value))

    linesvg.append("path")
      .datum(weekValues)
      .attr("fill", "none")
      .attr("stroke", "#029C8D")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return xScaleLine(d.Day) })
        .y(function(d) { return yScaleLine(d.Value) })
        )

        linesvg.selectAll("circle")
        .data(weekValues)
        .enter()
        .append("circle")
        .attr("cx", function(dd) {return xScaleLine(dd.Day)})
        .attr("cy", function(dd) {return yScaleLine(dd.Value)})
        .attr("r", 5)
        .attr("fill","#232323e8");

        linesvg.append("line")
                .attr("x1", 5)
                .attr("y1", 0)
                .attr("x2", 5)
                .attr("y2", 600)
                .attr("stroke","black")
                .attr("stroke-width","2");

}

function getGeoDataPoints(data) {
    const geoData = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
        }
      },
      features: []
    }
    const features = data.filter(point => (point.longitude && point.latitude)).map(dataPoint => {
      const feature = {
        type: 'Feature',
        properties: dataPoint,
        geometry: {
          type: 'Point',
          coordinates: [dataPoint.longitude, dataPoint.latitude]
        }
      };
      return feature;
    });
    geoData.features = features;
    return geoData;
  }