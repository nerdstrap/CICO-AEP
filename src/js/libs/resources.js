define(function(require) {
    'use strict';

    var resources = {
        "appTitleText": "Check-in|Check-out",
        "openCheckInIcon": "fa-map-marker",
        "openCheckInIcon.withCrew": "fa-map-marker",
        "openCheckInIcon.warning": "fa-map-marker",
        "openCheckInIcon.warning.withCrew": "fa-map-marker",
        "openCheckInIcon.expired": "fa-map-marker",
        "openCheckInIcon.expired.withCrew": "fa-map-marker",
        "stationSearchIcon": "fa-search",
        "personnelSearchIcon": "fa-book",
        "appLogoImageSrc": "images/aep-logo.png",
        "appLogoImageAlt": "AEP",
        "helpButtonText": "help",
        "contactButtonText": "contact",
        "logoutButtonText": "logout",
        "stationSearchViewHeaderText": "Find A Station",
        "gpsButtonText": "gps",
        "manualButtonText": "manual",
        "recentButtonText": "recent",
        "stationTypeHeaderText": "Show Results For:",
        "dolStationTypeHeaderText": "T&D",
        "nocStationTypeHeaderText": "TCOM",
        "manualSearchPlaceholder": "enter a station name",
        "clearIcon": "fa-close",
        "adHocCheckInButtonText": "Ad-hoc Check-in",
        "stationCollectionLoadingMessageText": "Loading Stations",
        "loadingMessageText": "loading",
        "loadingImageSrc": "images/loading.gif",
        "loadingImageAlt": "loading",
        "noResultsMessageText": "No Results",
        "infoIcon": "fa-info-circle",
        "hazardIcon": "fa-exclamation-triangle",
        "warningIcon": "fa-exclamation-triangle",
        "abnormalConditionIcon": "fa-exclamation-triangle",
        "distanceFormatString":"{0} miles",
        "coordinatesUnavailableErrorMessage": "gps unavailable",
        "directionsButtonText": "directions",
        "directionsIcon": "fa-map-marker",
        "stationDetailLoadingMessageText": "Loading Station Details",
        "checkInButtonText": "check-in",
        "editCheckInButtonText": "edit check-in",
        "checkOutButtonText": "check-out",
        "openCheckInButtonText": "open check-in",
        "hazardNotificationMessage": "hazard check in",
        "expectedCheckOutTextFormatString": "expected check out {0}",
        "tdcHeaderText": "TDC",
        "ddcHeaderText": "DDC",
        "nocHeaderText": "NOC",
        "checkIcon": "fa-check",
        "adHocCheckInHeaderText": "Ad-hoc Check-in",
        "descriptionHeaderText": "ad-hoc",
        "descriptionPlaceholder": "description",
        "cancelButtonText": "cancel"
    };
    if (Object.freeze) {
        Object.freeze(resources);
    }

    return resources;
});