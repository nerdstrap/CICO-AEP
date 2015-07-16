define(function(require) {
    'use strict';

    var StationTypeEnum = {
        td: 'TD',
        tc: 'TC'
    };
    if (Object.freeze) {
        Object.freeze(StationTypeEnum);
    }

    return StationTypeEnum;

});