package com.highstreet.technologies.odlux;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.opensymphony.xwork2.util.ClassLoaderUtil;

public class ResFilesServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6807215213921798293L;
	private static final String LR = "\n";
	private static Logger LOG = LoggerFactory.getLogger(ResFilesServlet.class);
	private static final String regexRequire = "require\\(\\[(\"app\")\\]";
	private static final String regexFunction = "function[\\ ]*\\((app)\\)[\\ ]*\\{";
	private static final String regexFunctionBody = "(app\\(\\\"\\.\\/app\\.tsx\\\"\\))";
	private static final Pattern patternRequire = Pattern.compile(regexRequire);
	private static final Pattern patternFunction = Pattern.compile(regexFunction);
	private static final Pattern patternFunctionBody = Pattern.compile(regexFunctionBody);

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		LOG.debug("get req: " + req.getRequestURI().toString());
		String fn = req.getRequestURI().toString();

		URL url = ClassLoaderUtil.getResource(fn, this.getClass());
		String fileContent = this.loadFileContent(url);
		if (fileContent != null) {
			LOG.debug("found file in res. write to output stream");
			resp.setStatus(200);
			OutputStream os = resp.getOutputStream();
			os.write(fileContent.getBytes(java.nio.charset.StandardCharsets.UTF_8));
			os.flush();
		} else {
			LOG.debug("no file found in res.");
			resp.setStatus(404);

		}
	}

	private List<String> getLoadedBundles() {
		List<String> bundles = new ArrayList<String>();
		bundles.add("app");
		bundles.add("connectApp");
		bundles.add("faultApp");
		bundles.add("inventoryApp");

		return bundles;
	}

	public String loadFileContent(URL url) {
		if (url == null)
			return null;
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

}
