package org.opendaylight.mwtn.base.http;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/*
 * base... baseURL, e.g. http://10.10.55.11:8432/api/paut/
 *
 * usage: this.sendRequest()
 * 		uri... all after the baseURL => request-url=base+uri
 *		headers: https://developer.mozilla.org/de/docs/Web/HTTP/Headers
 *
 */
public class ExampleHttpClient extends BaseHTTPClient{

	private final String username;
	private final String password;

	/*
	 * for normal http request without ssl client certificate authorization
	 */
	public ExampleHttpClient(String base, boolean trustAllCerts,String user,String passwd)
	{
		super(base,trustAllCerts);
		this.username=user;
		this.password=passwd;
		int timeout=60000;//http timeout in ms
		this.setTimeout(timeout);


	}
	/*
	 * for client cert authorization
	 */
	public ExampleHttpClient(String base, boolean trustAllCerts, String certFilename, String passphrase,
			int sslCertType) {
		super(base, trustAllCerts, certFilename, passphrase, sslCertType);
		this.username="";
		this.password="";

	}


	public void doExamplePost(String param1,int param2) throws IOException
	{
		String uri="network/pnf/id";
		String method="GET";
		String body=String.format("{\"param1\":\"%s\",\"param1\":%d}",param1,param2);
		Map<String, String> headers = new HashMap<String,String>();
		headers.put("Accept-Encoding", "utf-8");
		headers.put("Authorization", BaseHTTPClient.getAuthorizationHeaderValue(this.username, this.password));
		BaseHTTPResponse response=this.sendRequest(uri, method, body, headers );

		if(response.code==BaseHTTPResponse.CODE200)
		{

		}


	}
}
