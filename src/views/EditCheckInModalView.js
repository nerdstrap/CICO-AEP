define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseModalView = require('views/BaseModalView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var validation = require('backbone-validation');
    var template = require('hbs!templates/EditCheckInModalView');

    var EditCheckInModalView = BaseModalView.extend({
        initialize: function(options) {
            console.debug('DurationView.initialize');
            options || (options = {});
            this.durationModel = this.model;
        },
        render: function() {
            this.renderError = false;

            var templateModel = {
                "durationModel": this.model.attributes
            };
            this.$el.html(template(templateModel));

            var currentContext = this;
            this.showOldExpectedTime();
            this.setAdditionalMinutes();
            this.showNewExpectedTime();
            this.showAdditionalInfo();

            this.showLoadingEntryData(false);
            this.showExtendDurationDialog(true);

            return this;
        },
        showError: function() {
            this.controller.showErrorView("Error retrieving data for Check-In Screen. Please call the dispatch center to check in.");
        },
        addAllDurations: function() {
            this.addOneDuration(new Backbone.Model({itemText: '0 Minutes', itemValue: '0'}));
            _.each(this.durationCollection.models, this.addOneDuration, this);
        },
        addOneDuration: function(durationModel) {
            var currentContext = this;
            var durationText = '<option value="' + durationModel.get('itemValue') + '">' + durationModel.get('itemText') + '</li>';
            currentContext.$('#additionalHours').append(durationText);
        },
        getOptions: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/lookupDataItem/find/options'
            });
        },
        beforeShow: function(errorMessage) {
            var currentContext = this;
            if (!this.renderError) {
                currentContext.showLoading(true);
                currentContext.beforeShowAfterGps();
                return true;
            } else {
                return false;
            }
        },
        beforeShowAfterGps: function() {
            var currentContext = this;
            $.when(currentContext.getOptions()).done(function(getOptionsResponse) {
                var getOptionsData = getOptionsResponse;
                currentContext.durationCollection = new Backbone.Collection(getOptionsData.nocDurations);
                currentContext.addAllDurations();
                currentContext.hideLoadingStationData();
            });
        },
        events: {
            "click #extend-durationBtn": "extendDuration",
            "click #cancel-extend-durationBtn": "cancelExtendDuration",
            "change #additionalHours": "setAdditionalMinutes"
        },
        cancelExtendDuration: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.hide();
        },
        extendDuration: function(event) {
            if (event) {
                event.preventDefault();
            }

            var additionalInfo = this.$('#additionalInfo').val();
            if (typeof (additionalInfo) !== "undefined") {
                additionalInfo = additionalInfo.trim();
            }

            currentContext.dispatcher.trigger(EventNameEnum.extendDuration, this.model.getCurrentStationEntry(), this.model, additionalInfo);
            this.hide();
        },
        showLoading: function(show) {
            if (!show) {
                this.$('#loading-dialog').hide();
            }
            else {
                this.$('#loading-dialog').show();
            }
            this.tryRecent();
        },
        showLoadingEntryData: function(show) {
            if (!show) {
                this.canHideLoadingEntryData = true;
                this.tryHideLoading();
            }
            else {
                this.canHideLoadingEntryData = false;
                this.tryRecent();
            }
        },
        hideLoadingStationData: function() {
            this.canHideLoadingStationData = true;
            this.tryHideLoading();
        },
        tryHideLoading: function() {
            if (this.canHideLoadingEntryData && this.canHideLoadingStationData) {
                var currentContext = this;
                setTimeout(function() {
                    currentContext.showLoading(false);
                    currentContext.showExtendDurationDialogs(true);
                }, 500);
            }
        },
        showExtendDurationDialogs: function(show) {
            if (!show) {
                this.$('#extend-duration-dialogs').hide();
            }
            else {
                this.$('#extend-duration-dialogs').show();
                this.tryRecent();
            }
        },
        showExtendDurationDialog: function(show) {
            if (!show) {
                this.$('#extend-duration-dialog').hide();
            }
            else {
                this.$('#extend-duration-dialog').show();
                this.tryRecent();
            }
        },
        tryRecent: function() {
            if (this.el.className === 'modal') {
                this.recenter();
            }
        },
        getOldDuration: function() {
            return this.model.getCurrentDuration() || 0;
        },
        getNewDuration: function() {
            var oldDuration = this.getOldDuration();
            var extendedDuration = this.$('#additionalHours').val();

            return Number(oldDuration) + Number(extendedDuration);
        },
        showOldExpectedTime: function() {
            this.$('.expectedCheckOutTime').html(this.model.getCurrentExpectedCheckOutTimeString());
        },
        setAdditionalMinutes: function() {
            var additionalMinutes = this.$('#additionalHours').val();
            this.model.setNewDuration(additionalMinutes);
            this.showNewExpectedTime();
        },
        showNewExpectedTime: function() {
            var newExpectedCheckOutTime = this.model.getNewExpectedCheckOutTimeString();
            this.$('.expectedCheckOutTimeNew').html(newExpectedCheckOutTime);
        },
        showAdditionalInfo: function() {
            var additionalInfo = this.model.stationEntry.get('additionalInfo');
            if (typeof (additionalInfo) !== "undefined") {
                this.$('#additionalInfo').html(additionalInfo);
            }
        }
    });

    return EditCheckInModalView;
});