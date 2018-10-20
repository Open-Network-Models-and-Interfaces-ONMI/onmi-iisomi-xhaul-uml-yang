define(['common/navigation/navigation.module', 'angular-ui-router',], function () {
  describe('Navigation Module', function () {
    var scope, NavHelperMock, EventMock, controller;

    beforeEach(angular.mock.module('ui.router'));
    beforeEach(module('app.core', function ($provide) {
      function NavHelperProvider() {
        this.addToView = function (url) {};
        this.addControllerUrl = function (url) {};
        this.$get = function NavHelperFactory() {
          return new NavHelperProvider();
        };
      }
      $provide.provider('NavHelper', NavHelperProvider);
    }));

    beforeEach(module('app.common.nav'));

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      controller = $controller;

      NavHelperMock = {
        getMenu: function () {
          return {
            "id": "",
            "title": "",
            "active": "",
            "submenu": ""
          };
        }
      };

      EventMock = {
        stopPropagation: function () {
          return null;
        },
        preventDefault: function () {
          return null;
        }
      };

    }));

    it('Should have receive all menu items', function () {
      spyOn(NavHelperMock, 'getMenu').andCallThrough();
      controller('NavCtrl', {
        $scope: scope,
        NavHelper: NavHelperMock
      });

      expect(NavHelperMock.getMenu).toHaveBeenCalled();
      expect(scope.navList).toBeDefined();
    });

    it('Should have create utility methods to show and hide submenu', function () {
      controller('NavItemCtrl', {
        $scope: scope,
        NavHelper: NavHelperMock
      });

      expect(scope.display).toEqual('none');
      expect(scope.isOpen).toBeFalsy();

      expect(scope.isValid).toBeDefined();
      expect(scope.updateTemplate).toBeDefined();
    });

    it('Should look if a item exist or not', function () {
      controller('NavItemCtrl', {
        $scope: scope,
        NavHelper: NavHelperMock
      });
      var item = {};

      expect(scope.isValid(item)).toBeTruthy();
      expect(scope.isValid(null)).toBeFalsy();
    });

    it('Should toggle the status of the item scope', function () {
      spyOn(EventMock, 'stopPropagation').andCallThrough();
      spyOn(EventMock, 'preventDefault').andCallThrough();
      controller('NavItemCtrl', {
        $scope: scope,
        NavHelper: NavHelperMock
      });

      var initOpen = scope.isOpen;
      var initDisplay = scope.display;

      scope.updateTemplate(EventMock, {});
      expect(scope.isOpen).not.toEqual(initOpen);
      expect(scope.display).not.toEqual(initDisplay);

      scope.updateTemplate(EventMock, {});
      expect(scope.isOpen).toEqual(initOpen);
      expect(scope.display).toEqual(initDisplay);

      expect(EventMock.stopPropagation.calls.length).toEqual(2);
      expect(EventMock.preventDefault.calls.length).toEqual(2);
    });
  });
});
