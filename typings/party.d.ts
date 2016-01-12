declare type Party = {
    _id?: string,
    name: string,
    description?: string,
    location: string,
    public: boolean,
    owner?: string,
    invited?: Array<string>,
    rsvps?: Array<RSVP>
}

declare type RSVP = {
    userId: string,
    response: string
}