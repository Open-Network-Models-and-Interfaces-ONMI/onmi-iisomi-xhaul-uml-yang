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
import com.highstreet.technologies.test.client.api.Value;

public class ValueBuilder implements Builder<Value<?>> {

	private final Object value; // required

	public ValueBuilder(Object value) {
		this.value = value;
	}

	public ValueBuilder(Value<?> value) {
		this.value = value.getValue();
	}

	private void validateValueObject(ValueImpl value) {
		// Do some basic validations to check
		// if Value object does not break any assumption of system
	}

	@Override
	public Value<?> build() {
		ValueImpl value = new ValueImpl(this);
		validateValueObject(value);
		return value;
	}
	
	private static final class ValueImpl implements Value<Object> {

    	// All final attributes
    	private final Object value; // required

    	private ValueImpl(ValueBuilder builder) {
    		this.value = builder.value;
    	}

    	@Override
		public Object getValue() {
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
			return "{'error':'No JSON representation for a Value object.'}";
		}
    }
}
