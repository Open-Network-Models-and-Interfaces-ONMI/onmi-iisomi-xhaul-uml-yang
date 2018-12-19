package com.highstreet.technologies.odlux;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
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

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		LOG.debug("get req: " + req.getRequestURI().toString());
		String fn = req.getRequestURI().toString();
		
		URL url = ClassLoaderUtil.getResource(fn, this.getClass());
		String fileContent = this.loadFileContent(url);
		if (fileContent != null) {
			LOG.debug("found file in res. write to output stream");
			resp.setStatus(200);
			OutputStream os=resp.getOutputStream();
			os.write(fileContent.getBytes(java.nio.charset.StandardCharsets.UTF_8));
			os.flush();
		} else {
			LOG.debug("no file found in res.");
			resp.setStatus(404);

		}
	}

	private String loadFileContent(URL url) {
		if(url==null)
			return null;
		StringBuilder sb = new StringBuilder();
		BufferedReader in;
		try {
			in = new BufferedReader(new InputStreamReader(url.openStream()));

			String inputLine;
			while ((inputLine = in.readLine()) != null)
				sb.append(inputLine + LR);
			in.close();
		} catch (IOException e) {
			LOG.warn("could not load resfile " + url.toString() + ": " + e.getMessage());
			return null;
		}

		return sb.toString();
	}

}
