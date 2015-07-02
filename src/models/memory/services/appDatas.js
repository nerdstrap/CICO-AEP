define(function (require) {

    "use strict";

        var internalAppDatas = [
            {"userInfo":{"personnelId":15495,"firstName":"Michael","lastName":"Baltic","middleName":"E","cellPhone":"1234567890","aepId":"Gg3iq96j2nfkqgunJDNTgQ=="},"stationEntryPurposes":[{"purpose":"Battery Maintenance","defaultDuration":60},{"purpose":"Communications (RTU)","defaultDuration":60},{"purpose":"Construction","defaultDuration":60},{"purpose":"Contractor Work","defaultDuration":60},{"purpose":"Equipment Maintenance","defaultDuration":60},{"purpose":"Facility Maintenance","defaultDuration":60},{"purpose":"Investigate Alarm","defaultDuration":60},{"purpose":"Job Planning","defaultDuration":60},{"purpose":"Material Handling","defaultDuration":60},{"purpose":"Metering","defaultDuration":60},{"purpose":"Monthly Readings","defaultDuration":60},{"purpose":"Protection and Control","defaultDuration":60},{"purpose":"Security Check","defaultDuration":60},{"purpose":"Site Meeting","defaultDuration":60},{"purpose":"Station Inspection","defaultDuration":60},{"purpose":"Switching","defaultDuration":60},{"purpose":"Targets and Operations","defaultDuration":60},{"purpose":"Unloading Materials","defaultDuration":60},{"purpose":"Weed Control","defaultDuration":60},{"purpose":"Wiring","defaultDuration":60},{"purpose":"Work On Isolated Equipment","defaultDuration":60},{"purpose":"Yard Maintenance (fence, grounding, etc.)","defaultDuration":60}],"durations":[{"description":"30 Minutes","duration":30},{"description":"1 Hour","duration":60},{"description":"1.5 Hours","duration":90},{"description":"2 Hours","duration":120},{"description":"2.5 Hours","duration":150},{"description":"3 Hours","duration":180},{"description":"3.5 Hours","duration":210},{"description":"4 Hours","duration":240},{"description":"4.5 Hours","duration":270},{"description":"5 Hours","duration":300},{"description":"5.5 Hours","duration":330},{"description":"6 Hours","duration":360},{"description":"6.5 Hours","duration":390},{"description":"7 Hours","duration":420},{"description":"7.5 Hours","duration":450},{"description":"8 Hours","duration":480}],"restrictedMessageRules":["Secure facility.","Please notify the SOC if you are ESCORTING!"],"maxDurExpiration":"30","helpDeskPhoneNumber":"8668353050","socPhoneNumber":"8667475845"}
        ],

        internalGetOne = function (userId) {
            var deferred = $.Deferred(),
            result = internalAppDatas[0];
            deferred.resolve(result);
            return deferred.promise();
        },

        appDatas = {

            getOne: function () {
                return internalGetOne();
            }
        };

    return appDatas;

});