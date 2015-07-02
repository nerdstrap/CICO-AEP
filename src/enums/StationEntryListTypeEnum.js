define(function(require) {

    "use strict";

    var StationEntryListTypeEnum = {
        'open': 1,
        'historical': 2
    };
    if (Object.freeze) {
        Object.freeze(StationEntryListTypeEnum);
    }

    return StationEntryListTypeEnum;

});