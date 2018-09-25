package org.opendaylight.mwtn.base.internalTypes;

import java.util.ArrayList;
import java.util.List;

public class InventoryInformation {

	public static final String UNKNOWN = "unknown";
    public static final List<String> EMPTY = new ArrayList<String>();
	public static final InventoryInformation DEFAULT = new InventoryInformation();

	private String type;
	private String model;
	private String vendor;
	private String deviceIpv4;
	private String deviceIpv6;
	private List<String> interfaceUuidList;

	public InventoryInformation()
	{
    	this.type=UNKNOWN;
		this.model=UNKNOWN;
		this.vendor=UNKNOWN;
		this.deviceIpv4=UNKNOWN;
		this.deviceIpv6=UNKNOWN;
		this.interfaceUuidList=EMPTY;
	}

	public InventoryInformation(InventoryInformation inventoryInformation) {
    	this.type=inventoryInformation.type;
		this.model=inventoryInformation.model;
		this.vendor=inventoryInformation.vendor;
		this.deviceIpv4=inventoryInformation.deviceIpv4;
		this.deviceIpv6=inventoryInformation.deviceIpv6;
		this.interfaceUuidList=new ArrayList<String>(inventoryInformation.interfaceUuidList);
	}

	public InventoryInformation(
				String type, String model, String vendor, String deviceIpv4,
				String deviceIpv6, List<String> interfaceUuidList) {
		setType(type);
		setModel(model);
		setVendor(vendor);
		setDeviceIpv4(deviceIpv4);
		setDeviceIpv6(deviceIpv6);
		setInterfaceUuidList(interfaceUuidList);
	}

	public String getType() {
		return type;
	}

	public String getModel() {
		return model;
	}

	public String getVendor() {
		return vendor;
	}

	public String getDeviceIpv4() {
		return deviceIpv4;
	}

	public String getDeviceIpv6() {
		return deviceIpv6;
	}

	public List<String> getInterfaceUuidList() {
		return interfaceUuidList;
	}

	public InventoryInformation setType(String type) {
		this.type = type != null ? type : UNKNOWN;
		return this;
	}

	public InventoryInformation setModel(String model) {
		this.model = model != null ? model : UNKNOWN;
		return this;
	}

	public InventoryInformation setVendor(String vendor) {
		this.vendor = vendor != null ? vendor : UNKNOWN;
		return this;
	}

	public InventoryInformation setDeviceIpv4(String deviceIpv4) {
		this.deviceIpv4 = deviceIpv4 != null ? deviceIpv4 : UNKNOWN;
		return this;
	}

	public InventoryInformation setDeviceIpv6(String deviceIpv6) {
		this.deviceIpv6 = deviceIpv6 != null ? deviceIpv6 : UNKNOWN ;
		return this;
	}

	public InventoryInformation setInterfaceUuidList(List<String> interfaceUuidList) {
		this.interfaceUuidList = interfaceUuidList != null ? interfaceUuidList : EMPTY;
		return this;
	}




}
