define(function(require) {

    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            validation = require('backbone-validation'),
            CompositeView = require('views/base/CompositeView'),
            template = require('hbs!templates/AddWarningListItem'),
            cicoEvents = require('cico-events');

    var AddWarningListView = CompositeView.extend({
        tagName: 'li',
        className: 'row',
        initialize: function(options) {
            console.trace('AddWarningListView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.userRole = options.userRole;
            this.parentModel = options.parentModel;

            this.listenTo(this.model, 'validated', this.onValidated);
            this.listenTo(this, 'leave', this.onLeave);

            this.listenTo(this.model, cicoEvents.addWarningSuccess, this.onAddWarningSuccess);
//            this.listenTo(this.model, AppEventNamesEnum.addWarningError, this.onAddWarningError);
        },
        render: function() {
            console.trace('AddWarningListView.render()');
            var currentContext = this;
            validation.unbind(currentContext);
            var renderModel = _.extend({}, currentContext.model.attributes);
            currentContext.$el.html(template(renderModel));
            currentContext.updateViewFromModel();

            validation.bind(this, {
                selector: 'name'
            });

            return this;
        },
        events: {
            'click .add-station-warning-button': 'validateAndSubmitWarning',
            'click .reset-add-station-warning-button': 'revertChanges'
//            'click .close-alert-box-button': 'closeAlertBox'
        },
        validateAndSubmitWarning: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.updateModelFromView();
            this.model.validate();
        },
        updateViewFromModel: function() {
            var currentContext = this;
            if (currentContext.model.has('warning')) {
                currentContext.$('.warning-input').val(currentContext.model.get('warning').toString());
            } else {
                currentContext.$('.warning-input').val('');
            }
        },
        updateModelFromView: function() {
            var currentContext = this;
            if (currentContext.$('.warning-input').val() !== currentContext.model.get('warning')) {
                var stationId = currentContext.parentModel.get('stationId');
                var warning = currentContext.$('.warning-input').val();
                var firstReportedBy;
                var openStationEntry;
                if(currentContext.parent.parent.appDataModel){
                    openStationEntry = currentContext.parent.parent.appDataModel.get('openStationEntry');
                }
                if(openStationEntry && openStationEntry.get('userName')){
                    firstReportedBy = openStationEntry.get('userName');
                }
                currentContext.model.set({
                    firstReportedBy: firstReportedBy,
                    stationId: stationId,
                    warning: warning
                });
            }
        },
        onValidated: function(isValid, model, errors) {
            if (isValid) {
                if (this.model.has('warning') && this.model.get('warning')) {
                    this.addWarning();
                }
            } else {
//                var message = utils.getResource('validationErrorMessage');
//                this.showError(message);
            }
        },
        revertChanges: function(event) {
            if (event) {
                event.preventDefault();
            }
            var currentContext = this;
            currentContext.$('.warning-input').val('').removeClass('invalid');
            currentContext.model.unset('warning');
        },
        addWarning: function() {
            cicoEvents.trigger(cicoEvents.addWarning, this.model);
        },
        onAddWarningSuccess: function(stationWarningModel) {
            cicoEvents.trigger(cicoEvents.addWarningSuccess, stationWarningModel);
            this.leave();
        },
        onAddWarningError: function(message) {
            this.hideLoading();
            this.showError(message);
        },
        setUserName: function(userName) {
            this.userName = userName;
        }
    });

    return AddWarningListView;

});