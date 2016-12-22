package com.highstreet.technologies.test.client.api;

public interface Result {

	public int getStatus();
	
	public String getMessage();
	
	public Value<?> getValue();
	
	public String toJsonString();
	
}
