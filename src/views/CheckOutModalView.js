define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseModalView = require('views/BaseModalView');
    var EventNameEnum = require('enums/EventNameEnum');
    var CheckInTypeEnum = require('enums/CheckInTypeEnum');
    var validation = require('backbone-validation');
    var utils = require('utils');
    var template = require('hbs!templates/CheckOutModalView');

    var CheckOutModalView = BaseModalView.extend({

        id: '#check-out-modal-view',

        initialize: function (options) {
            BaseModalView.prototype.initialize.apply(this, arguments);
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.myPersonnelModel = options.myPersonnelModel;
            this.myOpenStationEntryLogModel = options.myOpenStationEntryLogModel;
            this.stationModel = options.stationModel;

            this.$validating = this.$('.validating');

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
            'click #cancel-check-out-button': 'cancelCheckOut',
            'click .ok-modal-button': 'hide'
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
                this.trigger('error', utils.getResource('hazardErrorMessage'));
            }
            if (this.myOpenStationEntryLogModel && this.myOpenStationEntryLogModel.has('outTime')) {
                isValid = false;
                this.trigger('error', utils.getResource('openCheckInErrorMessage'));
            }
            if (this.model.has('outTime') === true) {
                isValid = false;
                this.trigger('error', utils.getResource('alreadyCheckedOutErrorMessage'));
            }
            return isValid;
        },

        updateViewFromModel: function () {
            this.updateAdditionalInfoInput();
            return this;
        },

        updateAdditionalInfoInput: function () {
            if (this.model.has('additionalInfo')) {
                var additionalInfo = this.model.get('additionalInfo');
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
            this.$validating.removeClass('invalid');
            if (isValid) {
                this.checkOut();
            } else {
                for (var error in errors) {
                    this.$('[name="' + error + '"]').parent().addClass('invalid');
                }
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
            this.hide();
            return this;
        },

        onCheckOutSuccess: function () {
            var stationName = this.model.get('stationName');
            var formattedOutTime = utils.formatDate(this.model.get('outTime'));
            var checkOutSuccessMessageText = utils.formatString(utils.getResource('checkOutSuccessMessageTextFormatString'), [stationName, formattedOutTime]);
            this.hideProgress();
            this.showInfo(checkOutSuccessMessageText);
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

    return CheckOutModalView;

});
