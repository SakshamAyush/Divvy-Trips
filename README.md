# Project - 3 (CS 424)

## Introduction 

![divvy-logo](https://user-images.githubusercontent.com/42165851/193394487-ada998fc-02f8-4624-b3bd-49db0e392eb4.png)

Divvy Bikes are a popular source of commute for the people of Chicago. A divvy station can be found every couple of blocks, and really helps in covering distances in a busy city like Chicago. This dataset interested us because being students, we use Divvy quite often. Whether it be going to classes or commuting to work, the bus and train times do not always fall in our schedule, and we might have to wait 10-20 minutes for the next source of commute to arrive, that's where Divvy bikes really help us in covering shorter distances. We were really intrigued to dive more into the Divvy Bike Trips and see what interesting things we could find out by looking at the data in depth and combing through it to find trends and popular stations and other important insights like that.

We chose the [Divvy’s Trip Dataset](https://ride.divvybikes.com/system-data) for the year of 2019. The csv files we used were:

  1. Divvy_Trips_2019_Q1.csv - The csv file included the ride history of customers for the months of January, February and March of 2019.
  2. Divvy_Trips_2019_Q2.csv - The csv file included the ride history of customers for the months of April, May and June of 2019.
  3. Divvy_Trips_2019_Q3.csv - The csv file included the ride history of customers for the months of July, August and September of 2019.
  4. Divvy_Trips_2019_Q4.csv - The csv file included the ride history of customers for the months of October, November and December of 2019.
  5. Divvy_Trips_2017_Q1Q2 - The csv included the latitude and longitude as well as the Divvy station capacity of Divvy Stations throughout Chicago.

## Website Interface


## Dataset Description

Initially we combined the dataset of all the four quarters into a single CSV file. After combining them all, the dataset had the following attributes:

  1. 'trip_id' : unique identifier for the trips taken.
  2. 'start_time' : start time of the trip in the following format: “MM/DD/YYYY HH:MM:SS”.
  3. 'end_time' : end time of the trip in the following format: “MM/DD/YYYY HH:MM:SS”.
  4. 'bikeid' : unique identifier for each Divvy bike.
  5. 'tripduration' : the duration of the trip taken in seconds.
  6. 'from_station_id' : unique identifier of the station from where the trip was started.
  7. 'from_station_name' : name of the station from which the trip was started.
  8. 'to_station_name' : name of the station at which the trip ended.
  9. 'usertype' : the information of the customer type.
  10. 'gender' : the gender of the customer.
  11. 'birthyear' : the year of birth of the customer.

The data frame contained 3,818,004 rows and 12 attributes(columns). There were no duplicate values in the data frame however, the data frame has some null values for the columns: gender and birthyear(probably because the customer refused to share that information). 
The datatype of the columns of the dataframe were:

  1. Trip_id - int64
  2. Start_time - object
  3. End_time - object
  4. Bikeid - int64
  5. Tripduration - object
  6. From_station_id - int64
  7. From_station_name - object
  8. To_station_name - object
  9. Usertype - object
  10. Gender - object
  11. Birthyear - object

The dataset containing the Divvy Stations information had the following attributes:
  
  1. 'id' : unique identifier for each Divvy station.
  2. 'name' : name of that particular Divvy station.
  3. 'city' : name of the city for that Divvy station.
  4. 'latitude' : latitude for the particular Divvy station.
  5. 'longitude' : longitude for the particular Divvy station.
  6. 'dpcapacity' : capacity of the Divvy Station.
  7. 'online_date' : date on which the Divvy station went live.

## Data Questions, Findings and Conclusion

### Question 1
Is the divvy trip duration longer for a certain age group of people as compared to other groups? In which part of the day is the most amount of rides taken?

#### Hypothesis
We made the following hypothesis:
  - Older people would generally take shorter rides as compared to younger people.
  - More number of rides would be taken in the evening period by younger people.
  
#### Visualization

The tripduration of the rides were initially in seconds, we convetrted it to minutes. We then extracted a new column called ‘hour’ from the start_time attribute to find the hour of the day in which the divvy ride was started.
Then we divided the hour attribute into 4 categories [morning, afternoon, evening, night] to find out in which part of the day the ride was taken. The categories were:
  1. Morning - Ride started between 5am to 11am
  2. Afternoon -  Ride started between 12pm to 5pm
  3. Evening - Ride started between 6pm to 10pm
  4. Night - Ride started between 11pm to 4am
  
We then made a multi-linked view of Brushable Scatterplot of Age V/S Trip Duration for all the rides and it was linked to a horizontal bar chart which showed the count of the total trips that was taken in the 4 parts of the day[morning, afternoon, evening, night].

Some outliers like ‘age’= 238 and ‘tripduartion’ = 96,850 were also removed.

![scatter1](https://user-images.githubusercontent.com/42165851/205424424-c5688d05-312a-44e2-9d03-c10b3039e0fd.png)

![bar1](https://user-images.githubusercontent.com/42165851/205424429-e7afe2c7-29b0-44fd-8081-2a215dcf9456.png)


The brush will select the scatter points and the bar chart will show the data for the selected points.

Inorder to increase the speed of interactive visualizations we sampled the dataset. The initial distribution of the part of the day attribute were:
  1. Morning - 32.81%
  2. Afternoon -  43.37%
  3. Evening - 21.41%
  4. Night - 2.41%

The same distribution was followed after sampling down the from 3.2million values to around 100,000 values.

##### Divvy Ride duration for each age by which part of the day the ride was taken in.

![mlbsp](https://user-images.githubusercontent.com/42165851/205424490-ef1e7697-8df7-47fe-ba15-4dfa2116f82c.png)

#### Conclusion 
  - The first hypothesis was true, as more rides were taken by people between 0-50 years of age.
  - The second hypothesis was incorrect as more rides were started in the afternoon period i.e, from 12pm to 5pm. This might be because younger people usually go out for ‘coffee breaks’ in between work or they’re commuting back from college after finishing their classes.
  
### Question 2
Which months have the most Divvy bike trips? Are the trips more during the weekend?

#### Hypothesis
We made the following hypothesis:
  - More bike trips taken during the summer, because people are out more and also because snow makes it hard to ride a bike.
  - More bike trips during the weekend, as people tend to go on bike rides in their free time.

#### Visualization
To find answers to both the questions, we decided to make a single Visualization that give insights in both the questions asked. To achieve this, we created a linked visualization, where one viz gives us the number of rides taken in a month, this is shown in the form of a bar chart. The other viz is a line chart showing the number of rides takes on each day of the week. Both the visualizations are linked, and by clicking on a month from the bar chart, will update the line chart for that particular month.

<img width="1192" alt="Screen Shot 2022-11-01 at 8 07 42 AM" src="https://user-images.githubusercontent.com/42735975/200083927-a9274154-2037-425d-9cb0-3e6b96a660cf.png">

<img width="1192" alt="image" src="https://user-images.githubusercontent.com/42735975/200084101-78610804-0188-4ba4-8d12-fe20647ba1d1.png">

#### Conclusion
  - Our initial hypothesis was correct as more bike trips were during the summer months.
  - Our second hypothesis was incorrect because there is a dip in bike rides during the weekend for every month, which leads us to believe that people prefer Divvy bikes for commute to school or work over casual biking.

### Question 3
Which area in Chicago have Divvy Stations with most capacity? Which Divvy Stations have the maximum trips taken from them?

#### Hypothesis
We made the following hypothesis:
  - The Divvy stations around Downtown Chicago would have the most capacity along with the most trips taken from them, since most offices and tourist attractions are situated in Downtown Chicago.
  
#### Visualization
We thought the best way to answer these questions would be through a geographical map. Since both questions relate to the Divvy Stations and there are 400 of them, visualizing them through any other plot, would reuslt in a clustered visualization where it would be hard to get any kind of insights. Unlike Question 2, we did not make a linked Visualization, instead we tried to answer each part of the quetion with a different visualization.

  - Visualization 1: To get the Divvy stations with the maximum capacity, we decided to plot every single Divvy station of Chicago on a map. The average capacity of a Divvy Station is 18, so in order to get the Divvy Stations with more than average capacities, we decide to color code them in a different color. Hence, any Divvy Station with capacity of more than 25, appear as yellow markers on the map, while the rest appear as black. The map is also freely explorable for the user, and on hovering on a Divvy station, the user can get it's name and the capacity it has.
  
 <img width="507" alt="Screenshot 2022-11-04 at 5 42 49 PM" src="https://user-images.githubusercontent.com/42735975/200086724-4ee6d105-20c6-4270-bda2-8757d526476c.png">  <img width="500" align='top' alt="Screenshot 2022-11-04 at 5 43 25 PM" src="https://user-images.githubusercontent.com/42735975/200086743-462ebbf3-394e-4408-9f03-fba7986fc355.png">

  - Visualization 2: We took a similar approach for this visualization as we did for the previous one. We caluclated the trips taken from each Divvy Station and color coded them. To stress on the stations that had the most trips taken from them (greater than 10,000), we slightly increased the radius of the markers of those Divvy Stations. The map is also freely explorable for the user, and on hovering on a Divvy station, the user can get it's name and the trips taken from that particular Divvy Station.

<img width="507" alt="image" src="https://user-images.githubusercontent.com/42735975/200087618-05a7e171-0921-475c-bc21-d54534bb7b8c.png">  <img width="500" align='top' alt="image" src="https://user-images.githubusercontent.com/42735975/200087679-7a5699ab-4313-4c88-9995-4039b251fd2a.png">

#### Conclusion
  - Our hypothesis was correct, Downtown Chicago has the majority Divvy Stations with high capacity, and the most trips were made from here as well.
  - Field Museum has the highest station capacity of all the Divvy Stations in Chicago, with a capacity of 51.
  - Navy Pier (Streeter Drive & Grand Ave) Divvy Station has the most number of trips taken.
