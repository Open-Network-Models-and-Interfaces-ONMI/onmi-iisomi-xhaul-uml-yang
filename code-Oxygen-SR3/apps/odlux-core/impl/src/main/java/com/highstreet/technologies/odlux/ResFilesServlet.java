package com.highstreet.technologies.odlux;

import java.io.IOException;
import java.io.OutputStream;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.highstreet.technologies.odlux.IndexOdluxBundle;
import com.highstreet.technologies.odlux.api.bundles.OdluxBundle;
import com.highstreet.technologies.odlux.api.bundles.OdluxBundleLoaderImpl;

public class ResFilesServlet extends HttpServlet{

	/**
	 * 
	 */
	private static final long serialVersionUID = -6807215213921798293L;
	private static Logger LOG = LoggerFactory.getLogger(ResFilesServlet.class);
	private final IndexOdluxBundle indexBundle;
	public ResFilesServlet() {
		super();
		indexBundle = new IndexOdluxBundle();
		OdluxBundleLoaderImpl.getInstance();
	}
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		LOG.debug("get req: " + req.getRequestURI().toString());
		String fn = req.getRequestURI().toString();
		String fileContent=null;
		if(indexBundle.hasResource(fn))
		{
			fileContent = indexBundle.getResourceFileContent(fn);
		}
		else
		{
			LOG.debug("not found in framework res. try to find in applications");
			for(OdluxBundle b:OdluxBundleLoaderImpl.getInstance().getBundles())
			{
				if(b.hasResource(fn))
				{
					LOG.debug("found res in "+b.getBundleName());
					fileContent = b.getResourceFileContent(fn);
					break;
				}
			}
		}
		if (fileContent != null) {
			LOG.debug("found "+fn+" in res. write to output stream");
			resp.setStatus(200);
			OutputStream os = resp.getOutputStream();
			os.write(fileContent.getBytes(java.nio.charset.StandardCharsets.UTF_8));
			os.flush();
		} else {
			LOG.debug("file "+fn+" not found in res.");
			resp.setStatus(404);

		}
	}
	public String loadFileContent(String filename) {
		return this.indexBundle.getResourceFileContent(filename);
	}

	

	


}
