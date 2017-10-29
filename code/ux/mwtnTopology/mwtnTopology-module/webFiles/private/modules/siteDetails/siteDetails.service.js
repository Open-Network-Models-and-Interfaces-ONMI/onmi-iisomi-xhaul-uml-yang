htSiteDetails.factory('$siteDetails', function(sitesService) {

    var service = {};
    service.getSite = function(dbIndex, siteId, callback) {
        sitesService.getSiteById(dbIndex, siteId, function(site) {
            callback(site);
        });
    };

    service.getSiteLinks = function(dbIndex, siteId, callback) {
        var siteIds = [];
        siteIds.push(siteId);
        sitesService.getSiteLinksBySiteIds(dbIndex, siteIds, function(siteLinks) {
            callback(siteLinks);
        });
    };
    
    service.getSitesOfLink = function(siteLink, callback) {
        sitesService.getSitesOfLink(siteLink, function(sites) {
            callback(sites);
        });
    };
    
    return service;
});
