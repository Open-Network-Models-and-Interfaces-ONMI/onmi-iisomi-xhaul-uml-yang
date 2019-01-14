package com.highstreet.technologies.odlux;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.highstreet.technologies.odlux.api.bundles.OdluxBundle;
import com.highstreet.technologies.odlux.api.bundles.OdluxBundleLoaderImpl;

public class IndexOdluxBundle extends OdluxBundle{
	
	private static final String LR = "\n";
	private static Logger LOG = LoggerFactory.getLogger(IndexOdluxBundle.class);
	private static final String regexRequire = "require\\(\\[(\"app\")\\]";
	private static final String regexFunction = "function[\\ ]*\\((app)\\)[\\ ]*\\{";
	private static final String regexFunctionBody = "(app\\(\\\"\\.\\/app\\.tsx\\\"\\))";
	private static final Pattern patternRequire = Pattern.compile(regexRequire);
	private static final Pattern patternFunction = Pattern.compile(regexFunction);
	private static final Pattern patternFunctionBody = Pattern.compile(regexFunctionBody);
	
	public IndexOdluxBundle() {
		super(null,"app");
	}
	@Override
	protected String loadFileContent(URL url) {
		if (url == null)
			return null;
		LOG.debug("try to load res "+url.toString());
		StringBuilder sb = new StringBuilder();
		Matcher matcher;
		BufferedReader in;
		try {
			in = new BufferedReader(new InputStreamReader(url.openStream()));

			String inputLine;
			List<String> bundles = this.getLoadedBundles();
			while ((inputLine = in.readLine()) != null) {
				if (url.getFile().endsWith("index.html")) {
					matcher = patternRequire.matcher(inputLine);
					if (matcher.find()) {
						inputLine = inputLine.substring(0, matcher.start(1)) + "\""+String.join("\",\"", bundles)+ "\""
								+ inputLine.substring(matcher.end(1) );
					}
					matcher = patternFunction.matcher(inputLine);
					if(matcher.find())
					{
						inputLine = inputLine.substring(0, matcher.start(1)) +String.join(",", bundles)
								+ inputLine.substring(matcher.end(1));
					}
					matcher=patternFunctionBody.matcher(inputLine);
					if(matcher.find())
					{
						String hlp="";
						for(String bundle:bundles) {
							if(!bundle.equals("app"))
								hlp+=bundle+".register();\n";
						}
						inputLine = inputLine.substring(0, matcher.start(1)) +hlp + inputLine.substring(matcher.start(1));
					}
				}
				sb.append(inputLine + LR);
			}
			in.close();
		} catch (IOException e) {
			LOG.warn("could not load resfile " + url.toString() + ": " + e.getMessage());
			return null;
		}

		return sb.toString();
	}
	private List<String> getLoadedBundles() {
		List<String> list = new ArrayList<String>();
		list.add(this.getBundleName());
		for(OdluxBundle b:OdluxBundleLoaderImpl.getInstance().getBundles())
		{
			list.add(b.getBundleName());
		}
		return list;
	}
}
