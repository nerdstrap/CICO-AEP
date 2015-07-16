define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var BaseView = require('views/BaseView');
    var config = require('config');
    var EventNameEnum = require('enums/EventNameEnum');
    var template = require('hbs!templates/PersonnelView');

    var PersonnelView = BaseView.extend({
        className: 'details-view personnel-details-view',
        initialize: function(options) {
            console.debug('PersonnelView.initialize');
            options || (options = {});
            this.dispatcher = options.dispatcher;
            this.myPersonnelModel = options.myPersonnelModel;
            this.stationEntryLogCollection = options.stationEntryLogCollection;
            this.openStationEntryLogModel = options.openStationEntryLogModel;
            
            this.listenTo(this, 'loaded', this.onLoaded);
            this.listenTo(this, 'leave', this.onLeave);
        },
        render: function() {
            console.debug('PersonnelView.render');
            var currentContext = this;
            currentContext.$el.html(template(currentContext.model.attributes));

            currentContext.stationOpenCheckInsView = new StationEntryCollectionView({
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationEntryLogCollection,
                el: $('.stationCheckIns.open', currentContext.$el),
                myPersonnelModel: currentContext.myPersonnelModel,
                nameLinkType: NameLinkTypeEnum.station
            });
            currentContext.renderChild(currentContext.stationOpenCheckInsView);
            currentContext.stationOpenCheckInsView.hideSectionTitle();

            var stationRecentCheckInsView = new StationEntryCollectionView({
                dispatcher: currentContext.dispatcher,
                collection: currentContext.stationEntryLogCollection,
                el: $('.stationCheckIns.recent', currentContext.$el),
                myPersonnelModel: currentContext.myPersonnelModel,
                nameLinkType: NameLinkTypeEnum.station
            });
            currentContext.renderChild(stationRecentCheckInsView);

            return this;
        },
        updateViewFromModel: function() {
            this.$('.personnel-name').html(this.model.get('userName'));
            if (this.model.has('contact') && this.model.get('contact')) {
                this.$('.personnel-phone').attr('href', 'tel:' + env.getPhoneFixedNumber(this.model.get('contact')));
                this.$('.personnel-phone').text(env.getFormattedPhoneNumber(this.model.get('contact')));
            }
        },
        events: {
            'click .sectionButton': 'sectionClick'
        },
        getRecentStationEntries: function() {
            this.stationEntryLogCollection.getRecentStationEntriesByPersonnel(this.model);
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
        onLoaded: function() {
            this.$('.wait-for-loaded').removeClass('wait-for-loaded');
            this.$('.loading').hide();
            this.updateViewFromModel();
            this.getRecentStationEntries();
        },
        onLeave: function() {
        }
    });
    return PersonnelView;
});