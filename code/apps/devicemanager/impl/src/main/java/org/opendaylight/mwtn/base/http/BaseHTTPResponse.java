package org.opendaylight.mwtn.base.http;

public class BaseHTTPResponse {

	public static final int CODE404 = 404;
	public static final int CODE200 = 200;
	public static final BaseHTTPResponse UNKNOWN = new BaseHTTPResponse(-1, "");
	public final int code;
	public final String body;

	public BaseHTTPResponse(int code,String body)
	{
		this.code=code;
		this.body=body;
	}

	@Override
	public String toString() {
		return "BaseHTTPResponse [code=" + code + ", body=" + body + "]";
	}
}
