package org.opendaylight.mwtn.base.database;

public class EsBaseRequireNetworkElement extends EsObject {

	public static final String ESDATATYPENAME = "required-networkelement";

	public EsBaseRequireNetworkElement()
	{
		
	}
	public EsBaseRequireNetworkElement(String mountpountName)
	{
		super();
		this.setEsId(mountpountName);
	}
}
