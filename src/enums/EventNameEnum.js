define(function(require) {
    'use strict';

    var EventNameEnum = {
        /*settings*/
        refreshSettings: 'refreshSettings',
        settingsReset: 'settingsReset',
        refreshMyPersonnel: 'refreshMyPersonnel',
        myPersonnelReset: 'myPersonnelReset',
        refreshOpenStationEntryLogs: 'refreshOpenStationEntryLogs',
        openStationEntryLogReset: 'openStationEntryLogReset',
        /*station*/
        goToStationSearch: 'goToStationSearch',
        goToStationWithId: 'goToStationWithId',
        goToAdHocStationWithId: 'goToAdHocStationWithId',
        refreshStationCollectionByGps: 'refreshStationCollectionByGps',
        refreshStationCollection: 'refreshStationCollection',
        /*personnel*/
        goToPersonnelSearch: 'goToPersonnelSearch',
        goToPersonnelWithId: 'goToPersonnelWithId',
        goToPersonnelWithName: 'goToPersonnelWithName',
        refreshPersonnelCollectionByGps: 'refreshPersonnelCollectionByGps',
        refreshPersonnelCollection: 'refreshPersonnelCollection',
        /*station entry log*/
        goToCheckIn: 'goToCheckIn',
        goToAdHocCheckIn: 'goToAdHocCheckIn',
        checkIn: 'checkIn',
        checkInSuccess: 'checkInSuccess',
        checkInError: 'checkInError',
        goToEditCheckIn: 'goToEditCheckIn',
        editCheckIn: 'editCheckIn',
        editCheckInSuccess: 'editCheckInSuccess',
        editCheckInError: 'editCheckInError',
        goToCheckOut: 'goToCheckOut',
        checkOut: 'checkOut',
        checkOutSuccess: 'checkOutSuccess',
        checkOutError: 'checkOutError',
        /*warning*/
        refreshWarningCollection: 'refreshWarningCollection',
        addWarning: 'addWarning',
        addWarningSuccess: 'addWarningSuccess',
        addWarningError: 'addWarningError',
        clearWarning: 'clearWarning',
        clearWarningSuccess: 'clearWarningSuccess',
        clearWarningError: 'clearWarningError',
        /*abnormal condition*/
        refreshAbnormalConditionCollection: 'refreshAbnormalConditionCollection',
        /*directions*/
        goToDirectionsWithLatLng: 'goToDirectionsWithLatLng',
        /*notifications*/
        showProgessView: 'showProgessView',
        showConfirmationView: 'showConfirmationView',
        showWarningView: 'showWarningView',
        showErrorView: 'showErrorView'
    };
    if (Object.freeze) {
        Object.freeze(EventNameEnum);
    }

    return EventNameEnum;
});
