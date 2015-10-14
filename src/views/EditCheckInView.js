'use strict';

var Backbone = require('backbone');
Backbone.$ = require('jquery');
var $ = Backbone.$;
var _ = require('underscore');
var BaseFormView = require('views/BaseFormView');
var EventNameEnum = require('enums/EventNameEnum');
var CheckInTypeEnum = require('enums/CheckInTypeEnum');
var validation = require('backbone-validation');
var utils = require('lib/utils');
var optionTemplate = require('templates/Option.hbs');
var template = require('templates/EditCheckInView.hbs');

var EditCheckInView = BaseFormView.extend({

    initialize: function (options) {
        BaseFormView.prototype.initialize.apply(this, arguments);
        options || (options = {});
        this.dispatcher = options.dispatcher || this;
        this.myPersonnelModel = options.myPersonnelModel;
        this.myOpenStationEntryLogModel = options.myOpenStationEntryLogModel;
        this.stationModel = options.stationModel;
        this.durationCollection = options.durationCollection;
        this.listenTo(this.model, 'validated', this.onValidated);
        this.listenTo(this.durationCollection, 'reset', this.renderDurations);
        this.listenTo(this.dispatcher, EventNameEnum.editCheckInSuccess, this.onEditCheckInSuccess);
        this.listenTo(this.dispatcher, EventNameEnum.editCheckInError, this.onEditCheckInError);
        this.listenTo(this, 'error', this.onError);
        this.listenTo(this, 'loaded', this.onLoaded);
    },

    render: function () {
        this.setElement(template(this.renderModel(this.model)));
        this.bindValidation();
        return this;
    },

    events: {
        'input [data-input="text"]': 'formTextInput',
        'click [data-button="clear"]': 'clearFormInput',
        'change #duration-input': 'durationChanged',
        'click #submit-edit-check-in-button': 'submitEditCheckIn',
        'click #cancel-edit-check-in-button': 'cancelEditCheckIn'
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
        if (this.model.get('checkInType') === CheckInTypeEnum.station && this.stationModel.get('hasHazard') === true) {
            isValid = false;
            this.trigger('error', utils.getResource('hazardErrorMessageText'));
        }
        if (this.myOpenStationEntryLogModel && this.myOpenStationEntryLogModel.get('stationEntryLogId') !== this.model.get('stationEntryLogId')) {
            isValid = false;
            this.trigger('error', utils.getResource('openCheckInErrorMessageText'));
        }
        var outTime = this.model.get('outTime');
        if (outTime) {
            isValid = false;
            this.trigger('error', utils.getResource('alreadyCheckedOutErrorMessageText'));
        }
        return isValid;
    },

    updateViewFromModel: function () {
        this.updateExpectedOutTimeLabel();
        this.updateAdditionalInfoInput();
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

    updateAdditionalInfoInput: function () {
        var additionalInfo = this.model.get('additionalInfo');
        if (additionalInfo) {
            this.$('#additional-info-input').val(additionalInfo);
        }
        return this;
    },

    durationChanged: function (event) {
        if (event) {
            event.preventDefault();
        }
        var originalDuration = Number(this.model.get('duration'));
        var additionalDuration = Number(this.$('#duration-input').val());
        this.updateExpectedOutTimeLabel(originalDuration + additionalDuration);
        return this;
    },

    submitEditCheckIn: function (event) {
        if (event) {
            event.preventDefault();
        }
        this.showProgress(false, utils.getResource('editCheckInProgressMessageText'));
        this.updateModelFromView();
        this.model.validate();
        return this;
    },

    updateModelFromView: function () {
        var attributes = {};
        var originalDuration = Number(this.model.get('duration'));
        var additionalDuration = Number(this.$('#duration-input').val());
        attributes.duration = originalDuration + additionalDuration;
        attributes.additionalInfo = this.$('#additional-info-input').val();
        this.model.set(attributes);
        return this;
    },

    onValidated: function (isValid, model, errors) {
        if (isValid) {
            this.editCheckIn();
        } else {
            this.showLoading();
        }
        return this;
    },

    editCheckIn: function () {
        this.dispatcher.trigger(EventNameEnum.editCheckIn, this.model);
        return this;
    },

    cancelEditCheckIn: function (event) {
        if (event) {
            event.preventDefault();
        }
        var stationId = this.model.get('stationId');
        if (stationId) {
            this.dispatcher.trigger(EventNameEnum.goToStationDetails, stationId);
        } else {
            var stationEntryLogId = this.model.get('stationEntryLogId');
            this.dispatcher.trigger(EventNameEnum.goToAdHocStationDetails, stationEntryLogId);
        }
        return this;
    },

    onEditCheckInSuccess: function () {
        var stationId = this.model.get('stationId');
        if (stationId) {
            this.dispatcher.trigger(EventNameEnum.goToStationDetails, stationId);
        } else {
            var stationEntryLogId = this.model.get('stationEntryLogId');
            this.dispatcher.trigger(EventNameEnum.goToAdHocStationDetails, stationEntryLogId);
        }
        //var stationName = this.model.get('stationName');
        //var editCheckInSuccessMessageText = utils.formatString(utils.getResource('editCheckInSuccessMessageTextFormatString'), [stationName]);
        //this.hideProgress();
        //this.showInfo(editCheckInSuccessMessageText);
    },

    onEditCheckInError: function (error) {
        this.showError(error);
    },

    onLoaded: function () {
        if (this.validatePreconditions()) {
            this.updateViewFromModel();
            this.showLoading();
        }
    },

    onError: function (error) {
        this.showError(error);
    }

});

module.exports = EditCheckInView;
