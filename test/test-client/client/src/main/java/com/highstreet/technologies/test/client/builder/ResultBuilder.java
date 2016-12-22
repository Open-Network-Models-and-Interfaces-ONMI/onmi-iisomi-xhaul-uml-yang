/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package com.highstreet.technologies.test.client.builder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.highstreet.technologies.test.client.api.Builder;
import com.highstreet.technologies.test.client.api.Result;
import com.highstreet.technologies.test.client.api.Value;

public class ResultBuilder implements Builder<Result> {

	private int status;
	private String message; 
	private Value<?> value;

	public ResultBuilder() {
		this.status = 500;
		this.message = "Internal Server Error";
	}

	public ResultBuilder(Result result) {
		this.status = result.getStatus();
		this.message = result.getMessage();
		this.value = result.getValue();
	}

	public ResultBuilder setStatus(int status) {
		this.status = status;
		return this;
	}

	public ResultBuilder setMessage(String message) {
		this.message = message;
		return this;
	}

	public ResultBuilder setValue(Value<?> value) {
		this.value = value;
		return this;
	}

	private void validateResultObject(ResultImpl result) {
		// Do some basic validations to check
		// if Result object does not break any assumption of system
		if (result.status < 1) {
			throw new IllegalStateException("Invalid status");
		}
	}

	@Override
	public Result build() {
		ResultImpl result = new ResultImpl(this);
		validateResultObject(result);
		return result;
	}
	private static final class ResultImpl implements Result {

    	// All final attributes
    	private final int status; 
    	private final String message;
    	private final Value<?> value;

    	private ResultImpl(ResultBuilder builder) {
    		this.status = builder.status;
    		this.message = builder.message;
    		this.value = builder.value;
    	}

		@Override
		public int getStatus() {
			return this.status;
		}

		@Override
		public String getMessage() {
			return this.message;
		}

		@Override
		public Value<?> getValue() {
			return this.value;
		}

		@Override
		public String toJsonString() {
			ObjectMapper mapper = new ObjectMapper();
			try {
				return mapper.writeValueAsString(this);
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
			return "{'error':'No JSON representation for a Result object.'}";
		}

    }
}
