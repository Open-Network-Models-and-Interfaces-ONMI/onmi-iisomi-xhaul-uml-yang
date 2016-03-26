package org.opendaylight.wtg.eventmanager.impl.xml;

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
			System.out.println(e);
			xml = null;
		}
		return xml;
	}
}
