import axios from 'axios';
import 'json';
import { NextApiRequest, NextApiResponse } from 'next';

import { Ride, Land, Park, AllParks } from '../util/types';

// Due to some CORS nonsense, the only way to make a request to the API is to use turn the data
// gathering into an API. That is implemented here.

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    let allParks: AllParks = {
        animal_kingdom: undefined,
        epcot: undefined,
        hollywood_studios: undefined,
        magic_kingdom: undefined,
    };

    try {
        for(const element of apis) {
            const response = await axios.get(`https://queue-times.com/parks/${element.id}/queue_times.json`);
            const park = parkJsonDeserialize(element.name, response.data);
            switch(element.id) {
                case 5:
                    allParks.epcot = park;
                    break;
                case 6:
                    allParks.magic_kingdom = park;
                    break;
                case 7:
                    allParks.hollywood_studios = park;
                    break;
                case 8:
                    allParks.animal_kingdom = park;
                    break;
            }
        };
    } catch (error) {
        console.error('Error in /api/handleWaitTimes.ts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(`returning allparks:`);
    console.log(allParks);
    res.status(200).json(JSON.stringify(allParks));
}

export default handler;

// Data deserialization
// Extra processing and data insertion is required so we can't just straight convert
const rideJsonDeserialize = (rideJson: any): Ride => {
    return {
        name: rideJson['name'],
        waitTime: rideJson['wait_time'],
        isOpen: rideJson['is_open']
    }
}

const landJsonDeserialize = (landJson: any): Land => {
    return {
        name: landJson['name'],
        rides: landJson['rides'].map((ride) => rideJsonDeserialize(ride))
    }
}

const parkJsonDeserialize = (name: string, parkJson: any): Park => {
    return {
        name: name,
        rides: parkJson['rides'].map((ride) => rideJsonDeserialize(ride)),
        lands: parkJson['lands'].map((land) => landJsonDeserialize(land)),
    };
}

// Indexing data

const apis = [
    {
        name: 'Epcot',
        id: 5
    },
    {
        name: 'Magic Kingdom',
        id: 6
    },
    {
        name: 'Hollywood Studios',
        id: 7
    },
    {
        name: 'Animal Kingdom',
        id: 8
    }
];