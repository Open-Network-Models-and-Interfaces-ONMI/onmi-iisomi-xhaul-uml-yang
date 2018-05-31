## Test yang compatibility

This test section contains the yang files that are used for CENTENNIAL testing of ODL with NETCONF devices.
The file set is depending on the major version of ODL.

#### Why we need this test?

##### ODL behavior

ODL is used by NETCONF devices. Each NETCONF device can come with its individual capability list with yang files. ODL is uploading all the yang files that are *not known* into its internal location at $ODL_KARAF_HOME/cache/schema. If a yang-file is within this "cache" it is not uploading it and is using it.

#### Testcase for this situation

Scenario:
  * A new device connects to ODL.
  * ODL has all yang files already loaded.

=> Test result: The device is working correctly

#### Answer to the why

We need to be sure that all devices that are connecting to ODL are using the equal set of yang files. Unfortunately a yang file can be easily changed. So we need a test case for this situation to verify that it is working.

The files listed in this section are also used by ODL for code generation for ODL Java apps. This kinf of ODL apps can only work with the "known" yang files. And this files are also used for this test.

ODLs tests are also using this yang files. ODL is working with these files

#### Some rules for yang modifications

Additional yang files, added by the NE, are no problem if all agree and follow this RULES:

  * A modification of any of the existing yang files, specified by modulename and namespace and revision is not allowed
  * A new revision has to be compatible and contains all revision dates of the previouse yang-files with same module name and namspace
  * A new yang file uses a new, no conflicting module name and namespace and an actual date.

### Capabilities used for ODL Test

#### ODL Boron and Carbon

The following capabilities are used by NETCONF devices for the test and good working. They cover all functions that are used by devicemanager in ODL.

HINT: The sequence is considering the IMPORT relationships of the YANG files.

    <capabilities>
        <capability>urn:ietf:params:netconf:base:1.0</capability>
        <capability>urn:ietf:params:netconf:capability:notification:1.0</capability>
        <capability>urn:ietf:params:netconf:capability:writable-running:1.0</capability>
        <capability>urn:onf:params:xml:ns:yang:core-model?module=core-model&amp;revision=2017-03-20&amp;features=protection-exclude-server,protection-exclude-fc-port,protection-exclude-ltp</capability>
        <capability>urn:onf:params:xml:ns:yang:g.874.1-model?module=g.874.1-model&amp;revision=2017-03-20</capability>
        <capability>urn:onf:params:xml:ns:yang:microwave-model?module=microwave-model&amp;revision=2017-03-24&amp;features=pure-ethernet,hybrid-microwave</capability>
        <capability>urn:ietf:params:xml:ns:yang:ietf-inet-types?module=ietf-inet-types&amp;revision=2010-09-24</capability>
        <capability>urn:ietf:params:xml:ns:yang:ietf-yang-types?module=ietf-yang-types&amp;revision=2013-07-15</capability>
        <capability>urn:ietf:params:xml:ns:yang:ietf-netconf-monitoring?module=ietf-netconf-monitoring&amp;revision=2010-10-04</capability>
        <capability>urn:ietf:params:xml:ns:yang:ietf-netconf-acm?module=ietf-netconf-acm&amp;revision=2012-02-22</capability>
        <capability>urn:ietf:params:xml:ns:yang:ietf-system?module=ietf-system&amp;revision=2014-08-06&amp;features=radius,authentication,local-users,radius-authentication,ntp,ntp-udp-port,timezone-name,dns-udp-tcp-port</capability>
        <capability>urn:ietf:params:xml:ns:netconf:partial-lock:1.0?module=ietf-netconf-partial-lock&amp;revision=2009-10-19</capability>
        <capability>urn:ietf:params:xml:ns:netmod:notification?module=nc-notifications&amp;revision=2008-07-14</capability>
        <capability>http://netconfcentral.org/ns/yuma-ncx?module=yuma-ncx&amp;revision=2015-10-16</capability>
        <capability>urn:ietf:params:xml:ns:netconf:notification:1.0?module=notifications&amp;revision=2013-03-15</capability>
    </capabilities>

