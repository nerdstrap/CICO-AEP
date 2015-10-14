'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');

var BaseFormView = require('views/BaseFormView');
var EventNameEnum = require('enums/EventNameEnum');
var StationTypeEnum = require('enums/StationTypeEnum');
var CheckInTypeEnum = require('enums/CheckInTypeEnum');
var validation = require('backbone-validation');
var utils = require('lib/utils');
var optionTemplate = require('templates/Option.hbs');
var template = require('templates/CheckInView.hbs');

var CheckInView = BaseFormView.extend({

    initialize: function (options) {
        BaseFormView.prototype.initialize.apply(this, arguments);
        options || (options = {});
        this.dispatcher = options.dispatcher || this;
        this.myPersonnelModel = options.myPersonnelModel;
        this.myOpenStationEntryLogModel = options.myOpenStationEntryLogModel;
        this.stationModel = options.stationModel;
        this.purposeCollection = options.purposeCollection;
        this.durationCollection = options.durationCollection;
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
        'click #cancel-check-in-button': 'cancelCheckIn'
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
        if (this.stationModel) {
            var hasHazard = this.stationModel.get('hasHazard');
            if (hasHazard === true) {
                isValid = false;
                this.trigger('error', utils.getResource('hazardErrorMessageText'));
            }
        }
        if (this.myOpenStationEntryLogModel) {
            var stationEntryLogId = this.myOpenStationEntryLogModel.get('stationEntryLogId');
            if (stationEntryLogId) {
                isValid = false;
                this.trigger('error', utils.getResource('openCheckInErrorMessageText'));
            }
        }
        return isValid;
    },

    updateModelFromDependencies: function () {
        this.model.set({
            stationId: this.stationModel.get('stationId'),
            stationName: this.stationModel.get('stationName'),
            stationType: this.stationModel.get('stationType'),
            latitude: this.stationModel.get('latitude'),
            longitude: this.stationModel.get('longitude'),
            personnelId: this.myPersonnelModel.get('personnelId'),
            personnelType: this.myPersonnelModel.get('personnelType'),
            userRole: this.myPersonnelModel.get('userRole'),
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
        var stationName = this.model.get('stationName');
        if (stationName) {
            this.$('#station-name-label').text(stationName);
        }
        return this;
    },

    updateDistanceLabel: function () {
        var distance = this.model.get('distance');
        if (distance) {
            this.$('#distance-label').text(utils.formatString(utils.getResource('distanceFormatString'), [distance.toFixed(2)]));
        } else {
            this.$('#distance-label').text(utils.getResource('distanceUnavailableErrorMessageText'));
        }
        return this;
    },

    updateContactNumberInput: function () {
        var contactNumber = this.model.get('contactNumber');
        if (contactNumber) {
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
        var duration = this.model.get('duration');
        if (duration) {
            this.$('#duration-input').val(duration);
        }
        return this;
    },

    updateExpectedOutTimeLabel: function (duration) {
        if (duration) {
            var currentTime = new Date();
            var expectedOutTime = utils.addMinutes(currentTime, duration);
            this.expectedOutTime = expectedOutTime;
        }
        if (this.expectedOutTime) {
            this.$('#expected-out-time-label').text(utils.formatDate(this.expectedOutTime));
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
        if (isValid) {
            this.checkIn();
        } else {
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
        var stationId = this.model.get('stationId');
        this.dispatcher.trigger(EventNameEnum.goToStationDetails, stationId);
        return this;
    },

    onCheckInSuccess: function () {
        var stationId = this.model.get('stationId');
        this.dispatcher.trigger(EventNameEnum.goToStationDetails, stationId);
        //var stationName = this.model.get('stationName');
        //var formattedInTime = utils.formatDate(this.model.get('inTime'));
        //var checkInSuccessMessageText = utils.formatString(utils.getResource('checkInSuccessMessageTextFormatString'), [stationName, formattedInTime]);
        //this.hideProgress();
        //this.showInfo(checkInSuccessMessageText);
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

    onError: function (error) {
        this.showError(error);
    }

});

module.exports = CheckInView;
