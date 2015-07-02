require.config({
    config: {
        'env': {
            apiUrl: '/CheckInCheckOutMobile-services/webresources',
            siteRoot: '/CheckInCheckOutMobile-web/',
            maxDurExpiration: 30,
            helpEmail: 'helpaep@aep.com',
            helpEmailSubject: 'CICO Help'
        },
        'models/CICOLocationModel': {
            'timeout': 5000,
            'enableHighAccuracy': false,
            'maximumAge': 6000
        },
        'tpl': {
            'extension': 'html'
        }
    },
    'hbs': {// hbs config
        disableI18n: true, // This disables the i18n helper and
        // doesn't require the json i18n files (e.g. en_us.json)
        // (false by default)

        //disableHelpers: true, // When true, won't look for and try to automatically load
        // helpers (false by default)


//            helperPathCallback:       // Callback to determine the path to look for helpers
//                function (name) {       // ('/template/helpers/'+name by default)
//                    return 'cs!' + name;
//                },
            templateExtension: "html" // Set the extension automatically appended to templates
        // ('hbs' by default)

//            compileOptions: {}        // options object which is passed to Handlebars compiler
    },
    paths: {
        'require': 'libs/require',
        'text': 'libs/require-text',
        'jquery': 'libs/jquery',
        'jquery-highlight': 'libs/jquery-highlight',
        'jquery-magnific-popup': 'libs/jquery-magnific-popup',
        'jquery-formatter': 'libs/jquery-formatter',
        'underscore': 'libs/underscore',
        'backbone': 'libs/backbone',
        'backbone-modal': 'libs/backbone-modal',
        'backbone-localstorage': 'libs/backbone-localstorage',
        'console': 'libs/console',
        'foundation': 'libs/foundation',        
        'backbone-validation': 'libs/backbone-validation',
        'tpl': 'libs/require-tpl',
        'hbs': 'libs/require-hbs',
        'i18nprecompile': 'libs/hbs/i18nprecompile',
        'Handlebars': 'libs/handlebars',
        'auth-retry-setup': 'libs/jquery-ajax-auth-retry',        
        'cico-local-app-state': 'libs/cico-local-app-state',
        'json2': 'libs/hbs/json2',
        
        'cico-events': 'cico-libs/cico-events',
        'globals': 'cico-libs/globals',
        'cico-style-overwrite': 'cico-libs/cico-style-overwrite',
        'env': 'cico-libs/env',
        'handlebars-helpers': 'cico-libs/handlebars-helpers',
        'cico-util': 'cico-libs/cico-util',
        
        'routers': '../routers',
        'enums': '../enums',
        'models': '../models',
        'collections': '../collections',
        'views': '../views',
        'templates': '../templates',
        'controllers': '../controllers'     
        
    },
    map: {
        '*': {
            'models/StationModel': 'models/json/StationModel',
            'models/StationEntryModel': 'models/json/StationEntryModel',
            'models/AbnormalConditionModel': 'models/json/AbnormalConditionModel',
            'models/DurationModel': 'models/DurationModel',
            'models/appDataModel': 'models/json/appDataModel',
            'models/AuthModel': 'models/json/AuthModel',
            'models/PersonnelModel': 'models/json/PersonnelModel',
            'collections/PersonnelCollection': 'collections/json/PersonnelCollection',
            'collections/StationCollection': 'collections/json/StationCollection',
            'collections/StationEntryCollection': 'collections/json/StationEntryCollection',
            'collections/AbnormalConditionCollection': 'collections/json/AbnormalConditionCollection',
            'collections/StationWarningCollection': 'collections/json/StationWarningCollection'
//            'models/StationModel': 'models/memory/StationModel',
//            'models/StationEntryModel': 'models/memory/StationEntryModel',
//            'models/AbnormalConditionModel': 'models/memory/AbnormalConditionModel',
//            'models/DurationModel': 'models/DurationModel',
//            'models/appDataModel': 'models/memory/appDataModel',
//            'models/AuthModel': 'models/memory/AuthModel',
//            'models/PersonnelModel': 'models/memory/PersonnelModel',
//            'collections/PersonnelCollection': 'collections/memory/PersonnelCollection',
//            'collections/StationCollection': 'collections/memory/StationCollection',
//            'collections/StationEntryCollection': 'collections/memory/StationEntryCollection',
//            'collections/AbnormalConditionCollection': 'collections/memory/AbnormalConditionCollection'
        }
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'foundation': {
            deps: ['jquery']
        },
        'magnific-jquery-popup': {
            deps: ['jquery']
        },
        'Handlebars': {
            exports: 'Handlebars'
        }
    }
});

// Global error handler
requirejs.onError = function(err) {
    if (err) {
        console.log(err.message);
        if (err.originalError) {
            console.log(err.originalError.message);
        }
        if (err.requireType) {
            if (err.requireType === 'timeout') {
                console.log('modules: ' + err.requireModules);
            }
        }
    }

    throw err;
};

// Load our app module and pass it to our definition function
require(['console', 'app']);

function sortedGroupBy(list, groupByIter, sortByIter) {
    if (_.isArray(groupByIter)) {
        function groupBy(obj) {
            return _.map(groupByIter, function(key, value) {
                return obj[key];
            });
        }
    } else {
        var groupBy = groupByIter;
    }
    if (_.isArray(sortByIter)) {
        function sortBy(obj) {
            return _.map(sortByIter, function(key, value) {
                return obj[key];
            });
        }
    } else {
        var sortBy = sortByIter;
    }
    var groups = _.groupBy(list, groupBy);
    _.each(groups, function(value, key, list) {
        list[key] = _.sortBy(value, sortBy);
    });
    return groups;
}
