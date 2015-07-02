define(function(require) {
    /*
     * Duration list
     * CurrentStationEntry
     */
    'use strict';
    var $ = require('jquery'),
            Backbone = require('backbone'),
            
            env = require('env'),
            globals = require('globals'),
            module = require('module');

    var DurationModel = Backbone.Model.extend({
        defaults: {
            estimatedDuration: 0,
            additionalMinutes: 0,
            newDuration: 0,
            durations: []
        },
        initialize: function(options) {
            options || (options = {});
            console.debug('Backbone : DurationModel : Initialized');
            this.stationEntry = options.stationEntry || null;
            this.durations = options.durations || [];
        },
        getDurationOptions: function() {
            return this.durations;
        },
        setDurations: function(durations) {
            this.set('durations', durations);
        },
        getCurrentStationEntry: function() {
            return this.stationEntry;
        },
        setCurrentStationEntry: function(stationEntryModel) {
            console.debug('durationModel.setCurrentStationEntry');
            this.set('stationEntry', stationEntryModel);
        },
        getCurrentIntimeDate: function() {
            if (this.get('stationEntry')) {
                return this.get('stationEntry').getIntimeDate();
            }
            else {
                return null;
            }
        },
        getCurrentDuration: function() {
            console.debug('DurationModel.getCurrentDuration');
            var currentDuration = 0;
            if (this.has('stationEntry') && this.get('stationEntry').get('duration')) {
                currentDuration = Number(this.get('stationEntry').get('duration'));
            }
            return currentDuration;
        },
        getCurrentExpectedCheckOutTime: function() {
            console.debug('DurationModel.getCurrentExpectedCheckOutTime');
            if (this.get('stationEntry')) {
                return this.get('stationEntry').getExpectedCheckOutTime();
            }
            return null;
        },
        getCurrentExpectedCheckOutTimeString: function() {
            if (this.get('stationEntry')) {
                return this.get('stationEntry').getExpectedCheckOutTimeString();
            }
            else{
                return "unable to determine expected checkout date";
            }
        },
        getAdditionalMinutes: function() {
            if (this.has('additionalMinutes')) {
                return Number(this.get('additionalMinutes'));
            } else {
                return 0;
            }
        },
        setNewDuration: function(additionalMinutes) {
            this.set('additionalMinutes', Number(additionalMinutes));
        },
        getNewDuration: function() {
            console.debug('DurationModel.getNewDuration');
            var oldDuration = this.getCurrentDuration();
            var additionalMinutes = this.get('additionalMinutes');
            var newDuration = Number(oldDuration) + Number(additionalMinutes);
            return newDuration;
        },
        getNewExpectedCheckOutTime: function() {
            console.debug('DurationModel.getNewExpectedCheckOutTime');
            var newDuration = this.getNewDuration();
            var inDate = this.getCurrentIntimeDate();
            var expectedCheckOutTime = new Date();
            if (newDuration && inDate) {
                expectedCheckOutTime = inDate.addMinutes(newDuration);
            }
            return expectedCheckOutTime;
        },
        getNewExpectedCheckOutTimeString: function() {
            console.debug('DurationModel.getNewExpectedCheckOutTimeString');
            var expectedCheckOutTime = this.getNewExpectedCheckOutTime();
            var expectedCheckOutTimeString = '';
            expectedCheckOutTimeString = expectedCheckOutTime.cicoDate();
            return expectedCheckOutTimeString;
        }
    });

    return DurationModel;
});