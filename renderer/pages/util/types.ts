export interface Ride {
  name: string;
  waitTime: number;
  isOpen: boolean;
}

export interface Land {
  name: string;
  rides: Ride[];
}

export interface Park {
  name: string;
  rides: Ride[];
  lands: Land[];
}

export interface AllParks {
  animal_kingdom: Park | undefined,
  magic_kingdom: Park | undefined,
  hollywood_studios: Park | undefined,
  epcot: Park | undefined
}
