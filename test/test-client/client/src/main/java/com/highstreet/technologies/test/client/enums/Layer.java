package com.highstreet.technologies.test.client.enums;

public enum Layer {
	AIRINTERFACE("MWPS"), STRUCTURE("MWS"), CONTAINER("ETH-CTP");

	private final String text;

	/**
	 * @param text
	 */
	private Layer(final String text) {
		this.text = text;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Enum#toString()
	 */
	@Override
	public String toString() {
		return text;
	}
}

/*
 * MWPS-TTP: AirInterface 
 * MWS-TTP: Structure (PureEthernetSturcture, HybridStructure) 
 * ETH-CTP: Container (EthernetContainer, TdmConainer)
 */