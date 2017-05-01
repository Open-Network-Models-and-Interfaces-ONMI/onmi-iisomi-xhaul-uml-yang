/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.devicemanager.impl.xml;

import java.io.StringWriter;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class XmlMapper {
    private static final Logger LOG = LoggerFactory.getLogger(XmlMapper.class);

    public String getXmlString(MwtNotificationBase base) {
        String xml;
        JAXBContext jaxbContext;
        try {
            jaxbContext = JAXBContext.newInstance(AttributeValueChangedNotificationXml.class,
                    ObjectCreationNotificationXml.class, ObjectDeletionNotificationXml.class,
                    ProblemNotificationXml.class);
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();
            jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

            StringWriter stringWriter = new StringWriter();
            jaxbMarshaller.marshal(base, stringWriter);
            xml = stringWriter.toString();
        } catch (JAXBException e) {
            LOG.warn("Problem in marshalling xml file {}", e);
            xml = null;
        }
        return xml;
    }
}
