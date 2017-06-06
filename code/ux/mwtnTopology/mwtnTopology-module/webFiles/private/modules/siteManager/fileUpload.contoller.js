
// var htSiteManager = angular.module('fileUpload', ['angularFileUpload'])


htSiteManager.controller('FileUploadController', ['$scope', 'FileUploader', '$siteManager', function($scope, FileUploader, $siteManager) {
    'use strict';
        var uploader = $scope.uploader = new FileUploader({
            // url: '/convert/echo',
            url: '/convert/sitexlsx2json',
            autoUpload: true,
            removeAfterUpload: true,
            queueLimit: 1
        });

        // FILTERS
        uploader.filters.push({
            name: 'xslxFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|xlsx|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            // console.info('onWhenAddingFileFailed', item, filter, options);
            $scope.failed = true;
            $scope.errorMessage = ' Error: ' + item.name + ' is not an Excel file.';
        };
        uploader.onAfterAddingFile = function(fileItem) {
            // console.info('onAfterAddingFile', fileItem);
            $scope.failed = false;
            $scope.errorMessage = '';
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            // console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            // console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            // console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            // console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            // console.info('onSuccessItem', fileItem, response, status, headers);
            $siteManager.setNewSite(response);
            // console.info(JSON.stringify(response));
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            // console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            // console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            // console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            // console.info('onCompleteAll');
        };

        // console.info('uploader', uploader);
    }]);