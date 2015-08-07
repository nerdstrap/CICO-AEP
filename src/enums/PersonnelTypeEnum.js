define(function(require) {
    'use strict';

    var StationTypeEnum = {
        td: 1,
        tc: 2
    };
    if (Object.freeze) {
        Object.freeze(StationTypeEnum);
    }

    return StationTypeEnum;

});