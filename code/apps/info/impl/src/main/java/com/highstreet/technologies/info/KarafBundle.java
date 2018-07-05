package com.highstreet.technologies.info;

import org.json.JSONObject;

public class KarafBundle implements CharSequence
{
	@Override
	public String toString() {
		return this.json;
	}

	public final int id;
	public final String name;//: OPS4J Pax Swissbox :: OSGi Core
	public final String symbolicName;//: org.ops4j.pax.swissbox.core
	public final String vendor;//: OPS4J - Open Participation Software for Java
	public final String version;//: 1.8.2
	private final String json;
	public KarafBundle(int id,String name,String symbName,String vendor,String version)
	{
		this.id=id;this.name=name;this.symbolicName=symbName;this.vendor=vendor;this.version=version;
		this.json=this.toJSON();
	}
	public String toJSON()
	{
		JSONObject o=new JSONObject();
		o.put("id", this.id);
		o.put("name", this.name);
		o.put("symbolicName", this.symbolicName);
		o.put("vendor", this.vendor);
		o.put("version",this.version);
		return o.toString();
	}
	@Override
	public char charAt(int arg0) {
		return json.charAt(arg0);
	}
	@Override
	public int length() {
		return json.length();
	}
	@Override
	public CharSequence subSequence(int arg0, int arg1) {
		return json.subSequence(arg0, arg1);
	}

}
