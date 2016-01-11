/// <reference path="../typings/fake.d.ts" />

import {Parties} from 'collections/parties';

export function loadParties() {
    if (Parties.find().count() !== 0) {
        return;
    }

    for (var i = 0; i < 27; i++) {
        Parties.insert({
            name: Fake.sentence(50),
            location: Fake.sentence(10),
            description: Fake.sentence(100),
            public: true
        });
    }
};