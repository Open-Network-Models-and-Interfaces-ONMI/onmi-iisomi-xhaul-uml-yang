/*
 * @copright 2016 highstreet technologies GmbH and others. All rights reserved.
 *
 * @license
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at {@link http://www.eclipse.org/legal/epl-v10.html} 
 */

if (!String.prototype.contains) { 
  /**
   * An extension to String, which checks whether another string is contained.
   * @param {string} find A string to be checked, whether it is contained in 'this'.
   * @return {boolean} True, if 'this' contains param 'find', otherwise false.
   */
  String.prototype.contains = function(find) { 
    return this.indexOf(find) > -1; 
  }; 
}

if (!String.prototype.format) {
  /**
   * An extension to String, which replaces certain patterns by arguments.
   * @see {@link https://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format|javascript-equivalent-to-printf-string-format}
   * @return {string} Formated string.
   */
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] !== 'undefined' ? args[number] : match
      ;
    });
  };
}

if (!String.prototype.replaceAll){
  /**
   * An extension to String, which replaces certain patterns by arguments.
   * @see {@link https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript|how-to-replace-all-occurrences-of-a-string-in-javascript}
   * @param {string} find - The string which should be replaced.
   * @param {string} replace - The string which should replace 'find'.
   * @return {string} String where 'find' is replaced by 'replace'.
   */
  String.prototype.replaceAll = function(find, replace) {
    return this.replace(new RegExp(find, 'g'), replace);
  }
}

if (!Array.prototype.contains) {
  /**
   * An extension to Array checking whether an array of primitive types contains a given value.
   * @param {string|number|boolean|null|undefined} find An object which should be removed from the array.
   * @return {boolean} True, if 'this' contains param 'find', otherwise false..
   */
  Array.prototype.contains = function (find) {
    return this.indexOf(find) > -1;
  };
}

if (!Array.prototype.clean) {
  /**
   * An extension to Array removing defined values from an array.
   * @see {@link https://gist.github.com/waynegraham/3684627|Array.clean()}
   * @param {Object} deleteValue An object which should be removed from the array.
   * @return {Array} An array without 'deleteValue'.
   */
  Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) { // TODO swtich to .map() ?
      if (this[i] === deleteValue) {         
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };
}

define(
    [ 'app/mwtnCommons/mwtnCommons.module' ],
    function(mwtnCommonsApp) {

  mwtnCommonsApp.register.controller('mwtnFooterController', ['$scope', function ($scope) {
    var vm = this;
    $scope.prefix = 'ONF Wireless for OpenDaylight Boron-SR1';
    console.log($scope.prefix);
  }]);

  mwtnCommonsApp.register.directive('mwtnFooter', function () {
    return {
      restrict: 'E',
      controller: 'mwtnFooterController',
      controllerAs: 'vm',
      templateUrl: 'src/app/mwtnCommons/templates/mwtnFooter.tpl.html'
    };
  });

  mwtnCommonsApp.register.factory('$mwtnCommons', function($http, $q,  ENV, $mwtnLog, $mwtnDatabase, LogicalTerminationPoint) {
        
        var COMPONENT = '$mwtnCommons';
        
        /**
          * Process an array of data synchronously.
          * Please see https://gist.github.com/KevinTCoughlin/6901825 
          * @param {Array} data An array of data.
          * @param {function} processData A function that processes an item of data.
          *        Signature: function(item, i, callback), where {@code item} is the i'th item,
          *                   {@code i} is the loop index value and {@code calback} is the
          *                    parameterless function to call on completion of processing an item.
          * @param {function} done A callback function indecating that all items are processed.
          */
        var doSynchronousLoop = function (data, processData, done) {
          if (data && data.length > 0) {
            var loop = function(data, i, processData, done) {
              processData(data[i], i, function() {
                if (++i < data.length) {
                  loop(data, i, processData, done);
                } else {
                  done();
                }
              });
            };
            loop(data, 0, processData, done);
          } else {
            done();
          }
        };         

        var service = {
          base : ENV.getBaseURL("MD_SAL") + "/restconf/",
          database : {},
          'sdn-controller' : [],
          modules: {} 
        };

        /**
         * A function to get the global-identifier of a condtional package subClass by a specifcation object of such subClass and a local-name.
         * @param {{pacId: string, layerProtocolId: string, partId:string}} spec - Specification object of a conditional package subclass.
         * @param {string} local-name (e.g. current-problems)
         * @return {string} globel-identifier of a conditional packages subClass (e.g. 'air-interface-diversity-current-problems')
         */
        service.getPartGlobalId = function(spec, localName) {
          var address = spec.pacId.split(':');
          var module = address[0];
          var pacName = address[1];
          // console.warn(module, pacName);
          return Object.keys(service.modules[module][pacName]).filter(function(subClass){
            return service.modules[module][pacName][subClass]['local-name'] === localName;
          }).map(function(subClass){
            return service.modules[module][pacName][subClass].name;
          })[0];
        };

        /**
         * A function to get the local-name of a condtional package subClass by a specifcation object of such subClass.
         * @param {{pacId: string, layerProtocolId: string, partId:string}} spec - Specification object of a conditional package subclass
         * @return {string} local-name of a conditional packages subClass (e.g. 'current-problems')
         */
        service.getPartLocalId = function(spec) {
          var result;
          Object.keys(service.modules).map(function(module) {
            Object.keys(service.modules[module]).filter(function(pacName){
              return spec.pacId === [module, pacName].join(':') && service.modules[module][pacName][spec.partId].name === spec.partId;
            }).map(function(pacName) {
              result = service.modules[module][pacName][spec.partId]['local-name'];
            });
          });
          return result;
        };
        
        var init = function() {
          var deferred = $q.defer();
          var databaseRequest = {
              base: $mwtnDatabase.base,
              index: 'config',
              docType: 'sdn-controller',
              command: '_search',
              method: 'GET',
              from: 0,
              size: 10
          };
          $mwtnDatabase.genericRequest(databaseRequest).then(function(success){
            // console.log('sc', JSON.stringify(success.data.hits.hits));
            service['sdn-controller'] = success.data.hits.hits;
            $mwtnDatabase.getModules().then(function(success){
              service.modules = success;
            }, function(error){
              service.modules = [];
              console.error('modules', JSON.stringify(error));
              deferred.reject(error);
            });
            deferred.resolve();
          }, function(error){
            service['sdn-controller'] = [];
            console.error('sc', JSON.stringify(error));
            deferred.reject(error);
          });
        
          return deferred.promise;
        };
        
        service.getMainConroller = function() {
          var deferred = $q.defer();
          if (service['sdn-controller'].length === 0) {
            init().then(function(success){
              service['sdn-controller'].map(function(controller){
                result = controller;
              });
              deferred.resolve(result);
            }, function(error) {
              deferred.reject(error);
            });
          } else {
            service['sdn-controller'].map(function(controller){
              result = controller;
            });
            deferred.resolve(result);
          }
          return deferred.promise;
        };
        
        var createStream = function(streamName, callback) {
          service.getMainConroller().then(function(success){
            var src = success._source;
            var ip = src.host;
            if (ip === 'localhost') {
              ip = service.base.split('//')[1].split(':')[0];
            }
            var url = [src['transport-protocol'], '://', ip, ':', src.port, '/restconf/streams/stream/' , streamName].join('');
            var request = {
                method : 'GET',
                url : url
              };
              $http(request).then(function(response) {
                // console.log(response.headers('Location'));
                callback(response.headers('Location'));
              }, function errorCallback(response) {
                console.error(JSON.stringify(response));
                callback();
              });
          }, function(error){
            console.error('mainController', error);
            callback();
          });
        };
        
        service.getMmwtnWebSocketUrl = function() {
          var deferred = $q.defer();
          service.getMainConroller().then(function(success){
            var src = success._source;
            var ip = src.host;
            if (ip === 'localhost') {
              ip = service.base.split('//')[1].split(':')[0];
            }
            var url = ['ws://', src.username, ':', src.password, '@',  ip, ':8085/websocket' ].join('');
            deferred.resolve(url);
          }, function(error){
            console.error('mainController', error);
            deferred.reject(error);
          });
          return deferred.promise;
        };
        
        service.formatTimeStamp = function(t) {
          // t: time in ONF format, e.g. 20161020081633.7Z, 20161025235946.0+0000
          if (t.length !== '20161020081633.7Z'.length || t.length !== '20161025221822.0+0000') {
            if (t.endsWith('Z') || t.endsWith('+0000')) {
              if (!t.contains('-')) {
                return [[t.slice(0,4), t.slice(4,6), t.slice(6, 8)].join('-'), 
                        [t.slice(8, 10), t.slice(10, 12), t.slice(12, 16)].join(':')].join(' ') + ' UTC';
              }
            }
          }
          console.info('check', t);
          // return new Date().toISOString().slice(0,21).replace('T', ' ') + ' UTC';
          return t;
        };
        
        service.formatData = function(event) {
          var deferred = $q.defer();
          
          var x2js = new X2JS();
          var jsonObj = x2js.xml_str2json(event.data);
          // console.info('a', service.getType(jsonObj), JSON.stringify(jsonObj));
          if (jsonObj === null || service.getType(jsonObj) !== 'object') {
            deferred.reject('ignore');
          } else {
            notifType = Object.keys(jsonObj)[0];
            var formated = jsonObj[notifType];
            formated.timeStamp = service.formatTimeStamp(formated.timeStamp);
            formated.notifType = notifType;
            formated.myMessage = 'someMessage';
            formated.time = new Date().toISOString();
            deferred.resolve(formated);
          }
          
          return deferred.promise;
        };
        
        service.getData = function(callback) {
          return callback('$mwtnCommons registered to this application.');
        };
        /* 
         * returns the (json) type of a value
         */
        service.getType = function(value) {
          var result = typeof value;
          if (result === 'object' && JSON.stringify(value).substring(0,1) === '[') {
            result = 'array';
         } else if (result === 'object' && value === null) {
            result = 'null';
         }
          return result;
        };
        service.getLayer = function(pacId) {
          console.warn('@depricated', '$mwtnCommons.getLayer()');
          switch (pacId) {
            case 'airinterface':
            case 'air-interface':
              return 'MWPS';
            case 'structure':
            case 'pureEthernetStructure':
            case 'hybridStructure':
            case 'pure-ethernet-structure':
            case 'hybrid-structure':
              return 'MWS';
            case 'container':
            case 'ethernetContainer':
            case 'ethernet-container':
              return 'ETC';
            case 'tdmContainer':
            case 'tdm-container':
              return 'TDM';
            default:
              return (pacId);
          }
        };
        
        /** @deprecated */
        service.parts = ['Capability', 'Configuration', 'Status', 'CurrentProblems', 'CurrentPerformance', 'HistoricalPerformances'];
        
        service.getLabelId = function(key, callback) {
          return  callback(['mwtn', key].join('_').toUpperCase());
        };
        
        service.checkModules = function(names) {
          // accepts a list of module names and
          // attempts to load them, in order.
          // attempt to load the module into m
          var m;
          var result = {};
          names.map(function(name){
            try {
              m = angular.module(name);
              result[name] = true;
            } catch(err) {
              result[name] = false;
            }
          });
          return result;
        };
        
        service.mount = function(mp) {
          // mp: mounting point
          var url = [ service.base, service.url.mount(mp.name)].join('');
          /* deprecated 
          var xml = [
            '<module xmlns="urn:opendaylight:params:xml:ns:yang:controller:config">',
            '<type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">prefix:sal-netconf-connector</type>',
            '<name>{0}</name>',
            '<address xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">{1}</address>',
            '<port xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">{2}</port>',
            '<username xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">{3}</username>',
            '<password xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">{4}</password>',
            '<tcp-only xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">false</tcp-only>',
            '<event-executor xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">',
            '  <type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:netty">prefix:netty-event-executor</type>',
            '  <name>global-event-executor</name>',
            '</event-executor>',
            '<binding-registry xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">',
            '  <type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:md:sal:binding">prefix:binding-broker-osgi-registry</type>',
            '  <name>binding-osgi-broker</name>',
            '</binding-registry>',
            '<dom-registry xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">',
            '  <type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:md:sal:dom">prefix:dom-broker-osgi-registry</type>',
            '  <name>dom-broker</name>',
            '</dom-registry>',
            '<client-dispatcher xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">',
            '  <type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:config:netconf">prefix:netconf-client-dispatcher</type>',
            '  <name>global-netconf-dispatcher</name>',
            '</client-dispatcher>',
            '<processing-executor xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">',
            '  <type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:threadpool">prefix:threadpool</type>',
            '  <name>global-netconf-processing-executor</name>',
            '</processing-executor>',
            '<keepalive-executor xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">',
            '  <type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:threadpool">prefix:scheduled-threadpool</type>',
            '  <name>global-netconf-ssh-scheduled-executor</name>',
            '</keepalive-executor>', 
            '</module>' ].join('').format(mp.name, mp.ipaddress, mp.port, mp.username, mp.password); */
          var xml = [
             '<node xmlns="urn:TBD:params:xml:ns:yang:network-topology">',
             '  <node-id>{0}</node-id>',
             '  <host xmlns="urn:opendaylight:netconf-node-topology">{1}</host>',
             '  <port xmlns="urn:opendaylight:netconf-node-topology">{2}</port>',
             '  <username xmlns="urn:opendaylight:netconf-node-topology">{3}</username>',
             '  <password xmlns="urn:opendaylight:netconf-node-topology">{4}</password>',
             '  <tcp-only xmlns="urn:opendaylight:netconf-node-topology">false</tcp-only>',
             '  <keepalive-delay xmlns="urn:opendaylight:netconf-node-topology">120</keepalive-delay>',
             '</node>'].join('').format(mp.name, mp.ipaddress, mp.port, mp.username, mp.password);

            var request = {
              method : 'PUT',
              url : url,
              headers: {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
              },
              data : xml
            };
            var deferred = $q.defer();
            $http(request).then(function(success) {
              deferred.resolve(success.data);
            }, function(error) {
              $mwtnLog.error({component: '$mwtnCommons.mount', message: JSON.stringify(error.data)});
              deferred.reject(error);
            });
            return deferred.promise;
        };
        
        /**
         * A promise to unmount netconf devices the old way from OpenDaylight Lithium. 
         * This is needed in case Netconf devices from 3rd ONF Wireless PoC were mounted.
         * @param {string} nodeId - The mountpoint identifier which should be unmounted the old way.
         */
        var unmountDeprecated = function(nodeId) {
          var url = [service.base,
              'config/network-topology:network-topology/topology/topology-netconf/node/controller-config/yang-ext:mount/config:modules/module/odl-sal-netconf-connector-cfg:sal-netconf-connector/',
              nodeId].join('');
          var request = {
            method : 'DELETE',
            url : url
          };
          var deferred = $q.defer();
          $http(request).then(function(success) {
            $mwtnLog.info({component: COMPONENT, message: 'Mounting Point deleted: ' + nodeId});
            deferred.resolve(success.data);
          }, function(error) {
            $mwtnLog.info({component: '$mwtnCommons.unmount', message: JSON.stringify(error.data)});
            deferred.reject(error);
          });
          return deferred.promise;
        }

        /**
         * A promise to unmount netconf devices from OpenDaylight Beryllium and higher. 
         * @param {string} nodeId - The mountpoint identifier which unmounted/disconnected from OpenDaylight.
         */
        service.unmount = function(nodeId) {
          var url = [service.base, service.url.unmount(nodeId)].join('');
          var request = {
            method : 'DELETE',
            url : url
          };
          var deferred = $q.defer();
          $http(request).then(function(success) {
            $mwtnLog.info({component: COMPONENT, message: 'Mounting Point deleted: ' + nodeId});
            deferred.resolve(success.data);
          }, function(error) {
            // try the old way
            unmountDeprecated(nodeId).then(
              function(success) {
                $mwtnLog.info({component: COMPONENT, message: 'Mounting Point deleted: ' + nodeId});
                deferred.resolve(success.data);
              },
              function(error) {
                $mwtnLog.info({component: '$mwtnCommons.unmount', message: JSON.stringify(error.data)});
                deferred.reject(error);
              }
            );
          });
          return deferred.promise;
        };
        
        service.getPacParts = function(spec) {
          var errorMsg = {info:'No data received'};
          var deferred = $q.defer();
          switch (spec.pacId){
          case 'ne':
            service.getActualNetworkElement(spec.nodeId, spec.revision).then(function(success){
              deferred.resolve(success);
            }, function(error){
              $mwtnLog.error({component: COMPONENT, message: 'Requesting ' + spec.nodeId + ' failed!'});
              deferred.reject(error);
            });
            break;
          case 'ltp':
            var ltpKey = 'ltp';
            switch (spec.revision) {
              case '2017-02-17':
              case '2017-03-20':
              case '2017-03-24':
                ltpKey = 'ltp';
                break;
              default:
                ltpKey = '_ltpRefList';
            }
            var odlRequest = {
              method: 'GET',
              url: [service.url.actualNetworkElement(spec.nodeId, spec.revision), ltpKey, spec.layerProtocolId].join('/')
            };
            console.info(odlRequest.url);
            service.genericRequest(odlRequest).then(function(success){
              deferred.resolve(success);
            }, function(error){
              $mwtnLog.error({component: COMPONENT, message: 'Requesting LTPs of ' + spec.nodeId + ' failed!'});
              deferred.reject(errorMsg);
            });
            break;
          case 'MWPS':
          case 'MWS':
          case 'ETH-CTP':
          case 'ETH':
          case 'airinterface':
          case 'structure':
          case 'container':
          // 3rd PoC
          case 'MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac':
          case 'MicrowaveModel-ObjectClasses-EthernetContainer:MW_EthernetContainer_Pac':
          case 'MicrowaveModel-ObjectClasses-PureEthernetStructure:MW_PureEthernetStructure_Pac':
          // 4th PoC
          case 'microwave-model:mw-air-interface-pac':
          case 'microwave-model:mw-air-interface-diversity-pac':
          case 'microwave-model:mw-pure-ethernet-structure-pac':
          case 'microwave-model:mw-hybrid-mw-structure-pac':
          case 'microwave-model:mw-tdm-container-pac':
          case 'microwave-model:mw-ethernet-container-pac':
          case 'onf-ethernet-conditional-packages:ethernet-pac':
            if (spec.partId) {
              service.getConditionalPackagePart(spec).then(function(success){
                success.layerProtocol = spec.layerProtocolId;
                deferred.resolve(success);
              }, function(error){
                $mwtnLog.error({component: COMPONENT, message: 'Requesting conditional package of ' + JSON.stringify(spec) + ' failed!'});
                deferred.reject(errorMsg);
              });
            } else {
              deferred.resolve();
            }
            break;
          case 'neCurrentProblems':
            service.getNetworkElementCurrentProblemList(spec.nodeId, spec.revision).then(function(success){
              deferred.resolve(success);
            }, function(error){
              $mwtnLog.error({component: COMPONENT, message: 'Requesting ' + spec.nodeId + ' failed!'});
              deferred.reject(error);
            });
            break;
          case 'mountpoint':
            // not needed (currently)
            break;
          default:
            $mwtnLog.error({component: COMPONENT, message: 'Requesting ' + spec.pacId + ' is not supported!'});
            deferred.reject(errorMsg);
          }
          return deferred.promise;
        };
        service.setPacParts = function(spec, data) {
          var errorMsg = {info:'No data received'};
          var deferred = $q.defer();
          switch (spec.pacId){
//          case 'ne':
//            service.getActualNetworkElement(spec.nodeId, spec.revision).then(function(success){
//              deferred.resolve(success);
//            }, function(error){
//              $mwtnLog.error({component: COMPONENT, message: 'Requesting ' + spec.nodeId + ' failed!'});
//              deferred.reject(errorMsg);
//            });
//            break;
//          case 'ltp':
//            var odlRequest = {
//              method: 'GET',
//              url: [service.url.actualNetworkElement(spec.nodeId, spec.revision), '_ltpRefList', spec.layerProtocolId].join('/')
//            };
//            service.genericRequest(odlRequest).then(function(success){
//              deferred.resolve(success);
//            }, function(error){
//              $mwtnLog.error({component: COMPONENT, message: 'Requesting LTPs of ' + spec.nodeId + ' failed!'});
//              deferred.reject(errorMsg);
//            });
//            break;
          case 'airinterface':
          case 'structure':
          case 'container':
            if (spec.partId) {
              service.setConditionalPackagePart(spec, data).then(function(success){
                deferred.resolve(success);
              }, function(error){
                $mwtnLog.error({component: COMPONENT, message: 'Modification of ' + JSON.stringify(spec) + ' failed!'});
                deferred.reject(errorMsg);
              });
            }
            break;
          default:
            $mwtnLog.error({component: COMPONENT, message: 'Modification of ' + spec.pacId + ' not supported!'});
            deferred.reject(errorMsg);
          }
          return deferred.promise;
        };
        service.setPacPartLists = function(spec, listData) {
          var errorMsg = {info:'No data received'};
          var deferred = $q.defer();
          switch (spec.pacId){
//          case 'ne':
//            service.getActualNetworkElement(spec.nodeId, spec.revision).then(function(success){
//              deferred.resolve(success);
//            }, function(error){
//              $mwtnLog.error({component: COMPONENT, message: 'Requesting ' + spec.nodeId + ' failed!'});
//              deferred.reject(errorMsg);
//            });
//            break;
//          case 'ltp':
//            var odlRequest = {
//              method: 'GET',
//              url: [service.url.actualNetworkElement(spec.nodeId, spec.revision), '_ltpRefList', spec.layerProtocolId].join('/')
//            };
//            service.genericRequest(odlRequest).then(function(success){
//              deferred.resolve(success);
//            }, function(error){
//              $mwtnLog.error({component: COMPONENT, message: 'Requesting LTPs of ' + spec.nodeId + ' failed!'});
//              deferred.reject(errorMsg);
//            });
//            break;
          case 'airinterface':
          case 'structure':
          case 'container':
            if (spec.partId === 'Configuration') {
              service.setConditionalPackagePartList(spec, listData).then(function(success){
                deferred.resolve(success);
              }, function(error){
                $mwtnLog.error({component: COMPONENT, message: 'Modification of ' + JSON.stringify(spec) + ' failed!'});
                deferred.reject(errorMsg);
              });
            }
            break;
          default:
            $mwtnLog.error({component: COMPONENT, message: 'Modification of ' + spec.pacId + ' not supported!'});
            deferred.reject(errorMsg);
          }
          return deferred.promise;
        };
        var nodeIntId = 100;
        service.getNodeIntIdFromNodeId = function(nodeId) {
          nodeIntId = nodeIntId + 1;
          if (nodeId.contains('-')) {
            return nodeId.split('-')[1]; 
          }
          return nodeIntId;
        };

        service.getRequiredNetworkElements = function(complete) {
          var sort = [{ _id : {order : 'asc'}}];;
          var query = {
            match: {
              required: true
            }
          };
          var deferred = $q.defer();
          $mwtnDatabase.getFilteredSortedData('mwtn', 'required-networkelement', 0, 10000, sort, query).then(
            function(success){
              if (complete) {
                deferred.resolve(success.data.hits.hits); 
              }
              var result = success.data.hits.hits.map(function(ne){
                var yangifiedObj = service.yangifyObject(ne._source);
                var pacKey = 'microwave-model:mw-air-interface-pac';
                if (yangifiedObj['microwave-model-object-classes-air-interface:mw-air-interface-pac']) {
                  pacKey = 'microwave-model-object-classes-air-interface:mw-air-interface-pac';
                }
                var configKey = 'air-interface-configuration';
                if (yangifiedObj[pacKey]) {
                  var radioSignalIds = yangifiedObj[pacKey].filter(
                    function(mwps) {
                      return mwps[configKey] && mwps[configKey]['radio-signal-id'];
                    }
                  ).map(
                    function(mwps) {
                      return mwps[configKey]['radio-signal-id'];
                    }
                  );
                } 
                return {
                  id: service.getNodeIntIdFromNodeId(yangifiedObj['node-id']),
                  name: yangifiedObj['node-id'],
                  ipaddress: yangifiedObj.connect.host,
                  port: yangifiedObj.connect.port,
                  username: yangifiedObj.connect.username,
                  password: yangifiedObj.connect.password,
                  radioSignalIds: JSON.stringify(radioSignalIds),
                  connectionStatus: 'disconnected'
                };
              });
              deferred.resolve(result);         
            }, 
            function(error){
              $mwtnLog.error({component: COMPONENT, message: 'Problems in retrieving required network elements.'});
              deferred.reject(error);
            }
          );
          return deferred.promise;
        };
        
        service.getConnectionStatus = function(neId) {
          var url = service.base + service.url.connectionStatus(neId);
          var request = {
            method : 'GET',
            url : url
          };
          var deferred = $q.defer();
          $http(request).then(function(success) {
            // console.log(JSON.stringify(success));
            deferred.resolve(success.data.node[0]['netconf-node-topology:connection-status']);
          }, function(error) {
            deferred.reject(error);
          });
          return deferred.promise;
        };
        service.executeClosedLoopAutomation = function() {
            var url = service.base+'operations/closedLoopAutomation:start';
            var request = {
                method : 'POST',
                url : url
            };
            var deferred = $q.defer();
            $http(request).then(function(success) {
               deferred.resolve(success);
            }, function(error) {
               deferred.reject(error);
            });
            return deferred.promise;
        };
        service.saveClosedLoopAutomation = function(enabled, option) {
            var url = service.base+'operations/closedLoopAutomation:save-timer';
            var request = {
                method : 'POST',
                url : url,
                data : {
                   "input" : {
                     "enabled" : enabled,
                     "option" : option
                   }
                }
            };
            var deferred = $q.defer();
            $http(request).then(function(success) {
               deferred.resolve(success);
            }, function(error) {
               deferred.reject(error);
            });
            return deferred.promise;
        };
        service.readClosedLoopAutomation = function() {
            var url = service.base+'operations/closedLoopAutomation:read-timer';
            var request = {
                method : 'POST',
                url : url,
            };
            var deferred = $q.defer();
            $http(request).then(function(success) {
               deferred.resolve(success);
            }, function(error) {
               deferred.reject(error);
            });
            return deferred.promise;
        };
        
        /**
         * A promise inquiring the a single mountpoint from topology-netconf.
         * @param {string} nodeId - The mountpoint identifier.
         * @return {{'node-id':string, 'netconf-node-topology:tcp-only': boolean, 'netconf-node-topology:host', string, 'netconf-node-topology:keepalive-delay':number, 'netconf-node-topology:port':number, 'netconf-node-topology:username':string, 'netconf-node-topology:password': string}} - The mountpoint from topology-netconf.
         */
        service.getMountPoint = function(nodeId) {
          var odlRequest = {
            method : 'GET',
            url : service.url.mount(nodeId)
          };
          var deferred = $q.defer();
          service.genericRequest(odlRequest).then(
            function(success){
              deferred.resolve(success.data.node[0]);
            }, 
            function(error){
              deferred.reject(error);
            }
          );
          return deferred.promise;
        };
        
        service.getMountPoints = function() {
          var url = service.base + service.url.actualNetworkElements();
          var request = {
            method : 'GET',
            url : url
          };
          var deferred = $q.defer();
          $http(request).then(function(success) {
            var requiredTopology = 'topology-netconf';
            var topo = success.data.topology.filter(function(topo){
              return topo['topology-id'] === requiredTopology;
            });
            // console.log('topo', JSON.stringify(topo));
            if (topo.length === 0) {
              var message = ['ODL', requiredTopology, 'not found!'].join(' ');
              $mwtnLog.error({component: COMPONENT, message: message});
              deferred.reject(message);
            } else {
              var mwMountPoints = topo[0].node.filter(function(mountpoint){
                return mountpoint['node-id'] !==  'controller-config';
              }).map(function(mountpoint){
                // console.log('mountpoint', JSON.stringify(mountpoint));
                var capId = 'netconf-node-topology:available-capabilities';
                if (mountpoint[capId] && mountpoint[capId]['available-capability']) {
                  var caps = mountpoint[capId]['available-capability'].filter(function(cap) {
                    return cap.contains('?revision=');
                  }).map(function(cap) {
                    return {
                      module: cap.split(')')[1],
                      revision: cap.split('?revision=')[1].substring(0,10)
                    };
                  }).sort(function(a, b) {
                    if (a.module < b.module) return -1;
                    if (a.module > b.module) return 1;
                    return 0;
                  });
                  // console.log('mountpoint', JSON.stringify(caps));
                  mountpoint.onfCapabilities = caps;
                  mountpoint.onfCoreModelRevision = caps.filter(function(cap){
                    return cap.module === 'core-model' || cap.module === 'CoreModel-CoreNetworkModule-ObjectClasses'; 
                  }).map(function(cap){
                    return cap.revision;
                  });
                  if (mountpoint.onfCoreModelRevision.length === 1) {
                    mountpoint.onfCoreModelRevision = mountpoint.onfCoreModelRevision[0];
                  } else {
                    $mwtnLog.error({component: COMPONENT, message: mountpoint.onfCoreModelRevision.length + ' CoreModels supported by ' + mountpoint['node-id']});
                  }
                  
                  // console.log('caps', JSON.stringify(caps));
                  mountpoint.onfAirInterfaceRevision = caps.filter(function(cap){
                    return cap.module === 'microwave-model' || cap.module === 'MicrowaveModel-ObjectClasses-AirInterface'; 
                  }).map(function(cap){
                    return cap.revision;
                  });
                  // console.log('onfAirInterfaceRevision', mountpoint.onfAirInterfaceRevision);
                  if (mountpoint.onfAirInterfaceRevision.length === 1) {
                    mountpoint.onfAirInterfaceRevision = mountpoint.onfAirInterfaceRevision[0];
                  } else {
                    $mwtnLog.error({component: COMPONENT, message: 'More than 1 or no MicrowaveModel supported by ' + mountpoint['node-id']});
                  }
                }
                return mountpoint;
              });
              // console.log('mwMountPoints', JSON.stringify(mwMountPoints));
              deferred.resolve(mwMountPoints);
            }
          }, function(error) {
            $mwtnLog.error({component: COMPONENT, message: JSON.stringify(error.data)});
            deferred.reject(error);
          });
          return deferred.promise;
        };
        service.separator = '&nbsp;';
        // grid settings
        service.highlightFilteredHeader = function(row, rowRenderIndex,
            col, colRenderIndex) {
          if (col.filters[0].term) {
            return 'header-filtered';
          } else {
            return '';
          }
        };
        service.gridOptions = {
          data : [],
          enableColumnResizing : true,
          enableSorting : true,
          enableFiltering : true,
          enableGridMenu : true,
          exporterMenuPdf: false,
          showGridFooter : true,
          // showColumnFooter: true,
          fastWatch : true,
          enableRowSelection : true,
          enableRowHeaderSelection : true,
          multiSelect : false
        };
        service.gridOptions.gridMenuCustomItems = [ {
          title : 'Rotate Grid',
          action : function($event) {
            this.grid.element.toggleClass('rotated');
          },
          order : 210
        } ];
        service.url = {
          actualNetworkElements : function() {
            return 'operational/network-topology:network-topology/topology/topology-netconf';
          },
          connectionStatus : function(neId) {
            return 'operational/network-topology:network-topology/topology/topology-netconf/node/' + neId;
          },
          mount : function(neId) {
            return 'config/network-topology:network-topology/topology/topology-netconf/node/' + neId;
            // return 'config/network-topology:network-topology/topology/topology-netconf/node/controller-config/yang-ext:mount/config:modules'; // depricated 
          },
          unmount : function(neId) {
            // return 'config/network-topology:network-topology/topology/topology-netconf/node/controller-config/yang-ext:mount/config:modules/module/odl-sal-netconf-connector-cfg:sal-netconf-connector/' + neId; // depricated 
            return 'config/network-topology:network-topology/topology/topology-netconf/node/' + neId;
          },
          actualNetworkElement : function(neId, revision) {
            switch (revision) {
            case "2016-03-23":
              return [
                      'operational/network-topology:network-topology/topology/topology-netconf/node/',
                      neId,
                      '/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement/',
                      neId ].join('');
            case "2017-02-17":
            case "2017-03-20":
            case "2017-03-24":
              return [
                      'operational/network-topology:network-topology/topology/topology-netconf/node/',
                      neId,
                      '/yang-ext:mount/core-model:network-element'].join('');
            default: // 2016-08-11
              return [
                      'operational/network-topology:network-topology/topology/topology-netconf/node/',
                      neId,
                      '/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement'].join('');
            }
          },
          networkElementCurrentProblemList : function(neId, revision) {
            console.log(neId, revision);
            switch (revision) {
            case "2016-08-11":
              return [
                  'operational/network-topology:network-topology/topology/topology-netconf/node/',
                  neId,
                  '/yang-ext:mount/MicrowaveModel-NetworkElement-CurrentProblemList:NetworkElementCurrentProblems'].join('');
            case "2017-02-17": 
            case "2017-03-20": // TODO sko equipmentAlarms check new yang file if agreed
              return [
                  'operational/network-topology:network-topology/topology/topology-netconf/node/',
                  neId,
                  '/yang-ext:mount/MicrowaveModel-NetworkElement-CurrentProblemList:NetworkElementCurrentProblems'].join('');
            default:
              return [
                'operational/network-topology:network-topology/topology/topology-netconf/node/',
                neId,
                '/yang-ext:mount/MicrowaveModel-NetworkElement-CurrentProblemListCurrentProblems'].join('');
            }
          }
        };
        /*
         * Changes different time formats to a common time fromat
         * TODO currently not implemented!
         */
        service.normalizeTimeFormat = function(time, format) {
          return time;
        };
        /*
         * Changing a string according to yang naming conventions.
         * The function should be alinged with the ONF Eagle project.
         */
        service.yangify = function(str) {
            var result=str
                    .replace( /RefList+$/, '')                // endling "List" was removed
                    .replace( /List+$/, '')                   // endling "List" was removed
                    .replace( /([a-z])([A-Z])/g, '$1-$2' )    // insert dashes
                    .replace( /([0-9])([a-zA-Z])/g, '$1-$2' ) // insert dashes
                    .replace( /([A-Z])([A-Z])([a-z])/g, '$1-$2$3' ) // insert dashes
                    .toLowerCase()                            // lowercase everything
                    .replace( /^_/, '')                       // remove leading underscore
                    .replace( /:_/g, ':')                     // and leading underscores in path segments
                    .replace( /_/g, '-');                     // convert underscore to dashes

          // catch "wrong" UML labels
          var exceptions={
            'current-performance-data':'current-performance-data-list',
            'air-interface-capability':'air-interface-capability-list',
            'air-interface-current-problem':'air-interface-current-problem-list',
            'structure-capability':'structure-capability-list',
            'structure-current-problem':'structure-current-problem-list',
            'container-capability':'container-capability-list',
          };
          if (exceptions[result]) {
           // result=exceptions[result]; // TODO is this needed or not - maybe depend on revision?
          } 

          // catch modulation value difference
          if (result.startsWith('time') && result.endsWith('symbols') 
           || result.startsWith('time') && result.contains('-symbols-') && result.endsWith('-s') 
           || result.startsWith('time') && result.contains('-symbols-') && result.endsWith('-l')){
            result=result.replace('symbols','states');
          }
          return result;
        };

        /*
         * Checking, whether a jsonObject should be yangifyed
         */
        service.isCamelCase = function(jsonObject) {
            if (jsonObject === undefined || jsonObject === null) {
                return true;
            }
            var result;
            var type = service.getType(jsonObject);
            switch (type) {
                case 'object':
                    result = false;
                    Object.keys(jsonObject).map(function(key){
                        result = result || key !== [service.yangify(key)];
                    });
                    break;
                case 'array':
                case 'boolean':
                case 'function':
                case 'string':
                case 'number':
                case 'null':
                case 'undefined':
                    result = true;
                    break;
                default:
                    console.error('Type1:', type, ' is not supported!');
                    result = true;
            }
            return result;
        };
        /*
         * Yangifies a names/keys of a jsonOject
         */
        service.yangifyObject = function(jsonObject) {
            if (jsonObject === undefined || jsonObject === null) {
                return jsonObject;
            }
            var result;
            var type = service.getType(jsonObject);
            switch (type) {
                case 'object':
                    result = {};
                    Object.keys(jsonObject).map(function(key){
                        result[service.yangify(key)] = service.yangifyObject(jsonObject[key]);
                    });
                    break;
                case 'array':
                    result = jsonObject.map(function(item, index) {
                        return service.yangifyObject(item);
                    });
                    break;
                case 'boolean':
                case 'function':
                case 'string':
                case 'number':
                case 'null':
                case 'undefined':
                    result = jsonObject;
                    break;
                default:
                    console.error('Type:', type, ' is not supported!');
                    result = jsonObject;
            }
            return result;
        };
        /*
         * Send a restconf request to OpenDayligth.
         * All ODL restconf requests should pass this function.
         */
        service.genericRequest = function(odlRequest) {
          var url = [ service.base, odlRequest.url].join('');
          var request = {
            method : odlRequest.method,
            url : url,
            data : odlRequest.data
          };
          var deferred = $q.defer();
          $http(request).then(function(success) {
            // yangifing the response is required until all NEs has switch to CoreModel 1.2 (ONF-TR-532)
           // deferred.resolve(service.yangifyObject(success));
             deferred.resolve(success);
          }, function(error) {
            $mwtnLog.error({component: COMPONENT + '.genericRequest', message: JSON.stringify(error.data)});
            deferred.reject(error);
          });
          return deferred.promise;
        };
        service.getMountedNetConfServers = function(callback) {
          var url = service.base + service.url.actualNetworkElements();
          var request = {
            method : 'GET',
            url : url
          };
          $http(request).then(function(success) {
            return callback(success.data);
          }, function(error) {
            console.error(JSON.stringify(error));
            return callback();
          });
        };
        service.getActualNetworkElement = function(neId, revision) {
          var url = [service.base,
              service.url.actualNetworkElement(neId, revision)].join('');
          var request = {
            method : 'GET',
            url : url
          };
          var taskId = [neId, 'ONF:CoreModel:NetworkElement data received'].join(' ');
          
          var deferred = $q.defer();
          console.time(taskId);
          $http(request).then(function(success) {
            console.timeEnd(taskId);
            success.data.revision = revision;
          //  deferred.resolve(service.yangifyObject(success.data));
             deferred.resolve(success.data);
          }, function(error) {
            console.timeEnd(taskId);
            $mwtnLog.info({component: '$mwtnCommons.getActualNetworkElement', message: JSON.stringify(error.data)});
            deferred.reject(error);
           });
          return deferred.promise;
        };
        service.getNetworkElementCurrentProblemList = function(neId, revision) {
          var url = [service.base,
              service.url.networkElementCurrentProblemList(neId, revision)].join('');
          var request = {
            method : 'GET',
            url : url
          };
          var taskId = [neId, 'ONF:CoreModel:NetworkElement data received'].join(' ');
          
          var deferred = $q.defer();
          console.time(taskId);
          $http(request).then(function(success) {
            console.timeEnd(taskId);
            success.data.revision = revision;
           // deferred.resolve(service.yangifyObject(success.data)); TODO: check if correct
             deferred.resolve(success.data);
          }, function(error) {
            console.timeEnd(taskId);
            $mwtnLog.info({component: '$mwtnCommons.getActualNetworkElement', message: JSON.stringify(error.data)});
            deferred.reject(error);
           });
          return deferred.promise;
        };

        var getIdsByRevision = function(revision, pacId, partId) {

          switch (revision) {
            case '2016-03-23':
              switch (pacId) {
                case 'MWPS':
                case 'AirInterface':
                case 'airinterface':
                case 'airInterface':
                  pacId = 'MicrowaveModel-ObjectClasses-MwConnection:MW_AirInterface_Pac';
                  partId = 'airInterface' + partId;
                  if (partId === 'airInterfaceCapability' || partId === 'airInterfaceCurrentProblems') {
                    partId = undefined;
                  }
                  break;
                case 'MWS':
                case 'Structure':
                case 'structure':
                  pacId = 'MicrowaveModel-ObjectClasses-MwConnection:MW_Structure_Pac';
                  partId = 'structure' + partId;
                  break;
                case 'ETH-CTP':
                case 'ETH':
                case 'Container':
                case 'container':
                  pacId = 'MicrowaveModel-ObjectClasses-MwConnection:MW_Container_Pac';
                  partId = 'container' + partId;
                  break;
                case 'TDM':
                  pacId = 'MicrowaveModel-ObjectClasses-MwConnection:MW_Container_Pac';
                  partId = 'container' + partId;
                  break;
              }
              break;
            case '2017-02-17':
            case '2017-03-20':
            case '2017-03-24':
             switch (pacId) {
              case 'MWPS':
              case 'AirInterface':
              case 'airinterface':
              case 'airInterface':
              case 'air-interface':
                pacId = 'microwave-model:mw-air-interface-pac';
                partId = 'air-interface-'+service.yangify(partId);
                break;
              case 'MWS':
              case 'Structure':
              case 'structure':
                var isHybrid = false; // TODO How do I know this? 
                if (isHybrid) {
                  pacId = 'microwave-model:mw-hybrid-mw-structure-pac';
                  partId = 'hybrid-mw-structure-' + service.yangify(partId);
                } else {
                  pacId = 'microwave-model:mw-pure-ethernet-structure-pac';
                  partId = 'pure-ethernet-structure-' + service.yangify(partId);
                }
                break;
              case 'ETH-CTP':
              case 'ETH':
              case 'Container':
              case 'container':
                pacId = 'microwave-model:mw-ethernet-container-pac';
                partId = 'ethernet-container-' + service.yangify(partId);
                break;
              case 'TDM':
                pacId = 'microwave-model:mw-tdm-container-pac';
                partId = 'tdm-container-' + service.yangify(partId);
                break;
              }
              break;
            default:
              switch (pacId) {
                case 'MWPS':
                case 'AirInterface':
                case 'airinterface':
                case 'airInterface':
                  pacId = 'MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac';
                  partId = 'airInterface' + partId;
                  break;
                case 'MWS':
                case 'Structure':
                case 'structure':
                  pacId = 'MicrowaveModel-ObjectClasses-PureEthernetStructure:MW_PureEthernetStructure_Pac';
                  partId = 'pureEthernetStructure' + partId;
                  break;
                case 'ETH-CTP':
                case 'ETH':
                case 'Container':
                case 'container':
                  pacId = 'MicrowaveModel-ObjectClasses-EthernetContainer:MW_EthernetContainer_Pac';
                  partId = 'ethernetContainer' + partId;
                  break;
                case 'TDM':
                  pacId = 'microwave-model:mw-tdm-container-pac';
                  partId = 'tdm-container-' + service.yangify(partId);
                  break;
              }
          }
          return {
            pacId: pacId,
            partId: partId
          };
        };
        
        service.getConditionalPackagePart = function(spec) {
          // console.log(JSON.stringify(spec));
          var deferred = $q.defer();
          if(!spec.partId) {
            deferred.reject('ignore');
            return deferred.promise;
          }
          
          var ids = getIdsByRevision(spec.revision, spec.pacId, spec.partId);
          
          var url = [service.base,
              'operational/network-topology:network-topology/topology/topology-netconf/node/',
              spec.nodeId,
              '/yang-ext:mount/',ids.pacId,'/',
              spec.layerProtocolId, '/', 
              ids.partId].join('');
          var request = {
            method : 'GET',
            url : url
          };
          // console.log(JSON.stringify(request));
                    
          var taskId = [spec.nodeId, spec.layerProtocolId, spec.pacId, 'data received'].join(' ');
          console.time(taskId);
          $http(request).then(function(success) {
            console.timeEnd(taskId);
            success.data.revision = spec.revision;
            deferred.resolve(success.data);
            // console.log(JSON.stringify(service.yangifyObject(success.data)));
            // [sko] not now - later after all apps are updated to the new model: deferred.resolve(service.yangifyObject(success.data));
          }, function(error) {
            console.timeEnd(taskId);
            $mwtnLog.info({component: '$mwtnCommons.getConditionalPackagePart', message: JSON.stringify(error.data)});
            deferred.reject(error);
          });
          return deferred.promise;
        };
        
        service.setConditionalPackagePart = function(spec, data) {
          var deferred = $q.defer();
          if(!spec.partId) {
            deferred.reject('ignore');
            return deferred.promise;
          }
          
          var ids = getIdsByRevision(spec.revision, spec.pacId, spec.partId);
          var body = {};
          body[ids.partId] = data;
          
          var url = [service.base,
              'config/network-topology:network-topology/topology/topology-netconf/node/',
              spec.nodeId,
              '/yang-ext:mount/',ids.pacId,'/',
              spec.layerProtocolId, '/', 
              ids.partId].join('');
          var request = {
              method : 'PUT',
              url : url,
              headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json'
              },
              data : body
            };
//          var request = {
//              method : 'PATCH',
//              url : url,
//              headers: {
//                'Content-Type': 'application/yang.patch+json'
//              },
//              data : body
//            };
          // console.log(JSON.stringify(request));
          
          var taskId = [spec.nodeId, spec.layerProtocolId, spec.pacId, 'data received'].join(' ');
          console.time(taskId);
          
          $http(request).then(function(success) {
            console.timeEnd(taskId);
            success.data.revision = spec.revision;
             deferred.resolve(success.data);
           // deferred.resolve(service.yangifyObject(success.data));
          }, function(error) {
            console.timeEnd(taskId);
            $mwtnLog.error({component: '$mwtnCommons.setConditionalPackagePart', message: JSON.stringify(error.data)});
            deferred.reject(error);
          });
          return deferred.promise;
        };
//     pureEthernetStructureConfiguration/problemKindSeverityList/value1
//     {
//       "problemKindSeverityList": [
//         {
//           "problemKindName": "severity1",
//           "problemKindSeverity": "warning"
//         }
//       ]
//     }
     
       var processData = function(item, i, callback) {
          var spec = item.spec;
          var ids = getIdsByRevision(spec.revision, spec.pacId,
              spec.partId);
          item.spec = undefined;
          var body = {};
          body[spec.attribute] = [ item ];
          $mwtnDatabase.getSchema().then(function(schema) {
            
            var key;
            Object.keys(item).map(function(k){
              // works currently only for single key lists
              if (schema[k] && schema[k]['is-key']) {
                key = k;
              }
            });
           
            var url = [
                service.base.slice(0, -1),
                'config/network-topology:network-topology/topology/topology-netconf/node',
                spec.nodeId, 'yang-ext:mount', ids.pacId,
                spec.layerProtocolId, ids.partId,
                spec.attribute, item[key] ].join('/');
            var request = {
              method : 'PUT',
              url : url,
              headers : {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json'
              },
              data : body
            };
            // console.log(JSON.stringify(request));
            var taskId = [ spec.nodeId, spec.layerProtocolId,
                spec.pacId, item.problemKindName,
                'data received' ].join(' ');
            console.time(taskId);
            $http(request).then(function(success) {
              console.timeEnd(taskId);
              success.data.revision = spec.revision;
              return callback();
            },
            function(error) {
              console.timeEnd(taskId);
              $mwtnLog
                  .error({
                    component : '$mwtnCommons.setConditionalPackagePart',
                    message : JSON
                        .stringify(error.data)
                  });
              return callback();
            });
          });
        };
     
        service.setConditionalPackagePartList = function(spec, data) {
          var deferred = $q.defer();
          if(!spec.partId) {
            deferred.reject('ignore');
            return deferred.promise;
          }
          
          data.map(function(item){
            item.spec = spec;
          });
          
          doSynchronousLoop(data, processData, function(){
            deferred.resolve();
          });
          return deferred.promise;
        };
        
        var saveRequiredNetworkElement = function(requiredNode){
          var url = [ $mwtnDatabase.base, $mwtnDatabase.index, 'required-networkelement',
                      requiredNode.nodeId ].join('/');
          var bodyString = JSON.stringify(requiredNode); 
          var headers = {
              'Content-Type': 'application/json',
              'Content-Length': bodyString.length
          };
          var request = {
            method : 'PUT',
            url : url,
            data : requiredNode
          };
        
          var deferred = $q.defer();
          console.time('database:' + url);
          $http(request).then(function(success) {
            console.timeEnd('database:' + url);
            // console.log(JSON.stringify(success));
            deferred.resolve(success);
          }, function(error) {
            console.timeEnd('database:' + url);
            $mwtnLog.error({component: '$mwtnCommons.saveRequiredNetworkElement', message: JSON.stringify(error.data)});
            deferred.reject(error);
          });
          return deferred.promise;
        };
        
        /**
         * A function which inquires data from a netconf server and stores it in a database.
         * @param {{'node-id': string, ipAddress: string, port: number, username: string, password: string, site:string, onfCoreModelRevision: string, onfAirInterfaceRevision: string}} netconfServer - A netConf server object with all connectivity parameters.
         */
        service.addRequiredNetworkElement = function(netconfServer) {
          /** {Object} requiredNode - Data set to be stored in database */
          var requiredNode = {
              nodeId: netconfServer['node-id'],
              siteRef: netconfServer.site,
              onfCoreModelRevision: netconfServer.onfCoreModelRevision,
              onfAirInterfaceRevision: netconfServer.onfAirInterfaceRevision,
              required: true,
              connect: {
                mountId : netconfServer['node-id'],
                host: netconfServer['netconf-node-topology:host'],
                port: netconfServer['netconf-node-topology:port'],
                username: netconfServer.username,
                password: netconfServer.password
              },
              'core-model:network-element' : {},
          };
          
          // get NetworkElement object from node
          var spec = {
              nodeId : requiredNode.nodeId,
              revision: requiredNode.onfCoreModelRevision,
              pacId : 'ne'
          };
          
          var updatePart = function(spec, data) {
            data.layerProtocol = spec.layerProtocolId;
            requiredNode[spec.pacId].push(data);
          };

          var processLTPs = function(item, i, callback) {
            var ltp = new LogicalTerminationPoint(item);
            console.warn(i, ltp.getId());
            ltp.getLayerProtocols().map(
              /**
               * A function processing a layer-protocol object
               * @param {LayerProtocol} lp A layer-protocol object
               */
              function(lp) {
                var conditionalPackage = lp.getConditionalPackage(true);
                // console.log(conditionalPackage);
                if (conditionalPackage) {
                  if (requiredNode[conditionalPackage] === undefined) {
                    // create missing pac array
                    requiredNode[conditionalPackage] = [];
                  }
                  var spec = {
                      nodeId : requiredNode.nodeId,
                      revision: requiredNode.onfCoreModelRevision, 
                      pacId: conditionalPackage,
                      layer: lp.getLayer(),
                      layerProtocolId: lp.getId()
                  };
                  spec.partId = service.getPartGlobalId(spec, 'configuration'); 
                  // console.log(JSON.stringify(spec));
                  service.getPacParts(spec).then(function(success){
                    // console.log(JSON.stringify(success));
                    updatePart(spec, service.yangifyObject(success));
                    return callback();
                  }, function(error){
                    updatePart(spec, error);
                    $mwtnLog.error({component: '$mwtnCommons.processLTPs bad data', message: JSON.stringify(error)});
                    return callback();
                  });
                } else {
                  $mwtnLog.info({component: COMPONENT, message: 'The condtional package ' + conditionalPackage + ' is not supported (yet)!'});
                }
            });

            // console.log(JSON.stringify(ltp.getData()));
          };

          var deferred = $q.defer();
          service.getPacParts(spec).then(function(success){
            success = service.yangifyObject(success);
            requiredNode['core-model:network-element'] = success['network-element'];
            
            doSynchronousLoop(success['network-element'].ltp, processLTPs, function(){
              saveRequiredNetworkElement(requiredNode).then(function(success){
                deferred.resolve(success);
              }, function(error){
                $mwtnLog.error({component: '$mwtnCommons.saveRequiredNetworkElement', message: JSON.stringify(error.data)});
                deferred.reject(error);
              });
            });
            
          }, function(error){
            $mwtnLog.error({component: '$mwtnCommons.getPacParts', message: JSON.stringify(error.data)});
            deferred.reject(error);
          });
          return deferred.promise;
        };

        service.registerForOdlEvents = function(path, callback) {
          var request = {
            method : 'POST',
            url : [ service.base,
                'operations/sal-remote:create-data-change-event-subscription' ]
                .join(''),
            data : {
              "input" : {
                "path" : path,
                "sal-remote-augment:datastore" : "CONFIGURATION",
                "sal-remote-augment:scope" : "SUBTREE"
              }
            }
          };
          $http(request).then(
              function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                // console.log(JSON.stringify(response));
                createStream(response.data.output['stream-name'],
                    function(socketLocation) {
                      callback(socketLocation);
                    });
              }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.error(JSON.stringify(response));
              });
        };
        
        return service;
      });

      // Service log
      mwtnCommonsApp.register.factory('$mwtnLog', function($http, $q, $mwtnDatabase) {
        var writeLogToDB = function(data, callback) {
          var url = [ $mwtnDatabase.base, $mwtnDatabase.index, 'log' ].join('/');
          var request = {
            method : 'POST',
            url : url,
            data : {
              timestamp : data.timestamp ? data.timestamp : new Date().toISOString(),
              type : data.type ? data.type : 'info',
              component : data.component ? data.component : 'unkonwn',
              message : data.message
            }
          };
          $http(request).then(function successCallback(response) {
            return callback(true);
          }, function errorCallback(response) {
            console.error(JSON.stringify(response));
            return callback(false);
          });
        };

        var createIndex = function(index, callback) {
          var url = [ $mwtnDatabase.base, index ].join('/');
          var request = {
            method : 'POST',
            url : url,
            data : {
              timestamp : new Date().toISOString(),
              type : 'info',
              component : '$mwtnLog',
              message : 'init log'
            }
          };
          $http(request).then(function(success) {
            return callback(true);
          }, function(error) {
            console.error(JSON.stringify(error));
            return callback(false);
          });
        };
        var checkIndex = function(index, callback) {
          var url = [ $mwtnDatabase.base, index ].join('/');
          var request = {
            method : 'HEAD',
            url : url
          };
          $http(request).then(function successCallback(response) {
            return callback(true);
          }, function errorCallback(response) {
            console.error(JSON.stringify(response));
            createIndex(index, function(created) {
              return callback(created);
            });
          });
        };
        var checkDatabase = function(callback) {
          var url = $mwtnDatabase.base;
          var request = {
            method : 'GET',
            url : url
          };
          $http(request).then(function successCallback(response) {
            checkIndex($mwtnDatabase.index, function(exists) {
              return callback(exists);
            });
          }, function errorCallback(response) {
            console.error(JSON.stringify(response));
            return callback(false);
          });
        };
        var getData = function(type, log) {
          var data = {};
          data.timestamp = new Date().toISOString();
          switch (typeof log) {
          case 'string':
            data.type = type;
            data.component = 'unknown';
            data.message = log;
            break;
          case 'object':
            data.type = type;
            data.component = log.component;
            data.message = log.message;
            break;
          default:
            data.type = 'error';
            data.component = '$mwtnLog';
            data.message = 'MWTN log service is called with wrong parameters.';
          }
          // console.log(JSON.stringify(data));
          return data;
        };
        var service = {
          base : $mwtnDatabase.base
        };
        service.debug = function(log) {
          var data = getData('debug', log);
          checkDatabase(function(isRunning) {
            if (isRunning) {
              writeLogToDB(data, function() {
                // console.log('log stored');
              });
            } else {
              console.error(data.timestamp, service.base,
                  'Database (ElasticSerach) not reachable!?');
            }
          });
          console.log(data.timestamp, JSON.stringify(log));
        };
        service.error = function(log) {
          var data = getData('error', log);
          checkDatabase(function(isRunning) {
            if (isRunning) {
              writeLogToDB(data, function() {
                // console.log('log stored');
              });
            } else {
              console.error(data.timestamp, service.base,
                  'Database (ElasticSerach) not reachable!?');
            }
          });
          console.error(data.timestamp, JSON.stringify(log));
        };
        service.info = function(log) {
          var data = getData('info', log);
          checkDatabase(function(isRunning) {
            if (isRunning) {
              writeLogToDB(data, function() {
                // console.log('log stored');
              });
            } else {
              console.error(data.timestamp, service.base, 'Database (ElasticSerach) not reachable!?');
            }
          });
        };
        service.warning = function(log) {
          var data = getData('warning', log);
          checkDatabase(function(isRunning) {
            if (isRunning) {
              writeLogToDB(data, function() {
                // console.log('log stored');
              });
            } else {
              console.error(data.timestamp, service.base, 'Database (ElasticSerach) not reachable!?');
            }
          });
        };
        return service;
      });

      // Service Database (ElasticSerach)
      mwtnCommonsApp.register.factory('$mwtnDatabase', function($http, $q, ENV) {
        var service = {
          base : ENV.getBaseURL("MD_SAL").replace(':8181', ':9200'),
          index : 'mwtn',
          command : '_search',
          mwtn : 'todo'
        };
        
        service.getBase = function(functionId) {
          var deferred = $q.defer();
          var result = {};
          if (!service.database) {
              var databaseRequest = {
                  base: service.base,
                  index: 'config',
                  docType: 'database',
                  command: '_search',
                  method: 'GET',
                  from: 0,
                  size: 10
              };
              service.genericRequest(databaseRequest).then(function(success){
                service.database = success.data.hits.hits;
                service.database.map(function(server){
                  var src = server._source;
                  if (server._id === functionId) {
                    var ip = src.host;
                    if (ip === 'localhost') {
                      ip = service.base.split('//')[1].split(':')[0];
                    }
                    result.base = [src['transport-protocol'], '://', ip, ':', src.port ].join('');
                    result.index = src.index;
                  }
                });
                if (result.base) {
                  deferred.resolve( result );
                } else {
                  console.error('Server settings not found!', functionId);
                  deferred.reject({});
                }
              }, function(error){
                console.log('Server settings not found!', functionId, JSON.stringify(error));
                deferred.reject({});
              });
          } else {
            service.database.map(function(server){
              var src = server._source;
              if (server._id === functionId) {
                var ip = src.host;
                if (ip === 'localhost') {
                  ip = service.base.split('//')[1].split(':')[0];
                }
                result.base = [src['transport-protocol'], '://', ip, ':', src.port ].join('');
                result.index = src.index;
              }
            });
            if (result.base) {
              deferred.resolve( result );
            } else {
              console.log('Server settings not found!', functionId);
              deferred.reject({});
            }
          }
          return deferred.promise;
        };
                
        service.genericRequest = function(databaseRequest) {
          var url = [ databaseRequest.base, databaseRequest.index, databaseRequest.docType,
                      databaseRequest.command ].join('/');
          var request = {
            method : databaseRequest.method,
            url : url,
            data : {
              from : databaseRequest.from,
              size : databaseRequest.size,
              sort : databaseRequest.sort,
              filter : databaseRequest.filter,
              query : databaseRequest.query
            }
          };
          // overwrite request data if given
          if (databaseRequest.data) {
            request.data = databaseRequest.data;
          }
          var deferred = $q.defer();
          var consoleId = 'database: ' + url; 
          console.time(consoleId);
          $http(request).then(function(success) {
            console.timeEnd(consoleId);
            // console.log(JSON.stringify(success));
            deferred.resolve(success);
          }, function(error) {
            console.timeEnd(consoleId);
            console.error(JSON.stringify(error));
            deferred.reject(error);
          });
          return deferred.promise;
        };

        service.aggregationRequest = function(databaseRequest) {
          var url = [ databaseRequest.base, databaseRequest.index, databaseRequest.docType,
                      databaseRequest.command ].join('/');
          var request = {
            method : databaseRequest.method,
            url : url,
            data : databaseRequest.aggregation
          };
          var deferred = $q.defer();
          var consoleId = 'database: ' + url; 
          console.time(consoleId);
          $http(request).then(function(success) {
            console.timeEnd(consoleId);
            // console.log(JSON.stringify(success));
            deferred.resolve(success);
          }, function(error) {
            console.timeEnd(consoleId);
            console.error(JSON.stringify(error));
            deferred.reject(error);
          });
          return deferred.promise;
        };

        service.getAllData = function(functionId, docType, from, size, sort) {
          var deferred = $q.defer();
          service.getBase(functionId).then(function(success){
            var databaseRequest = {
              method : 'POST',
              base : success.base,
              index : success.index,
              command: '_search',
              docType: docType,
              from : from,
              size : size,
              sort : sort,
              query : {
                match_all : {}
              }
            };
            service.genericRequest(databaseRequest).then(function(success){
              // console.log('getAllData', success);
              deferred.resolve(success);
            }, function(error){
              deferred.reject(error);
            });
          }, function(error){
            deferred.reject(error);            
          });
          return deferred.promise;
        };

        service.getFilteredData = function(functionId, docType, from, size, query) {
          var deferred = $q.defer();
          service.getBase(functionId).then(function(success){
            var databaseRequest = {
              method : 'POST',
              base : success.base,
              index : success.index,
              command: '_search',
              docType: docType,
              from : from,
              size : size,
              sort:[],
              query : query
            };
            service.genericRequest(databaseRequest).then(function(success){
              // console.log('getAllData', success);
              deferred.resolve(success);
            }, function(error){
              deferred.reject(error);
            });
          }, function(error){
            deferred.reject(error);            
          });
          return deferred.promise;
        };

        service.getFilteredSortedData = function(functionId, docType, from, size, sort, query) {
          var deferred = $q.defer();
          service.getBase(functionId).then(function(success){
            var databaseRequest = {
              method : 'POST',
              base : success.base,
              index : success.index,
              command: '_search',
              docType: docType,
              from : from,
              size : size,
              sort :  sort,
              query : query
            };
            service.genericRequest(databaseRequest).then(function(success){
              // console.log('getAllData', success);
              deferred.resolve(success);
            }, function(error){
              deferred.reject(error);
            });
          }, function(error){
            deferred.reject(error);            
          });
          return deferred.promise;
        };
        
        service.getAggregatedData = function(functionId, docType, aggregation) {
          var deferred = $q.defer();
          service.getBase(functionId).then(function(success){
            var databaseRequest = {
              method : 'POST',
              base : success.base,
              index : success.index,
              command: '_search',
              docType: docType,
              aggregation: aggregation
            };
            service.aggregationRequest(databaseRequest).then(function(success){
              // console.log('getAllData', success);
              deferred.resolve(success);
            }, function(error){
              deferred.reject(error);
            });
          }, function(error){
            deferred.reject(error);            
          });
          return deferred.promise;
        };

        service.getData = function(docType, from, size, sort, filter, query) {
          var deferred = $q.defer();
          service.getBase('mwtn').then(function(success){
            var databaseRequest = {
                method : 'POST',
                base : success.base,
                index : success.index,
                docType: docType,
                from : from,
                size : size,
                sort : sort,
                filter : filter,
                query : query
              };
              service.genericRequest(databaseRequest).then(function(success){
                deferred.resolve(success);
              }, function(error){
                deferred.reject(error);
              });
          }, function(error){
            deferred.reject(error);            
          });
          return deferred.promise;
        };
        
        service.deleteDocType = function(spec) {
          var deferred = $q.defer();
          service.getBase(spec.functionId).then(function(success){
            var databaseRequest = {
                method : 'DELETE',
                base : success.base,
                index : success.index,
                docType: spec.docType,
                command: '_query',
                query : spec.query
              };
              
              service.genericRequest(databaseRequest).then(function(success){
                deferred.resolve(status);
              }, function(error){
                deferred.reject(error);
              });
          }, function(error){
            deferred.reject(error);            
          });
          return deferred.promise;
        };

        /**
         * A promise, which inquires a single document from database.
         * @param {string} functionId - An identifier of an SDN function (e.g 'mwtn').
         * @param {string} docType - The document type of the document to be deleted.
         * @param {string} id - An identifier of the document to be deleted.
         */
        service.getSingleDocument = function(functionId, docType, id) {
          var deferred = $q.defer();
          service.getBase(functionId).then(function(success){
            var databaseRequest = {
                method : 'GET',
                base : success.base,
                index : success.index,
                docType: docType,
                command: id
              };
              
              service.genericRequest(databaseRequest).then(function(success){
                deferred.resolve(success.data._source);
              }, function(error){
                deferred.reject(error);
              });
          }, function(error){
            deferred.reject(error);            
          });
          return deferred.promise;
        };

        /**
         * A promise, creating or updateing a single document of the database.
         * @param {string} functionId - An identifier of an SDN function (e.g 'mwtn').
         * @param {string} docType - The document type of the document to be deleted.
         * @param {string} id - An identifier of the document to be deleted.
         * @param {Object} data - A json object to be stored in the database
         */
        service.createSingleDocument = function(functionId, docType, id, data) {
          var deferred = $q.defer();
          service.getBase(functionId).then(function(success){
            var databaseRequest = {
                method : 'PUT',
                base : success.base,
                index : success.index,
                docType: docType,
                command: id,
                data : data
              };
              
              service.genericRequest(databaseRequest).then(function(success){
                deferred.resolve(success);
              }, function(error){
                deferred.reject(error);
              });
          }, function(error){
            deferred.reject(error);            
          });
          return deferred.promise;
        };

        /**
         * A promise, which deletes one document within the database.
         * @param {string} functionId - An identifier of an SDN function (e.g 'mwtn').
         * @param {string} docType - The document type of the document to be deleted.
         * @param {string} id - An identifier of the document to be deleted.
         */
        service.deleteSingleDocument = function(functionId, docType, id) {
          var deferred = $q.defer();
          service.getBase(functionId).then(function(success){
            var databaseRequest = {
                method : 'DELETE',
                base : success.base,
                index : success.index,
                docType: docType,
                command: id,
              };
              
              service.genericRequest(databaseRequest).then(function(success){
                deferred.resolve({status: success.status, logId: success.data._id});
              }, function(error){
                deferred.reject(error);
              });
          }, function(error){
            deferred.reject(error);            
          });
          return deferred.promise;
        };

        var moduleInfromation;
        var inquireModuleInformation = function(){
          var deferred = $q.defer();
          service.getBase('mwtn').then(function(success){
            var databaseRequest = {
                method: 'GET',
                base : success.base,
                index : success.index,
                from: 0,
                size: 999
              };
              service.getAllData('mwtn', 'module', 0, 999, undefined).then(function(success){
                // console.log(JSON.stringify(data.data.hits.hits));
                moduleInfromation = {};
                success.data.hits.hits.map(function(hit){
                  moduleInfromation[hit._id] = hit._source;
                });
                // console.log('got moduleInfromation', Object.keys(moduleInfromation).length);
                return deferred.resolve(moduleInfromation);
              }, function(error){
                deferred.reject(error);
              });
          }, function(error){
            deferred.reject(error);            
          });
          return deferred.promise;
        };

        /**
         * A promise which returns object yang class and attribute descriptions
         */
        service.getModules = function() {
          var deferred = $q.defer();
          if (moduleInfromation) {
            deferred.resolve(moduleInfromation);
          } else {
            inquireModuleInformation().then(function(success){
              deferred.resolve(success);
            }, function(error){
              deferred.reject(error);
            });
          }
          return deferred.promise;
        };

        var schemaInformation;
        var inquireSchemaInformation = function(){
          var deferred = $q.defer();
          service.getBase('mwtn').then(function(success){
            var databaseRequest = {
                method: 'GET',
                base : success.base,
                index : success.index,
                from: 0,
                size: 999
              };
              service.getAllData('mwtn', 'schema-information', 0, 999, undefined).then(function(success){
                // console.log(JSON.stringify(data.data.hits.hits));
                schemaInformation = {};
                success.data.hits.hits.map(function(hit){
                  schemaInformation[hit._id] = hit._source;
                });
                // console.log('got schemaInformation', Object.keys(schemaInformation).length);
                return deferred.resolve(schemaInformation);
              }, function(error){
                deferred.reject(error);
              });
          }, function(error){
            deferred.reject(error);            
          });
          return deferred.promise;
        };

        /**
         * A promise which returns object yang class and attribute descriptions
         */
        service.getSchema = function() {
          var deferred = $q.defer();
          if (schemaInformation) {
            deferred.resolve(schemaInformation);
          } else {
            inquireSchemaInformation().then(function(success){
              deferred.resolve(success);
            }, function(error){
              deferred.reject(error);
            });
          }
          return deferred.promise;
        };

        return service;
      });
      // Class NetConfServer
      mwtnCommonsApp.register.factory('NetConfServer', function() {
        // Classes
        // Class NetConfServer
        var NetConfServer = function(data) {
          this.data = data;
          this.getData = function() {
            return this.data;
          };
          this.getRadioSignalId = function() {
            return this.data.airInterfaceConfiguration.radioSignalId;
          };
          this.isLinkUp = function() {
            return this.data.airInterfaceStatus.linkIsUp;
          };
          this.isPowerOn = function() {
            return this.data.airInterfaceConfiguration.powerIsOn;
          };
          this.isActive = function() {
            return this.isPowerOn() && this.isLinkUp();
          };
        };
        return NetConfServer;
      });
      
      mwtnCommonsApp.register.factory('ActualNetworkElement', function() {
        // Classes
        // Class ActualNetworkElement
        var ActualNetworkElement = function(data) {
          this.data = data;
          this.data.layerProtocols = {};
          this.setOnfNetworkElement = function(onfNe) {
            this.data.onfNetworkElement = onfNe;
          };          
          this.getLpByRadioSignalId = function(radioSignalId) {
            //console.log('getLP', JSON.stringify(this.data.ltp));
            var layerProtocol;
            for (var layerProtocolKey in this.data.layerProtocols){
              if (this.data.layerProtocols[layerProtocolKey].getRadioSignalId && 
                  radioSignalId === parseInt(this.data.layerProtocols[layerProtocolKey].getRadioSignalId())) {
                layerProtocol = this.data.layerProtocols[layerProtocolKey];
              }
            }
            return layerProtocol;
          };
          this.getLpByRadioSignalIds = function(radioSignalIds) {
            //console.log('getLP', JSON.stringify(this.data.ltp));
            var layerProtocol;
            if (radioSignalIds !== undefined) {
            for (var layerProtocolKey in this.data.layerProtocols){
              if (this.data.layerProtocols[layerProtocolKey].getRadioSignalIds && 
                  radioSignalIds.toString() === this.data.layerProtocols[layerProtocolKey].getRadioSignalIds(this).toString()) {
                layerProtocol = this.data.layerProtocols[layerProtocolKey];
              }
            }}
            return layerProtocol;
          };
          this.setLP = function(onfPac) {
            this.data.layerProtocols[onfPac.data.layerProtocol] = onfPac;
          };
          this.getLpPac = function(lpRef) {
            return this.data.layerProtocols[lpRef];
          };
          this.getName = function() {
            return this.data.name;
          };
          this.getConnectionStatus = function() {
            return this.data.connectionStatus;
          };
          this.isConnected = function() {
            return this.data.name !== 'controller-config' && this.data.connectionStatus == 'connected';
          };
          this.setConnectionStatus = function(status) {
            this.data.connectionStatus = status;
          };
        };
        return ActualNetworkElement;
      });
      
      mwtnCommonsApp.register.factory('LogicalTerminationPoint', function($mwtnLog) {
        // Sub-Class LayerProtocol
        /**
          * An object representing an LP.
          * @typedef {Object} LayerProtocol
          */
        var LayerProtocol = function(data) {
          // take a guess, if termiation-state is not exposed
          if (data['termination-state'] === undefined) {
            data['termination-state'] = 'terminated-bidirectional';
            $mwtnLog.warning({component: 'LTP.getTerminationState', message: 'Check whether NE provided mandatory termination state. ' + data.uuid });
          }

          // console.log('in', JSON.stringify(data));
          var defaultMapping = {
            'ety-ttp': undefined,
            'etc-ttp': {'capability':'urn:onf:params:xml:ns:yang:microwave-model?module=microwave-model', 'revision':'2017-03-24', 'conditional-package':'mw-ethernet-container-pac'},
            'tdm-ctp': {'capability':'urn:onf:params:xml:ns:yang:microwave-model?module=microwave-model', 'revision':'2017-03-24', 'conditional-package':'mw-tdm-container-pac'},
            'mws-ctp': {'capability':'urn:onf:params:xml:ns:yang:microwave-model?module=microwave-model', 'revision':'2017-03-24', 'conditional-package':'mw-air-diversity-interface-pac'},
            'eth-ctp': {'capability':'urn:onf:params:xml:ns:yang:onf-ethernet-conditional-packages?module=onf-ethernet-conditional-packages', 'revision':'2017-04-02', 'conditional-package':'ethernet-pac'},
            // 3rd PoC
            'mwps-ttp': {'capability':'uri:onf:MicrowaveModel-ObjectClasses-AirInterface?module=MicrowaveModel-ObjectClasses-AirInterface', 'revision':'2016-09-01', 'conditional-package':'MW_AirInterface_Pac'},
            'mws-ttp': {'capability':'uri:onf:MicrowaveModel-ObjectClasses-PureEthernetStructure?module=MicrowaveModel-ObjectClasses-PureEthernetStructure', 'revision':'2016-09-02', 'conditional-package':'MW_PureEthernetStructure_Pac'},
            'eth-ctp-ctp': {'capability':'uri:onf:MicrowaveModel-ObjectClasses-EthernetContainerl?module=MicrowaveModel-ObjectClasses-EthernetContainer', 'revision':'2016-09-02', 'conditional-package':'MW_EthernetContainer_Pac'},
          };
          this.data = data;

          // methods
          this.getData = function() {
            return this.data;
          };
          this.getId = function() {
            return this.getData().uuid;
          };
          this.getLayer = function() {
            return this.getData()['layer-protocol-name'];
          };
          this.getTerminationState = function(abstract) {
            // 3th PoC termination state is of type boolean 
            if (this.getData()['termination-state'] === true) {
               return 'ttp';
            } else if (this.getData()['termination-state'] === false) {
               return 'ctp';
            }
            // 4th PoC termination state is of type enum
            if (abstract !== true) {
              return this.getData()['termination-state'];
            }
            var mapping = {
              'lp-can-never-terminate': 'ctp',
              'lt-not-terminated': 'ctp',
              'terminated-server-to-client-flow': 'ttp',
              'terminated-client-to-server-flow': 'ttp',
              'terminated-bidirectional': 'ttp',
              'lt-permenantly-terminated': 'ttp',
              'termination-state-unknown': 'ttp'
            };
            return mapping[this.getData()['termination-state']];
          };
          this.getItuLabel = function() {
            return [this.getLayer(), this.getTerminationState(true)].join('-').toLowerCase();
          };
          this.getExtension = function(key) {
            // retrun empty string, if no extension exists
            if (!this.getData().extension) {
              return '';
            }
            var result =  this.getData().extension.filter(function(ex) {
              return ex['value-name'] === key;
            }).map(function(ex){
              return ex.value;
            });
            if (result && result.length > 0) {
              return result[0];
            }
            if (!defaultMapping[this.getItuLabel()]) {
              return '';
            }
            return defaultMapping[this.getItuLabel()][key];
          };
          /**
           * A getter for the yang-capability of the LayerProtocol
           * @param {boolean|undefined} moduleOnly - Defines, whether the result should contain only yang-module-name.
           * @return {string} The conditional package name of the LayerProtocol
           */
          this.getCapability = function(moduleOnly) {
            var cap = this.getExtension('capability');
            // workaround bug in spec
            if (cap.contains('onf-ethernet-conditional-package') && !cap.contains('onf-ethernet-conditional-packages')) {
              console.warn('Inform vendor about spec error and updates');
              cap = cap.replaceAll('onf-ethernet-conditional-package','onf-ethernet-conditional-packages');
            }
            if (cap !== '' && moduleOnly === true) {
              return cap.split('?module=')[1];
            }
            return cap;
          };
          this.getRevision = function() {
            return this.getExtension('revision');
          };
          /**
           * A getter for the conditional package name of the LayerProtocol
           * @param {boolean|undefined} addModule - Defines, whether the result should include the yang-module-name.
           * @return {string} The conditional package name of the LayerProtocol
           */
          this.getConditionalPackage = function(addModule) {
            var cp = this.getExtension('conditional-package');
            if (!cp) {
              return '';
            }
            if (addModule === true) {
              return [this.getCapability(true), cp].join(':');
            }
            return cp;
          };
        };

        // Sub-Class LogicalTerminationPoint
        /**
          * An object representing an LTP.
          * @typedef {Object} LogicalTerminationPoint
          */
        var LogicalTerminationPoint = function(data) {
          this.data = data;
          this.layerProtocols = this.data.lp.map(function(layerProtocol){
            return new LayerProtocol(layerProtocol);
          });
          // console.log(this.layerProtocols);
          this.getData = function() {
            return this.data;
          };
          this.getId = function() {
            return this.getData().uuid;
          };
          this.getDirectionality = function() {
            return this.getData()['ltp-direction'];
          };
          this.getServerLtps = function() {
            return this.getData()['server-ltp'];
          };
          this.getClientLtps = function() {
            return this.getData()['client-ltp'];
          };
          this.getLayer = function() {
            return this.getLayerProtocols()[0].getLayer();
          };
          this.getLayerProtocols = function() {
            return this.layerProtocols;
          };
          this.getConditionalPackages = function() {
            return this.getLayerProtocols().map(function(lp){
              return lp.getConditionalPackage();
            });
          };
        }
        return LogicalTerminationPoint;
      });
      
      mwtnCommonsApp.register.factory('OnfNetworkElement', function(LogicalTerminationPoint) {
        // Classes
        // Class OnfNetworkElement
        var OnfNetworkElement = function(data) {
          this.data = data;
          // console.log(JSON.stringify(data));
          this.logicalTerminationPoints = this.data.ltp.map(function(logicalTerminationPoint){
            return new LogicalTerminationPoint(logicalTerminationPoint);
          });

          this.getData = function() {
           return this.data;
          };
          this.getName = function() {
            return this.data.name[0].value;
          };
          this.getLogicalTerminationPoints = function() {
            return this.logicalTerminationPoints;
          };
          this.getLpById = function(id) {
            var result = {};
            this.getLogicalTerminationPoints().map(function(ltp){
              ltp.getLayerProtocols().map(function(lp){
                if (lp.getData().uuid === id) {
                  result = lp;
                }
              });
            });
            return result;
          };
          this.getNumberOfLtps = function() {
            return this.logicalTerminationPoints.length;
          };
          this.getServerLtps = function(layerProtocolRef) {
            var result = [];
            if (this.data._ltpRefList) {
              var ltpList = this.data._ltpRefList.map(function(ltp){
                if (ltp.lp[0].uuid === layerProtocolRef) {
                  result =  ltp._serverLtpRefList;
                }
              });
            }
            return result;
          };
          this.getClientLtpIds = function(layerProtocolRef) {
            var result = [];
            if (this.data._ltpRefList) {
              var ltpList = this.data._ltpRefList.map(function(ltp){
                if (ltp.lp[0].uuid === layerProtocolRef) {
                  result =  ltp._clientLtpRefList;
                }
              });
            }
            return result;
          };
          this.getLpByLtpRef = function(ltpRef) {
            var result;
            if (this.data._ltpRefList) {
              var ltpList = this.data._ltpRefList.map(function(ltp){
                if (ltp.uuid === ltpRef) {
                  result =  ltp.lp[0];
                }
              });
            }
            return result;
          };
          this.getLtpsByLayer = function(layerProtocolName) {
            if (!this.data._ltpRefList) {
              return [];
            }
            var ltpList = this.data._ltpRefList.map(function(ltp){
              if (ltp.lp[0]['layer-protocol-name'] === layerProtocolName) {
                return ltp;
              }
            });
            return ltpList.clean(null);
          };
          this.getLTPMwpsList = function() {
            return this.getLtpsByLayer('MWPS');
          };
          this.getLTPMwsList = function() {
            return this.getLtpsByLayer('MWS');
          };
          this.getLTPEthCtpList = function() {
            return this.getLtpsByLayer('ETH');
          };
          this.getLTPTdmCtpList = function() {
            return this.getLtpsByLayer('TDM');
          };
        };
        return OnfNetworkElement;
      });

      mwtnCommonsApp.register.factory('MicrowavePhysicalSection', function() {
        // Classes
        // Class OnfNetworkElement
        var MicrowavePhysicalSection = function(data) {
          this.data = data;
          this.getData = function() {
           return this.data;
          };
          this.getLayerProtocolId = function() {
            return this.data.layerProtocol;
          };
          this.getRadioSignalId = function() {
            return this.data.airInterfaceConfiguration ? this.data.airInterfaceConfiguration.radioSignalID : -1;
          };
          this.isLinkUp = function() {
            return this.data.airInterfaceStatus.linkIsUp;
          };
          this.isPowerOn = function() {
            return this.data.airInterfaceConfiguration.powerIsOn;
          };
          this.isActive = function() {
            return this.isPowerOn() && this.isLinkUp();
          };
        };
        return MicrowavePhysicalSection;
      });

      mwtnCommonsApp.register.factory('MicrowaveSection', function() {
        // Classes
        // Class MicrowaveSection
        var MicrowaveSection = function(data) {
          this.data = data;
          this.getData = function() {
            return this.data;
          };
          this.getId = function() {
             return this.data.layerProtocol;
          };
          this.getRadioSignalIds = function(actualNe) {
            this.data.parent = actualNe;
            var result = [];
            var onfNe = actualNe.data.onfNetworkElement;
            var lpId = this.getId();
            onfNe.getServerLtps(lpId).map(function(mwpsLtpRef){
              var lpRef = onfNe.getLpByLtpRef(mwpsLtpRef).uuid;
              var mwps = actualNe.getLpPac(lpRef);
              result.push(mwps.getRadioSignalId());
            });
            return result;
          };
          this.getTimeSlotCapacity = function() {
            return this.data.structureCapability.timeSlotCapacity;
          };
          this.getTotalNumberOfTimeSlots = function() {
            return this.data.structureCapability.totalNumberOfTimeSlots;
          };
          this.getNumberOfEffectiveTimeSlots = function() {
            var count = 0;
            this.data.structureStatus.timeSlotStatusList.map(function(ts){
              if (ts.operationalStatus === 'ENABLED') {
                count = count + 1;
              }
            });
            return count;
          };
          this.getConfiguredCapacity = function() {
            return this.getTotalNumberOfTimeSlots() * this.getTimeSlotCapacity();
          };
          this.getEffectiveCapacity = function() {
            return this.getNumberOfEffectiveTimeSlots() * this.getTimeSlotCapacity();
          };
          this.isActive = function() {
            if (this.data.parent === undefined) {
              return false;
            }
            var actualNe = this.data.parent;
            var result = true;
            var onfNe = actualNe.data.onfNetworkElement;
            var lpId = this.getId();
            onfNe.getServerLtps(lpId).map(function(mwpsLtpRef){
              var lpRef = onfNe.getLpByLtpRef(mwpsLtpRef).uuid;
              var mwps = actualNe.getLpPac(lpRef);
              result = result && mwps.isActive();
            });
            return result;
          };
        };
        return MicrowaveSection;
      });     
    });