define(function(require) {

    "use strict";

    var NameLinkTypeEnum = {
        'station': 1,
        'personnel': 2
    };
    if (Object.freeze) {
        Object.freeze(NameLinkTypeEnum);
    }

    return NameLinkTypeEnum;

});