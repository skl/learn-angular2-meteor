/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/counts.d.ts" />

import {Parties} from 'collections/parties';

function buildQuery(partyId: string, location: string): Object {
    var isAvailable = {
        $or: [
            { public: true },
            {
                $and: [
                    { owner: this.userId },
                    { owner: { $exists: true } }
                ]
            },
            {
                $and: [
                    { invited: this.userId },
                    { invited: { $exists: true } }
                ]
            }
        ]
    };

    if (partyId) {
        return { $and: [{ _id: partyId }, isAvailable] };
    }

    let searchRegex = { '$regex': '.*' + (location || '') + '.*', '$options': 'i' };

    return { $and: [{ location: searchRegex }, isAvailable] };
}

Meteor.publish('parties', function(options, location) {
    Counts.publish(this, 'numberOfParties',
        Parties.find(buildQuery.call(this, null, location)), { noReady: true }
    );

    return Parties.find(buildQuery.call(this, null, location), options);
});

Meteor.publish('party', function(partyId) {
    return Parties.find(buildQuery.call(this, partyId));
});