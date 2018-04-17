define(['jquery'], function ($) {
  'use strict';

  var TopBarHelper = function () {
    var ids = [];
    var ctrls = [];

    this.addToView = function (url) {
      $.ajax({
        url: url,
        method: 'GET',
        async: false
      }).done(function (data) {
        ids.push(data);
      });
    };

    this.getViews = function () {
      var template = '';

      for (var i = 0; i < ids.length; ++i) {
        template += ids[i];
      }

      return template;
    };

    this.addControllerUrl = function (url) {
      ctrls.push(url);
    };

    this.getControllers = function () {
      return ctrls;
    };

    this.$get = ['apiToken', function (apiToken) {
      return new TopBarHelper(apiToken);
    }];
  };

  var NavHelper = function () {
    var ids = [];
    var ctrls = [];
    var menu = [];

    function NavHelperProvider() {
      this.addToView = function (url) {
        $.ajax({
          url: url,
          method: 'GET',
          async: false
        }).done(function (data) {
          ids.push(data);
        });
      };

      this.getViews = function () {
        var template = '';

        for (var i = 0; i < ids.length; ++i) {
          template += ids[i];
        }

        return template;
      };

      this.addControllerUrl = function (url) {
        ctrls.push(url);
      };

      this.getControllers = function () {
        return ctrls;
      };

      var getMenuWithId = function (menu, level) {
        if (menu === undefined) {
          return null;
        }
        var currentLevel = level[0];

        var menuItem = $.grep(menu, function (item) {
          return item.id === currentLevel;
        })[0];

        if (level.length === 1) {
          return menuItem;
        } else {
          return getMenuWithId(menuItem.submenu, level.slice(1));
        }
      };

      this.addToMenu = function (id, obj) {
        var lvl = id.split('.');
        obj.id = lvl.pop();

        if (lvl.length === 0) {
          menu.push(obj);
        } else {
          var menuItem = getMenuWithId(menu, lvl);

          if (menuItem) {
            if (!menuItem.submenu) {
              menuItem.submenu = [];
            }
            menuItem.submenu.push(obj);
          } else {
            var submenu = {
              'id': lvl[0],
              'title': lvl[0],
              'active': '',
              'submenu': [obj]
            };
            menu.push(submenu);
          }
        }
      };

      this.getMenu = function () {
        return menu;
      };

      this.$get = function NavHelperFactory() {
        return new NavHelperProvider();
      };
    }
    var persistentProvider = new NavHelperProvider();

    return persistentProvider;

  };

  var ContentHelper = function () {
    var ids = [];
    var ctrls = [];

    function ContentHelperProvider() {
      this.addToView = function (url) {
        $.ajax({
          url: url,
          method: 'GET',
          async: false
        }).done(function (data) {
          ids.push(data);
        });
      };

      this.getViews = function () {
        var template = '';

        for (var i = 0; i < ids.length; ++i) {
          template += ids[i];
        }

        return template;
      };

      this.addControllerUrl = function (url) {
        ctrls.push(url);
      };

      this.getControllers = function () {
        return ctrls;
      };

      this.$get = function ContentHelperFactory() {
        return new ContentHelperProvider();
      };
    }
    var persistentProvider = new ContentHelperProvider();

    return persistentProvider;

  };

  return {
    ContentHelper: ContentHelper,
    NavHelper: NavHelper,
    TopBarHelper: TopBarHelper
  };

});
