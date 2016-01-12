/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />

import {Component, View} from 'angular2/core';
import {FORM_DIRECTIVES} from 'angular2/common';
import {RouteParams} from 'angular2/router';
import {Parties} from 'collections/parties';
import {RouterLink} from 'angular2/router';
import {MeteorComponent} from 'angular2-meteor';
import {DisplayName} from 'client/lib/pipes';
import {RequireUser, InjectUser} from 'meteor-accounts';

@Component({
    selector: 'party-details'
})
@View({
    pipes: [DisplayName],
    templateUrl: '/client/party-details/party-details.html',
    directives: [RouterLink, FORM_DIRECTIVES]
})
@RequireUser()
@InjectUser()
export class PartyDetails extends MeteorComponent {
    party: Party;
    users: Mongo.Cursor<Object>;
    user: Meteor.User;

    constructor(params: RouteParams) {
        super();
        var partyId = params.get('partyId');
        this.subscribe('party', partyId, () => {
            this.autorun(() => {
                this.party = Parties.findOne(partyId);
                this.getUsers(this.party);
            }, true);
        });

        this.subscribe('uninvited', partyId, () => {
            this.getUsers(this.party);
        }, true);
    }

    getUsers(party) {
        if (party) {
            this.users = Meteor.users.find({
                _id: {
                    $nin: party.invited || [],
                    $ne: Meteor.userId()
                }
            });
        }
    }

    get isOwner() {
        if (this.party && this.user) {
            return this.user._id === this.party.owner;
        }

        return false;
    }

    get isPublic() {
        if (this.party) {
            return this.party.public;
        }

        return false;
    }

    get isInvited() {
        if (this.party && this.user) {
            let invited = this.party.invited || [];
            return invited.indexOf(this.user._id) !== -1;
        }

        return false;
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

    invite(user) {
        this.call('invite', this.party._id, user._id, (error) => {
            if (error) {
                alert(`Failed to invite due to ${error}`);
                return;
            }

            alert('User successfully invited.');
        });
    }

    reply(rsvp) {
        this.call('reply', this.party._id, rsvp, (error) => {
            if (error) {
                alert(`Failed to reply due to ${error}`);
            } else {
                alert('You successfully replied.');
            }
        });
    }
}