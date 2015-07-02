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

    var CheckOutModel = Backbone.Model.extend({
        defaults: {
        },
        initialize: function(options) {
            options || (options = {});
            this.stationEntry = options.stationEntry || null;
        },
        getCurrentStationEntry: function() {
            return this.stationEntry;
        },
        setCurrentStationEntry: function(stationEntryModel) {
            console.debug('durationModel.setCurrentStationEntry');
            this.set('stationEntry', stationEntryModel);
        }
    });

    return CheckOutModel;
});