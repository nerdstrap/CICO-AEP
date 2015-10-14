var config = {};

config.app = {};

config.app.apiUrl = '';
config.app.siteRoot = '';

config.thresholds = {};

config.thresholds.checkInExpiration = 1800000;
config.thresholds.searchRadius = 50;
config.thresholds.searchResults = 20;

config.myIdentity = {};

config.myIdentity.personnelId = 's251201';
config.myIdentity.firstName = 'Michael';
config.myIdentity.middleName = 'E';
config.myIdentity.lastName = 'Baltic';
config.myIdentity.contactNumber = '6143239560';
config.myIdentity.email = 'mebaltic@aep.com';

config.positionOptions = {};

config.positionOptions.timeout = 5000;
config.positionOptions.enableHighAccuracy = false;
config.positionOptions.maximumAge = 6000;

config.contacts = {};
config.contacts.helpEmail = "helpaep@aep.com";
config.contacts.telecomEmail = "telecomcico@aep.com";

module.exports = config;