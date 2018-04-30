package org.opendaylight.mwtn.base.database;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;

public class HtDatabaseUpdateFile extends ZipFile {

	public static final String FILENAME_DEFAULT = "elasticsearch_update.zip";

	public class EsUpdateObject {
		public final String Uri;
		public final String Method;
		public final JSONObject Body;

		public EsUpdateObject(JSONObject o) {
			this.Uri = o.getString("uri");
			this.Method = o.getString("method");
			this.Body = o.getJSONObject("body");
		}
	}

	public interface FileReadCallback {
		void read(EsUpdateObject obj,String filename);

		void onerror(String filename,IOException e);
	}

	private static final Comparator<ZipEntry> byfilenameComparator = new Comparator<ZipEntry>() {

		@Override
		public int compare(ZipEntry o1, ZipEntry o2) {
			return o1.getName().compareTo(o2.getName());
		}
	};

	public HtDatabaseUpdateFile(String filename) throws IOException {
		super(filename);
	}

	private static String readFile(final InputStream s) throws IOException {
		// read file
		BufferedReader in = new BufferedReader(new InputStreamReader(s));
		StringBuilder sb = new StringBuilder();
		String inputLine;
		while ((inputLine = in.readLine()) != null) {
			sb.append(inputLine);
		}
		in.close();
		s.close();
		return sb.toString();
	}

	public boolean readFiles(FileReadCallback cb) {
		boolean r=true;
		Enumeration<? extends ZipEntry> entries = this.entries();
		ArrayList<? extends ZipEntry> list = Collections.list(entries);
		Collections.sort(list, byfilenameComparator);
		for (ZipEntry entry : list) {
			if (entry.isDirectory())
				continue;
			try {
				InputStream stream = this.getInputStream(entry);
				Object data = new JSONTokener(readFile(stream)).nextValue();
				stream.close();
				if(data instanceof JSONArray)
				{
					JSONArray a=(JSONArray)data;
					for(int i=0;i<a.length();i++)
					{
						cb.read(new EsUpdateObject(a.getJSONObject(i)),entry.getName());
					}
				}
				else if(data instanceof JSONObject)
				{
					cb.read(new EsUpdateObject( (JSONObject)data),entry.getName());
				}
			} catch (IOException e) {
				r=false;
				cb.onerror(entry.getName(),e);
			}
		}
		return r;
	}

}
