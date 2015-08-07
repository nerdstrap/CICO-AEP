define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var _purposes = [
        {
            "value": "60",
            "text": "change something"
        },
        {
            "value": "120",
            "text": "fix it"
        },
        {
            "value": "480",
            "text": "turn it off"
        },
        {
            "value": "",
            "text": "other"
        }
    ];
    var _durations = [
        {
            "value": "30",
            "text": "30 minutes"
        },
        {
            "value": "60",
            "text": "1 hour"
        },
        {
            "value": "120",
            "text": "2 hours"
        },
        {
            "value": "360",
            "text": "3 hours"
        },
        {
            "value": "480",
            "text": "4 hours"
        }
    ];
    var _areas = [
        {
            "value": "area1|region1",
            "text": "one"
        },
        {
            "value": "area2|region1",
            "text": "two"
        },
        {
            "value": "area3|region2",
            "text": "three"
        },
        {
            "value": "area4|region3",
            "text": "four"
        }
    ];

    var LookupDataItemRepository = function (options) {
        this.initialize.apply(this, arguments);
    };

    _.extend(LookupDataItemRepository.prototype, {

        initialize: function (options) {
        },

        getOptions: function (options) {
            options || (options = {});
            var deferred = $.Deferred();

            var error;
            var results = {
                purposes: _purposes,
                durations: _durations,
                areas: _areas
            };

            window.setTimeout(function () {
                if (error) {
                    deferred.reject(error);
                } else {
                    deferred.resolve(results);
                }
            }, 5);

            return deferred.promise();
        }
    });

    return LookupDataItemRepository;
});