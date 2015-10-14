'use strict';

var CheckInTypeEnum = {
    station: 1,
    adHoc: 2
};
if (Object.freeze) {
    Object.freeze(CheckInTypeEnum);
}

module.exports = CheckInTypeEnum;