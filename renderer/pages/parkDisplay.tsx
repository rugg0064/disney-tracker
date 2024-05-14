import React, { useEffect, useState } from 'react';
import { AllParks, Park, Land, Ride } from './util/types';
import Carousel from './Carousel';
import RoundedBoxWithNumber from './roundedBoxWithNumber';
import {parkDisplayInterval} from './util/config';

interface ParkDisplayProps {
    parkData: Park | undefined;
    className?: string;
}

const RideList: React.FC<{ rides: Ride[] }> = ({ rides }) => (
    <ul className='ml-2'>
        {rides.map((ride, index) => (
            <li key={'ride' + index}>
                <RoundedBoxWithNumber number={ride.isOpen ? ride.waitTime : 'X'} text={ride.name} disabled={!ride.isOpen} />
                {/* {ride.name} - {ride.waitTime} */}
            </li>
        ))}
    </ul>
);

const LandComponent: React.FC<{ land: Land }> = ({ land }) => (
    <div>
        <h3 className='font-sans text-lg font-semibold text-center text-gray-950'>{land.name}</h3>
        <RideList rides={land.rides} />
    </div>
)

const LandList: React.FC<{ lands: Land[] }> = ({ lands }) => (
    <div className='ml-2'>
        {lands.map((land, index) => (
            <LandComponent land={land} />
        ))}
    </div>
);

// Manually place and order lands
// Any lands that arent included will be auto sorted and added
const parkSortPriorities = {
    'Animal Kingdom': [
        ['', 'Africa'],
        ['Asia', "Rafiki's Planet Watch"],
        ['Dinoland U.S.A'],
        ['Discovery Island', 'Pandora - The World of Avatar']
    ],
    'Magic Kingdom': [
        [''],
        [],
        [],
        []
    ],
    'Magic Kingdom (cont.)': [
        [''],
        [],
        [],
        []
    ],
    'Hollywood Studios': [
        ['Animation Courtyard', 'Toy Story Land', 'Hollywood Boulevard'],
        ['Commissary Lane', 'Muppet Courtyard', "Star Wars: Galaxy's Edge"],
        ['Echo Lake', 'Pixar Place'],
        ['Sunset Boulevard'],
    ],
    'Epcot': [
        ['World Celebration'],
        ['World Discovery'],
        ['World Nature'],
        ['World Showcase']
    ]
};

const ParkDisplay: React.FC<ParkDisplayProps> = ({ parkData, className }) => {
    console.log(`RENDERING ${parkData}`)
    console.log(parkData)
    // Order visual components

    // Turn all park data into a {landName -> component} mapping to use for fixed order stuff
    const landNameToDataMap = {}
    parkData.lands.forEach(land => {
        landNameToDataMap[land.name] = land
    })

    const landNameToComponentMap = {};
    landNameToComponentMap[''] = <RideList rides={parkData.rides} />
    parkData.lands.forEach(land => {
        landNameToComponentMap[land.name] = <LandComponent land={land} />
    })


    let sizes: number[] = [0, 0, 0, 0]
    let components: React.JSX.Element[][] = [[], [], [], []];

    for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        (parkSortPriorities[parkData.name][columnIndex] as string[]).forEach(landName => {
            console.log(landName)
            if (landName !== '') {
                sizes[columnIndex] += (landNameToDataMap[landName] as Land).rides.length
            } else {
                sizes[columnIndex] += parkData.rides.length
            }
            components[columnIndex].push(landNameToComponentMap[landName] as React.JSX.Element)
            delete landNameToDataMap[landName]
            delete landNameToComponentMap[landName]
        })
    }

    const getSmallestIndex = () => {
        let smallestIndex = 4;
        let smallestCount = -1;
        sizes.forEach((count, index) => {

            if (
                (smallestIndex > 3) ||
                (count < smallestCount)
            ) {
                smallestIndex = index;
                smallestCount = count;
            }
        })
        return smallestIndex;
    }

    for (const landName in landNameToComponentMap) {
        const indexToAdd = getSmallestIndex();
        if (landName !== '') {
            sizes[indexToAdd] += (landNameToDataMap[landName] as Land).rides.length
        } else {
            sizes[indexToAdd] += parkData.rides.length
        }
        components[indexToAdd].push(landNameToComponentMap[landName])
        delete landNameToDataMap[landName]
        delete landNameToComponentMap[landName]
    }

    // parkData.lands.map((landData) => {
    //     console.log("Cycle start state");
    //     console.log(sizes);
    //     console.log(components);
    //     const indexToAdd = getSmallestIndex();
    //     console.log(`picked ${indexToAdd}`)
    //     sizes[indexToAdd] += landData.rides.length;
    //     components[indexToAdd].push(<LandComponent land={landData}/>)
    // });

    return (
        <div className={className + ' transition-opacity delay-1000 bigDelay flex-col flex-shrink-0 w-full overflow-hidden text-sm grow-0 absolute'}>
            <h2 className='p-3 text-5xl text-center disney-font text-gray-950'>{parkData.name}</h2>
            <div className='flex flex-row '>
                {
                    components.map((componentArray) => (
                        <div className='flex flex-col flex-1'>
                            {componentArray}
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

interface ParkDisplay2Data {
    name: string
    rides: Ride[]
}

const ParkDisplay2 = (props: {
    data: ParkDisplay2Data
    className?: string;
}) => {
    const components = props.data.rides.map((ride) => <RoundedBoxWithNumber number={ride.isOpen ? ride.waitTime : 'X'} text={ride.name} disabled={!ride.isOpen} />)
    let componentsSplit: React.JSX.Element[][] = [[], [], [], []];
    components.forEach((component, index) => {
        componentsSplit[index%4].push(component)
    })
    return (
        <div className={props.className + ' transition-opacity delay-500 bigDelay flex-col flex-shrink-0 w-full overflow-hidden text-sm grow-0 absolute'}>
            <h2 className='p-3 text-5xl text-center disney-font text-gray-950'>{props.data.name}</h2>
            <div className='flex flex-row '>
                {
                    componentsSplit.map((componentArray) => (
                        <div className='flex flex-col flex-1'>
                            {componentArray}
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

interface AllParksDisplayProps {
    allParks: AllParks;
}

const AllParksDisplay: React.FC<AllParksDisplayProps> = ({ allParks }) => {
    const [currentParkIndex, setCurrentParkIndex] = useState(0);
    
    const getAllRides = (park: Park): Ride[] => {
        return [...park.rides, ...park.lands.reduce((acc, land) => [...acc, ...land.rides], [] as Ride[])]
    }

    let data: ParkDisplay2Data[] = [] as ParkDisplay2Data[];

    ([allParks.animal_kingdom, allParks.magic_kingdom, allParks.hollywood_studios, allParks.epcot] as Park[]).forEach((park: Park) => {
        const allRides = getAllRides(park)
        let curEntry : ParkDisplay2Data = {
            name: park.name,
            rides: []
        }
        allRides.forEach((ride) => {
            if(curEntry.rides.length == 24) {
                data.push(curEntry)
                curEntry = {
                    name: park.name,
                    rides: []
                }
            }
            curEntry.rides.push(ride)
        })
        data.push(curEntry)
    });
    console.log("loaded new DATA")
    console.log(data)

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Increment the currentParkIndex to switch to the next park
            console.log("Switching interval")
            setCurrentParkIndex((prevIndex) => (prevIndex + 1) % data.length);
        }, parkDisplayInterval * 1000); // 1 minute 1000 * 60 * 1

        // Cleanup the interval on component unmount
        return () => clearInterval(intervalId);
    }, [allParks]);

    return (
        <div>
            <div className='flex whitespace-no-wrap ' >
                {data.map((park, index) => (
                    <ParkDisplay2
                        key={index}
                        data={park}
                        className={currentParkIndex === index ? 'opacity-100' : 'opacity-0'}
                    />
                ))}
            </div>
        </div>);
};

export default AllParksDisplay;
