define(function(require) {

    'use strict';

    //token:     description:             example:
    //#YYYY#     4-digit year             1999
    //#YY#       2-digit year             99
    //#MMMM#     full month name          February
    //#MMM#      3-letter month name      Feb
    //#MM#       2-digit month number     02
    //#M#        month number             2
    //#DDDD#     full weekday name        Wednesday
    //#DDD#      3-letter weekday name    Wed
    //#DD#       2-digit day number       09
    //#D#        day number               9
    //#th#       day ordinal suffix       nd
    //#hhh#      military/24-based hour   17
    //#hh#       2-digit hour             05
    //#h#        hour                     5
    //#mm#       2-digit minute           07
    //#m#        minute                   7
    //#ss#       2-digit second           09
    //#s#        second                   9
    //#ampm#     'am' or 'pm'             pm
    //#AMPM#     'AM' or 'PM'             PM
    //
    //Example 
    //var now = new Date;  
    //console.log( now.customFormat( '#DD#/#MM#/#YYYY# #hh#:#mm#:#ss#' ) );
    Date.prototype.customFormat = function(formatString) {
        var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th;
        var dateObject = this;
        YY = ((YYYY = dateObject.getFullYear()) + '').slice(-2);
        MM = (M = dateObject.getMonth() + 1) < 10 ? ('0' + M) : M;
        MMM = (MMMM = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][M - 1]).substring(0, 3);
        DD = (D = dateObject.getDate()) < 10 ? ('0' + D) : D;
        DDD = (DDDD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dateObject.getDay()]).substring(0, 3);
        th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) === 1) ? 'st' : (dMod === 2) ? 'nd' : (dMod === 3) ? 'rd' : 'th';
        formatString = formatString.replace('#YYYY#', YYYY).replace('#YY#', YY).replace('#MMMM#', MMMM).replace('#MMM#', MMM).replace('#MM#', MM).replace('#M#', M).replace('#DDDD#', DDDD).replace('#DDD#', DDD).replace('#DD#', DD).replace('#D#', D).replace('#th#', th);

        h = (hhh = dateObject.getHours());
        if (h === 0) {
            h = 24;
        }
        if (h > 12) {
            h -= 12;
        }
        hh = h < 10 ? ('0' + h) : h;
        AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
        mm = (m = dateObject.getMinutes()) < 10 ? ('0' + m) : m;
        ss = (s = dateObject.getSeconds()) < 10 ? ('0' + s) : s;
        return formatString.replace('#hhh#', hhh).replace('#hh#', hh).replace('#h#', h).replace('#mm#', mm).replace('#m#', m).replace('#ss#', ss).replace('#s#', s).replace('#ampm#', ampm).replace('#AMPM#', AMPM);
    };

    Date.prototype.cicoDate = function() {
        var dateObject = this;

        if (dateObject.isToday()) {
            return dateObject.customFormat("Today at #hhh#:#mm#");
        }
        else if(dateObject.isTomorrow()){
            return dateObject.customFormat("Tomorrow at #hhh#:#mm#");
        }
        return dateObject.customFormat("#MM#/#DD# at #hhh#:#mm#");
    };
    
    Date.prototype.longDate = function() {
        var dateObject = this;
        return dateObject.customFormat("#MM#/#DD#/#YYYY# #hhh#:#mm#");
    };

    Date.prototype.cicoTime = function() {
        var dateObject = this;
        return dateObject.customFormat("#hhh#:#mm#");
    };

    Date.prototype.isToday = function() {
        var dateObject = this;
        var today = new Date();
        return today.isSameDay(dateObject);
    }; 
    
    Date.prototype.isTomorrow = function() {
        var dateObject = this;
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate()+1);
        return tomorrow.isSameDay(dateObject);
    }; 

    /**/
    Date.prototype.isSameDay = function(endDate) {
        var startDate = this;
        var isSameDay = false;

        if (endDate) {
            isSameDay = startDate.getFullYear() === endDate.getFullYear() &&
                    startDate.getMonth() === endDate.getMonth() &&
                    startDate.getDate() === endDate.getDate();
        }
        /* debugging
         console.debug('isSameDay'); 
         console.debug('Today: ' + startDate);
         console.debug('CompareDate: ' + endDate);
         console.debug('year (' + startDate.getFullYear() + ',' + endDate.getFullYear() + '): ' + (startDate.getFullYear() === endDate.getFullYear()));
         console.debug('month (' + startDate.getMonth() + ',' + endDate.getMonth() + '): ' + (startDate.getMonth() === endDate.getMonth()));
         console.debug('day (' + startDate.getDate() + ',' + endDate.getDate() + '): ' + (startDate.getDate() === endDate.getDate()));
         console.log('isSameDay: ' + isSameDay);
         */
        return isSameDay;
    };



    Date.prototype.addMinutes = function(minutes) {
        return new Date(this.getTime() + minutes * 60000);
    };

    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    };

    return Date;
});
