define(['common/authentification/auth.module'], function () {
  describe('Auth Module', function () {
    var _Auth, httpBackend, deferred;
    beforeEach(module('app.common.auth'));

    beforeEach(inject(function ($injector) {
      _Auth = $injector.get('Auth');
      httpBackend = $injector.get('$httpBackend');
    }));

    it('Should have defined function facilate the authentication process', function () {
      expect(_Auth.setBasic).toBeDefined();
      expect(_Auth.unsetBasic).toBeDefined();
      expect(_Auth.getUser).toBeDefined();
      expect(_Auth.authorize).toBeDefined();
      expect(_Auth.isAuthed).toBeDefined();
      expect(_Auth.isLoggedIn).toBeDefined();
      expect(_Auth.login).toBeDefined();
      expect(_Auth.logout).toBeDefined();
    });

    describe(':: Authentication header', function () {
      var username = 'john',
        password = 'abc123',
        _window = null;

      beforeEach(inject(function ($window) {
        _window = $window;
      }));

      it('Should set the basic authenticate header', function () {
        _Auth.setBasic(username, password);

        expect(_window.localStorage.odlUser).toBeDefined();
        expect(_window.localStorage.odlUser).toEqual(username);

        expect(_window.localStorage.odlPass).toBeDefined();
        expect(_window.localStorage.odlPass).toEqual(password);
      });

      it('Should unset the basic authenticate header', inject(function ($http) {
        _Auth.setBasic(username, password);
        _Auth.unsetBasic();

        expect(_window.localStorage.odlUser).toBeUndefined();
        expect(_window.localStorage.odlPass).toBeUndefined();
        expect($http.defaults.headers.common.Authorization).toBeUndefined();
      }));
    });

    describe(':: Login management', function () {
      var username = 'john',
        password = 'abc123';

      it('Should return the current user or null otherwise', function () {
        var user = _Auth.getUser();
        expect(user).toBeNull();

        _Auth.setBasic(username, password);
        expect(user).toEqual(user);
      });

      it('Should set the authentication header and send a callback if success', function () {
        httpBackend.expect('GET', /.*/).respond(200, '');
        var successSpy = jasmine.createSpy("successSpy");
        var errorSpy = jasmine.createSpy("errorSpy");
        spyOn(_Auth, 'setBasic');

        _Auth.login(username, password, successSpy, errorSpy);
        httpBackend.flush();

        expect(_Auth.setBasic).toHaveBeenCalledWith(username, password);
        expect(successSpy).toHaveBeenCalled();
        expect(errorSpy).not.toHaveBeenCalled();
      });

      it('Should unset the authentication header and send a callback if error', function () {
        httpBackend.expect('GET', /.*/).respond(404, '');
        var successSpy = jasmine.createSpy("successSpy");
        var errorSpy = jasmine.createSpy("errorSpy");
        spyOn(_Auth, 'setBasic');
        spyOn(_Auth, 'unsetBasic');

        _Auth.login(username, password, successSpy, errorSpy);
        httpBackend.flush();

        expect(_Auth.setBasic).toHaveBeenCalledWith(username, password);
        expect(_Auth.unsetBasic).toHaveBeenCalled();
        expect(successSpy).not.toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalled();
      });

      it('Should unset the authentication header on logout', function () {
        var successSpy = jasmine.createSpy("successSpy");
        spyOn(_Auth, 'unsetBasic');

        _Auth.logout(successSpy);

        expect(_Auth.unsetBasic).toHaveBeenCalled();
        expect(successSpy).toHaveBeenCalled();
      });

      afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
      });

    });

  });
});
