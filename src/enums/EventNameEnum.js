define(function (require) {
    'use strict';

    var EventNameEnum = {
        /*settings*/
        refreshSettings: 'refreshSettings',
        settingsReset: 'settingsReset',
        refreshMyPersonnel: 'refreshMyPersonnel',
        myPersonnelReset: 'myPersonnelReset',
        /*station*/
        goToStationSearch: 'goToStationSearch',
        goToStationDetailWithId: 'goToStationDetailWithId',
        goToAdHocStationDetailWithId: 'goToAdHocStationDetailWithId',
        getNearbyStations: 'getNearbyStations',
        getRecentStations: 'getRecentStations',
        getStationsByStationName: 'getStationsByStationName',
        /*personnel*/
        goToPersonnelSearch: 'goToPersonnelSearch',
        goToPersonnelDetailWithId: 'goToPersonnelDetailWithId',
        goToPersonnelDetailWithUserName: 'goToPersonnelDetailWithUserName',
        getPersonnelsByUserName: 'getPersonnelsByUserName',
        /*station entry log*/
        refreshStationEntryLogCollectionByGps: 'refreshStationEntryLogCollectionByGps',
        refreshStationEntryLogCollection: 'refreshStationEntryLogCollection',
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
        getWarningsByStationId: 'getWarningsByStationId',
        addWarning: 'addWarning',
        addWarningSuccess: 'addWarningSuccess',
        addWarningError: 'addWarningError',
        clearWarning: 'clearWarning',
        clearWarningSuccess: 'clearWarningSuccess',
        clearWarningError: 'clearWarningError',
        /*abnormal condition*/
        getAbnormalConditionsByStationId: 'getAbnormalConditionsByStationId',
        /*directions*/
        goToDirectionsWithLatLng: 'goToDirectionsWithLatLng',
        /*notifications*/
        showConfirmation: 'showConfirmation'
    };
    if (Object.freeze) {
        Object.freeze(EventNameEnum);
    }

    return EventNameEnum;
});
