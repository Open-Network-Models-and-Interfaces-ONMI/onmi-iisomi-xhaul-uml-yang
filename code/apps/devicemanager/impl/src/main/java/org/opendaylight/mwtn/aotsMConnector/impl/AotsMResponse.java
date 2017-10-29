package org.opendaylight.mwtn.aotsMConnector.impl;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.*;

import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
//import org.opendaylight.mwtn.config.impl.HtLogger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class AotsMResponse {

	private static final Logger LOG = LoggerFactory.getLogger(AotsMResponse.class);

	public interface TicketResult
	{
		public boolean isSuccessfull();
		public int getCode();
		public String getDescription();
	}
	public class AddMobilityResult implements TicketResult
	{
		private final String ticketNumber;
		private final int code;
		private final String description;

		public AddMobilityResult(String tno,int code,String desc)
		{this.ticketNumber=tno;this.code=code;this.description=desc;}

		public String getTicketNumber()
		{return this.ticketNumber;}
		@Override
		public boolean isSuccessfull() {
			return this.code==0;
		}

		@Override
		public int getCode() {
			return this.code;
		}

		@Override
		public String getDescription() {
			return this.description;
		}
	}
	public class InquireMobilityTicketResult implements TicketResult
	{
		private final int code;
		private final String description;
		public InquireMobilityTicketResult(int code,String desc)
		{this.code=code;this.description=desc;	}
		@Override
		public boolean isSuccessfull() {
			return this.code==0;
		}
		@Override
		public int getCode() {
			return this.code;
		}

		@Override
		public String getDescription() {
			return this.description;
		}
	}
	public static class FaultResult implements TicketResult
	{
		private final int code;
		private final String description;
		public FaultResult(int code,String desc)
		{
			this.code=code;
			this.description=desc;
		}
		@Override
		public boolean isSuccessfull() {
			return false;
		}

		@Override
		public int getCode() {
			return this.code;
		}

		@Override
		public String getDescription() {
			return this.description;
		}
		public static TicketResult UnknownResult() {
			return new FaultResult(0,"unknown");
		}

	}
	/*
	 * root=<MobilityTicket>
	 */
	private static class InquireResponseListItem
	{
		public static final String UNKNOWN = "unknown";
		public final String ticketNumber;
		public final String ticketStatus;
		public InquireResponseListItem(Element root)
		{
			this.ticketNumber = findElemValue(root,"mobilityTicketNumber");
			Node detailsNode = findElem(root, "MobilityCoreTicketDetails");
			if(detailsNode!=null)
			{
				this.ticketStatus = findElemValue(detailsNode,"ticketStatus",UNKNOWN);
			}
			else
				this.ticketStatus=UNKNOWN;
		}
		public boolean isClosed()
		{return this.ticketStatus!=null?this.ticketStatus.toLowerCase().equals("closed"):false;}
		public boolean isCanceled()
		{return this.ticketStatus!=null?this.ticketStatus.toLowerCase().equals("canceled"):false;}
		public boolean isResolved()
		{return this.ticketStatus!=null?this.ticketStatus.toLowerCase().equals("resolved"):false;}
		public boolean isClosedCanceldOrResolved()
		{return this.isClosed() || this.isCanceled() || this.isResolved();}

	}
	private class InquireResponseItemCollection extends ArrayList<InquireResponseListItem>
	{
		public InquireResponseItemCollection(Node root)
		{
			List<Element> elems = new ArrayList<Element>();
			findElements(root, "MobilityTicket",elems ,5,false);
			if(elems!=null && elems.size()>0)
			{
				for(Element e: elems)
				{
					this.add(new InquireResponseListItem(e));
				}
			}
		}
		public boolean isAnyTicketOpen()
		{
			if(this.size()<=0)
				return false;
			for(InquireResponseListItem item :this)
			{
				if(!item.isClosedCanceldOrResolved())
					return true;
			}
			return false;
		}
	}
	public static final int TYPE_ADDMOBILITYTICKET = 1;
	public static final int TYPE_INQUIREMOBILITYTICKET = 2;
	private static final String NSURI_SOAP = "http://schemas.xmlsoap.org/soap/envelope/";
	private static final String NSURI_ADDMOB = "http://csi.cingular.com/CSI/Namespaces/Container/Public/AddMobilityTicketResponse.xsd";
	private static final String NSURI_ADDMOB_ERRORRESP="http://csi.cingular.com/CSI/Namespaces/ATTOneTicketingSystem/InfrastructureCommon/Types/Public/ErrorResponse.xsd";
	private static final String NSURI_ADDMOB_ERRORRESP2="http://csi.cingular.com/CSI/Namespaces/Types/Public/ErrorResponse.xsd";
	private static final String NSURI_ADDINQ_COMMONDATA="http://csi.att.com/CSI/Namespaces/ATTOneTicketingSystem/Types/Public/CommonDataModel.xsd";

	private static final String NSURI_INQMOB = "http://csi.cingular.com/CSI/Namespaces/Container/Public/InquireMobilityTicketListResponse.xsd";
	private static final String NSURI_INQMOB_ERRORRESP = NSURI_ADDMOB_ERRORRESP;//TODO


	private final int msgType;
	private final String responseRAW;
	private TicketResult resultObj;
	private InquireResponseItemCollection listObjects=null;

	/*
	 * getter
	 */

	public boolean isSuccessful() {
		return this.resultObj==null?false:this.resultObj.isSuccessfull();
	}
	public boolean hasResultObjects() {

		return this.listObjects!=null && this.listObjects.size()>0;
	}
	public boolean isAddMobilityTicketResponse() {
		return this.msgType==TYPE_ADDMOBILITYTICKET;
	}
	public boolean isInquireMobilityTicketResponse() {
		return this.msgType==TYPE_INQUIREMOBILITYTICKET;
	}
	public String getRaw() {
		return this.responseRAW;
	}
	public String getTicketNumber() {
		return (this.resultObj!=null && this.resultObj.isSuccessfull() && this.resultObj instanceof AddMobilityResult)?((AddMobilityResult)this.resultObj).getTicketNumber():"";
	}
	public int getNumResults() {
		return this.listObjects!=null?this.listObjects.size():0;
	}

	private AotsMResponse(int t, String responseString) throws ParserConfigurationException, IOException, SAXException {
		this.msgType = t;
		this.responseRAW = responseString;
		this.parse();
	}

	private void parse() throws SAXException, ParserConfigurationException, IOException {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		factory.setNamespaceAware(true);
		DocumentBuilder builder = factory.newDocumentBuilder();
		InputSource is = new InputSource(new StringReader(this.responseRAW));
		Document doc = builder.parse(is);
		switch (this.msgType) {
		case TYPE_ADDMOBILITYTICKET:
			this.findParamsAddMobilityResponse(doc);
			break;
		case TYPE_INQUIREMOBILITYTICKET:
			this.findParamsInquireMobilityResponse(doc);
			break;
		}
	}

	private void findParamsInquireMobilityResponse(Document doc) {
		//NodeList header=doc.getElementsByTagNameNS(NSURI_SOAP, "Header");
		//NodeList body=doc.getElementsByTagNameNS( NSURI_SOAP,"Body");
		NodeList fault=doc.getElementsByTagNameNS(NSURI_SOAP,"Fault");
		NodeList resp=doc.getElementsByTagNameNS(NSURI_INQMOB,"InquireMobilityTicketListResponse");
		if(resp!=null && resp.getLength()>0)//valid response
		{
			try
			{
				this.listObjects=new InquireResponseItemCollection(findElem(resp.item(0),"MobilityTicketDetails"));
				this.resultObj=new InquireMobilityTicketResult(0, "Success");
			}
			catch(Exception e)
			{
				LOG.error("error parsing result object");
			}
		}
		else if(fault!=null && fault.getLength()>0)	//fault response
		{
			try
			{
				this.resultObj=FaultResult.UnknownResult();

			}
			catch(Exception e)
			{
				LOG.error("error parsing result object");
			}
		}
		else	//should never happen
		{
			LOG.error("unknwon result");
		}
	}


	private void findParamsAddMobilityResponse(Document doc) {
		//NodeList header=doc.getElementsByTagNameNS(NSURI_SOAP, "Header");
		//NodeList body=doc.getElementsByTagNameNS( NSURI_SOAP,"Body");
		NodeList fault=doc.getElementsByTagNameNS(NSURI_SOAP,"Fault");
		NodeList resp=doc.getElementsByTagNameNS(NSURI_ADDMOB,"AddMobilityTicketResponse");
		if(resp!=null && resp.getLength()>0)//valid response
		{
			try
			{
				String ticketNo=findElemValue(resp.item(0), "mobilityTicketNumber");
				int code=Integer.parseInt(findElemValue(resp.item(0), "code"));
				String desc=findElemValue(resp.item(0), "description");
				this.resultObj=new AddMobilityResult(ticketNo, code, desc);

			}
			catch(Exception e)
			{
				LOG.error("error parsing result object");
			}
		}
		else if(fault!=null && fault.getLength()>0)	//fault response
		{
			try
			{
				NodeList faultResponse=doc.getElementsByTagNameNS(NSURI_ADDMOB_ERRORRESP, "Response");
				if(faultResponse==null || faultResponse.item(0)==null)
					faultResponse=doc.getElementsByTagNameNS(NSURI_ADDMOB_ERRORRESP2, "Response");
				int code=Integer.parseInt(findElemValue(faultResponse.item(0), "code"));
				String desc=findElemValue(faultResponse.item(0), "description");
				this.resultObj=new FaultResult(code,desc);

			}
			catch(Exception e)
			{
				this.resultObj=FaultResult.UnknownResult();
				LOG.error("error parsing result object");
			}
		}
		else	//should never happen
		{
			LOG.error("unknwon result");
		}
	}
	private static String findElemValue(Node root, String nodeName)
	{
		return findElemValue(root,nodeName,null);
	}
	private static String findElemValue(Node root, String nodeName,String def)
	{
		Node n=findElem(root, nodeName);
		return n!=null?n.getFirstChild().getTextContent():def;
	}
	private static Node findElem(Node root, String nodeName) {
		return findElem(root, nodeName,true);
	}
	private static Node findElem(Node root, final String nodeName,final boolean recursive) {
		Node n=null;

		if(root.hasChildNodes())
		{
			NodeList nodes=root.getChildNodes();
			for(int i=0;i<nodes.getLength();i++)
			{
				Node node=nodes.item(i);
				if(node instanceof Element)
				{
					Element el=(Element)node;
					if(nodeName.equals(el.getLocalName()))
					{
						n=node;
						break;
					}
					if(node.hasChildNodes())
					{
						n=findElem(node, nodeName, recursive);
						if(n!=null)
							break;
					}
				}
			}
		}
		return n;
	}
	private int findElements(Node root, final String nodeName,List<Element> results,int limit,final boolean recursive) {
		int cnt=0;
		if(root.hasChildNodes())
		{
			NodeList nodes=root.getChildNodes();
			Node node;
			for(int i=0;i<nodes.getLength();i++)
			{
				node=nodes.item(i);
				if(node instanceof Element)
				{
					Element el=(Element)node;
					if(nodeName.equals(el.getLocalName()))
					{
						results.add(el);
						cnt++;
					}
					if(cnt>limit)
						break;
					if(node.hasChildNodes() && recursive)
					{
						cnt+=this.findElements(node, nodeName,results,limit-cnt, recursive);
						if(cnt>limit)
							break;
					}

				}
			}
		}
		return cnt;
	}
	private static void printNodeList(NodeList list)
	{
		for(int i=0;i<list.getLength();i++)
		{
			Node n=list.item(i);
			if(!(n instanceof Element))
				continue;
			if(n.hasChildNodes())
			{
				System.out.println("=="+n.getNodeName()+"==");
				printNodeList(n.getChildNodes());
			}
			else
			{
				System.out.println(n.getNodeName()+" : "+n.getNodeValue());
			}
		}
	}
	public static AotsMResponse ParseAddMobility(String responseString) throws SAXException, ParserConfigurationException, IOException {

		return new AotsMResponse(TYPE_ADDMOBILITYTICKET, responseString);
	}

	public static AotsMResponse ParseInquireMobility(String responseString) throws SAXException, ParserConfigurationException, IOException {

		return new AotsMResponse(TYPE_INQUIREMOBILITYTICKET, responseString);
	}
	public boolean hasOpenTicket() {
		return this.listObjects!=null?this.listObjects.isAnyTicketOpen():false;
	}



}
