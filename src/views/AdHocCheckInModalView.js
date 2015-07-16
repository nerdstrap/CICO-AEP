define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseModalView = require('views/BaseModalView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var validation = require('backbone-validation');
    var template = require('hbs!templates/AdHocCheckInModalView');

    var AdHocCheckInModalView = BaseModalView.extend({
        initialize: function(options) {
            console.debug('AdHocCheckInView.initialize');
            options || (options = {});

            this.popupOptions = {showCloseButton: false};

            this.myPersonnelModel = options.myPersonnelModel;
            this.dispatcher = options.dispatcher || this;

            this.listenTo(this.model, 'change', this.updateModelFromView);
            this.listenTo(this.model, 'validated', this.onValidated);
        },
        render: function() {
            console.debug('AdHocCheckInView.render');
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
                "myPersonnelModel": this.myPersonnelModel.attributes
            };
            this.$el.html(template(templateModel));
            validation.bind(this, {
                selector: 'id'
            });
            this.$("#contactNumber").formatter({
                'pattern': phoneNumberPattern,
                'persistent': false
            });
            this.$("#contactNumber").val(this.myPersonnelModel.get('fixedPhone'));
            this.$("#contactNumber").formatter().resetPattern();
            this.validateAndSetProperty("dispatchCenterId", '777');
            this.validateAndSetProperty("stationType", 'TC');
            this.updateModelFromView();
            this.$('#otherPurpose').closest('.row').hide();

            return this;
        },
        showError: function(errorMessage) {
            var msg = errorMessage || "Error retrieving data for Check-In Screen. Please call the dispatch center to check in.";
            this.dispatcher.trigger(EventNameEnum.showErrorView, msg);
        },
        beforeShow: function(errorMessage) {
            if (!this.renderError) {
                var currentContext = this;
                currentContext.showLoading(true);
                currentContext.showStationEntryDialogs(false);

                currentContext.locationModel.getCurrentPosition(
                        function(position) {
                            currentContext.$('.currentLocationLoading').addClass('hidden');
                            currentContext.$('#latitude').html(position.coords.latitude);
                            currentContext.$('#longitude').html(position.coords.longitude);
                            currentContext.validateAndSetProperty("latitude", position.coords.latitude);
                            currentContext.validateAndSetProperty("longitude", position.coords.longitude);
                            currentContext.beforeShowAfterGps();
                        },
                        function(error) {
                            currentContext.$('.currentLocationLoading').addClass('hidden');
                            currentContext.$('.currentLocationSuccess').addClass('hidden');
                            currentContext.$('.currentLocationError').html('position unavailable');
                            currentContext.beforeShowAfterGps();
                        }
                );
                return true;
            } else {
                return false;
            }
        },
        beforeShowAfterGps: function() {
            var currentContext = this;
            $.when(currentContext.getOptions()).done(function(getOptionsResponse) {
                var getOptionsData = getOptionsResponse;
                currentContext.purposeCollection = new Backbone.Collection(getOptionsData.nocPurposes);
                currentContext.durationCollection = new Backbone.Collection(getOptionsData.nocDurations);
                currentContext.areaCollection = new Backbone.Collection(getOptionsData.nocAreas);
                currentContext.addAllPurposes();
                currentContext.addAllDurations();
                currentContext.addAllAreas();
                currentContext.hideLoadingStationData();
                currentContext.showCheckInDialog(true);
            });
        },
        getOptions: function(options) {
            options || (options = {});
            var data = $.param(options);

            return $.ajax({
                contentType: 'application/json',
                data: data,
                dataType: 'json',
                type: 'GET',
                url: config.apiUrl() + '/lookupDataItem/find/options'
            });
        },
        events: {
            "click #checkInBtn": "checkIntoStation",
            "click #checkInBtnCancel,#hazardWarningOk": "cancelCheckIn",
            "keyup #description": "keyUp2",
            "keyup #contactNumber,#otherPurpose, #additionalInfo": "keyUp",
            "focus #contactNumber": "onContactNumberFocus",
            "change #selectPurpose": "selectPurpose",
            "change #duration": "selectDuration",
            "change #noHasCrew,#yesHasCrew": "hasCrewChange",
            "click #clearManualSearchBtn": "onClearManualSearch",
            "click #clearAdHocBtn": "onClearAdHoc",
            "change #areaName": "selectArea"

        },
        addAllDurations: function() {
            _.each(this.durationCollection.models, this.addOneDuration, this);
        },
        addOneDuration: function(durationModel) {
            var currentContext = this;
            var durationText = '<option value="' + durationModel.get('itemValue') + '">' + durationModel.get('itemText') + '</li>';
            currentContext.$('#duration').append(durationText);
        },
        addAllPurposes: function() {
            _.each(this.purposeCollection.models, this.addOnePurpose, this);
            this.addOnePurpose(new Backbone.Model({itemText: 'Other', itemAdditionalData: ''}));
        },
        addOnePurpose: function(purposeModel) {
            var currentContext = this;
            var purposeText = '<option value="' + purposeModel.get('itemAdditionalData') + '">' + purposeModel.get('itemText') + '</li>';
            currentContext.$('#selectPurpose').append(purposeText);
        },
        addAllAreas: function() {
            _.each(this.areaCollection.models, this.addOneArea, this);
        },
        addOneArea: function(areaModel) {
            var currentContext = this;
            var areaText = '<option value="' + areaModel.get('regionName') + '|' + areaModel.get('areaName') + '">' + areaModel.get('areaName') + '</li>';
            currentContext.$('#areaName').append(areaText);
        },
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
        selectArea: function(event) {
            var areaName, regionName;
            if ($(event.target).prop("selectedIndex") === 0) {
                areaName = null;
                regionName = null;
            } else {
                var areaRegion = $(event.target).val().split('|');
                areaName = areaRegion[0];
                regionName = areaRegion[1];
            }

            this.validateAndSetProperty('areaName', areaName);
            this.validateAndSetProperty('regionName', regionName);
        },
        keyUp: function(event) {
            var propName = event.target.id;
            var val = $(event.target).val();
            if (val && val.length > 0) {
                this.$('#clearManualSearchBtn').show();
            }
            this.validateAndSetProperty(propName, val);
        },
        keyUp2: function(event) {
            var propName = event.target.id;
            var val = $(event.target).val();
            if (val && val.length > 0) {
                this.$('#clearAdHocBtn').show();
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
            var description = this.$("#description").val();
            var latitude = this.$("#latitude").text();
            var longitude = this.$("#longitude").text();
            var areaName;
            var regionName;
            var areaRegion;
            if ($("#areaName").prop("selectedIndex") !== undefined && $("#areaName").prop("selectedIndex") !== 0) {
                areaRegion = $("#areaName").val().split('|');
                areaName = areaRegion[0];
                regionName = areaRegion[1];
            }

            this.validateAndSetProperty("hasCrew", hasCrew);
            this.validateAndSetProperty("contactNumber", contactNumber);
            this.validateAndSetProperty("purpose", purpose);
            this.validateAndSetProperty("duration", duration);
            this.validateAndSetProperty("additionalInfo", additionalInfo);
            this.validateAndSetProperty("dispatchCenterId", '777');

            this.validateAndSetProperty("description", description);
            this.validateAndSetProperty("latitude", latitude);
            this.validateAndSetProperty("longitude", longitude);
            this.validateAndSetProperty("areaName", areaName);
            this.validateAndSetProperty("regionName", regionName);

            this.model.validate(true);

            if (description) {
                this.$('#clearAdHocBtn').show();
            }
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
                this.dispatcher.trigger(EventNameEnum.checkIntoStation, this.model);
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
        showLoading: function(show) {
            if (!show) {
                this.$('#loading-dialog').hide();
            }
            else {
                this.$('#loading-dialog').show();
            }
            this.tryRecent();
        },
        hideLoadingStationData: function() {
            this.canHideLoadingStationData = true;
            this.tryHideLoading();
        },
        tryHideLoading: function() {
            if (this.canHideLoadingStationData) {
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
        onClearManualSearch: function(event) {
            if (event) {
                event.preventDefault();
                this.$('#contactNumber').focus();
                this.$('#clearManualSearchBtn').hide();
            }
            this.$('#contactNumber').val('');
            this.validateAndSetProperty("contactNumber", "");

        },
        onClearAdHoc: function(event) {
            if (event) {
                event.preventDefault();
                this.$('#description').focus();
                this.$('#clearAdHocBtn').hide();
            }
            this.$('#description').val('');
            this.validateAndSetProperty("description", "");

        },
        tryRecent: function() {
            if (this.el.className === 'modal') {
                this.recenter();
            }
        }
    });
    
    return AdHocCheckInModalView;
});
