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
