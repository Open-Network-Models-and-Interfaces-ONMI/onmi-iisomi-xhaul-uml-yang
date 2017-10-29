package org.opendaylight.mwtn.aotsMConnector.impl;

import java.util.HashMap;

import org.opendaylight.mwtn.base.internalTypes.InternalSeverity;

public class PrtOffsetMap extends HashMap<String,Integer>{

	/**
	 *
	 */
	private static final long serialVersionUID = 8216115741022858161L;

	private String getKey(int customerImpact,InternalSeverity sev)
	{
		return String.format("%d-%s", customerImpact,sev.name());
	}
	public void put(int customerImpact,InternalSeverity sev,int value)
	{
		this.put(getKey(customerImpact, sev), value);
	}
	public int get(int customerImpact,InternalSeverity sev)
	{
		return this.get(this.getKey(customerImpact, sev));
	}
	public boolean containsKey(int customerImpact,InternalSeverity sev)
	{
		return this.containsKey(this.getKey(customerImpact, sev));
	}

}
