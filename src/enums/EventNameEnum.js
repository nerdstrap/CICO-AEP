'use strict';

var EventNameEnum = {
    /*settings*/
    settingsReset: 'settingsReset',
    /*my data*/
    myPersonnelReset: 'myPersonnelReset',
    myOpenStationEntryLogReset: 'myOpenStationEntryLogReset',
    /*station*/
    goToStationSearch: 'goToStationSearch',
    goToStationDetails: 'goToStationDetails',
    goToAdHocStationDetails: 'goToAdHocStationDetails',
    getNearbyStations: 'getNearbyStations',
    getRecentStations: 'getRecentStations',
    getStations: 'getStations',
    /*personnel*/
    goToPersonnelSearch: 'goToPersonnelSearch',
    goToPersonnelDetails: 'goToPersonnelDetails',
    getPersonnels: 'getPersonnels',
    /*station entry log*/
    getNearbyStationEntryLogs: 'getNearbyStationEntryLogs',
    getOpenStationEntryLogs: 'getOpenStationEntryLogs',
    getRecentStationEntryLogs: 'getRecentStationEntryLogs',
    /*check-in*/
    goToCheckIn: 'goToCheckIn',
    goToAdHocCheckIn: 'goToAdHocCheckIn',
    checkIn: 'checkIn',
    checkInSuccess: 'checkInSuccess',
    checkInError: 'checkInError',
    /*edit check-in*/
    goToEditCheckIn: 'goToEditCheckIn',
    editCheckIn: 'editCheckIn',
    editCheckInSuccess: 'editCheckInSuccess',
    editCheckInError: 'editCheckInError',
    /*check-out*/
    goToCheckOut: 'goToCheckOut',
    checkOut: 'checkOut',
    checkOutSuccess: 'checkOutSuccess',
    checkOutError: 'checkOutError',
    /*warning*/
    getWarnings: 'getWarnings',
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

module.exports = EventNameEnum;