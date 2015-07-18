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
    var optionTemplate = require('hbs!templates/Option');
    var template = require('hbs!templates/AdHocCheckInModalView');

    var AdHocCheckInModalView = BaseModalView.extend({

        /**
         *
         * @param options
         */
        initialize: function (options) {
            options || (options = {});
            this.dispatcher = options.dispatcher || this;

            this.myPersonnelModel = options.myPersonnelModel;
            this.openEntryLogyModel = options.openEntryLogyModel;
            this.purposeCollection = options.purposeCollection;
            this.durationCollection = options.durationCollection;
            this.areaCollection = options.areaCollection;

            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this.purposeCollection, 'reset', this.renderPurposes);
            this.listenTo(this.durationCollection, 'reset', this.renderDurations);
            this.listenTo(this.areaCollection, 'reset', this.renderAreas);
            this.listenTo(this.dispatcher, EventNameEnum.checkInSuccess, this.onCheckInSuccess);
            this.listenTo(this.dispatcher, EventNameEnum.checkInError, this.onCheckInError);
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },

        /**
         *
         * @returns {AdHocCheckInModalView}
         */
        render: function () {
            var currentContext = this;
            currentContext.setElement(template());
            currentContext.bindValidation();
            return this;
        },

        /**
         *
         */
        events: {
            'change #purpose-input': 'purposeChanged',
            'change #duration-input': 'durationChanged',
            'click #submit-check-in-button': 'submitCheckIn',
            'click #cancel-check-in-button': 'cancelCheckIn'
        },

        /**
         *
         * @param purposes
         * @returns {AdHocCheckInModalView}
         */
        renderPurposes: function () {
            var currentContext = this;
            var optionsHtml = '';
            currentContext.purposeCollection.forEach(function (purposeModel) {
                optionsHtml += optionTemplate({
                    'value': purposeModel.get('value'),
                    'text': purposeModel.get('text')
                });
            });
            currentContext.$('#purpose-input').append(optionsHtml);
            return this;
        },

        /**
         *
         * @param durations
         * @returns {AdHocCheckInModalView}
         */
        renderDurations: function () {
            var currentContext = this;
            var optionsHtml = '';
            currentContext.durationCollection.forEach(function (durationModel) {
                optionsHtml += optionTemplate({
                    'value': durationModel.get('value'),
                    'text': durationModel.get('text')
                });
            });
            currentContext.$('#duration-input').append(optionsHtml);
            return this;
        },

        /**
         *
         * @param areas
         * @returns {AdHocCheckInModalView}
         */
        renderAreas: function () {
            var currentContext = this;
            var optionsHtml = '';
            currentContext.areaCollection.forEach(function (areaModel) {
                optionsHtml += optionTemplate({
                    'value': areaModel.get('value'),
                    'text': areaModel.get('text')
                });
            });
            currentContext.$('#area-input').append(optionsHtml);
            return this;
        },

        /**
         *
         * @returns {AdHocCheckInModalView}
         */
        bindValidation: function () {
            var currentContext = this;
            validation.bind(this, {
                selector: 'name'
            });
            return this;
        },
        /**
         *
         * @returns {AdHocCheckInModalView}
         */
        validateOpenEntryLogModel: function () {
            var currentContext = this;
            if (currentContext.openEntryLogyModel && currentContext.openEntryLogyModel.has('stationEntryLogId')) {
                currentContext.trigger('error');
            }
            return this;
        },
        /**
         *
         * @returns {AdHocCheckInModalView}
         */
        updateModelFromParentModels: function () {
            var currentContext = this;
            currentContext.model.set({
                personnelId: currentContext.myPersonnelModel.get('personnelId'),
                fullName: currentContext.myPersonnelModel.get('fullName'),
                firstName: currentContext.myPersonnelModel.get('firstName'),
                middleName: currentContext.myPersonnelModel.get('middleName'),
                lastName: currentContext.myPersonnelModel.get('lastName'),
                contactNumber: currentContext.myPersonnelModel.get('contactNumber'),
                email: currentContext.myPersonnelModel.get('email')
            });
            return this;
        },

        /**
         *
         * @returns {AdHocCheckInModalView}
         */
        updateViewFromModel: function () {
            var currentContext = this;
            currentContext.updateContactNumberInput();
            currentContext.updatePurposeInput();
            currentContext.updateDurationInput();
            currentContext.updateExpectedOutTimeInput();
            return this;
        },

        /**
         *
         * @returns {AdHocCheckInModalView}
         */
        updateGpsInput: function (latitude, longitude) {
            var currentContext = this;
            if (latitude && longitude) {
                var formattedGpsText = latitude.toString() + ', ' + longitude.toString();
                currentContext.$('#gps-input').val(formattedGpsText);
            } else {
                //show no coords
            }
            return this;
        },

        /**
         *
         * @returns {AdHocCheckInModalView}
         */
        updateContactNumberInput: function () {
            var currentContext = this;
            if (currentContext.model.has('contactNumber')) {
                var contactNumber = currentContext.model.get('contactNumber');
                var cleanedContactNumber = utils.cleanPhone(contactNumber);
                var formattedContactNumber = utils.formatPhone(cleanedContactNumber);
                currentContext.$('#contact-number-input').val(formattedContactNumber).parent().addClass('control-highlight');
            }
            return this;
        },

        /**
         *
         * @returns {AdHocCheckInModalView}
         */
        updatePurposeInput: function () {
            var currentContext = this;
            if (currentContext.model.has('purpose')) {
                var purpose = currentContext.model.get('purpose');
                currentContext.$('#purpose-input').val(purpose).parent().addClass('control-highlight');
            }
            return this;
        },

        /**
         *
         * @returns {AdHocCheckInModalView}
         */
        updateDurationInput: function (newDuration) {
            var currentContext = this;
            if (newDuration) {
                currentContext.model.set({duration: newDuration});
            }
            if (currentContext.model.has('duration')) {
                var duration = currentContext.model.get('duration');
                currentContext.$('#duration-input').val(duration).parent().addClass('control-highlight');
            }
            return this;
        },

        /**
         *
         * @returns {AdHocCheckInModalView}
         */
        updateExpectedOutTimeInput: function (duration) {
            var currentContext = this;
            if (duration) {
                var currentTime = new Date();
                var expectedOutTime = utils.addMinutes(currentTime, duration);
                currentContext.model.set({expectedOutTime: expectedOutTime});
            }
            if (currentContext.model.has('expectedOutTime')) {
                var expectedOutTime = currentContext.model.get('expectedOutTime');
                currentContext.$('#expected-out-time-input').val(utils.formatDate(expectedOutTime)).parent().addClass('control-highlight');
            }

            return this;
        },

        /**
         *
         * @param event
         * @returns {AdHocCheckInModalView}
         */
        purposeChanged: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            var purpose = currentContext.$('#purpose-input option:selected').text();
            currentContext.togglePurposeOther(purpose === 'Other');
            if (!currentContext.manualDurationEntry) {
                var defaultDuration = currentContext.$('#purpose-input').val();
                currentContext.updateDurationInput(defaultDuration);
                currentContext.updateExpectedOutTimeInput(defaultDuration);
            }
            return this;
        },

        /**
         *
         * @param show
         * @returns {AdHocCheckInModalView}
         */
        togglePurposeOther: function (show) {
            var currentContext = this;
            if (show) {
                currentContext.$('#purpose-other-input-container').removeClass('hidden');
            } else {
                currentContext.$('#purpose-other-input-container').addClass('hidden');
            }
            return this;
        },

        /**
         *
         * @param event
         * @returns {AdHocCheckInModalView}
         */
        durationChanged: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.manualDurationEntry = true;
            var duration = Number(currentContext.$('#duration-input').val());
            currentContext.updateExpectedOutTimeInput(duration);
            return this;
        },

        /**
         *
         * @param event
         * @returns {AdHocCheckInModalView}
         */
        submitCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.updateModelFromView();
            currentContext.model.validate();
            return this;
        },

        /**
         *
         * @returns {AdHocCheckInModalView}
         */
        updateModelFromView: function () {
            var currentContext = this;
            var attributes = {};

            var rawContactNumber = currentContext.$('#contact-number-input').val();
            attributes.contactNumber = utils.cleanPhone(rawContactNumber);
            attributes.purpose = currentContext.$('#purpose-input option:selected').text();
            if (currentContext.$('#purpose-input').prop('selectedIndex') === 0) {
                attributes.purpose = '';
            }
            if (attributes.purpose === 'Other') {
                attributes.purposeOther = currentContext.$('#purpose-other-input').val();
            }
            attributes.duration = currentContext.$('#duration-input').val();
            attributes.groupCheckIn = currentContext.$('#has-group-check-in-input').is(':checked');
            attributes.additionalInfo = currentContext.$('#additional-info-input').val();

            currentContext.model.set(attributes);
            return this;
        },

        /**
         *
         * @param isValid
         * @param model
         * @param errors
         * @returns {AdHocCheckInModalView}
         */
        onValidated: function (isValid, model, errors) {
            var currentContext = this;

            if (isValid) {
                currentContext.checkIn();
            } else {
                for (var error in errors) {
                    //currentContext.$('[name="' + error + '"]').parent().addClass('form-group-red');
                }
            }
            return this;
        },

        /**
         *
         * @param event
         * @returns {AdHocCheckInModalView}
         */
        checkIn: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.dispatcher.trigger(EventNameEnum.checkIn, currentContext.model);
            return this;
        },

        /**
         *
         * @returns {AdHocCheckInModalView}
         */
        show: function () {
            var currentContext = this;
            $('#ad-hoc-check-in-modal-view').foundation('reveal', 'open');
            return this;
        },

        /**
         *
         * @param event
         * @returns {AdHocCheckInModalView}
         */
        cancelCheckIn: function (event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            $('#ad-hoc-check-in-modal-view').foundation('reveal', 'close');
            return this;
        },

        /**
         *
         * @returns {AdHocCheckInModalView}
         */
        onCheckInSuccess: function () {
            var currentContext = this;
            var stationEntryLogId = currentContext.model.get('stationEntryLogId');
            currentContext.dispatcher.trigger(EventNameEnum.goToAdHocStationWithId, stationEntryLogId);
            return this;
        },

        /**
         *
         * @returns {AdHocCheckInModalView}
         */
        onCheckInError: function () {
            var currentContext = this;
            return this;
        },

        /**
         *
         */
        onError: function (error) {
            var currentContext = this;
            return this;
        },

        /**
         *
         */
        onLoaded: function () {
            console.trace('AdHocCheckInModalView.onLoaded');
            var currentContext = this;
            currentContext.validateOpenEntryLogModel();
            currentContext.updateModelFromParentModels();
            currentContext.updateViewFromModel();
        },

        /**
         *
         */
        onLeave: function () {
            console.trace('AdHocCheckInModalView.onLeave');
        }
    });

    return AdHocCheckInModalView;

});
