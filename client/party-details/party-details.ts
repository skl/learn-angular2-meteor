/// <reference path="../../typings/angular2-meteor.d.ts" />

import {Component, View} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {RouteParams} from 'angular2/router';
import {Parties} from 'collections/parties';
import {RouterLink} from 'angular2/router';

@Component({
    selector: 'party-details'
})
@View({
    templateUrl: '/client/party-details/party-details.html',
    directives: [RouterLink, FORM_DIRECTIVES]
})
export class PartyDetails {
    party: Object;

    constructor(params: RouteParams) {
        var partyId = params.get('partyId');
        this.party = Parties.findOne(partyId);
    }

    saveParty(party) {
        Parties.update(party._id, {
            $set: {
                name: party.name,
                description: party.description,
                location: party.location
            }
        });
    }
}