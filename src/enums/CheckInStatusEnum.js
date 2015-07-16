define(function(require) {
    'use strict';

    var CheckInStatusEnum = {
        checkedIn: 1,
        overdue: 2,
        expired: 3,
        checkedOut: 4
    };
    if (Object.freeze) {
        Object.freeze(CheckInStatusEnum);
    }

    return CheckInStatusEnum;
});