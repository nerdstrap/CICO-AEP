define(function(require) {

    "use strict";

    var FilterStationTypeEnum = {
        'TDTC': 'TD|TC',
        'TC': 'TC',
        'TD': 'TD'
    };
    if (Object.freeze) {
        Object.freeze(FilterStationTypeEnum);
    }

    return FilterStationTypeEnum;

});