define(function(require) {

    "use strict";

    var $ = require('jquery'),
            _ = require('underscore'),
            Backbone = require('backbone'),
            CompositeView = require('views/base/CompositeView'),
            
            NameLinkTypeEnum = require('enums/NameLinkTypeEnum'),
            StationEntryListTypeEnum = require('enums/StationEntryListTypeEnum'),
            StationEntryListView = require('views/StationEntryListView'),
            env = require('env'),
            template = require('hbs!templates/Personnel');


    var PersonnelView = CompositeView.extend({
        className: 'details-view personnel-details-view',
        initialize: function(options) {
            console.debug("PersonnelView.initialize");
            options || (options = {});
            this.appDataModel = options.appDataModel;
            this.stationEntryCollection = options.stationEntryCollection;

            this.listenTo(this.model, 'change', this.updateViewFromModel);
            this.listenTo(this.model, 'sync', this.updateViewFromModel);
            this.listenTo(this.model, 'error', this.updateViewFromModel);

            this.personnelLoaded = false;
        },
        render: function() {
            console.debug("PersonnelView.render");

            var currentContext = this;

            this.$el.html(template(this.model.attributes));

            var stationOpenCheckInsView = new StationEntryListView({
                collection: currentContext.stationEntryCollection,
                el: $(".stationCheckIns.open", currentContext.$el),
                appDataModel: currentContext.appDataModel,
                dispatcher: this.dispatcher,
                stationEntryListType: StationEntryListTypeEnum.open,
                nameLinkType: NameLinkTypeEnum.station
            });
            this.renderChild(stationOpenCheckInsView);
            stationOpenCheckInsView.hideSectionTitle();

            var stationRecentCheckInsView = new StationEntryListView({
                collection: currentContext.stationEntryCollection,
                el: $(".stationCheckIns.recent", currentContext.$el),
                appDataModel: currentContext.appDataModel,
                stationEntryListType: StationEntryListTypeEnum.historical,
                nameLinkType: NameLinkTypeEnum.station
            });
            this.renderChild(stationRecentCheckInsView);

            this.updateViewFromModel();

            return this;
        },
        updateViewFromModel: function() {
            this.$('.personnel-loading').hide();
            this.$('.personnel-name').html(this.model.get("userName"));
            if (this.model.has("contact") && this.model.get("contact")) {
                this.$('.personnel-phone').attr('href', 'tel:' + env.getPhoneFixedNumber(this.model.get("contact")));
                this.$('.personnel-phone').text(env.getFormattedPhoneNumber(this.model.get("contact")));
            }
            this.personnelLoaded = true;
            this.tryHideLoading();

        },
        events: {
            "click .sectionButton": "sectionClick"
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
        tryHideLoading: function() {
            if (this.personnelLoaded) {
                this.$('.wait-for-loaded').removeClass('wait-for-loaded');
                this.$('.loading').hide();
            }
        }
    });
    return PersonnelView;
});
