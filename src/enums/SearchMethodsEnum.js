define(function(require) {

    "use strict";

    var SearchMethodsEnum = {
        'gps': 1,
        'manual': 2,
        'recent': 3
    };
    if (Object.freeze) {
        Object.freeze(SearchMethodsEnum);
    }

    return SearchMethodsEnum;

});