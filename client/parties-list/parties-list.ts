/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />
/// <reference path="../../typings/meteor-accounts-ui.d.ts" />

import {Component, View} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {Parties} from 'collections/parties';
import {PartiesForm} from 'client/parties-form/parties-form';
import {RouterLink} from 'angular2/router';
import {AccountsUI} from 'meteor-accounts-ui';
import {InjectUser} from 'meteor-accounts';
import {MeteorComponent} from 'angular2-meteor';

@Component({
    selector: 'app'
})
@View({
    templateUrl: 'client/parties-list/parties-list.html',
    directives: [NgFor, PartiesForm, RouterLink, AccountsUI]
})
@InjectUser()
export class PartiesList extends MeteorComponent {
    parties: Mongo.Cursor<Party>;

    constructor () {
        super();
        this.subscribe('parties', () => {
            this.parties = Parties.find();
        }, true);
    }

    removeParty(party) {
        Parties.remove(party._id);
    }

    search(value) {
        if (value) {
            this.parties = Parties.find({ location: value });
        } else {
            this.parties = Parties.find();
        }
    }
}