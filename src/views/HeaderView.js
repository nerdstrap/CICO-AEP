define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var EventNameEnum = require('enums/EventNameEnum');
    var CheckInStatusEnum = require('enums/CheckInStatusEnum');
    var template = require('hbs!templates/HeaderView');

    var HeaderView = BaseView.extend({
        
        initialize: function (options) {
            BaseView.prototype.initialize.apply(this, arguments);
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.dispatcher, EventNameEnum.myPersonnelReset, this.updateOpenCheckInMenu);
        },

        render: function () {
            this.setElement(template(this.renderModel(this.model)));
            return this;
        },

        events: {
            'click #app-title-button': 'goToStationSearch',
            'click #go-to-station-search-button': 'goToStationSearch',
            'click #go-to-personnel-search-button': 'goToPersonnelSearch',
            'click #go-to-open-check-in-button': 'goToOpenCheckIn'
        },

        updateOpenCheckInMenu: function (myPersonnelModel, myOpenStationEntryLogModel) {
            this.$('#go-to-open-check-in-button-container').addClass('hidden');
            this.myPersonnelModel = myPersonnelModel;
            this.myOpenStationEntryLogModel = myOpenStationEntryLogModel;
            if (this.myOpenStationEntryLogModel) {
                var checkInStatus = this.myOpenStationEntryLogModel.get('checkInStatus');
                if (checkInStatus === CheckInStatusEnum.checkedOut) {
                    // do nothing
                } else {
                    this.$('#go-to-open-check-in-button-container').removeClass('hidden');
                    //green
                    if (checkInStatus === CheckInStatusEnum.overdue) {
                        //yellow
                    }
                    if (checkInStatus === CheckInStatusEnum.expired) {
                        //red
                    }
                }
            }
            return this;
        },

        goToStationSearch: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(EventNameEnum.goToStationSearch);
        },

        goToPersonnelSearch: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(EventNameEnum.goToPersonnelSearch);
        },

        goToOpenCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }
            var stationId = this.myOpenStationEntryLogModel.get('stationId');
            if (stationId) {
                this.dispatcher.trigger(EventNameEnum.goToStationDetailWithId, stationId);
            } else {
                var stationEntryLogId = this.myOpenStationEntryLogModel.get('stationEntryLogId');
                this.dispatcher.trigger(EventNameEnum.goToAdHocStationWithId, stationEntryLogId);
            }
        }

    });

    return HeaderView;
});