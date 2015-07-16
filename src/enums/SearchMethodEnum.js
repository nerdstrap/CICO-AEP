define(function(require) {
    'use strict';

    var SearchMethodEnum = {
        gps: 1,
        manual: 2,
        recent: 3
    };
    if (Object.freeze) {
        Object.freeze(SearchMethodEnum);
    }

    return SearchMethodEnum;

});