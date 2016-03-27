package org.opendaylight.wtg.netconfconnector.api.connect;

public class NetconfConnectionModel {

	private String name;
	private String address;
	private int port;
	private String username;
	private String password;
	private boolean tcpOnly;

	public void setName(String name) {
		this.name = name;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setTcpOnly(boolean tcpOnly) {
		this.tcpOnly = tcpOnly;
	}

	public String getNetconfConnectionXML() {
		String str = "<module xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:config\">\n  "
				+ "<type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">prefix:sal-netconf-connector</type>\n  "
				+ "<name>" + name + "</name>\n  "
				+ "<address xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">"
				+ address + "</address>\n  "
				+ "<port xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">" + port
				+ "</port>\n  "
				+ "<username xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">"
				+ username + "</username>\n  "
				+ "<password xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">"
				+ password + "</password>\n  "
				+ "<tcp-only xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">"
				+ tcpOnly + "</tcp-only>\n  "
				+ "<event-executor xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">\n    "
				+ "<type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:netty\">prefix:netty-event-executor</type>\n    "
				+ "<name>global-event-executor</name>\n  " + "</event-executor>\n  "
				+ "<binding-registry xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">\n    "
				+ "<type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:binding\">prefix:binding-broker-osgi-registry</type>\n    "
				+ "<name>binding-osgi-broker</name>\n  " + "</binding-registry>\n  "
				+ "<dom-registry xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">\n    "
				+ "<type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:dom\">prefix:dom-broker-osgi-registry</type>\n    "
				+ "<name>dom-broker</name>\n  " + "</dom-registry>\n  "
				+ "<client-dispatcher xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">\n    "
				+ "<type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:config:netconf\">prefix:netconf-client-dispatcher</type>\n    "
				+ "<name>global-netconf-dispatcher</name>\n  " + "</client-dispatcher>\n  "
				+ "<processing-executor xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">\n    "
				+ "<type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:threadpool\">prefix:threadpool</type>\n    "
				+ "<name>global-netconf-processing-executor</name>\n  " + "</processing-executor>\n  "
				+ "<keepalive-executor xmlns=\"urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf\">\n    "
				+ "<type xmlns:prefix=\"urn:opendaylight:params:xml:ns:yang:controller:threadpool\">prefix:scheduled-threadpool</type>\n    "
				+ "<name>global-netconf-ssh-scheduled-executor</name>\n  " + "</keepalive-executor>\n</module>";
		return str;
	}
}