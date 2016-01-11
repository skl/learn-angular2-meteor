/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />

import {Component, View} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {RouteParams, CanActivate, ComponentInstruction} from 'angular2/router';
import {Parties} from 'collections/parties';
import {RouterLink} from 'angular2/router';
import {MeteorComponent} from 'angular2-meteor';
import {DisplayName} from 'client/lib/pipes';

function checkPermissions(instruction: ComponentInstruction) {
    var partyId = instruction.params['partyId'];
    var party = Parties.findOne(partyId);
    return (party && party.owner == Meteor.userId());
}

@Component({
    selector: 'party-details'
})
@View({
    pipes: [DisplayName],
    templateUrl: '/client/party-details/party-details.html',
    directives: [RouterLink, FORM_DIRECTIVES]
})
@CanActivate(checkPermissions)
export class PartyDetails extends MeteorComponent {
    party: Party;
    users: Mongo.Cursor<Object>;

    constructor(params: RouteParams) {
        super();
        var partyId = params.get('partyId');
        this.subscribe('party', partyId, () => {
            this.party = Parties.findOne(partyId);
        }, true);

        this.subscribe('uninvited', partyId, () => {
            this.users = Meteor.users.find({_id: {$ne: Meteor.userId()}});
        }, true);
    }

    saveParty(party) {
        if (Meteor.userId()) {
            Parties.update(party._id, {
                $set: {
                    name: party.name,
                    description: party.description,
                    location: party.location
                }
            });
        } else {
            alert('Please log in to change this party');
        }
    }
}