/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />

import {Component, View} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';
import {Parties} from 'collections/parties';
import {InjectUser} from 'meteor-accounts';
import {MeteorComponent} from 'angular2-meteor';

@Component({
    selector: 'parties-form'
})
@View({
    templateUrl: 'client/parties-form/parties-form.html',
    directives: [FORM_DIRECTIVES]
})
@InjectUser()
export class PartiesForm extends MeteorComponent {
    partiesForm: ControlGroup;

    constructor() {
        super();

        var fb = new FormBuilder();
        this.partiesForm = fb.group({
            name: ['', Validators.required],
            description: [''],
            location: ['', Validators.required],
            public: [false]
        });
    }

    addParty(party) {
        if (this.partiesForm.valid) {
            if (this.user) {
                Parties.insert({
                    name: party.name,
                    description: party.description,
                    location: party.location,
                    public: party.public,
                    owner: this.user._id
                });

                (<Control>this.partiesForm.controls['name']).updateValue('', false);
                (<Control>this.partiesForm.controls['description']).updateValue('', false);
                (<Control>this.partiesForm.controls['location']).updateValue('', false);
                (<Control>this.partiesForm.controls['public']).updateValue('', false);
            } else {
                alert('Please log in to add a party');
            }
        }
    }
}