define(['app/core/core.module', 'app/core/core.services'], function() {
    describe("Core Module", function() {

        beforeEach(angular.mock.module('app.core'));

        describe(":: Common Provider function", function() {
            var _ContentHelper, _NavHelper, url, deferred;
            url = 'test/index.tpl.html';

            beforeEach(angular.mock.inject(function(ContentHelper) {
                _ContentHelper = ContentHelper;
                deferred = jQuery.Deferred();
            }));

            it(':: Should be do an ajax call and add the view to the list', function() {
                spyOn($, 'ajax').andReturn (deferred);
                _ContentHelper.addToView(url);
                deferred.resolve(url);

                expect($.ajax.mostRecentCall.args[0]["url"]).toEqual(url);
                expect(_ContentHelper.getViews()).toContain(url);
            });

            it('Should add a controller to the list', function() {
                _ContentHelper.addControllerUrl(url);

                expect(_ContentHelper.getControllers()).toContain(url);
            });
        });

        describe(':: Menu management method', function() {
            var menu = {
              "id" : 'menu',
              "title" : 'lvl0 menu',
              "active" : '',
              "submenu" : [ ]
            };

            var submenu = {
              "id" : 'sub menu',
              "title" : 'lvl1 menu',
              "active" : '',
              "submenu" : [ ]
            };


            beforeEach(angular.mock.inject(function(NavHelper) {
                _NavHelper = NavHelper;
            }));


            it('Should add a child even if there no parent', function() {
                var menus = null;
                _NavHelper.addToMenu('root.lvl1', submenu);

                menus = _NavHelper.getMenu();

                expect(menus[0]).toEqual({
                    "id":'root',
                    "title":'root',
                    "active": '',
                    "submenu": [submenu]
                });
            });

            it('Should add a item to the root menu', function() {
                var menus = null;

                _NavHelper.addToMenu('main', menu);
                menus = _NavHelper.getMenu();

                expect(menus[0]).toEqual(menu);
            });

            it('Should add a item to the sub menu', function() {
                var menus = null;

                _NavHelper.addToMenu('main', menu);
                _NavHelper.addToMenu('main.lvl1', submenu);

                menus = _NavHelper.getMenu();

                expect(menus[0].submenu[0]).toEqual(submenu);
            });

        });

    });
});
