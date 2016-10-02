# Necessary change in OpenDaylight DLUX

In order to use latest features of [ui-bootstrap](https://angular-ui.github.io/bootstrap/) the version number used by OpenDaylight Beryllium-SR-2 was changed to  "~2.1.3" in the static ODL DLUX WEB project.

This change results in a modified "loader.implementation-0.3.2-Beryllium-SR2.jar" which needs to be copied to the OpenDaylight Karaf "system" folder.
```
cp ./loader.implementation-0.3.2-Beryllium-SR2.jar $ODL_KARAF_HOME/system/org/opendaylight/dlux/loader.implementation/0.3.2-Beryllium-SR2
```

Please restart karaf.
