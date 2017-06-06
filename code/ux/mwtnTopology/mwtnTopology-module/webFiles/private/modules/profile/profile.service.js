htProfil.factory('profileService', function($http) {
    'use strict';

    var index = 'configuration';
    var docType = 'profile';
    var defaultProfile = {
        common: {
            language: 'en_US',
            mapTypeId: 'hybrid',
            viewBox : {},
            version: '0.1.0',
        },
        site : {
            shape : {
                type : 'circle',
                scale : 8,
                rotation : 45,
                zIndex: 10
            },
            normal : {
                stroke : {
                    color : '#00ccff',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                },
                fill : {
                    color : '#00ccff',
                    opacity : 0.5
                }
            },
            hover : {
                stroke : {
                    color : '#00ccff',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                },
                fill : {
                    color : '#00ccff',
                    opacity : 0.8
                }
            }
        },
        siteLink : {
            normal : {
                stroke : {
                    color : '#00ccff',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                }
            },
            hover : {
                stroke : {
                    color : '#00ccff',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                }
            },
            zIndex: 5
        },
        cluster : {
            shape : {
                type : 'circle',
                scale : 50, // will be overwritten by function
                rotation : 45,
                zIndex: 10
            },
            normal : {
                stroke : {
                    color : '#00ccff',
                    width : 0,
                    type : 'solid',
                    opacity : 0.9
                },
            fill : {
                color : '#00ccff',
                opacity : 0.3
            }
            },
            hover : {
                stroke : {
                    color : '#00ccff',
                    width : 3,
                    type : 'solid',
                    opacity : 0.5
                },
                fill : {
                    color : '#00ccff',
                    opacity : 0.4
                }

            },
            zIndex: 5
        },
        newSite : {
            shape : {
                type : 'circle',
                scale : 8,
                rotation : 45,
                zIndex: 10
            },
            normal : {
                stroke : {
                    color : '#dd0000',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                },
                fill : {
                    color : '#dd0000',
                    opacity : 0.5
                }
            },
            hover : {
                stroke : {
                    color : '#dd0000',
                    width : 5,
                    type : 'solid',
                    opacity : 0.9
                },
                fill : {
                    color : '#dd0000',
                    opacity : 0.8
                }
            }
        },
        newSiteLink : {
            normal : {
                stroke : {
                    color : '#dd0000',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                }
            },
            hover : {
                stroke : {
                    color : '#dd0000',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                }
            },
            zIndex: 5
        },
        selectedSite : {
            shape : {
                type : 'circle',
                scale : 8,
                rotation : 45,
                zIndex: 10
            },
            normal : {
                stroke : {
                    color : '#dd0000',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                },
                fill : {
                    color : '#dd0000',
                    opacity : 0.5
                }
            },
            hover : {
                stroke : {
                    color : '#dd0000',
                    width : 5,
                    type : 'solid',
                    opacity : 0.9
                },
                fill : {
                    color : '#dd0000',
                    opacity : 0.8
                }
            }
        },
        selectedSiteLink : {
            normal : {
                stroke : {
                    color : '#00ccff',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                }
            },
            hover : {
                stroke : {
                    color : '#00ccff',
                    width : 3,
                    type : 'solid',
                    opacity : 0.9
                }
            },
            zIndex: 5
        }
    };

    var getRestURL = function(profil) {
        var index = 'configuration';
        var docType = 'profile';
        var url = '/db/' + index + '/' + docType + '/' + profil;
        return url;
    };

    var createProfile = function(profileId, callback) {
        var data = defaultProfile;
        data.common.lastChange = new Date();
        var req = {
            method : 'PUT',
            url : getRestURL(profileId),
            headers : {
                'Content-Type' : 'application/json'
            },
            data : data
        };
        // console.log(JSON.stringify(req));
        $http(req).success(function(data, status) {
            return callback(null, defaultProfile);
        }).error(function(data, status) {
            return callback(status, null);
        });
    };

    var service = {};

    service.profile = defaultProfile;
    service.defaultProfile = defaultProfile;
    
    service.apply = function(profileId, profileData, callback) {
        profileData.common.lastChange = new Date();
        var req = {
            method : 'PUT',
            url : getRestURL(profileId),
            headers : {
                'Content-Type' : 'application/json'
            },
            data : profileData
        };
        $http(req).success(function(data, status) {
            return callback(null, profileData);
        }).error(function(data, status) {
            return callback(status, null);
        });
    };

    service.restoreDefaults = function(profileId, callback) {
        var data = defaultProfile;
        data.common.lastChange = new Date();
        var req = {
            method : 'PUT',
            url : getRestURL(profileId),
            headers : {
                'Content-Type' : 'application/json'
            },
            data : data
        };
        $http(req).success(function(data, status) {
            service.profile = defaultProfile;
            return callback(null, defaultProfile);
        }).error(function(data, status) {
            return callback(status, null);
        });
    };

    service.getProfileData = function(profileId, callback) {
        var req = {
            method : 'GET',
            url : getRestURL(profileId),
            headers : {
                'Content-Type' : 'application/json'
            }
        };
        $http(req).success(function(data, status) {
            service.profile = data._source;
            return callback(null, data._source);
        }).error(function(data, status) {
            if (status === 400 || status === 404) {
                createProfile(profileId, function(err, data) {
                    return callback(null, data);
                });
            } else {
                return callback(status, null);
            }
        });
    };

    return service;
});
