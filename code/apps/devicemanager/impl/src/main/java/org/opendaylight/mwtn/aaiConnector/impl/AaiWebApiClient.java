package org.opendaylight.mwtn.aaiConnector.impl;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.annotation.Nonnull;

import org.opendaylight.mwtn.base.http.BaseHTTPClient;
import org.opendaylight.mwtn.base.http.BaseHTTPResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AaiWebApiClient extends BaseHTTPClient{

	public static class URLParamEncoder {

	    public static String encode(String input) {
	        StringBuilder resultStr = new StringBuilder();
	        for (char ch : input.toCharArray()) {
	            if (isUnsafe(ch)) {
	                resultStr.append('%');
	                resultStr.append(toHex(ch / 16));
	                resultStr.append(toHex(ch % 16));
	            } else {
	                resultStr.append(ch);
	            }
	        }
	        return resultStr.toString();
	    }

	    private static char toHex(int ch) {
	        return (char) (ch < 10 ? '0' + ch : 'A' + ch - 10);
	    }

	    private static boolean isUnsafe(char ch) {
	        if (ch > 128 || ch < 0)
	            return true;
	        return " %$&+,/:;=?@<>#%".indexOf(ch) >= 0;
	    }

	}
	private static final String pnfJSON_INTERFACE_TEMPLATE = "        {\n" +
			"            \"interface-name\": \"@interface@\",\n" +
			"            \"speed-value\": \"300\",\n" +
			"            \"speed-units\": \"MBit/s\",\n" +
			"            \"port-description\": \"Air Interface (MWPS)\",\n" +
			"            \"equipment-identifier\": \"@pnfId@-@interface@\",\n" +
			"            \"interface-role\": \"Wireless\",\n" +
			"            \"interface-type\": \"Air Interface (MWPS)\",\n" +
			"            \"resource-version\": \"@model@\",\n" +
			"            \"relationship-list\": [\n" +
			"                {\n" +
			"                    \"related-to\": \"A keyword provided by A&AI to indicate type of node.\",\n" +
			"                    \"related-link\": \"URL to the object in A&AI.\",\n" +
			"                    \"relationship-data\": [\n" +
			"                        {\n" +
			"                            \"relationship-key\": \"A keyword provided by A&AI to indicate an attribute.\",\n" +
			"                            \"relationship-value\": \"Value of the attribute\"\n" +
			"                        }\n" +
			"                    ],\n" +
			"                    \"related-to-property\": [\n" +
			"                        {\n" +
			"                            \"property-key\": \"Key part of a key/value pair\",\n" +
			"                            \"property-value\": \"Value part of a key/value pair\"\n" +
			"                        }\n" +
			"                    ]\n" +
			"                }\n" +
			"            ]\n" +
			"        }\n";

	private static final String pnfJSON_TEMPLATE = "{\n" +
			"    \"pnf-name\": \"@pnfId@\",\n" +
			"    \"pnf-id\": \"@pnfId@\",\n" +
			"    \"equip-type\": \"@type@\",\n" +
			"    \"equip-model\": \"@model@\",\n" +
			"    \"equip-vendor\": \"@vendor@\",\n" +
			"    \"ipaddress-v4-oam\": \"@oamIp@\",\n" +
			"    \"in-maint\": true,\n" +
			"    \"p-interfaces\": @interface-list@\n"+
			"}\n" +
			"";

	private static String getPnfTemplateFilled(String pnfId,String type,String model,String vendor,String oamIp,List<String> ifaces)
	{
		return pnfJSON_TEMPLATE.replace("@pnfId@",pnfId).
				replace("@type@", type).
				replace("@model@", model).
				replace("@vendor@",vendor).
				replace("@oamIp@", oamIp).
				replace("@interface-list@", getPnfTemplateInterfaceList(pnfId,ifaces,model));
	}
	private static String getPnfTemplateInterfaceList(String pnfId,List<String> ifaces,String model) {
		String s="[";
		if(ifaces!=null)
		{
			if(ifaces.size()>0)
			{
				s+=pnfJSON_INTERFACE_TEMPLATE.replace("@interface@", ifaces.get(0));
			}
			for(int i=1;i<ifaces.size();i++)
				s+=","+pnfJSON_INTERFACE_TEMPLATE.replace("@interface@", ifaces.get(i));
		}
		s+="]";

		return s.replace("@pnfId@",pnfId).replace("@model@", model);
	}
	private static Logger LOG = LoggerFactory.getLogger(AaiWebApiClient.class);

	private final Map<String, String> headers;

	public AaiWebApiClient(String baseUrl, Map<String, String> headers, boolean trustAllCerts) {
		this(baseUrl,headers,trustAllCerts,null,null);
	}

	public AaiWebApiClient(String baseUrl, Map<String, String> headers, boolean trustAllCerts, String certFilename,
			String passphrase) {
		super(baseUrl, trustAllCerts, certFilename, passphrase, BaseHTTPClient.SSLCERT_PCKS);
		this.headers = headers;
	}


	public boolean pnfCreate(String pnfId,String type,String model,String vendor,String oamIp,List<String> ifaces)
	{
		LOG.debug("registering "+pnfId +"(type="+type+", model="+model+", vendor="+vendor+",ip="+oamIp+")");
		Map<String,String> headers = this.headers;
		headers.put("Content-Type","application/json");
		headers.put("Accept","application/json");
		BaseHTTPResponse response=null;
		try {
			String uri="network/pnfs/pnf/"+URLParamEncoder.encode( pnfId);
			String message=getPnfTemplateFilled(pnfId, type, model, vendor, oamIp, ifaces);
			response=this.sendRequest(uri,"PUT",message,headers);
			LOG.debug("finished with responsecode "+response.code);
		} catch (IOException e) {
			LOG.warn("problem registering "+pnfId+": "+e.getMessage());
		}
		return response!=null?response.code==200:false;
	}

	public boolean pnfDelete(String pnfId)
	{
		LOG.debug("unregistering "+pnfId);
		Map<String,String> headers = this.headers;
		headers.put("Content-Type","application/json");
		headers.put("Accept","application/json");
		BaseHTTPResponse response=null;
		try {
			String uri="network/pnfs/pnf/"+URLParamEncoder.encode( pnfId );
			response=this.sendRequest(uri,
					"DELETE",
					"",headers);
			LOG.debug("finished with responsecode "+response.code);
		} catch (IOException e) {
			LOG.warn("problem unregistering "+pnfId+": "+e.getMessage());
		}
		return response!=null?response.code==200:false;
	}
	public @Nonnull BaseHTTPResponse pnfCheckIfExists(String pnfId) {

		BaseHTTPResponse response=null;
		LOG.debug("check for "+pnfId);
		Map<String,String> headers = this.headers;
		headers.put("Content-Type","application/json");
		headers.put("Accept","application/json");
		try {
			String uri="network/pnfs/pnf/"+URLParamEncoder.encode( pnfId );
			response=this.sendRequest(uri,
					"GET",
					"",headers);
			LOG.debug("finished with responsecode "+response.code);
		} catch (IOException e) {
			LOG.warn("problem checking "+pnfId+": "+e.getMessage());
			response = BaseHTTPResponse.UNKNOWN;
		}

		return response;
	}



}
