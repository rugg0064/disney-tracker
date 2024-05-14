import { useEffect, useState, Fragment } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios';
import { AllParks, Park, Ride, Land } from './util/types';
import AllParksDisplay from './parkDisplay';
import {blockedRideNames, fetchDataInterval} from './util/config';

export default function HomePage() {
  const [parkData, setParkData] = useState<AllParks>(null);

  // Returns true if this ride is allowed
  const filterRideFunc = (ride: Ride): Boolean => {
    const inBlockedList = blockedRideNames.indexOf(ride.name) !== -1;
    return !inBlockedList;
  }

  const filterPark = (park: Park): Park => {
    return {
      name: park.name,
      rides: park.rides.filter(filterRideFunc),
      lands: park.lands.map((land) => {
        return {
          name: land.name,
          rides: land.rides.filter(filterRideFunc)
        }
      })
    }
  }

  const filterParkData = (allParks: AllParks): AllParks => {
    return {
      animal_kingdom: filterPark(allParks.animal_kingdom),
      epcot: filterPark(allParks.epcot),
      hollywood_studios: filterPark(allParks.hollywood_studios),
      magic_kingdom: filterPark(allParks.magic_kingdom),
    }
  }

  const fetchData = async () => {
    try {
      const response = await fetch('/api/handleWaitTimes');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      let parks = JSON.parse(result) as AllParks;
      setParkData(filterParkData(parks));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    setInterval(function () {
      console.log("Grab new data");
      fetchData();
    }, 1000 * fetchDataInterval); // 5 minutes
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Loaded new park data:");
    console.log(parkData);
  }, [parkData])

  return (
    <>
      <Head>
        <title>Disney Tracker</title>
      </Head>
      <div className="relative">
        <div id='background' className='fixed top-0 left-0 z-10 bg-gray-200 bg-center bg-no-repeat bg-cover bg- full-vh' style={{ backgroundImage: 'url("/images/background.png")' }}>
          {(parkData == undefined) ?
            <></> : <AllParksDisplay allParks={parkData} />}
        </div>
      </div>
    </>
  )
}
