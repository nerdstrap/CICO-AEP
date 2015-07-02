define(function(require) {

    "use strict";

    var $ = require('jquery'),
            Backbone = require('backbone'),
            _ = require('underscore'),
            MenuView = require('views/MenuView'),
            template = require('hbs!templates/Menu'),
            cicoEvents = require('cico-events'),
            env = require('env');

    return MenuView.extend({
        initialize: function(options) {
            console.debug("CheckInMenuView.initialize");
            options || (options = {});

            this.listenTo(cicoEvents, 'currentCheckedInChange', this.updateOpenCheckinMenu);

            _.bindAll(this, 'updateOpenCheckinMenu');
        },
        events: {
            'click .menu-button': 'menuButtonClick'
        },
        getGetButtonSelector: function() {
            return getGetButtonSelector();
        },
        render: function() {
            console.debug("CheckInMenuView.render");
            this.$el.html(template({
                title: this.title
            }));
            return this;
        },
        updateOpenCheckinMenu: function(stationEntry) {
            this.openStationEntryLogModel = stationEntry;
            if (stationEntry && !stationEntry.derivedAttributes.checkedOut) {
                var hasCrew = stationEntry.get('hasCrew');
                var menuButtonSrc = hasCrew ? env.getCheckedInWithCrewButton() : env.getCheckedInButton();

                if (stationEntry.durationExpiredMax()) {
                    menuButtonSrc = hasCrew ? env.getCheckedInWithCrewButtonRestricted() : env.getCheckedInButtonRestricted();
                }
                else if (stationEntry.durationExpired()) {
                    menuButtonSrc = hasCrew ? env.getCheckedInWithCrewButtonWarning() : env.getCheckedInButtonWarning();
                }

                this.setButtonImage(menuButtonSrc);
                this.showMenuButton();
            }
            else {
                this.hideMenuButton();
            }
        },
        menuButtonClick: function(event) {
            if (event) {
                event.preventDefault();
            }
            cicoEvents.trigger(cicoEvents.goToOpenCheckIn, this.openStationEntryLogModel);
        }
    });

});
