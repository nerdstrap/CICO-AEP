define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseModalView = require('views/BaseModalView');
    var EventNameEnum = require('enums/EventNameEnum');
    var StationTypeEnum = require('enums/StationTypeEnum');
    var CheckInTypeEnum = require('enums/CheckInTypeEnum');
    var validation = require('backbone-validation');
    var utils = require('utils');
    var optionTemplate = require('hbs!templates/Option');
    var template = require('hbs!templates/CheckInModalView');

    var CheckInModalView = BaseModalView.extend({

        id: '#check-in-modal-view',

        initialize: function (options) {
            BaseModalView.prototype.initialize.apply(this, arguments);
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.myPersonnelModel = options.myPersonnelModel;
            this.myOpenStationEntryLogModel = options.myOpenStationEntryLogModel;
            this.stationModel = options.stationModel;
            this.purposeCollection = options.purposeCollection;
            this.durationCollection = options.durationCollection;

            this.$validating = this.$('.validating');

            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this.purposeCollection, 'reset', this.renderPurposes);
            this.listenTo(this.durationCollection, 'reset', this.renderDurations);
            this.listenTo(this.dispatcher, EventNameEnum.checkInSuccess, this.onCheckInSuccess);
            this.listenTo(this.dispatcher, EventNameEnum.checkInError, this.onCheckInError);
            this.listenTo(this, 'error', this.onError);
            this.listenTo(this, 'loaded', this.onLoaded);
        },

        render: function () {
            this.setElement(template(this.renderModel()));
            this.bindValidation();
            return this;
        },

        events: {
            'input [data-input="tel"]': 'formTelephoneInput',
            'input [data-input="text"]': 'formTextInput',
            'click [data-button="clear"]': 'clearFormInput',
            'change #purpose-input': 'purposeChanged',
            'change #duration-input': 'durationChanged',
            'click #submit-check-in-button': 'submitCheckIn',
            'click #cancel-check-in-button': 'cancelCheckIn',
            'click .ok-modal-button': 'hide'
        },

        renderPurposes: function () {
            var optionsHtml = '';
            this.purposeCollection.forEach(function (purposeModel) {
                optionsHtml += optionTemplate({
                    'value': purposeModel.get('value'),
                    'text': purposeModel.get('text')
                });
            });
            this.$('#purpose-input').append(optionsHtml);
            return this;
        },

        renderDurations: function () {
            var optionsHtml = '';
            this.durationCollection.forEach(function (durationModel) {
                optionsHtml += optionTemplate({
                    'value': durationModel.get('value'),
                    'text': durationModel.get('text')
                });
            });
            this.$('#duration-input').append(optionsHtml);
            return this;
        },

        bindValidation: function () {
            validation.bind(this, {
                selector: 'name'
            });
            return this;
        },

        validatePreconditions: function () {
            var isValid = true;
            if (this.stationModel.get('hasHazard') === true) {
                isValid = false;
                this.trigger('error', utils.getResource('hazardErrorMessage'));
            }
            if (this.myOpenStationEntryLogModel && this.myOpenStationEntryLogModel.has('stationEntryLogId')) {
                isValid = false;
                this.trigger('error', utils.getResource('openCheckInErrorMessage'));
            }
            return isValid;
        },

        updateModelFromDependencies: function () {
            this.model.set({
                stationId: this.stationModel.get('stationId'),
                stationName: this.stationModel.get('stationName'),
                stationType: this.stationModel.get('stationType'),
                distance: this.stationModel.get('distance'),
                latitude: this.stationModel.get('latitude'),
                longitude: this.stationModel.get('longitude'),
                personnelId: this.myPersonnelModel.get('personnelId'),
                userName: this.myPersonnelModel.get('userName'),
                userRole: this.myPersonnelModel.get('userRole'),
                personnelType: this.myPersonnelModel.get('personnelType'),
                firstName: this.myPersonnelModel.get('firstName'),
                middleName: this.myPersonnelModel.get('middleName'),
                lastName: this.myPersonnelModel.get('lastName'),
                contactNumber: this.myPersonnelModel.get('contactNumber'),
                email: this.myPersonnelModel.get('email'),
                companyName: this.myPersonnelModel.get('companyName')
            });
            return this;
        },

        updateViewFromModel: function () {
            this.updateStationNameLabel();
            this.updateDistanceLabel();
            this.updateContactNumberInput();
            return this;
        },

        updateStationNameLabel: function () {
            if (this.model.has('stationName')) {
                var stationName = this.model.get('stationName');
                this.$('#station-name-label').text(stationName);
            }
            return this;
        },

        updateDistanceLabel: function () {
            if (this.model.has('distance')) {
                var distance = this.model.get('distance').toFixed(2);
                this.$('#distance-label').text(utils.formatString(utils.getResource('distanceFormatString'), [distance]));
            } else {
                this.$('#distance-label').text(utils.getResource('distanceUnavailableErrorMessage'));
            }
            return this;
        },

        updateContactNumberInput: function () {
            if (this.model.has('contactNumber')) {
                var contactNumber = this.model.get('contactNumber');
                this.$('#contact-number-input').val(utils.formatPhone(contactNumber));
                this.$('[data-parent="#contact-number-input"]').toggleClass('hidden', (contactNumber.length === 0));
            }
            return this;
        },

        updateDurationInput: function (newDuration) {
            if (newDuration) {
                this.model.set({
                    duration: newDuration
                });
            }
            if (this.model.has('duration')) {
                var duration = this.model.get('duration');
                this.$('#duration-input').val(duration);
            }
            return this;
        },

        updateExpectedOutTimeLabel: function (duration) {
            if (duration) {
                var currentTime = new Date();
                var expectedOutTime = utils.addMinutes(currentTime, duration);
                this.model.set({
                    expectedOutTime: expectedOutTime
                });
            }
            if (this.model.has('expectedOutTime')) {
                this.$('#expected-out-time-label').text(utils.formatDate(this.model.get('expectedOutTime')));
            }

            return this;
        },

        purposeChanged: function (event) {
            if (event) {
                event.preventDefault();
            }
            var purpose = this.$('#purpose-input option:selected').text();
            this.$('#purpose-other-input-container').toggleClass('hidden', (purpose !== 'other'));
            if (!this.manualDurationEntry) {
                var defaultDuration = this.$('#purpose-input').val();
                this.updateDurationInput(defaultDuration);
                this.updateExpectedOutTimeLabel(defaultDuration);
            }
            return this;
        },

        durationChanged: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.manualDurationEntry = true;
            var duration = Number(this.$('#duration-input').val());
            this.updateExpectedOutTimeLabel(duration);
            return this;
        },

        submitCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.showProgress(false, utils.getResource('checkInProgressMessageText'));
            this.updateModelFromView();
            this.model.validate();
            return this;
        },

        updateModelFromView: function () {
            var attributes = {};
            var rawContactNumber = this.$('#contact-number-input').val();
            attributes.contactNumber = utils.cleanPhone(rawContactNumber);
            attributes.purpose = this.$('#purpose-input option:selected').text();
            if (this.$('#purpose-input').prop('selectedIndex') === 0) {
                attributes.purpose = '';
            }
            if (attributes.purpose === 'other') {
                attributes.purposeOther = this.$('#purpose-other-input').val();
            }
            attributes.duration = this.$('#duration-input').val();
            attributes.withCrew = this.$('#yes-with-crew-input').is(':checked');
            var selectedDispatchCenter = this.$('input:radio[name="dispatchCenterId"]:checked').attr('id');
            if (selectedDispatchCenter === 'transmission-dispatch-center-check-in-input') {
                attributes.dispatchCenterId = this.stationModel.get('transmissionDispatchCenterId');
            } else if (selectedDispatchCenter === 'distribution-dispatch-center-check-in-input') {
                attributes.dispatchCenterId = this.stationModel.get('distributionDispatchCenterId');
            }
            attributes.additionalInfo = this.$('#additional-info-input').val();
            this.model.set(attributes);
            return this;
        },

        onValidated: function (isValid, model, errors) {
            this.$validating.removeClass('invalid');
            if (isValid) {
                this.checkIn();
            } else {
                for (var error in errors) {
                    this.$('[name="' + error + '"]').parent().addClass('invalid');
                }
                this.showLoading();
            }
            return this;
        },

        checkIn: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger(EventNameEnum.checkIn, this.model);
            return this;
        },

        cancelCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.hide();
            return this;
        },

        onCheckInSuccess: function () {
            var stationName = this.model.get('stationName');
            var formattedInTime = utils.formatDate(this.model.get('inTime'));
            var checkInSuccessMessageText = utils.formatString(utils.getResource('checkInSuccessMessageTextFormatString'), [stationName, formattedInTime]);
            this.hideProgress();
            this.showInfo(checkInSuccessMessageText);
        },

        onCheckInError: function (error) {
            this.showError(error);
        },

        onLoaded: function () {
            if (this.validatePreconditions()) {
                this.updateModelFromDependencies();
                this.updateViewFromModel();
                this.showLoading();
            }
        },
        
        onError: function(error) {
            this.showError(error);
        }

    });

    return CheckInModalView;

});
