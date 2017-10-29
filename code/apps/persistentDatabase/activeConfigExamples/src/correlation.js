var sites = require('../buildTst/site/site.json');
var siteLinks = require('../buildTst/site-link/site-link.json');
var plannedNetworkElements = require('./plannedNetworkElements.json');

// console.log(JSON.stringify(sites));
// console.log(JSON.stringify(siteLinks));

Object.keys(siteLinks['site-link']).map(function(key) {
    if (sites.site[siteLinks['site-link'][key].siteA].references['site-links'].indexOf(key) === -1) {
        sites.site[siteLinks['site-link'][key].siteA].references['site-links'].push(key);
        sites.site[siteLinks['site-link'][key].siteA].references['site-links'].sort();
    }
    if (sites.site[siteLinks['site-link'][key].siteZ].references['site-links'].indexOf(key) === -1) {
        sites.site[siteLinks['site-link'][key].siteZ].references['site-links'].push(key);
        sites.site[siteLinks['site-link'][key].siteZ].references['site-links'].sort();
    }
});

Object.keys(plannedNetworkElements['planned-network-elements']).map(function(key) {
    sites.site[plannedNetworkElements['planned-network-elements'][key].siteRef].references['network-elements'].push(key);
    sites.site[plannedNetworkElements['planned-network-elements'][key].siteRef].references['network-elements'].sort();
});

console.log(JSON.stringify(sites, null, ' '));

