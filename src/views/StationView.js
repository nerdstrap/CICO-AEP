define(function(require) {
    'use strict';

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            env = require('env'),
            CICOLocationModel = require('models/CICOLocationModel'),
            CompositeView = require('views/base/CompositeView'),
            NameLinkTypeEnum = require('enums/NameLinkTypeEnum'),
            StationEntryListTypeEnum = require('enums/StationEntryListTypeEnum'),
            StationEntryOpenView = require('views/StationEntryOpenView'),
            StationEntryListView = require('views/StationEntryListView'),
            AbnormalConditionListView = require('views/AbnormalConditionListView'),
            StationWarningListView = require('views/StationWarningListView'),
            template = require('hbs!templates/Station'),
            stationDataTemplate = require('hbs!templates/StationData'),
            stationHazardTemplate = require('hbs!templates/HazardInfo'),
            gpsDistanceTemplate = require('hbs!templates/partial/GpsDistancePartial');

    var StationView = CompositeView.extend({
        className: 'details-view station-details-view',
        stationLoadingMessage: 'Getting Station Info...',
        defaultTitleText: 'Station Info',
        defaultHazardTitleText: 'Hazard Details',
        stationErrorMessage: 'Error - Station',
        getDefaultsForRendering: function() {
            return {
                stationLoadingMessage: this.stationLoadingMessage,
                defaultTitleText: this.defaultTitleText,
                stationErrorMessage: this.stationErrorMessage,
                defaultHazardTitleText: this.defaultHazardTitleText
            };
        },
        initialize: function(options) {
            console.debug('StationView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher || this;
            this.locationModel = CICOLocationModel.getInstance();

            this.settingsModel = options.settingsModel;
            this.myPersonnelModel = options.myPersonnelModel;
            this.stationEntryLogCollection = options.stationEntryCollection;
            this.abnormalConditionCollection = options.abnormalConditionCollection;
            this.stationWarningCollection = options.stationWarningCollection;
            this.openStationEntryLogModel = options.stationEntryOpenModel;

            this.listenTo(this, 'loaded', this.onLoaded);
        },
        render: function() {
            console.debug('StationView.render');
            var currentContext = this;
            this.$el.html(template());

            var openStationEntryLogViewInstance = new StationEntryOpenView({
                dispatcher: currentContext.dispatcher,
                el: $('#stationEntryOpenView', currentContext.$el),
                stationModel: currentContext.model,
                stationEntryLogModel: currentContext.openStationEntryLogModel
            });
            this.renderChild(openStationEntryLogViewInstance);

            var stationOpenCheckInsView = new StationEntryListView({
                dispatcher: currentContext.dispatcher,
                el: $('.stationCheckIns.open', currentContext.$el),
                collection: currentContext.stationEntryLogCollection,
                myPersonnelModel: currentContext.myPersonnelModel,
                stationEntryListType: StationEntryListTypeEnum.open,
                nameLinkType: NameLinkTypeEnum.personnel
            });
            this.renderChild(stationOpenCheckInsView);

            var stationRecentCheckInsView = new StationEntryListView({
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationEntryLogCollection,
                el: $('.stationCheckIns.recent', currentContext.$el),
                stationModel: currentContext.model,
                myPersonnelModel: currentContext.myPersonnelModel,
                stationEntryListType: StationEntryListTypeEnum.historical,
                nameLinkType: NameLinkTypeEnum.personnel
            });
            this.renderChild(stationRecentCheckInsView);

            if (this.model.get('stationType') === 'TD') {
                var abnormalConditionListView = new AbnormalConditionListView({
                    dispatcher: currentContext.dispatcher,
                    el: $('#stationAbnormalConditions', currentContext.$el),
                    collection: currentContext.abnormalConditionCollection,
                    myPersonnelModel: currentContext.myPersonnelModel
                });
                this.renderChild(abnormalConditionListView);
            }

            if (this.model.get('stationType') === 'TC') {
                var stationWarningListView = new StationWarningListView({
                    dispatcher: currentContext.dispatcher,
                    el: $('#stationWarnings', currentContext.$el),
                    collection: currentContext.stationWarningCollection,
                    myPersonnelModel: currentContext.myPersonnelModel,
                    stationModel: currentContext.model,
                    stationEntryLogModel: currentContext.openStationEntryLogModel
                });

                this.renderChild(stationWarningListView);
            }

            return this;
        },
        renderWarnings: function() {
            if (this.model.has('restrictedFlag') && this.model.get('restrictedFlag')) {
                if (this.settingsModel && this.settingsModel.has('socPhoneNumber')) {
                    this.$('.soc-info').removeClass('hidden');
                    this.$('.soc-phone').html(env.getFormattedPhoneNumberLink(this.myPersonnelModel.get('socPhoneNumber')));
                }
                this.$('.restricted-text-icon').removeClass('hidden');
            }
            if (this.model.has('hasHazard') && this.model.get('hasHazard')) {
                this.$('.hazard-text-icon').removeClass('hidden');
                var hazardModel = _.extend({}, this.model.attributes, this.getDefaultsForRendering());
                this.$('#stationHazard').html(stationHazardTemplate(hazardModel));
            }
            if (this.model.has('hasWarnings') && this.model.get('hasWarnings')) {
                this.$('.warning-text-icon').removeClass('hidden');
            }
        },
        updateViewFromModel: function() {
            var currentContext = this;

            if (this.model.has('stationType') && this.model.get('stationType') === 'TC') {
                this.$('.telecom-text-icon').removeClass('hidden');
                if (this.model.has("linkedStationId") && this.model.has('linkedStationName') && (this.model.get('linkedStationName').length > 0)) {
                    this.$('.linked-station-text-icon').removeClass('hidden');
                }
                this.$('.distribution-dispatch-center').addClass('hidden');
                this.$('.transmission-dispatch-center').addClass('hidden');
                this.$('.noc-dispatch-center').removeClass('hidden');
            }

            if (this.model.get('hasCoordinates')) {
                this.locationModel.getCurrentPosition(
                        function(position) {
                            var distanceInMiles = currentContext.locationModel.calculateDistanceFromCurrentPosition(position.coords, currentContext.model.get('coords'));
                            currentContext.model.set('distanceInMiles', distanceInMiles);
                            currentContext.updateViewFromModelAfterGps();
                        },
                        function() {
                            currentContext.updateViewFromModelAfterGps();
                        }
                );
            } else {
                currentContext.updateViewFromModelAfterGps();
            }
        },
        updateViewFromModelAfterGps: function() {
            this.$('.station-name').html(this.model.get('stationName'));

            this.setDispatchCenterDetails(
                    '.transmission-dispatch-center',
                    this.model.get('transmissionDispatchCenterId'),
                    this.model.get('transmissionDispatchCenterName'),
                    this.model.get('transmissionDispatchCenterPhone'));

            this.setDispatchCenterDetails(
                    '.distribution-dispatch-center',
                    this.model.get('distributionDispatchCenterId'),
                    this.model.get('distributionDispatchCenterName'),
                    this.model.get('distributionDispatchCenterPhone'));

            this.setDispatchCenterDetails(
                    '.noc-dispatch-center',
                    this.model.get('nocDispatchCenterId'),
                    this.model.get('nocDispatchCenterName'),
                    this.model.get('nocDispatchCenterPhone'));

            var renderModel = _.extend({}, this.model.attributes, this.getDefaultsForRendering());

            this.$('#stationData').html(stationDataTemplate(renderModel));

            this.renderWarnings();
            this.setDirectionLink();
            this.showDispatchCenterIndicator();
        },
        events: {
            'click a.sectionButton': 'sectionClick',
            'click a.directions-text-link': 'goToDirections'
        },
        sectionClick: function(event) {
            if ($(event.target).closest('section').hasClass('disabled')) {
                return false;
            }
            else {
                $('html, body').animate({
                    scrollTop: $(event.target).closest('section').offset().top
                }, 250);
            }
        },
        goToDirections: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.dispatcher.trigger('goToDirections', this.model);
        },
        setDirectionLink: function() {
            var currentContext = this;
            currentContext.$('.station-distance-directions').html(gpsDistanceTemplate(this.model.attributes));
        },
        showDispatchCenterIndicator: function() {
            if (this.openStationEntryLogModel) {
                if (this.openStationEntryLogModel
                        && this.openStationEntryLogModel.get('stationId')
                        && this.openStationEntryLogModel.get('stationId').toString() === this.model.get('stationId')
                        ) {
                    this.$('.dcSection[data-dcid="' + this.openStationEntryLogModel.get('dcId') + '"] .indicator').removeClass('hidden');
                }
            }
        },
        setDispatchCenterDetails: function(containerSelector, id, name, phone) {
            var container = this.$(containerSelector);
            container.attr('data-dcid', id);
            $('.dispatch-center', container).html(name);
            $('.dispatch-center', containerSelector).html(name);
            if (phone) {
                $('.dispatch-phone', container).html(env.getFormattedPhoneNumberLink(phone));
                $('.dispatch-phone', containerSelector).html(env.getFormattedPhoneNumberLink(phone));
            }
        },
        getRecentStationEntries: function() {
            this.stationEntryLogCollection.getRecentStationEntriesByStationId(this.model.get('stationId'), this.model.get('stationType'));
        },
        getAbnormalConditions: function() {
            if (this.model.get('stationType') === 'TD') {
                this.abnormalConditionCollection.getAbnormalConditionsByStationId(this.model.get('stationId'));
            }
        },
        getStationWarnings: function() {
            if (this.model.get('stationType') === 'TC') {
                this.stationWarningCollection.getStationWarningsByStationId(this.model.get('stationId'));
            }
        },
        onLoaded: function() {
            this.$('.wait-for-loaded').removeClass('wait-for-loaded');
            this.$('.station-primary-details-loading').hide();
            this.updateViewFromModel();
            this.getRecentStationEntries();
            this.getAbnormalConditions();
            this.getStationWarnings();
        }
    });

    return StationView;
});
