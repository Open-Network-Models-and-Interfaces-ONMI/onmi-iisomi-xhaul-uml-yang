package org.opendaylight.mwtn.base.internalTypes;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class TemplateFile {

	protected final HashMap<String, Object> mKeyValuePairs;
	private final String mContent;

	public TemplateFile(String content)
	{
		this.mKeyValuePairs = new HashMap<>();
		this.mContent=content;

	}
	public TemplateFile(File f) throws IOException {
		this.mKeyValuePairs = new HashMap<>();
		BufferedReader br = new BufferedReader(new FileReader(f));
		StringBuilder sb = new StringBuilder();
		String line = br.readLine();

		while (line != null) {
			sb.append(line);
			line = br.readLine();
		}
		this.mContent = sb.toString();
		br.close();
	}

	public void addValue(String key, Object value) {
		this.mKeyValuePairs.put(key, value);
	}

	public void removeValue(String key) {
		this.mKeyValuePairs.remove(key);
	}

	private String replace() {
		String s=this.mContent;
		String key;
		Object value;
		for (Map.Entry<String, Object> entry : this.mKeyValuePairs.entrySet()) {
		    key = entry.getKey();
		    value = entry.getValue();
		    if(value!=null)
		    	s=s.replace(key, value.toString());
		}
		return s;
	}

	@Override
	public String toString() {
		return this.replace();
	}

}
