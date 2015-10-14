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
var template = require('templates/CheckOutView.hbs');

var CheckOutView = BaseFormView.extend({

    initialize: function (options) {
        BaseFormView.prototype.initialize.apply(this, arguments);
        options || (options = {});
        this.dispatcher = options.dispatcher || this;
        this.myPersonnelModel = options.myPersonnelModel;
        this.myOpenStationEntryLogModel = options.myOpenStationEntryLogModel;
        this.stationModel = options.stationModel;
        this.listenTo(this.model, 'validated', this.onValidated);
        this.listenTo(this.dispatcher, EventNameEnum.checkOutSuccess, this.onCheckOutSuccess);
        this.listenTo(this.dispatcher, EventNameEnum.checkOutError, this.onCheckOutError);
        this.listenTo(this, 'loaded', this.onLoaded);
        this.listenTo(this, 'error', this.onError);
    },

    render: function () {
        this.setElement(template(this.renderModel(this.model)));
        this.bindValidation();
        return this;
    },

    events: {
        'input [data-input="text"]': 'formTextInput',
        'click [data-button="clear"]': 'clearFormInput',
        'click #submit-check-out-button': 'submitCheckOut',
        'click #cancel-check-out-button': 'cancelCheckOut'
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
        if (this.myOpenStationEntryLogModel) {
            var myOpenStationEntryLogModelOutTime = this.myOpenStationEntryLogModel.get('outTime');
            if (myOpenStationEntryLogModelOutTime) {
                isValid = false;
                this.trigger('error', utils.getResource('openCheckInErrorMessageText'));
            }
        }
        var outTime = this.model.get('outTime');
        if (outTime) {
            isValid = false;
            this.trigger('error', utils.getResource('alreadyCheckedOutErrorMessageText'));
        }
        return isValid;
    },

    updateViewFromModel: function () {
        this.updateAdditionalInfoInput();
        return this;
    },

    updateAdditionalInfoInput: function () {
        var additionalInfo = this.model.get('additionalInfo');
        if (additionalInfo) {
            this.$('#additional-info-input').val(additionalInfo);
        }
        return this;
    },

    submitCheckOut: function (event) {
        if (event) {
            event.preventDefault();
        }
        this.showProgress(utils.getResource('checkOutProgressMessageText'));
        this.updateModelFromView();
        this.model.validate();
        return this;
    },

    updateModelFromView: function () {
        var attributes = {};
        attributes.additionalInfo = this.$('#additional-info-input').val();
        this.model.set(attributes);
        return this;
    },

    onValidated: function (isValid, model, errors) {
        if (isValid) {
            this.checkOut();
        } else {
            this.showLoading();
        }
        return this;
    },

    checkOut: function () {
        this.dispatcher.trigger(EventNameEnum.checkOut, this.model);
        return this;
    },

    cancelCheckOut: function (event) {
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

    onCheckOutSuccess: function () {
        //var stationName = this.model.get('stationName');
        //var formattedOutTime = utils.formatDate(this.model.get('outTime'));
        //var checkOutSuccessMessageText = utils.formatString(utils.getResource('checkOutSuccessMessageTextFormatString'), [stationName, formattedOutTime]);
        //this.hideProgress();
        //this.showInfo(checkOutSuccessMessageText);
        this.dispatcher.trigger(EventNameEnum.goToStationSearch);
    },

    onCheckOutError: function (error) {
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

module.exports = CheckOutView;
