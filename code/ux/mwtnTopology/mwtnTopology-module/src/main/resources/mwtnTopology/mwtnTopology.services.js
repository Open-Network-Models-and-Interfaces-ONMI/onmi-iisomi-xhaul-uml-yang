/*
 * Copyright (c) 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

/** Type Definitions 
 * @typedef {{id: string, siteLink: string, radio: string, polarization: string }} AirInterfaceLink
 * @typedef {{id: string, siteA: string, siteZ: string, siteNameA: string, siteNameZ: string, airInterfaceLinks: AirInterfaceLink[] }} DbLink
 * @typedef {{data: {hits: {hits: {_id: string, _index: string, _score: number, _source: DbLink, _type: string}[], max_score: number, total: number}}, status: number}} DbLinkResult */

define(['app/mwtnTopology/mwtnTopology.module'], function (mwtnTopologyApp) {
// module.exports = function () {
//   const mwtnTopologyApp = require('app/mwtnTopology/mwtnTopology.module');
//   const mwtnTopologyCommons = require('app/mwtnCommons/mwtnCommons.service');

  mwtnTopologyApp.factory('$mwtnTopology', function ($q, $mwtnCommons, $mwtnDatabase, $mwtnLog) {
    var service = {};

    // AF/MF: Obsolete - will removed soon. All data access function
    service.getRequiredNetworkElements = $mwtnCommons.getRequiredNetworkElements;
    service.gridOptions = $mwtnCommons.gridOptions;
    service.highlightFilteredHeader = $mwtnCommons.highlightFilteredHeader;
    service.getAllData = $mwtnDatabase.getAllData;
    

    /**
      * Since not all browsers implement this we have our own utility that will
      * convert from degrees into radians
      *
      * @param deg - The degrees to be converted into radians
      * @return radians
      */
    var _toRad = function (deg) {
      return deg * Math.PI / 180;
    };

    /**
     * Since not all browsers implement this we have our own utility that will
     * convert from radians into degrees
     *
     * @param rad - The radians to be converted into degrees
     * @return degrees
     */
    var _toDeg = function (rad) {
      return rad * 180 / Math.PI;
    };

    // public functions
    /**
     * Calculate the bearing between two positions as a value from 0-360
     *
     * @param lat1 - The latitude of the first position
     * @param lng1 - The longitude of the first position
     * @param lat2 - The latitude of the second position
     * @param lng2 - The longitude of the second position
     *
     * @return int - The bearing between 0 and 360
     */
    service.bearing = function (lat1, lng1, lat2, lng2) {
        var dLon = (lng2 - lng1);
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        var brng = _toDeg(Math.atan2(y, x));
        return 360 - ((brng + 360) % 360);
      },

    
    /**
     * Gets the geospatial distance between two points
     * @param lat1 {number} The latitude of the first point.
     * @param lon1 {number} The longitude of the first point.
     * @param lat2 {number} The latitude of the second point.
     * @param lon2 {number} The longitude of the second point.
     * @returns {number} The distance between the two given points.
     */
    service.getDistance = function (lat1, lon1, lat2, lon2) {
      var R = 6371; // km
      var φ1 = _toRad(lat1);
      var φ2 = _toRad(lat2);
      var Δφ = _toRad(lat2 - lat1);
      var Δλ = _toRad(lon2 - lon1);

      var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return (R * c).toFixed(3);
    };

    /**
     * Gets a promise which is resolved if the database has been calculated the bounds containing all sites.
     * @returns {promise} The promise which is resolved if the database has completed its calculation.
     */
    service.getOuterBoundingRectangleForSites = function () {
      var getOuterBoundingRectangleForSitesDefer = $q.defer();
      var aggregation = {
        "aggregations": {
          "top": {
            "max": {
              "field": "location.lat"
            }
          },
          "right": {
            "max": {
              "field": "location.lon"
            }
          },
          "bottom": {
            "min": {
              "field": "location.lat"
            }
          },
          "left": {
            "min": {
              "field": "location.lon"
            }
          }
        },
        "size": 0
      };

      $mwtnDatabase.getAggregatedData('mwtn', 'site', aggregation).then(function (result) {
        getOuterBoundingRectangleForSitesDefer.resolve({
          top: result.data.aggregations.top.value,
          right: result.data.aggregations.right.value,
          bottom: result.data.aggregations.bottom.value,
          left: result.data.aggregations.left.value
        });
      }, function (error) {
        getOuterBoundingRectangleForSitesDefer.reject(error);
      });

      return getOuterBoundingRectangleForSitesDefer.promise;
    };

    /**
     * Gets a promise which resolved with an array of sites within the given bounding box.
     * @param boundingBox {{top: number, right: number, bottom: number, left: number}} The bounding box to get all sites for.
     * @param chunkSize {number} The maximum count of sites who should return.
     * @param chunkSiteStartIndex {number} The index of the first site element to get.
     */
    service.getSitesInBoundingBox = function (boundingBox, chunkSize, chunkSiteStartIndex) {
      var resultDefer = $q.defer();

      var filter = {
        "geo_bounding_box": {
          "location": {
            "top": boundingBox.top,
            "right": boundingBox.right,
            "bottom": boundingBox.bottom,
            "left": boundingBox.left
          }
        }
      };

      $mwtnDatabase.getFilteredData("mwtn", "site", chunkSiteStartIndex, chunkSize, filter)
        .then(processResult, resultDefer.reject);

      return resultDefer.promise;

      /**
       * Callback for the database request.
       * @param result {{data: {hits: {hits: {_id: string, _index: string, _score: number, _source: {id: string, name: string, location: {lat: number, lon: number}, "amsl-ground": number, references: {"network-elements": string[], "site-links": string[]}}, _type: string}[], max_score: number, total: number}}, status: number}} The database result.
       */
      function processResult(result) {
        var hits = result && result.data && result.data.hits;
        if (!hits) {
          resultDefer.reject("Invalid result.");
          return;
        }

        var total = hits.total;
        var sites = [];

        for (var hitIndex = 0; hitIndex < hits.hits.length; ++hitIndex) {
          var site = hits.hits[hitIndex];
          sites.push({
            id: site._source.id,
            name: site._source.name,
            type: site._source.type,
            location: {
              lat: site._source.location.lat,
              lng: site._source.location.lon
            },
            amslGround: site._source["amsl-ground"],
            references: {
              siteLinks: site._source.references["site-links"]
            }
          });
        }

        resultDefer.resolve({
          chunkSize: chunkSize,
          chunkSiteStartIndex: chunkSiteStartIndex,
          total: total,
          sites: sites
        })
      }
    };

    /**
     * Gets a promise which is resolved with an array of sites filtered by given site ids.
     * This function does not use chunks!
     * @param siteIds {string[]} The ids of the sites to return.
     */
    service.getSitesByIds = function (siteIds) {
      var resultDefer = $q.defer();

      if (!siteIds || siteIds.length === 0) {
        resultDefer.resolve([]);
        return resultDefer.promise;
      }

      var query = {
        bool: {
          should: siteIds.map(function (siteId) {
            return { term: { id: siteId } };
          })
        }
      };

      $mwtnDatabase.getFilteredData("mwtn", "site", 0, siteIds.length, query)
        .then(processResult, resultDefer.reject);

      return resultDefer.promise;

      /**
       * Callback for the database request.
       * @param result {{data: {hits: {hits: {_id: string, _index: string, _score: number, _source: {id: string, name: string, location: {lat: number, lon: number}, "amsl-ground": number, references: {"network-elements": string[], "site-links": string[]}}, _type: string}[], max_score: number, total: number}}, status: number}} The database result.
       */
      function processResult(result) {
        var hits = result && result.data && result.data.hits;
        if (!hits) {
          resultDefer.reject("Invalid result.");
          return;
        }

        var total = hits.total;
        var sites = [];

        for (var hitIndex = 0; hitIndex < hits.hits.length; ++hitIndex) {
          var site = hits.hits[hitIndex];
          sites.push({
            id: site._source.id,
            name: site._source.name,
            type: site._source.type,
            location: {
              lat: site._source.location.lat,
              lng: site._source.location.lon
            },
            amslGround: site._source["amsl-ground"],
            references: {
              siteLinks: site._source.references["site-links"]
            }
          });
        }

        resultDefer.resolve({
          total: total,
          sites: sites
        })
      }
    };

    /**
     * Gets a promise which is resolved with an array of sites using the given filter expression.
     */
    service.getSites = function (sortColumn, sortDirection, filters, chunkSize, chunkSiteStartIndex) {
      var resultDefer = $q.defer();

      // determine the sort parameter
      var sort = null;
      if (sortColumn != null && sortDirection != null) {
        sort = {};
        switch (sortColumn) {
          case 'countNetworkElements':
          case 'countLinks':
            sort = null;
            break;
          case 'amslGround':
            sort['amsl-ground'] = {
              order: sortDirection === 'desc' ? 'desc' : 'asc'
            }
            break;
          default:
            sort[sortColumn] = {
              order: sortDirection === 'desc' ? 'desc' : 'asc'
            }
            break;
        }
      }

       // determine the query parameter
      var query = {};
      if (filters == null || filters.length == 0) {
        query["match_all"] = {};
      } else {
        var regexp = {};
        filters.forEach(function (filter) {
          if (filter && filter.field) {
            regexp[filter.field] = '.*'+ filter.term + '.*';
          }
        });
        query["regexp"] = regexp;
      }


      if (sort) {
        $mwtnDatabase.getFilteredSortedData("mwtn", "site", chunkSiteStartIndex, chunkSize, sort, query).then(processResult, resultDefer.reject);
      } else {
        $mwtnDatabase.getFilteredData("mwtn", "site", chunkSiteStartIndex, chunkSize, query).then(processResult, resultDefer.reject);
      }

      return resultDefer.promise;

      /**
       * Callback for the database request.
       * @param result {{data: {hits: {hits: {_id: string, _index: string, _score: number, _source: {id: string, name: string, location: {lat: number, lon: number}, "amsl-ground": number, references: {"network-elements": string[], "site-links": string[]}}, _type: string}[], max_score: number, total: number}}, status: number}} The database result.
       */
      function processResult(result) {
        var hits = result && result.data && result.data.hits;
        if (!hits) {
          resultDefer.reject("Invalid result.");
          return;
        }

        var total = hits.total;
        var sites = [];

        for (var hitIndex = 0; hitIndex < hits.hits.length; ++hitIndex) {
          var site = hits.hits[hitIndex];
          sites.push({
            id: site._source.id,
            name: site._source.name,
            type: site._source.type,
            location: {
              lat: site._source.location.lat,
              lng: site._source.location.lon
            },
            amslGround: site._source["amsl-ground"],
            references: {
              siteLinks: site._source.references["site-links"]
            }
          });
        }

        resultDefer.resolve({
          total: total,
          sites: sites
        })
      }
    };

    /**
     * Gets a promise which resolved with an array of site links referenced by given sites.
     * @param sites {({id: string, name: string, location: {lat: number, lng: number}, amslGround: number, references: {siteLinks: string[]})[]}
     * @param chunkSize {number} The maximum count of site links who should return.
     * @param chunkSiteLinkStartIndex {number} The index of the first site link element to get.
     */
    service.getSiteLinksForSites = function (sites, chunkSize, chunkSiteLinkStartIndex) {
      var resultDefer = $q.defer();

      if (!sites || sites.length === 0) {
        resultDefer.resolve([]);
        return resultDefer.promise;
      }

      var siteLinkIds = Object.keys(sites.reduce(function (accumulator, currentSite) {
        // Add all site link ids referenced by the current site to the accumulator object.
        currentSite.references.siteLinks.forEach(function (siteLinkId) {
          // The value "true"" isnt important, i only use the key (siteLinkId) later.
          // But this way i dont have to check, if the key is already known.
          accumulator[siteLinkId] = true;
        });
        return accumulator;
      }, {})).map(function (siteLinkId) {
        return { term: { id: siteLinkId } };
      });

      var query = {
        bool: { should: siteLinkIds }
      };

      $mwtnDatabase.getFilteredData("mwtn", "site-link", chunkSiteLinkStartIndex, chunkSize, query).then(
        /**
         * Callback for the database request.
         * @param result {{data: {hits: {hits: {_id: string, _index: string, _score: number, _source: {id: string, siteA: string, siteZ: string, siteNameA: string, siteNameZ: string, airInterfaceLinks: {id: string, siteLink: string, radio: string, polarization: string }[] }, _type: string}[], max_score: number, total: number}}, status: number}} The database result.
         */
        function (result) {
          var hits = result && result.data && result.data.hits;
          if (!hits) {
            resultDefer.reject("Invalid result.");
            return;
          }

          if (hits.total === 0) {
            resultDefer.resolve([]);
            return;
          }

          // get additional sites that wont be given in the sites array but are referenced by the site links.
          // get all sites, referenced by the site links.
          var allReferencedSiteIds = hits.hits.reduce(function (accumulator, currentSiteLink) {
            accumulator[currentSiteLink._source.siteA] = true;
            accumulator[currentSiteLink._source.siteZ] = true;
            return accumulator;
          }, {});
          // remove all known sites
          sites.forEach(function (site) {
            if (allReferencedSiteIds.hasOwnProperty(site.id)) {
              delete allReferencedSiteIds[site.id];
            }
          });

          var additionalReferencedSiteIds = Object.keys(allReferencedSiteIds).map(function (referencedSiteId) {
            return { term: { id: referencedSiteId } };
          });

          if (additionalReferencedSiteIds.length > 0) {
            query = {
              bool: { should: additionalReferencedSiteIds }
            };

            $mwtnDatabase.getFilteredData("mwtn", "site", 0, 400, query).then(
              /**
               * Callback for the database request.
               * @param result {{data: {hits: {hits: {_id: string, _index: string, _score: number, _source: {id: string, name: string, location: {lat: number, lon: number}, "amsl-ground": number, references: {"network-elements": string[], "site-links": string[]}}, _type: string}[], max_score: number, total: number}}, status: number}} The database result.
               */
              function (result) {
                var siteHits = result && result.data && result.data.hits;
                if (!siteHits) {
                  resultDefer.reject("Invalid result.");
                  return;
                }

                var additionalSites = siteHits.hits.map(function (site) {
                  return {
                    id: site._source.id,
                    name: site._source.name,
                    type: site._source.type,
                    location: {
                      lat: site._source.location.lat,
                      lng: site._source.location.lon
                    },
                    amslGround: site._source["amsl-ground"],
                    type: site._source.type,
                    references: {
                      siteLinks: site._source.references["site-links"]
                    }
                  };
                });

                var siteLinks = hits.hits.map(function (siteLink) {
                  return {
                    id: siteLink._source.id,
                    siteA: sites.find(function (site) { return site.id === siteLink._source.siteA; }) || additionalSites.find(function (site) { return site.id === siteLink._source.siteA; }),
                    siteZ: sites.find(function (site) { return site.id === siteLink._source.siteZ; }) || additionalSites.find(function (site) { return site.id === siteLink._source.siteZ; }),
                    type: siteLink._source.type,
                    length: 5000 // AF/MF: the length will be served from the database in the next version.
                  };
                });

                resultDefer.resolve(siteLinks);
              },
              resultDefer.reject);

            return;
          }

          var siteLinks = hits.hits.map(function (siteLink) {
            return {
              id: siteLink._source.id,
              siteA: sites.find(function (site) { return site.id === siteLink._source.siteA; }),
              siteZ: sites.find(function (site) { return site.id === siteLink._source.siteZ; }),
              type: siteLink._source.type,
              length: 5000 // AF/MF: the length will be served from the database in the next version.
            };
          });

          resultDefer.resolve(siteLinks);
        },
        resultDefer.reject);

      return resultDefer.promise;
    };

    /**
     * Gets a promise which is resolved with an array of planned filtered by given network element ids.
     * This function does not use chunks!
     * @param neIds {string[]} The ids of the site links to return.
     */
    service.getPlannedNetworkElementsByIds = function (neIds) {
      var resultDefer = $q.defer();

      if (!neIds || neIds.length === 0) {
        resultDefer.resolve([]);
        return resultDefer.promise;
      }

      var query = {
        bool: {
          should: neIds.map(function (neId) {
            return { term: { id: neId } };
          })
        }
      };

      $mwtnDatabase.getFilteredData("mwtn", "planned-network-elements", 0, neIds.length, query).then(
        /**
         * Callback for the database request.
         * @param result {{data: {hits: {hits: {_id: string, _index: string, _score: number, _source: {id: string, name: string, type: string}, _type: string}[], max_score: number, total: number}}, status: number}} The database result.
         */
        function (result) {
          var hits = result && result.data && result.data.hits;
          if (!hits) {
            resultDefer.reject("Invalid result.");
            return;
          }

          if (hits.total === 0) {
            resultDefer.resolve([]);
            return;
          }

          var plannedNetworkElements = hits.hits.map(function (plannedNetworkElement) {
            return {
              id: plannedNetworkElement._source.id,
              name: plannedNetworkElement._source.name,
              type: plannedNetworkElement._source.radioType
            };
          });

          resultDefer.resolve(plannedNetworkElements);
        }, resultDefer.reject);

      return resultDefer.promise;
    };


    /**
     * Gets a promise which is resolved with an array of site links filtered by given site link ids.
     * This function does not use chunks!
     * @param siteLinkIds {string[]} The ids of the site links to return.
     */
    service.getSiteLinksByIds = function (siteLinkIds) {
      var resultDefer = $q.defer();

      if (!siteLinkIds || siteLinkIds.length === 0) {
        resultDefer.resolve([]);
        return resultDefer.promise;
      }

      var query = {
        bool: {
          should: siteLinkIds.map(function (siteLinkId) {
            return { term: { id: siteLinkId } };
          })
        }
      };

      $mwtnDatabase.getFilteredData("mwtn", "site-link", 0, siteLinkIds.length, query).then(
        /**
         * Callback for the database request.
         * @param result {{data: {hits: {hits: {_id: string, _index: string, _score: number, _source: {id: string, siteA: string, siteZ: string}, _type: string}[], max_score: number, total: number}}, status: number}} The database result.
         */
        function (result) {
          var hits = result && result.data && result.data.hits;
          if (!hits) {
            resultDefer.reject("Invalid result.");
            return;
          }

          if (hits.total === 0) {
            resultDefer.resolve([]);
            return;
          }

          var siteLinks = hits.hits.map(function (siteLink) {
            return {
              id: siteLink._source.id,
              siteA: siteLink._source.siteA,
              siteZ: siteLink._source.siteZ,
              azimuthAz: siteLink._source.azimuthAZ,
              azimuthZa: siteLink._source.azimuthZA,
              length: siteLink._source.length,
              type: siteLink._source.type
            };
          });

          resultDefer.resolve(siteLinks);
        }, resultDefer.reject);

      return resultDefer.promise;
    };

    /**
     *  Gets a promise with all details for a given site by its id.
     *  @param siteId {string} The id of the site to request the details for.
     */
    service.getSiteDetailsBySiteId = function (siteId) {
      var resultDefer = $q.defer();

      var siteQuery = {
        "bool": {
          "must": [
            {
              "term": {
                "id": siteId
              }
            }
          ]
        }
      };

      // get all site details
      $mwtnDatabase.getFilteredData("mwtn", "site", 0, 1, siteQuery).then(
        /**
        * Callback for the database request.
       * @param result {{data: {hits: {hits: {_id: string, _index: string, _score: number, _source: {id: string, name: string, location: {lat: number, lon: number}, "amsl-ground": number, references: {"network-elements": string[], "site-links": string[]}}, _type: string}[], max_score: number, total: number}}, status: number}} The database result.
        */
        function (result) {
          if (result.data.hits.total != 1) {
            // todo: handle this error
            resultDefer.reject("Error loading details for " + siteId + ((result.data.hits.total) ? ' Too many recoeds found.' : ' No record found.'));
          }
          var site = result.data.hits.hits[0];
          var siteDetails = {
            id: site._source.id,
            name: site._source.name,
            type: site._source.type,
            location: {
              lat: site._source.location.lat,
              lng: site._source.location.lon
            },
            amslGround: site._source["amsl-ground"],
            references: {
              siteLinks: site._source.references["site-links"],
              networkElements: site._source.references["network-elements"]
            }
          };
          
          service.getSiteLinksByIds(siteDetails.references.siteLinks).then(
            /** Callback for the database request.
             *  @param result {{id: string, siteA: string, siteZ: string }[]}
             */
            function (result) {
              siteDetails.siteLinks = result;
              resultDefer.resolve(siteDetails);
            });

            service.getPlannedNetworkElementsByIds(siteDetails.references.networkElements).then(
            /** Callback for the database request.
             *  @param result {{id: string, name: string, type: string }[]}
             */
            function (result) {
              siteDetails.plannedNetworkElements = result;
              resultDefer.resolve(siteDetails);
            });
        }
      );
      return resultDefer.promise;
    };
    
    /**
     *  Gets a promise with all details for a given link by its id.
     *  @param siteId {string} The id of the link to request the details for.
     */
    service.getLinkDetailsByLinkId = function (linkId) {
      var resultDefer = $q.defer();

      var linkQuery = {
        "bool": {
          "must": [
            {
              "term": {
                "id": linkId
              }
            }
          ]
        }
      };

      // get all site details
      $mwtnDatabase.getFilteredData("mwtn", "site-link", 0, 1, linkQuery).then(
        /**
        * Callback for the database request.
       * @param result { DbLinkResult }  The database result.
        */
        function (result) {
          if (result.data.hits.total != 1) {
            // todo: handle this error
            resultDefer.reject("Error loading details for " + siteId + ((result.data.hits.total) ? ' Too many recoeds found.' : ' No record found.'));
          }
          var link = result.data.hits.hits[0];
          var linkDetails = {
            id: link._source.id,
            siteA: link._source.siteA,
            siteZ: link._source.siteZ,
            siteNameA: link._source.siteNameA,
            siteNameZ: link._source.siteNameZ,
            length: link._source.length,
            azimuthA: link._source.azimuthAZ,
            azimuthB: link._source.azimuthZA,
            airInterfaceLinks: link._source.airInterfaceLinks,
            type: link._source.type,
            airInterfaceLinks: link._source.airInterfaceLinks
          };

          service.getSitesByIds([link._source.siteA, link._source.siteZ]).then(
            /** Callback for the database request.
             *  @param result {{ total: number, sites: { id: string, name: string } []}}
             */
            function (result) {
              var siteA = result.sites.find(function (site) { return site.id == linkDetails.siteA });
              var siteZ = result.sites.find(function (site) { return site.id == linkDetails.siteZ });
              if (result.total != 2 || !siteA || !siteZ) {
                resultDefer.reject("Could not load Sites for link "+linkDetails.id);
              } 
              linkDetails.siteA = siteA;
              linkDetails.siteZ = siteZ;
              
              resultDefer.resolve(linkDetails);
            })
        }
      );
      return resultDefer.promise;
    } 

    /**
     * Gets a promise which is resolved with an array of links using the given filter expression.
     */
    service.getLinks = function (sortColumn, sortDirection, filters, chunkSize, chunkSiteStartIndex) {
      var resultDefer = $q.defer();

      // determine the sort parameter
      var sort = null;
      if (sortColumn != null && sortDirection != null) {
        sort = {};
        switch (sortColumn) {
          case 'siteIdA':
            sort['siteA'] = {
              order: sortDirection === 'desc' ? 'desc' : 'asc'
            }
            break;
          case 'siteIdZ':
            sort['siteZ'] = {
              order: sortDirection === 'desc' ? 'desc' : 'asc'
            }
            break;
          default:
            sort[sortColumn] = {
              order: sortDirection === 'desc' ? 'desc' : 'asc'
            }
            break;
        }
      }

      // determine the query parameter
      var query = {};
      if (filters == null || filters.length == 0) {
        query["match_all"] = {};
      } else {
        var regexp = {};
        filters.forEach(function (filter) {
          if (filter && filter.field) {
            switch (filter.field) {
              case 'siteIdA':
                regexp['siteIdA'] = '.*' + filter.term + '.*';  
                break;  
              case 'siteIdZ':
                regexp['siteZ'] = '.*' + filter.term + '.*';  
                break; 
              default:
                regexp[filter.field] = '.*' + filter.term + '.*';
                break;
            }
          }
        });
        query["regexp"] = regexp;
      }


      if (sort) {
        $mwtnDatabase.getFilteredSortedData("mwtn", "site-link", chunkSiteStartIndex, chunkSize, sort, query).then(processResult, resultDefer.reject);
      } else {
        $mwtnDatabase.getFilteredData("mwtn", "site-link", chunkSiteStartIndex, chunkSize, query).then(processResult, resultDefer.reject);
      }

      /**
         * Callback for the database request.
         * @param result {{data: {hits: {hits: {_id: string, _index: string, _score: number, _source: {id: string, siteA: string, siteZ: string}, _type: string}[], max_score: number, total: number}}, status: number}} The database result.
         */
      function processResult (result) {
        var hits = result && result.data && result.data.hits;
        if (!hits) {
          resultDefer.reject("Invalid result.");
          return;
        }

        var total = hits.total;
        var links = [];

        var siteLinks = hits.hits.map(function (siteLink) {
          return {
            id: siteLink._source.id,
            siteA: siteLink._source.siteA,
            siteZ: siteLink._source.siteZ,
            type: siteLink._source.type,
          };
        });

        resultDefer.resolve({
          total: total,
          links: siteLinks
        });
      }

      return resultDefer.promise;

      
    };
   
    /**
     * Determines if a coordinate is in a bounding box
     *  @param bounds {{ top: number, left: number, right: number, bottom: number}} The bounding box.
     *  @param coordinate {{ lat: number, lng: number }} The coordinate.
     *  @return if the bounding box contains the coordinate 
     */
    service.isInBounds = function(bounds, coordinate) {
      var isLongInRange = (bounds.right < bounds.left)
        ? coordinate.lng >= bounds.left || coordinate.lng <= bounds.right 
        : coordinate.lng >= bounds.left && coordinate.lng <= bounds.right ;
      
      return coordinate.lat >= bounds.bottom && coordinate.lat <= bounds.top && isLongInRange;
    } 

    service.getAllEdges = function () {
      var edges = [];
      return getGenericChunk("edge", edges).then(function () {
        return edges;
      });
    };

    /**
     * Retrieves all nodes.
     * @return a Promis containing an array of nodes
     */
    service.getAllNodes = function () {
      var resultDefer = $q.defer();
      var nodes = [];
      getGenericChunk("node", nodes).then(function () {

        // recreate the tree structure from the flat list
        var finalNodes = nodes.reduce(
          /** @param acc { Node[] } */
          function (acc, cur, ind, arr) {
            // the site will be added with the first device, so it can not be missing after the first device is in
            if (!acc.some(node => node.data.type == "site" && node.data.id == cur.data.grandparent)) {
              acc.push({
                data: {
                  type: "site",
                  id: cur.data.grandparent,
                  label: cur.data.grandparent,
                  active: cur.data.active
                }
              });
            }
            if (!acc.some(node => node.data.type == "device" && node.data.id == cur.data.parent)) {
              acc.push({
                data: {
                  _parent: cur.data.grandparent,
                  type: "device",
                  id: cur.data.parent,
                  get parent() { return cur.data.grandparent },
                  set parent(val) { debugger; },
                  label: cur.data.parent,
                  active: cur.data.active
                }
              });
            }
            acc.push({
              data: Object.keys(cur.data).reduce(function (obj, key) {
                if (key == 'grandparent') {
                  obj['type'] = 'port'
                } else {
                  cur.data.hasOwnProperty(key) && (obj[key] = cur.data[key]);
                }
                return obj;
              }, {}),
              position: cur.position
            });
            return acc;
          }, []);

        resultDefer.resolve(finalNodes);
      }, function (err) {
        console.error(err);
        resultDefer.reject(err);
      });
      return resultDefer.promise;
    }

    /** @param nodes {{id: string,position:{ x:number, y:number}}}[]} */
    service.saveChangedNodes = function (nodes) {
      return $mwtnDatabase.getBase('topology').then(function (base) {
        var resultDefer = $q.when();

        nodes.forEach(function (node) {
          resultDefer = resultDefer.then(function () {
            return $mwtnDatabase.genericRequest({
              method: 'POST',
              base: base.base,
              index: base.index,
              docType: 'node',
              command: encodeURI(node.id) +'/_update',
              data: { 
                "doc": {
                  "position": node.position
                }
              }
            });
          })
        });
        return resultDefer;
      });
    }

    // Start to initialize google maps api and save the returned promise.
    service.googleMapsApiPromise = initializeGoogleMapsApi();

    return service;

    // private helper functions of $mwtnTopology

    function getGenericChunk(docType, target) {
      var size = 30;
      return $mwtnDatabase.getAllData('topology', docType, target.length || 0, size, undefined)
        .then(function (result) {
          if (result.status === 200 && result.data) {
            var total = (result.data.hits && result.data.hits.total) || 0;
            var hits = (total && result.data.hits.hits) || [];
            hits.forEach(function (hit) {
              target.push(hit._source || {});
            });
            if (total > target.length) {
              return getGenericChunk(docType, target);
            }
            return $q.resolve(true);
          } else {
            return $q.reject("Could not load " + docType + ".");
          }
      }, function (err) {
        resultDefer.reject(err);
      });

      return resultDefer.promise;
    }


    /**
     * Gets a promise which is resolved if the google maps api initialization is completed.
     * @returns {promise} The promise which is resolved if the initialization is completed.
     */
    function initializeGoogleMapsApi() {
      var googleMapsApiDefer = $q.defer();
      window.googleMapsApiLoadedEvent = new Event("googleMapsApiLoaded");

      window.addEventListener("googleMapsApiLoaded", function (event) {

        /**
         * Calculates the bounds this map would display at a given zoom level.
         *
         * @member google.maps.Map
         * @method boundsAt
         * @param {Number}                 zoom         Zoom level to use for calculation.
         * @param {google.maps.LatLng}     [center]     May be set to specify a different center than the current map center.
         * @param {google.maps.Projection} [projection] May be set to use a different projection than that returned by this.getProjection().
         * @param {Element}                [div]        May be set to specify a different map viewport than this.getDiv() (only used to get dimensions).
         * @return {google.maps.LatLngBounds} the calculated bounds.
         *
         * @example
         * var bounds = map.boundsAt(5); // same as map.boundsAt(5, map.getCenter(), map.getProjection(), map.getDiv());
         */
        google.maps.Map.prototype.boundsAt = function (zoom, center, projection, div) {
          var p = projection || this.getProjection();
          if (!p) return undefined;
          var d = $(div || this.getDiv());
          var zf = Math.pow(2, zoom) * 2;
          var dw = d.getStyle('width').toInt() / zf;
          var dh = d.getStyle('height').toInt() / zf;
          var cpx = p.fromLatLngToPoint(center || this.getCenter());
          return new google.maps.LatLngBounds(
            p.fromPointToLatLng(new google.maps.Point(cpx.x - dw, cpx.y + dh)),
            p.fromPointToLatLng(new google.maps.Point(cpx.x + dw, cpx.y - dh)));
        }

        googleMapsApiDefer.resolve();
      });

      var head = document.getElementsByTagName('head')[0];

      var callbackScript = document.createElement("script");
      callbackScript.appendChild(document.createTextNode("function googleMapsApiLoadedCallback() { window.dispatchEvent(window.googleMapsApiLoadedEvent); };"));

      var googleScript = document.createElement('script');
      googleScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBWyNNhRUhXxQpvR7i-Roh23PaWqi-kNdQ&callback=googleMapsApiLoadedCallback";

      head.appendChild(callbackScript);
      head.appendChild(googleScript);

      return googleMapsApiDefer.promise;
    }

  });

});