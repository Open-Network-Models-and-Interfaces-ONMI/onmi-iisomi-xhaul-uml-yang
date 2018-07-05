package org.opendaylight.mwtn.base.internalTypes;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Nonnull;

public class InventoryInformation {

	public static final String UNKNOWN = "unknown";
	public static final InventoryInformation DEFAULT = new InventoryInformation(InventoryInformation.UNKNOWN, InventoryInformation.UNKNOWN, InventoryInformation.UNKNOWN, InventoryInformation.UNKNOWN, InventoryInformation.UNKNOWN, new ArrayList<String>());
	private final String type;
	private final String model;
	private final String vendor;
	private final String deviceIpv4;
	private final String deviceIpv6;
	private final List<String> interfaceUuidList;


	public String getType() {return this.type;}
	public String getModel() {return this.model;}
	public String getVendor() {return this.vendor;}
	public String getDeviceIpv4() {return this.deviceIpv4;}
	public String getDeviceIpv6() {return this.deviceIpv6;}
	public List<String> getInterfaceUuidList(){return this.interfaceUuidList;}

	public InventoryInformation(String type,String model,String vendor,String ipv4,String ipv6,List<String> ifInfos )
	{
		this.type=type;
		this.model=model;
		this.vendor=vendor;
		this.deviceIpv4=ipv4;
		this.deviceIpv6=ipv6;
		this.interfaceUuidList=ifInfos;

	}

	public @Nonnull static InventoryInformation fromNeXML(String xmlRaw,String layerProtocolFilter)
	{
		List<String> uuids = new ArrayList<String>();
    	String type=InventoryInformation.UNKNOWN;
		String model=InventoryInformation.UNKNOWN;
		String vendor=InventoryInformation.UNKNOWN;
		String ipv4=InventoryInformation.UNKNOWN;
		String ipv6=InventoryInformation.UNKNOWN;

		//TODO: parse xml document

		return new InventoryInformation(type, model, vendor, ipv4, ipv6, uuids);
	}
}
