define(function(require) {

    "use strict";

    var $ = require('jquery'),
            BasePopupView = require('views/base/BasePopupView'),
            
            env = require('env'),
            template = require('hbs!templates/Duration'),
            loadingTemplate = require('hbs!templates/Progress');

    return BasePopupView.extend({
        initialize: function(options) {
            console.debug('DurationView.initialize');
            options || (options = {});
            this.controller = options.controller;
            this.durationModel = this.model;
        },
        render: function() {
            this.renderError = false;

            var templateModel = {
                "durationModel": this.model.attributes
            };
            this.$el.html(template(templateModel));

            var currentContext = this;
            currentContext.$('#additionalHours').append('<option value="0">0 Minutes</option>');
            $.each(this.model.get('durations'), function(ndx, duration) {
                if (ndx === 0) {
                    currentContext.$('#additionalHours').append('<option value="' + duration.itemValue + '" select="selected">' + duration.itemText + '</option>');
                } else {
                    currentContext.$('#additionalHours').append('<option value="' + duration.itemValue + '">' + duration.itemText + '</option>');
                }
            });

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
        beforeShow: function(errorMessage) {
            if (!this.renderError) {
                var currentContext = this;
                currentContext.showLoading(true);
                return true;
            } else {
                return false;
            }
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

            this.controller.extendDuration(this.model.getCurrentStationEntry(), this.model, additionalInfo);
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
        tryHideLoading: function() {
            if (this.canHideLoadingEntryData) {
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
});