define(['common/login/login.controller', 'angular-ui-router', 'common/layout/layout.module'], function() {
  describe('Login Module', function() {
    var scope, state, controller, location, AuthMock;
    var url = '/test';

    beforeEach(module('ui.router'));
    beforeEach(module('app.common.layout'));
    beforeEach(module('app.common.login', function($provide) {
      AuthMock = {
        isAuthed: function() {},
        login: function() {}
      };
      $provide.value('Auth', AuthMock);
    }));

    beforeEach(inject( function($rootScope, $controller, $state, $location) {
      scope = $rootScope.$new();
      controller = $controller;
      state = $state;
      location = $location;
    }));

    it('Should load the login state', function() {
      var stateName = 'login';

      controller('LoginCtrl', {$scope: scope, $state: state});
      expect(state.href(stateName, {})).toBe('#/login');
    });

    it('Should redirect any url to login if not logged', function() {
      var stateName = 'login';
      spyOn(AuthMock,'isAuthed').andReturn(false);
      location.url(url);
      controller('LoginCtrl', {$scope: scope, $state: state});
      state.go('main');

      expect(AuthMock.isAuthed).toHaveBeenCalled();
      expect(state.is("login"));
      expect(location.url()).toEqual('/login');
    });

    it('Should not redirect if logged', function() {
      spyOn(AuthMock,'isAuthed').andReturn(true);
      location.url(url);
      controller('LoginCtrl', {$scope: scope, $state: state});
      state.go('main');

      expect(AuthMock.isAuthed).toHaveBeenCalled();
      expect(state.is("main"));
      expect(location.url()).toEqual(url);
    });

    it('Should call the Auth module', function() {
      spyOn(AuthMock,'login');
      controller('LoginCtrl', {$scope: scope, $state: state});

      scope.sendLogin();
      expect(AuthMock.login).toHaveBeenCalled();
    });
  });
});
