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
import com.highstreet.technologies.test.client.api.Attribute;
import com.highstreet.technologies.test.client.api.Builder;
import com.highstreet.technologies.test.client.enums.ConditionalPackage;
import com.highstreet.technologies.test.client.enums.SubObjectClass;

public class AttributeBuilder implements Builder<Attribute> {

	private final ConditionalPackage conditionalPackage; // required
	private final String layerProtocol; // required
	private final SubObjectClass subObjectClass; // required
	private String attribute; // optional

	public AttributeBuilder(ConditionalPackage conditionalPackage, 
			                String layerProtocol,
			                SubObjectClass subObjectClass) {
		this.conditionalPackage = conditionalPackage;
		this.layerProtocol = layerProtocol;
		this.subObjectClass = subObjectClass;
	}

	public AttributeBuilder setAttribute(String attribute) {
		this.attribute = attribute;
		return this;
	}

	private void validateAttributeObject(AttributeImpl attribute) {
		// Do some basic validations to check
		// if Attribute object does not break any assumption of system
		if (attribute.getLayerProtocol() == "" || attribute.getLayerProtocol() == null) {
			throw new IllegalStateException("Invalid IP Address");
		}

		// TODO Check, whether subObjectClass and conditionalPackage fit
	}

	@Override
	public Attribute build() {
		AttributeImpl Attribute = new AttributeImpl(this);
		validateAttributeObject(Attribute);
		return Attribute;
	}
	
	private static final class AttributeImpl implements Attribute {

    	// All final attributes
		private final ConditionalPackage conditionalPackage; // required
		private final String layerProtocol; // required
		private final SubObjectClass subObjectClass; // required
		private final String attribute; // optional

    	private AttributeImpl(AttributeBuilder builder) {
    		this.conditionalPackage = builder.conditionalPackage;
    		this.layerProtocol = builder.layerProtocol;
    		this.subObjectClass = builder.subObjectClass;
    		this.attribute = builder.attribute;
    	}

		@Override
		public ConditionalPackage getConditionalPackage() {
			return this.conditionalPackage;
		}

		@Override
		public String getLayerProtocol() {
			return this.layerProtocol;
		}

		@Override
		public SubObjectClass getSubObjectClass() {
			return this.subObjectClass;
		}

		@Override
		public String getAttribute() {
			return this.attribute;
		}

		@Override
		public String toJsonString() {
			ObjectMapper mapper = new ObjectMapper();
			try {
				return mapper.writeValueAsString(this);
			} catch (JsonProcessingException e) {
				e.printStackTrace();
			}
			return "{'error':'No JSON representation for a Attribute object.'}";
		}
    }
}
