// export type Client = {
    // user: {
        // id: string
    // }
// }
// export type Client = string;
export type ClientID = string;

export type LocationMessage = {
    type: 'location',
    timestamp: number,
    data: {
        lng: number,
        lat: number
    }
}

export type SubscribeMessage = {
    type: 'subscribe',
    target: ClientID
}

export type UnsubscribeMessage = {
    type: 'unsubscribe',
    target: ClientID
}

export type Message = (
    LocationMessage 
    | SubscribeMessage
    | UnsubscribeMessage
);

export type AvailableTrucksMessage = {
    type: 'available_trucks',
    data: any[]
}

export type TruckMessage = {
    type: 'truck',
    data: {
        id: ClientID,
        lat: number,
        lng: number
    }
}

export type ServerMessage = TruckMessage | AvailableTrucksMessage