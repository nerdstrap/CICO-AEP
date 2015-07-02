define(function(require) {

    'use strict';
    var module = require('module'),
            globals = require('globals'),
            masterConfig = module.config(),
            apiUrl = masterConfig.apiUrl || '',
            siteRoot = masterConfig.siteRoot || '',
            maxDurExpiration = masterConfig.maxDurExpiration || '',
            helpEmail = masterConfig.helpEmail || '',
            helpEmailSubject = masterConfig.helpEmailSubject || '';

    var fixPhoneNumber = function(incoming) {
        if (incoming) {
            var originalPhone = incoming;
            var phone = originalPhone.replace(/[^0-9]/g, '');
            if (phone.length > 10) {
                phone = phone.substring(phone.length - 10);
            }
            return phone;
        }
        return undefined;
    };

    var formatPhoneNumber = function(phoneNumber) {
        phoneNumber = fixPhoneNumber(phoneNumber);
        if (phoneNumber && phoneNumber.length === 10) {
            var part1 = phoneNumber.substring(phoneNumber.length - 10, phoneNumber.length - 10 + 3);
            var part2 = phoneNumber.substring(phoneNumber.length - 7, phoneNumber.length - 7 + 3);
            var part3 = phoneNumber.substring(phoneNumber.length - 4);
            return '(' + part1 + ') ' + part2 + '-' + part3;
        }
        return phoneNumber;
    };

    var formatPhoneNumberLink = function(phoneNumber) {
        var fixedPhoneNumber = fixPhoneNumber(phoneNumber);
        var formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        if (fixedPhoneNumber && formattedPhoneNumber) {
            return '<a class="text-link" href="tel:' + fixedPhoneNumber + '">' + formattedPhoneNumber + '</a>';
        }
        return phoneNumber;
    };
    var env = {
        getApiUrl: function() {
            return apiUrl;
        },
        getSiteRoot: function() {
            return siteRoot;
        },
        getMaxDurExpiration: function() {
            return maxDurExpiration;
        },
        getHelpEmail: function() {
            return helpEmail;
        },
        getHelpEmailSubject: function() {
            return helpEmailSubject;
        },
        getCTRedirectUrl: function() {
            var CT_ORIG_URL = window.location.hash.replace('#', '%23');
            CT_ORIG_URL = this.getSiteRoot() + CT_ORIG_URL;
            var newUrl = this.getSiteRoot() + 'aep_logon/aep_logon_en.html?CTAuthMode=BASIC&language=en&CT_ORIG_URL=' + CT_ORIG_URL;
            return newUrl;
        },
        getAppLogoutUrl: function() {
            return this.getSiteRoot() + 'cico_logon/cico_logout.jsp';
        },
        getLogoutUrl: function() {
            return this.getSiteRoot() + 'aep_logon/aep_logout_en.html?ts=' + (new Date()).getTime();
        },
        getPhoneFixedNumber: function(phoneValue) {
            var fixedPhoneNumber = fixPhoneNumber(phoneValue);
            if (fixedPhoneNumber) {
                return fixedPhoneNumber;
            }
            else {
                return phoneValue;
            }
        },
        getFormattedPhoneNumber: function(phoneValue) {
            return formatPhoneNumber(phoneValue);
        },
        getFormattedPhoneNumberLink: function(phoneValue) {
            return formatPhoneNumberLink(phoneValue);
        },
        getBackButton: function() {
            return "&#10137;";
        },
        getSearchButton: function() {
            return 'img/search_180x180.png';
        },
        getPersonnelButton: function() {
            return 'img/directory_180x180.png';
        },
        getRefreshButton: function() {
            return '<i class="gen-enclosed foundicon-refresh"></i>';
        },
        getCheckedInButton: function() {
            return 'img/checked-in_180x180.png';
        },
        getCheckedInButtonWarning: function() {
            return 'img/checked-in_warning_180x180.png';
        },
        getCheckedInButtonRestricted: function() {
            return 'img/checked-in_restricted_180x180.png';
        },
        getCheckedInWithCrewButton: function() {
            return 'img/checked-in_with_crew_180x180.png';
        },
        getCheckedInWithCrewButtonWarning: function() {
            return 'img/checked-in_with_crew_warning_180x180.png';
        },
        getCheckedInWithCrewButtonRestricted: function() {
            return 'img/checked-in_with_crew_restricted_180x180.png';
        },
        getAppTitle: function() {
            return "Check-in|Check-out";
        },
        getStationCheckinWarningDistance: function() {
            return 15;
        },
        getDirectionsUri: function(latitude, longitude) {
            var directionsUri;
            var native = true;

            var userAgent = globals.window.navigator.userAgent;
            if (userAgent.indexOf('Mac OS') > -1) {
                directionsUri = "maps:daddr=" + latitude + "," + longitude;
            } else if (userAgent.indexOf('Linux') > -1) {
                directionsUri = "http://maps.google.com?daddr=" + latitude + "," + longitude;
            }
            else if ((userAgent.indexOf('Windows NT 6.3') > -1 && userAgent.indexOf('WPDesktop') < 0 && userAgent.indexOf('IEMobile') < 0)
                    || (userAgent.indexOf('Windows NT 6.2') > -1 && userAgent.indexOf('WPDesktop') < 0 && userAgent.indexOf('IEMobile') < 0)) {
                directionsUri = "bingmaps:?collection=point." + latitude + "_" + longitude;
            } else if ((userAgent.indexOf('Windows NT 6.2') > -1 && userAgent.indexOf('WPDesktop') > -1) ||
                    userAgent.indexOf('Windows Phone') > -1) {
                directionsUri = "directions://v2.0/route/destination/?latlon=" + latitude + "," + longitude + "&mode=car";
            }
            else {
                native = false;
                directionsUri = "http://maps.apple.com?daddr=" + latitude + "," + longitude;
            }

            return {uri: directionsUri, useNative: native};
        },
        overrideConfig: function(settings) {
            if (settings) {
                maxDurExpiration = settings.maxDurExpiration;
                helpEmail = settings.helpEmail;
                helpEmailSubject = settings.helpEmailSubject;
            }
        }
    };
    return env;
});
