/// <reference path="../typings/angular2-meteor.d.ts" />

import {Component, View, NgZone} from 'angular2/core';

import {NgFor} from 'angular2/common';

import {bootstrap} from 'angular2-meteor';

import {Parties} from 'collections/parties';

@Component({
    selector: 'app'
})
@View({
    templateUrl: 'client/app.html',
    directives: [NgFor]
})
class Socially {
    parties: Mongo.Cursor<Object>;

    constructor () {
        this.parties = Parties.find();
    }
}

bootstrap(Socially);