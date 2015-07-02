define(function(require) {

    "use strict";

    var $ = require('jquery'),
            BasePopupView = require('views/base/BasePopupView'),
            
            CICOLocationModel = require('models/CICOLocationModel'),
            validation = require('backbone-validation'),
            env = require('env'),
            template = require('hbs!templates/CheckIn'),
            loadingTemplate = require('tpl!templates/Progress'),
            cicoEvents = require('cico-events'),
            phoneNumberPattern = '({{999}}) {{999}}-{{9999}}';
    require('jquery-formatter'); // loads a jQuery plug-in. so, we don't use it directly

    return BasePopupView.extend({
        initialize: function(options) {
            console.debug('CheckInView.initialize');
            options || (options = {});

            this.popupOptions = {showCloseButton: false};

            this.myPersonnelModel = options.myPersonnelModel;
            this.stationModel = options.stationModel;
            this.dispatcher = options.dispatcher || this;
            this.locationModel = CICOLocationModel.getInstance();
            this.stationWarningCollection = options.stationWarningCollection;

            this.listenTo(this.model, 'change', this.updateModelFromView);
            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this.appDataModel, 'change', this.render);
            this.listenTo(this.appDataModel, 'error', this.showError);
            this.listenTo(this.stationWarningCollection, 'reset', this.addAllStationWarnings);
        },
        render: function() {
            console.debug('CheckInView.render');
            validation.unbind(this);
            this.renderError = false;
                if (!this.myPersonnelModel) {
                    // app data model is loaded, but we don't have the necessary userInfo
                    // this probably means the user is not in the PERSONNEL table
                    this.showError("The current user is not configured for Check-In functionality.");
                    this.renderError = true;
                    return this;
                }

                var templateModel = {
                    "stationEntryModel": this.model.attributes,
                    "appDataModel": this.appDataModel.attributes,
                    "stationModel": this.stationModel.attributes
                };
                this.$el.html(template(templateModel));
                validation.bind(this, {
                    selector: 'id'
                });
                this.$("#contactNumber").formatter({
                    'pattern': phoneNumberPattern,
                    'persistent': false
                });
                this.$("#contactNumber").formatter().resetPattern();
                this.validateAndSetProperty("stationType", this.stationModel.get('stationType'));
                if (this.stationModel.get('stationType') === 'TC') {
                    this.validateAndSetProperty("dispatchCenterId", '777');
                    this.$('#dispatchCenterId').hide();
                }
                this.updateModelFromView();
                this.$('#otherPurpose').closest('.row').hide();

            return this;
        },
        showError: function(errorMessage) {
            var msg = errorMessage || "Error retrieving data for Check-In Screen. Please call the dispatch center to check in.";
            this.dispatcher.trigger(cicoEvents.showErrorView, msg);
        },
        beforeShow: function(errorMessage) {
            if (!this.renderError) {
                var currentContext = this;
                currentContext.showLoading(true);
                currentContext.showStationEntryDialogs(false);
                currentContext.showStationWarningsDialog(false);
                currentContext.showCheckInDialog(false);
                currentContext.showDistanceDialog(false);

                if (currentContext.stationModel && currentContext.stationModel.get("hasCoordinates")) {
                    currentContext.locationModel.getCurrentPosition(
                            function(position) {
                                var distance = currentContext.locationModel.calculateDistanceFromCurrentPosition(currentContext.stationModel.get('coords'));
                                currentContext.stationModel.set('distanceInMiles', distance);
                                currentContext.stationModel.set('hasDistanceWarning', currentContext.stationModel.get('distanceInMiles') > env.getStationCheckinWarningDistance());
                                currentContext.beforeShowAfterGps();
                            },
                            function(error) {
                                currentContext.setStationDistanceError(currentContext.locationModel.get("errorMessage") || error);
                                currentContext.beforeShowAfterGps();
                            }
                    );
                } else {
                    currentContext.setStationDistanceError("Unable to determine distance.  Station is missing coordinates.");
                    currentContext.beforeShowAfterGps();
                }
                return true;
            } else {
                return false;
            }
        },
        getStationById: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/station/find'
            });
        },
        getStationWarningsByStationId: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: env.getApiUrl() + '/station/warning'
            });
        },
        addAllStationWarnings: function() {
            _.each(this.stationWarningCollection.models, this.addOneStationWarning, this);
        },
        addOneStationWarning: function(stationWarningModel) {
            var currentContext = this;
            var stationWarningText = '<li>' + stationWarningModel.get('warning') + '</li>';
            currentContext.$('#station-warnings-list').append(stationWarningText);
        },
        beforeShowAfterGps: function() {
            var currentContext = this;
//            this.stationModel.fetch({
//                success: function(model, resp, options) {
//                    // fetched refreshed stationModel 
//                    if (currentContext.checkHazardWarning()) {
//                        currentContext.hideLoadingStationDistance();
//                    }
//                    else {
//                        currentContext.checkDistanceWarning();
//                        if (!currentContext.stationModel.get('hasDistanceWarning')) {
//                            currentContext.checkRestrictedWarning();
//                            currentContext.hideLoadingStationDistance();
//                        }
//                    }
//                    currentContext.hideLoadingStationData();
//                }
//            });
            var stationId = this.model.get('stationId');
            var requestData = {
                'stationId': stationId
            };
            var idRegex = /^\d+$/;
            if (idRegex.test(stationId)) {
                requestData.stationType = 'TD';
                requestData.includeDol = true;
                requestData.includeNoc = false;
            } else {
                requestData.stationType = 'TC';
                requestData.includeDol = false;
                requestData.includeNoc = true;
            }
            if (requestData.stationType === 'TD') {
                $.when(currentContext.getStationById(requestData)).done(function(getStationsResponse) {
                    currentContext.model.set(getStationsResponse.stations[0]);
                    if (currentContext.checkHazardWarning()) {
                        currentContext.hideLoadingStationDistance();
                    }
                    else {
                        currentContext.checkDistanceWarning();
                        if (!currentContext.stationModel.get('hasDistanceWarning')) {
                            currentContext.checkStationWarnings();
                            currentContext.hideLoadingStationDistance();
                        }
                    }
                    currentContext.hideLoadingStationData();
                });
            } else {
                $.when(currentContext.getStationById(requestData), currentContext.getStationWarningsByStationId(requestData)).done(function(getStationsResponse, getStationWarningsResponse) {
                    var getStationsResponseData = getStationsResponse[0];
                    var getStationWarningsResponseData = getStationWarningsResponse[0];
                    currentContext.model.set(getStationsResponseData.stations[0]);
                    currentContext.stationWarningCollection.reset(getStationWarningsResponseData.stationWarnings);
                    if (currentContext.checkHazardWarning()) {
                        currentContext.hideLoadingStationDistance();
                    }
                    else {
                        currentContext.checkDistanceWarning();
                        if (!currentContext.stationModel.get('hasDistanceWarning')) {
                            currentContext.checkStationWarnings();
                            currentContext.hideLoadingStationDistance();
                        }
                    }
                    currentContext.hideLoadingStationData();
                });
            }
        },
        events: {
            "click #checkInBtn": "checkIntoStation",
            "click #checkInBtnCancel,#hazardWarningOk, #stationWarningsNo": "cancelCheckIn",
            "click #stationWarningsContinue": "onStationWarningsContinue",
            "keyup #contactNumber,#otherPurpose, #additionalInfo": "keyUp",
            "focus #contactNumber": "onContactNumberFocus",
            "change #selectPurpose": "selectPurpose",
            "change #duration": "selectDuration",
            "change #noHasCrew,#yesHasCrew": "hasCrewChange",
            "click #distanceWarningNo,#distanceWarningYes": "onDistanceWarningClick",
            "change #tdcRadio, #ddcRadio": "selectDispatchCenter",
            "click #clearManualSearchBtn": "onClearManualSearch"

        },
        /**** Form Handling ****/
        hasCrewChange: function(event) {
            var hasCrew = !this.$('#has-crew-row').hasClass('hasCrew');
            if (hasCrew) {
                this.$('#has-crew-row').addClass('hasCrew');
            }
            else {
                this.$('#has-crew-row').removeClass('hasCrew');
            }
            this.validateAndSetProperty("hasCrew", hasCrew);
        },
        selectPurpose: function(event) {
            var propName = event.target.id;
            var val = $(event.target).val();
            var label = $("option:selected", event.target).text();

            if (!this.durationManuallySelected)
            {
                if (val && this.$("#duration option[value=" + val + "]").length > 0) {
                    this.$("#duration option[value=" + val + "]").prop("selected", "selected");
                } else {
                    this.$("#duration option").prop("selected", "");
                }
            }

            this.validateAndSetProperty(propName, label);
            this.enableOtherPurpose(label === "Other");

        },
        selectDuration: function(event) {
            var propName = event.target.id,
                    val, label;
            if ($(event.target).prop("selectedIndex") === 0) {
                val = null;
                label = null;
            } else {
                val = $(event.target).val();
                label = $("option:selected", event.target).text();
                this.durationManuallySelected = true;
            }

            this.validateAndSetProperty(propName, val);
        },
        selectDispatchCenter: function(event) {
            var dc = $('input:radio[name=dispatchCenterId]:checked').attr("id");
            $('#dispatchCenterId').attr('data-dispatchCenter', dc);
            var dispatchCenterId = null;

            if (dc === "tdcRadio") {
                dispatchCenterId = this.stationModel.get("transmissionDispatchCenterId");
            } else if (dc === "ddcRadio") {
                dispatchCenterId = this.stationModel.get("distributionDispatchCenterId");
            }
            this.validateAndSetProperty("dispatchCenterId", dispatchCenterId);
        },
        keyUp: function(event) {
            var propName = event.target.id;
            var val = $(event.target).val();
            if (val && val.length > 0) {
                this.$('#clearManualSearchBtn').show();
            }
            this.validateAndSetProperty(propName, val);
        },
        onContactNumberFocus: function(event) {
            // using a timeout, otherwise the selection doesn't work
            setTimeout(function() {
                if (event.target.setSelectionRange) {
                    event.target.setSelectionRange(0, 15);
                } else {
                    event.target.select();
                }
            }, 10);
        },
        validateAndSetProperty: function(propName, val) {
            this.model.set(propName, val);
            this.model.validate(propName);

            //console.debug('validateAndSetProperty: ' + propName);

            if (this.model.isValid(propName)) {
                this.$('#' + propName).closest('.row').removeClass('cico-error');
            } else {
                this.$('#' + propName).closest('.row').addClass('cico-error');
            }

            //console.debug("isValid: " + this.model.isValid(propName) + " / " + this.model.isValid());
        },
        updateModelFromView: function() {
            var hasCrew = this.$("input:radio[name=switch-HasCrew]:checked").val();
            var contactNumber = this.$("#contactNumber").val();
            var purpose = this.$("#selectPurpose option:selected").text();
            var duration = $("#duration").val();
            var dc = $('input:radio[name=dispatchCenterId]:checked').attr("id");
            var dispatchCenterId = null;
            var additionalInfo = this.$("#additionalInfo").val();
            if (typeof (additionalInfo) !== "undefined") {
                additionalInfo = additionalInfo.trim();
            }

            if ($("#duration").prop("selectedIndex") === 0) {
                duration = null;
            }

            if (purpose === "Other") {
                var purposeOverride = this.$("#otherPurpose").val();
                purpose = purposeOverride;
            }
            else {
                this.enableOtherPurpose(false);
            }

            if (this.stationModel.get('stationType') === 'TD') {
                if (dc === "tdcRadio") {
                    dispatchCenterId = this.stationModel.get("transmissionDispatchCenterId");
                } else if (dc === "ddcRadio") {
                    dispatchCenterId = this.stationModel.get("distributionDispatchCenterId");
                }
            }

            if (this.stationModel.get('stationType') === 'TC') {
                this.validateAndSetProperty("linkedStationId", this.stationModel.get('linkedStationId'));
                this.validateAndSetProperty("linkedStationName", this.stationModel.get('linkedStationName'));
                this.validateAndSetProperty("stationName", this.stationModel.get('stationName'));
            }
            this.validateAndSetProperty("hasCrew", hasCrew);
            this.validateAndSetProperty("contactNumber", contactNumber);
            this.validateAndSetProperty("purpose", purpose);
            this.validateAndSetProperty("duration", duration);
            this.validateAndSetProperty("additionalInfo", additionalInfo);
            if (this.stationModel.get('stationType') === 'TC') {
                this.validateAndSetProperty("dispatchCenterId", '777');
                this.$('#dispatchCenterId').hide();
            } else if (this.stationModel.get('stationType') === 'TD') {
                this.validateAndSetProperty("dispatchCenterId", dispatchCenterId);
            }
            this.model.validate(true);

            if (contactNumber) {
                this.$('#clearManualSearchBtn').show();
            }
        },
        onValidated: function(isValid, model, errors) {
            if (isValid) {
                this.enableFormSubmit();
            } else {
//                console.error(errors);
                this.disableFormSubmit();
            }
        },
        enableFormSubmit: function() {
            this.$('#checkInBtn').removeClass('disabled').removeClass('secondary').addClass('success');
        },
        disableFormSubmit: function() {
            this.$('#checkInBtn').addClass('disabled').removeClass('success').addClass('secondary');
        },
        cancelCheckIn: function(event) {
            if (event) {
                event.preventDefault();
            }

            this.hide();
        },
        checkIntoStation: function(event) {
            if (event) {
                event.preventDefault();
            }

            if (this.model.isValid()) {
                this.dispatcher.trigger(cicoEvents.checkIntoStation, this.model);
                this.hide();
            }
        },
        enableOtherPurpose: function(enable) {
            var propName = "otherPurpose";
            if (enable) {
                this.$('#otherPurpose').closest('.row').show();
            } else {
                this.$('#otherPurpose').closest('.row').hide();
            }
            if (this.model.isValid(propName)) {
                this.$('#' + propName).closest('.row').removeClass('cico-error');
            } else {
                this.$('#' + propName).closest('.row').addClass('cico-error');
            }
            if (this.el.className === 'modal') {
                //this.recenter();
            }
        },
        /**** Hazard Handling ****/
        checkHazardWarning: function() {
            if (this.stationModel.get('hasHazard')) {
                this.showHazardDialog(true);
                return true;
            }
            else {
                this.showHazardDialog(false);
            }
            return false;
        },
        /**** Loading Handling ****/
        showLoading: function(show) {
            if (!show) {
                this.$('#loading-dialog').hide();
            }
            else {
                this.$('#loading-dialog').show();
            }
            this.tryRecent();
        },
        /**** Distance Handling ****/
        checkDistanceWarning: function() {
            if (this.stationModel && this.stationModel.get("hasCoordinates")) {
                var currentContext = this;
                currentContext.locationModel.getCurrentPosition(
                        function(position) {
                            var distance = currentContext.locationModel.calculateDistanceFromCurrentPosition(currentContext.stationModel.get('coords'));
                            currentContext.stationModel.set('distanceInMiles', distance);
                            currentContext.stationModel.set('hasDistanceWarning', currentContext.stationModel.get('distanceInMiles') > env.getStationCheckinWarningDistance());


                            if (currentContext.stationModel.get('distanceInMiles')) {
                                currentContext.$('.currentLocationSuccess').show();
                                currentContext.$('.distanceWarningDistance').html(currentContext.stationModel.get('distanceInMiles'));
                                currentContext.$('.currentLocationLoading').hide();
                            }

                            if (currentContext.stationModel.get('hasDistanceWarning')) {
                                currentContext.$('.stationDistance').addClass("hasDistanceWarning");
                                currentContext.showDistanceDialog(true);
                            }
                            else {
                                currentContext.showDistanceDialog(false);
                            }
                            currentContext.hideLoadingStationDistance();
                        },
                        function(error) {
                            currentContext.setStationDistanceError(currentContext.locationModel.get("errorMessage") || error);
                        }
                );
            }


        },
        onDistanceWarningClick: function(event) {
            if (event) {
                event.preventDefault();
                if (event.currentTarget.id === "distanceWarningNo") {
                    this.hide();
                }
                else {
                    this.showDistanceDialog(false);
                    if (!this.checkRestrictedWarning()) {
                        this.showCheckInDialog(true);
                    }
                }
            }
        },
        setStationDistanceError: function(errorMessage) {
            this.$('.currentLocationError').html(errorMessage).show();
            this.$('.currentLocationSuccess').hide();
            this.$('.currentLocationLoading').hide();
            this.showDistanceDialog(false);
            this.checkDistanceWarning();
        },
        /**** Restricted Handling ****/
        checkStationWarnings: function() {
            if (this.stationModel.get('hasWarnings')) {
                this.showStationWarningsDialog(true);
                this.showCheckInDialog(false);
                return true;
            }
            else {
                this.showStationWarningsDialog(false);
                this.showCheckInDialog(true);
                return false;
            }
        },
        onStationWarningsContinue: function(event) {
            event.preventDefault();
            this.showStationWarningsDialog(false);
            this.showCheckInDialog(true);
        },
        hideLoadingStationData: function() {
            this.canHideLoadingStationData = true;
            this.tryHideLoading();
        },
        hideLoadingStationDistance: function() {
            this.canHideLoadingStationDistance = true;
            this.tryHideLoading();
        },
        tryHideLoading: function() {
            if (this.canHideLoadingStationDistance && this.canHideLoadingStationData) {
                var currentContext = this;
                setTimeout(function() {
                    currentContext.showLoading(false);
                    currentContext.showStationEntryDialogs(true);
                }, 500);
            }
        },
        showStationEntryDialogs: function(show) {
            if (!show) {
                this.$('#stationEntry-dialogs').hide();
            }
            else {
                this.$('#stationEntry-dialogs').show();
                this.tryRecent();
            }
        },
        showCheckInDialog: function(show) {
            if (!show) {
                this.$('#checkIn-dialog').hide();
            }
            else {
                this.$('#checkIn-dialog').show();
                this.tryRecent();
            }
        },
        showStationWarningsDialog: function(show) {
            if (!show) {
                this.$('#station-warnings-dialog').hide();
            }
            else {
                this.$('#station-warnings-dialog').show();
                this.tryRecent();
            }
        },
        showHazardDialog: function(show) {
            if (!show) {
                this.$('#hazard-dialog').hide();
            }
            else {
                this.$('#hazard-dialog').show();
            }
            this.tryRecent();
        },
        showDistanceDialog: function(show) {
            if (!show) {
                this.$('#distance-dialog').hide();
            }
            else {
                if (this.stationModel && !this.stationModel.get('hasHazard')) {
                    this.$('#distance-dialog').show();
                }
            }
            this.tryRecent();
        },
        onClearManualSearch: function(event) {
            if (event) {
                event.preventDefault();
                this.$('#contactNumber').focus();
                this.$('#clearManualSearchBtn').hide();
            }
            this.$('#contactNumber').val('');
            this.validateAndSetProperty("contactNumber", "");

        },
        tryRecent: function() {
            if (this.el.className === 'modal') {
                this.recenter();
            }
        }
    });
});
