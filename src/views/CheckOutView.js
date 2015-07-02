define(function(require) {

    "use strict";

    var $ = require('jquery'),
            BasePopupView = require('views/base/BasePopupView'),
            
            env = require('env'),
            template = require('hbs!templates/CheckOut'),
            ConfirmWarningListView = require('views/ConfirmWarningListView'),
            loadingTemplate = require('hbs!templates/Progress');

    return BasePopupView.extend({
        initialize: function(options) {
            console.debug('CheckOutView.initialize');
            options || (options = {});
            this.controller = options.controller;
            this.checkOutModel = this.model;
            this.stationWarningCollection = options.stationWarningCollection;
            
            this.listenToOnce(this.stationWarningCollection, 'reset', this.renderWarningListView);
        },
        render: function() {
            this.renderError = false;

            var templateModel = {
                "checkOutModel": this.model.attributes
            };
            this.$el.html(template(templateModel));

            var currentContext = this;

            this.showAdditionalInfo();

            this.showLoadingEntryData(false);
            this.showCheckOutDialog(true);

            return this;
        },
        showError: function() {
            this.controller.showErrorView("Error retrieving data for Check-In Screen. Please call the dispatch center to check in.");
        },
        showErrorMessage: function(errorMsg) {
            this.controller.showErrorView(errorMsg);
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
            "click #checkOutBtn": "checkOut",
            "click #cancel-checkOutBtn": "cancelCheckOut"
        },
        cancelCheckOut: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.hide();
        },
        checkOut: function(event) {
            if (event) {
                event.preventDefault();
            }

            if (this.stationWarningCollection) {
                if (this.allStationWarningsConfirmed()) {
                    var stationWarningIds;
                    var lastConfirmedBy;
                    var currentStationEntry;
                    this.model.set('stationWarningIds', this.stationWarningCollection.map(function(stationWarning) {
                        return stationWarning.get('stationWarningId');
                    }));
                    this.model.set('lastConfirmedBy', this.model.get('userName'));
                    var additionalInfo = this.$('#additionalInfo').val();
                    if (typeof (additionalInfo) !== "undefined") {
                        additionalInfo = additionalInfo.trim();
                    }
                    currentStationEntry = this.model.getCurrentStationEntry();
                    stationWarningIds = this.model.get('stationWarningIds');
                    lastConfirmedBy = currentStationEntry.get('userName');
                    this.controller.checkOutOfStation(currentStationEntry, additionalInfo, stationWarningIds, lastConfirmedBy);
                    this.hide();
                } else {
                    var message = "One or more station warnings have not been confirmed.";
                    this.showErrorMessage(message);
                }
            } else {
                this.checkOut();
            }
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
                    currentContext.showCheckOutDialogs(true);
                }, 500);
            }
        },
        showCheckOutDialogs: function(show) {
            if (!show) {
                this.$('#check-out-dialogs').hide();
            }
            else {
                this.$('#check-out-dialogs').show();
                this.tryRecent();
            }
        },
        showCheckOutDialog: function(show) {
            if (!show) {
                this.$('#check-out-dialog').hide();
            }
            else {
                this.$('#check-out-dialog').show();
                this.tryRecent();
            }
        },
        tryRecent: function() {
            if (this.el.className === 'modal') {
                this.recenter();
            }
        },
        showAdditionalInfo: function() {
            var additionalInfo = this.model.stationEntry.get('additionalInfo');
            if (typeof (additionalInfo) !== "undefined") {
                this.$('#additionalInfo').html(additionalInfo);
            }
        },
        renderWarningListView: function() {
            console.debug('CheckOutView.renderWarningListView');
            var currentContext = this;
            if (currentContext.stationWarningCollection.length > 0) {
                if (currentContext.model.get('stationEntry').get('checkInType') === 1) {
                    var confirmWarningListView = new ConfirmWarningListView({
                        collection: currentContext.stationWarningCollection,
                        el: $('#stationWarnings', currentContext.$el),
                        appDataModel: currentContext.appDataModel,
                        dispatcher: this.dispatcher
                    });

                    confirmWarningListView.render();
                    confirmWarningListView.addAll();
                    currentContext.$('#station-warning-dialog').removeClass('hidden');
                }
            }
        },
        allStationWarningsConfirmed: function() {
            var currentContext = this;
            if (currentContext.stationWarningCollection) {
                return _.every(currentContext.stationWarningCollection.models, function(stationWarningModel) {
                    return stationWarningModel.get('confirmed') === true;
                }, currentContext);
            }
            return true;
        }
    });
});