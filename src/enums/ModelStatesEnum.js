define(function(require) {

    "use strict";

    var ModelStatesEnum = {
        'initial': 1,
        'loading': 2,
        'loaded': 3,
        'error': -1
    };
    if (Object.freeze) {
        Object.freeze(ModelStatesEnum);
    }

    return ModelStatesEnum;

});