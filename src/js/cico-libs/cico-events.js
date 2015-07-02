define(function(require) {
    var _ = require('underscore'),
            Backbone = require('backbone');


    var CicoEvents = function(options) {
        if (this.initialize) {
            this.initialize.apply(this, arguments);
        }
    };

    _.extend(CicoEvents.prototype, Backbone.Events, {
        checkInSuccess: "checkInSuccess",
        checkOutSuccess: "checkOutSuccess",
        extendDurationSuccess: "extendDurationSuccess",
        adhocCheckOutSuccess: "adhocCheckOutSuccess",
        adhocExtendDurationSuccess: "adhocExtendDurationSuccess",
        goToStationWithId: "goToStationWithId",
        currentCheckedInChange: "currentCheckedInChange",
        showErrorView: "showErrorView",
        checkIntoStation: "checkIntoStation",
        goToAdHocCheckIn: "goToAdHocCheckIn",
        goToCheckIn: "goToCheckIn",
        goToCheckOut: "goToCheckOut",
        goToExtendDuration: "goToExtendDuration",
        goToOpenCheckIn: "goToOpenCheckIn",
        addWarning: "addWarning",
        addWarningSuccess: "addWarningSuccess",
        addWarningError: "addWarningError",
        clearWarning: "clearWarning",
        clearWarningSuccess: "clearWarningSuccess",
        clearWarningError: "clearWarningError"
    });

    var cicoEvents = new CicoEvents();
    return cicoEvents;
});