define(function(require) {

    "use strict";

    var internalStationEntries = 
            [{ "entryId": 1030014, "stationId": 1310, "userName": "Baltic, Michael", "firstName": "Michael", "lastName": "Baltic", "middleName": "E", "outsideId": "Gg3iq96j2nfkqgunJDNTgQ==", "purpose": "Communications &#x28;RTU&#x29;", "inTime": 1384292915693, "createdDate": 1384292915693, "createdBy": 5999, "hasCrew": false, "contact": "1234567890", "dcId": 12, "duration": 60, "cleanContact": "1234567890", "latitude": "39.95386785", "longitude": "-83.00370578", "stationName": "Canal Street", "stationPhone": "614-224-1065", "restrictedFlag": false, "hazardFlag": false, "hasOpenCheckins": true }, { "entryId": 1030008, "stationId": 1310, "userName": "Baltic, Michael", "firstName": "Michael", "lastName": "Baltic", "middleName": "E", "outsideId": "Gg3iq96j2nfkqgunJDNTgQ==", "purpose": "Battery Maintenance", "inTime": 1384289488940, "outTime": 1384291887614, "createdDate": 1384289488940, "createdBy": 5999, "modifiedDate": 1384291887614, "modifiedBy": 5999, "hasCrew": true, "contact": "1234567890", "dcId": 23, "duration": 60, "cleanContact": "1234567890", "latitude": "39.95386785", "longitude": "-83.00370578", "stationName": "Canal Street", "stationPhone": "614-224-1065", "restrictedFlag": false, "hazardFlag": false, "hasOpenCheckins": true }, { "entryId": 1029993, "stationId": 1311, "userName": "Baltic, Michael", "firstName": "Michael", "lastName": "Baltic", "middleName": "E", "outsideId": "Gg3iq96j2nfkqgunJDNTgQ==", "purpose": "Battery Maintenance", "inTime": 1384286441077, "outTime": 1384289464734, "createdDate": 1384286441077, "createdBy": 5999, "modifiedDate": 1384289464734, "modifiedBy": 5999, "hasCrew": false, "contact": "1234567890", "dcId": 23, "duration": 60, "cleanContact": "1234567890", "latitude": "39.96426237", "longitude": "-82.99761716", "stationName": "Gay Street", "stationPhone": "614-224-1067", "restrictedFlag": true, "hazardFlag": false, "hasOpenCheckins": false }],
    
    internalGetOne = function() {
        var deferred = $.Deferred(),
                results = internalStationEntries[0];
        deferred.resolve(results);
        return deferred.promise();
    },
    internalGetAll = function() {
        var deferred = $.Deferred(),
                results = internalStationEntries;
        deferred.resolve(results, 'success', null);
        return deferred.promise();
    },
    
    stationEntries = {
        getOne: function() {
            return internalGetOne();
        },
        getAll: function() {
            return internalGetAll();
        }
    };

    return stationEntries;

});