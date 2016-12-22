package com.highstreet.technologies.test.client.api;

public interface Address {

	public RestConfServer getRestConfServer();
	
	public Node getNode();
	
	public Attribute getAttribute();
	
	public String toJsonString();

}
