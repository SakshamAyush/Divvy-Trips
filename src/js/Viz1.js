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

    let stationContent = {}
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
        if(stationContent.hasOwnProperty(data[i].from_station_name))
        {
            stationContent[data[i].from_station_name].trip_data.push(data[i].start_time)
            stationContent[data[i].from_station_name].trip_time.push(data[i].tripduration)
        }
        if(!(stationContent.hasOwnProperty(data[i].from_station_name)))
        {
            stationContent[data[i].from_station_name] = {trip_data:[], trip_time:[]}
            stationContent[data[i].from_station_name].trip_data.push(data[i].start_time)
            stationContent[data[i].from_station_name].trip_time.push(data[i].tripduration)
        }

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

    let linesvgtext = d3.select("#linechart")

    linesvgtext.append("text")
        .attr("class", "title")
        .attr("text-anchor", "end")
        .attr("x", 550)
        .attr("y", 280)
        .attr("font-family", "sans-serif")
        .attr("font-size","20")
        .text("Click on month to get week-day distribution");

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
          .text("Count of trips");

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
          .attr('fill', "#0197ae")
          .on("click",function(d,i){
            barsvg.selectAll("rect").attr("fill","#0197ae")
            d3.select(this).attr("fill","#232323e8")
            linechart(monthData[monthName.indexOf(i.Month)],monthName.indexOf(i.Month))
          });


    createmap(stationData);
    createmap2(stationData,stationContent);

}
vizbar()

function createmap(stationData){
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

    let geoLayer = L.geoJson(geoData, {
        pointToLayer: function (feature, latlng) {
          var marker = {}
          if((feature.properties.dpcapacity)>25)
          {
            marker = {
              radius: 6,
              fillColor: "#0bb3cd",
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
      let map2 = L.map('map2').setView([41.90, -87.68], 11); // Chicago origins
        let osmLayer = L.tileLayer( // 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png')
    'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, &copy; <a href=\"http://cartodb.com/attributions\">CartoDB</a>',
    detectRetina: false,
    noWrap: false,
    subdomains: 'abc'
  }).addTo(map2);

  map2.scrollWheelZoom.disable();

  let geoLayer2 = L.geoJson(geoData, {
    pointToLayer: function (feature, latlng) {
      var marker = {}
      if((feature.properties.trip_count)>=30000)
        {
           marker = {
              radius: 11,
              fillColor: "#0E5A65",
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
              fillColor: "#147E8E",
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
              fillColor: "#00D9FA",
              color: "black",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            };
        }
        if((feature.properties.trip_count)<10000 && (feature.properties.trip_count)>5000)
        {
             marker = {
              radius: 5,
              fillColor: "#63EAFF",
              color: "black",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            };
        }
        if((feature.properties.trip_count)<5000)
        {
           marker = {
              radius: 5,
              fillColor: "#EAFCFF",
              color: "black",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            };
        }
        if((feature.properties.trip_count)==0)
        {
           marker = {
              radius: 0,
              opacity:0
            };
        }
    return L.circleMarker(latlng, marker);
  },
    onEachFeature: function (feature, layer) {
      const data = feature.properties;
      if((feature.properties.trip_count)!=0)
      {
        layer.bindTooltip(`<b>Station Name:</b> ${data.name} <br />
        <b>Trips Taken:</b> ${data.trip_count}`, {sticky: true});
      }

    }
  });  

  map2.addLayer(geoLayer2);
}

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
          .text("Week Day");

    linesvg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -220)
        .attr("y", 30)
        .attr("transform", "rotate(-90)")
        .attr("font-family", "sans-serif")
        .text("Count of trips");

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
      .attr("stroke", "#00a4bd")
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

  function createmap2(stationData,stationContent){

    let hoursvgtext = d3.select("#hourdata")

    hoursvgtext.append("text")
        .attr("class", "title")
        .attr("text-anchor", "end")
        .attr("x", 510)
        .attr("y", 210)
        .attr("font-family", "sans-serif")
        .attr("font-size","17")
        .text("Click on station to get hour distribution");

    let tripsvgtext = d3.select("#tripdur")

    tripsvgtext.append("text")
            .attr("class", "title")
            .attr("text-anchor", "end")
            .attr("x", 530)
            .attr("y", 210)
            .attr("font-family", "sans-serif")
            .attr("font-size","17")
            .text("Click on station to get trip duration distribution");

    let map3 = L.map('map3').setView([41.85, -87.68], 12); // Chicago origins
    L.tileLayer( // 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png')
      'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, &copy; <a href=\"http://cartodb.com/attributions\">CartoDB</a>',
      detectRetina: false,
      noWrap: false,
      subdomains: 'abc'
    }).addTo(map3);

    map3.scrollWheelZoom.disable();

    let geoData = getGeoDataPoints(stationData)

    let geoLayer = L.geoJson(geoData, {
        pointToLayer: function (feature, latlng) {
          var marker = {}
          if((feature.properties.trip_count)==0)
          {
             marker = {
                radius: 0,
                opacity:0
              };
          }
          else
          {
            marker = {
                radius: 5,
                fillColor: "#0bb3cd",
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
            <b>Trips Taken:</b> ${data.trip_count}`, {sticky: true});
        }
      });  
    
      map3.addLayer(geoLayer);

      geoLayer.on("click", function (event) {
        var clickedMarker = event.layer;
        d3.selectAll("#hourdata > *").remove();
        d3.selectAll("#tripdur > *").remove();
        hourbar(stationContent[clickedMarker.feature.properties.name],clickedMarker.feature.properties.name)
        tripbar(stationContent[clickedMarker.feature.properties.name],clickedMarker.feature.properties.name)
    });



  }

function hourbar(stationContent,stationName)
{
    let hourval = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
    let hourcount =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    for(let i=0;i<stationContent.trip_data.length;i++)
    {
        let date = stationContent.trip_data[i];
        let hour = new Date(date).getHours()
        hourcount[hour] = hourcount[hour]+1
    }
    let values=[]
    let max = -1
    for(let i=0;i<24;i++)
    {
        if(hourcount[i]>max)
        {
            max=hourcount[i]
        }
        let temp = {"Hour": i, "Value":hourcount[i]}
        values.push(temp)
    }

    let hoursvg = d3.select("#hourdata")
    d3.selectAll("#hourdata > *").remove();

    let hourwidth = 680;
    let hourheight = 350
    const margin = { left: 60, top: 20, right: 0, bottom: 32 }
    let xScale = d3.scaleBand()
                   .padding(0.1)
                   .range([margin.left, hourwidth - margin.right])
                   .domain(hourval)

    
    hoursvg.append('g').call(d3.axisBottom(xScale)).attr('transform', `translate(0,${hourheight - margin.bottom})`)

    let yScale = d3.scaleLinear()
                   .range([hourheight - margin.bottom, margin.top])
                   .domain([0,max+(Math.round(10/100 * max))])

    hoursvg.append('g').call(d3.axisLeft(yScale)).attr('transform', `translate(${margin.left},0)`)

    hoursvg.append("text")
       .attr("class", "x label")
       .attr("text-anchor", "middle")
       .attr("x", hourwidth-280)
       .attr("y", hourheight)
       .attr("font-family", "sans-serif")
       .text("Hour of the day (for station: "+stationName+" )");

    hoursvg.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("x", -125)
          .attr("y", 18)
          .attr("transform", "rotate(-90)")
          .attr("font-family", "sans-serif")
          .text("Count of trips");

    hoursvg.selectAll('rect')
          .data(values)
          .enter()
          .append('rect')
          .attr('x', d => xScale(d.Hour))
          .attr('y', d => yScale(d.Value))
          .attr('height', d => yScale(0) - yScale(d.Value))
          .attr('width', xScale.bandwidth())
          .attr('fill', "#0197ae");
}

function tripbar(stationContent,stationName)
{
    let brackets = ["<5 Minutes","5-10 Minutes","10-15 Minutes","15-30 Minutes","30-60 Minutes","60-120 Minutes",">120 Minutes"]
    let bracketsval = [0,0,0,0,0,0,0]

    for(let i=0;i<stationContent.trip_time.length;i++)
    {
        stationContent.trip_time[i] = Math.round(stationContent.trip_time[i]/60)
        if(stationContent.trip_time[i]<=5)
        {
            bracketsval[0] = bracketsval[0]+1
        }
        if(stationContent.trip_time[i]<=10 && stationContent.trip_time[i]>5)
        {
            bracketsval[1] = bracketsval[1]+1
        }
        if(stationContent.trip_time[i]<=15 && stationContent.trip_time[i]>10)
        {
            bracketsval[2] = bracketsval[2]+1
        }
        if(stationContent.trip_time[i]<=30 && stationContent.trip_time[i]>15)
        {
            bracketsval[3] = bracketsval[3]+1
        }
        if(stationContent.trip_time[i]<=60 && stationContent.trip_time[i]>30)
        {
            bracketsval[4] = bracketsval[4]+1
        }
        if(stationContent.trip_time[i]<=120 && stationContent.trip_time[i]>60)
        {
            bracketsval[5] = bracketsval[5]+1
        }
        if(stationContent.trip_time[i]>120)
        {
            bracketsval[6] = bracketsval[6]+1
        }
    }
    let values=[]
    let max = -1
    for(let i=0;i<7;i++)
    {
        if(bracketsval[i]>max)
        {
            max=bracketsval[i]
        }
        let temp = {"Bracket": brackets[i], "Value":bracketsval[i]}
        values.push(temp)
    }

    let tripsvg = d3.select("#tripdur")
    d3.selectAll("#tripdur > *").remove();

    let tripwidth = 680;
    let tripheight = 350
    const margin = { left: 60, top: 20, right: 0, bottom: 35 }
    let xScale = d3.scaleBand()
                   .padding(0.1)
                   .range([margin.left, tripwidth - margin.right])
                   .domain(brackets)

    
    tripsvg.append('g').call(d3.axisBottom(xScale)).attr('transform', `translate(0,${tripheight - margin.bottom})`)

    let yScale = d3.scaleLinear()
                   .range([tripheight - margin.bottom, margin.top])
                   .domain([0,max+(Math.round(10/100 * max))])

    tripsvg.append('g').call(d3.axisLeft(yScale)).attr('transform', `translate(${margin.left},0)`)

    tripsvg.append("text")
       .attr("class", "x label")
       .attr("text-anchor", "middle")
       .attr("x", tripwidth-280)
       .attr("y", tripheight)
       .attr("font-family", "sans-serif")
       .text("Trip durations (for station: "+stationName+" )");

    tripsvg.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("x", -125)
          .attr("y", 18)
          .attr("transform", "rotate(-90)")
          .attr("font-family", "sans-serif")
          .text("Count of trips");

    tripsvg.selectAll('rect')
          .data(values)
          .enter()
          .append('rect')
          .attr('x', d => xScale(d.Bracket))
          .attr('y', d => yScale(d.Value))
          .attr('height', d => yScale(0) - yScale(d.Value))
          .attr('width', xScale.bandwidth())
          .attr('fill', "#0197ae");
}
  