define(function(require) {
    'use strict';

    var resources = {
        "appTitleText": "Check-in|Check-out",
        "openCheckInIcon": "fa-check",
        "openCheckInIcon.withCrew": "fa-check",
        "openCheckInIcon.warning": "fa-check",
        "openCheckInIcon.warning.withCrew": "fa-check",
        "openCheckInIcon.expired": "fa-check",
        "openCheckInIcon.expired.withCrew": "fa-check",
        "stationSearchIcon": "fa-search",
        "personnelSearchIcon": "fa-book",
        "appLogoImageSrc": "images/aep-logo.png",
        "appLogoImageAlt": "AEP",
        "helpButtonText": "help",
        "contactButtonText": "contact",
        "logoutButtonText": "logout",

        //station search
        "stationSearchLoadingMessageText": "Loading Station Search",
        "progressImageSrc": "images/loading.gif",
        "progressImageAlt": "loading",
        "stationSearchErrorMessageText": "Error Loading Station Search",
        "stationSearchHeaderText": "Find A Station",
        "gpsButtonText": "gps",
        "manualButtonText": "manual",
        "recentButtonText": "recent",
        "stationTypeHeaderText": "Show Results For:",
        "dolStationTypeHeaderText": "T&D",
        "nocStationTypeHeaderText": "TCOM",
        "stationNamePlaceholder": "enter a station name",
        "clearIcon": "fa-close",
        "adHocCheckInButtonText": "Ad-hoc Check-in",
        "openCheckInButtonText": "open check-in",

        //personnel search
        "personnelSearchLoadingMessageText": "Loading User Search",
        "personnelSearchErrorMessageText": "Error Loading User Search",
        "personnelSearchHeaderText": "Find A User",
        "personnelTypeHeaderText": "Show Results For:",
        "dolPersonnelTypeHeaderText": "T&D",
        "nocPersonnelTypeHeaderText": "TCOM",
        "userNamePlaceholder": "enter a user name",

        //station collection
        "stationCollectionLoadingMessageText": "Loading Stations",
        "stationCollectionErrorMessageText":"Error Loading Stations",
        "noResultsMessageText": "No Results",
        "gpsDisabledErrorMessage":"GPS Disabled",
        "gpsUnavailableErrorMessage":"GPS Unavailable",
        "gpsTimedOutErrorMessage":"GPS Timed Out",

        //personnel collection
        "personnelCollectionLoadingMessageText": "Loading Users",
        "personnelCollectionErrorMessageText":"Error Loading Users",

        //station tile
        "hazardIcon": "fa-flash",
        "warningIcon": "fa-exclamation-circle",
        "abnormalConditionIcon": "fa-exclamation-triangle",
        "distanceDirectionsSeparator": " | ",
        "directionsButtonText": "directions",
        "directionsIcon": "fa-map-marker",
        "distanceFormatString":"{0} miles",
        "distanceUnavailableErrorMessage": "gps unavailable",

        //station detail
        "stationDetailLoadingMessageText": "Loading Station Details",
        "stationDetailErrorMessageText": "Error Loading Station Details",
        "parentStationLinkPreMessageText": "Go to T&D site",
        "parentStationLinkPostMessageText": "to only check-in there.",
        "childStationLinkPreMessageText": "Go to Telecom site",
        "childStationLinkPostMessageText": "to check-in to both sites.",
        "checkInButtonText": "check-in",
        "editCheckInButtonText": "edit check-in",
        "checkOutButtonText": "check-out",
        "hazardNotificationMessageText": "A hazard exists at this site. Call the dispatcher if you need to check-in.",
        "transmissionDispatchCenterHeaderText": "TDC",
        "distributionDispatchCenterHeaderText": "DDC",
        "networkOperationsCenterHeaderText": "NOC",
        "checkIcon": "fa-check",
        "stationDetailsHeaderText":"Station Details",
        "phoneHeaderText":"Phone",
        "radioChannelHeaderText":"Radio Channel",
        "emergencyContactsHeaderText":"Emergency Contacts",
        "cityHeaderText":"City",
        "countyHeaderText":"County",
        "stateHeaderText":"State",
        "coordinatesHeaderText":"Lat/Lng",
        "directionsHeaderText":"Directions",
        "additionalDataHeaderText":"Additional Data",
        "expectedCheckOutTextFormatString": "expected check out {0}",

        //ad-hoc station detail
        "adHocStationDetailLoadingMessageText": "Loading Ad-Hoc Details",
        "adHocStationDetailErrorMessageText": "Error Loading Ad-Hoc Details",
        "adHocCheckInHeaderText": "Ad-Hoc Check-In",

        //personnel detail
        "personnelDetailLoadingMessageText": "Loading User Details",
        "personnelDetailErrorMessageText": "Error Loading User Details",

        //check-in
        "checkInLoadingMessageText": "Loading Check-In Data",
        "checkInErrorMessageText": "Error Loading Check-In Data",
        "okButtonText": "OK",
        "checkInHeaderText": "Check-In",
        "stationNameHeaderText": "station",
        "distanceHeaderText": "distance",
        "contactNumberHeaderText": "mobile",
        "contactNumberPlaceholder": "phone number",
        "purposeHeaderText": "purpose",
        "purposeOtherHeaderText": "other purpose",
        "purposeOtherPlaceholder": "description",
        "durationHeaderText": "duration",
        "expectedOutTimeHeaderText": "exp. out time",
        "withCrewHeaderText": "with crew",
        "yesHeaderText": "yes",
        "noHeaderText": "no",
        "dispatchCenterHeaderText": "Dispatch Center",
        "additionalInfoHeaderText": "additional info",
        "additionalInfoPlaceholder": "description",
        "cancelButtonText": "cancel",
        "hazardErrorMessage": "A hazard exists at this site. Call the dispatcher if you need to check-in.",
        "openCheckInErrorMessage": "You are already checked-in at another station.",
        "checkInProgressMessageText":"Sending Check-in Data",
        "checkInSuccessMessageTextFormatString": "You successfully checked-in to {0} at {1}",

        //ad-hoc check-in
        "adHocCheckInLoadingMessageText": "Loading Ad-Hoc Check-In",
        "adHocCheckInErrorMessageText": "Error Loading Ad-Hoc Check-In Data",
        "adHocDescriptionHeaderText": "ad-hoc",
        "adHocDescriptionPlaceholder": "description",
        "gpsHeaderText": "gps",
        "areaHeaderText": "area",
        "adHocCheckInProgressMessageText":"Sending Ad-hoc Check-in Data",
        "adHocCheckInSuccessMessageTextFormatString": "You successfully checked-in to {0} at {1}",

        //edit check-in
        "editCheckInLoadingMessageText": "Loading Check-In Details",
        "editCheckInErrorMessageText": "Error Loading Check-In Details",
        "editCheckInHeaderText": "Edit Check-in",
        "zeroMinutesOptionText": "0 minutes",
        "editCheckInProgressMessageText":"Sending Check-in Data",
        "editCheckInSuccessMessageTextFormatString": "You successfully edited your check-in to {0}",

        //check-out
        "checkOutLoadingMessageText": "Loading Check-in Details",
        "checkOutErrorMessageText": "Error Loading Check-in Details",
        "checkOutHeaderText": "Check-out",
        "checkOutProgressMessageText":"Sending Check-out Data",
        "checkOutSuccessMessageTextFormatString": "You successfully checked-out of {0} at {1}",

        //abnormal condition collection
        "abnormalConditionCollectionLoadingMessageText": "Loading Abnormal Conditions",
        "abnormalConditionCollectionErrorMessageText": "Error Loading Abnormal Conditions",
        "abnormalConditionCollectionHeaderTextFormatString": "{0} Abnormal Conditions",
        "outageIcon": "fa-exclamation-triangle",

        //warning collection
        "warningCollectionLoadingMessageText": "Loading Warnings",
        "warningCollectionErrorMessageText": "Error Loading Warnings",
        "warningCollectionHeaderTextFormatString": "{0} Warnings",

        //station entry log collection
        "toggleShowIcon": "fa-plus-square-o",
        "toggleHideIcon": "fa-minus-square-o",
        "stationEntryLogCollectionLoadingMessageText": "Loading Check-ins",
        "stationEntryLogCollectionErrorMessageText": "Error Loading Check-ins",
        "stationEntryLogCollectionHeaderTextFormatString": "{0} Check-ins",
        "withCrewIcon": "fa-user-plus",

        "openStationEntryLogCollectionLoadingMessageText": "Loading Open Check-ins",
        "openStationEntryLogCollectionErrorMessageText": "Error Loading Open Check-ins",
        "openStationEntryLogCollectionHeaderTextFormatString": "{0} Open Check-ins",

        "recentStationEntryLogCollectionLoadingMessageText": "Loading Recent Check-ins",
        "recentStationEntryLogCollectionErrorMessageText": "Error Loading Recent Check-ins",
        "recentStationEntryLogCollectionHeaderTextFormatString": "{0} Recent Check-ins",
        "inTimeOutTimeSeparator": " to ",

        //service
        "functionTraceFormatString":"{0}: {1}",
        "emptyResponseErrorMessageText":"Response Was Empty"
    };
    if (Object.freeze) {
        Object.freeze(resources);
    }

    return resources;
});