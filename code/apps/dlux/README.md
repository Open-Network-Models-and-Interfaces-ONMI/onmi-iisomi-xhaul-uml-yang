# Necessary change in OpenDaylight DLUX

In order to use latest features of [ui-bootstrap](https://angular-ui.github.io/bootstrap/) the version number used by OpenDaylight Boron-SR1 was changed to  "~2.1.3" in the static ODL DLUX WEB project.

This change results in a modified "loader.implementation-0.4.1-Boron-SR1.jar" which needs to be copied to the OpenDaylight Karaf "system" folder.
```
cp ./loader.implementation-0.4.1-Boron-SR1.jar $ODL_KARAF_HOME/system/org/opendaylight/dlux/loader.implementation/0.4.1-Boron-SR1
```

Please restart karaf.

## Changes in DLUX project Boron-SR1
```
$ git diff 
diff --git a/dlux-web/bower.json b/dlux-web/bower.json
index fc64524..c6f6bee 100644
--- a/dlux-web/bower.json
+++ b/dlux-web/bower.json
@@ -42,7 +42,7 @@
     "angular": "~1.4.0",
     "angular-mocks": "~1.4.0",
     "bootstrap": "~3.0.2",
-    "angular-bootstrap": "~0.13.0",
+    "angular-bootstrap": "~2.3.1",
     "ng-grid": "~2.0.7",
     "requirejs-domready": "~2.0.1",
     "ocLazyLoad": "0.3.0",
diff --git a/dlux-web/src/less/design.less b/dlux-web/src/less/design.less
index 083787e..2fdbc54 100644
--- a/dlux-web/src/less/design.less
+++ b/dlux-web/src/less/design.less
@@ -13,7 +13,7 @@
 }
 
 a {
-       color: #414042 !important;
+       color: #414042 /* !important */;
 }
 
 li.active {
```
