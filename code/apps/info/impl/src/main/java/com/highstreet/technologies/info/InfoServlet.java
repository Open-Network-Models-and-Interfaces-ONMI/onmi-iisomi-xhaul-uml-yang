package com.highstreet.technologies.info;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.nio.file.Path;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;
import org.apache.commons.compress.compressors.gzip.GzipCompressorOutputStream;
import org.apache.commons.compress.utils.IOUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class InfoServlet extends HttpServlet {

	private static Logger LOG = LoggerFactory.getLogger(InfoServlet.class);
	private static final String BASEURI = "/info";
	private static final String AKKACONF_FILENAME = "configuration/initial/akka.conf";
	private static final String GEOCONF_FILENAME = "configuration/initial/geo.conf";
	private static final String DATABASECONF_FILENAME = "etc/elasticsearch.yml";
	private static final String DEVMGRCONF_FILENAME = "etc/devicemanager.properties";
	private static final String KARAFLOG_FILENAME = "etc/org.ops4j.pax.logging.cfg";
	private static final String KARAFLOG_FOLDER = "data/log/";
	private static final String BUNDLE_FOLDER = "data/cache/org.eclipse.osgi/bundles";

	private static final String VERSIONTXT_FILENAME = "etc/version.txt";
	private static final String KARAFLOG_TARGZ = "data/log/karaflog.tar.gz";
	private static final String CHARSET = "UTF-8";
	private final Path basePath;

	public InfoServlet() {
		this.basePath = new File("/html").toPath();
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		String uri = URLDecoder.decode(req.getRequestURI().substring(BASEURI.length()), "UTF-8");
		LOG.debug("handle get request for uri="+uri);
		if (uri.startsWith("/"))
			uri = uri.substring(1);
		if(uri.startsWith("api/"))
		{
			uri = uri.substring("api/".length());
			if (uri.startsWith("data/")) {
				uri = uri.substring("data/".length());
				this.doGetDataRequest(uri, req, resp);
			}
		}
		else
		{
			Path p = basePath.resolve(uri);
			LOG.debug("try to find file:"+p.toString());
			URL resurl = this.getClass().getResource(p.toString());
			if (resurl != null)// resource file found
			{
				if (this.isHTMLFile(resurl)) {
					LOG.debug("filetype: html");
					resp.setHeader("Content-Type", "text/html");
					resp.setHeader("charset", "utf-8");
				} else if (this.isJavascript(resurl)) {
					LOG.debug("filetype: js");
					resp.setHeader("Content-Type", "application/javascript");
					resp.setHeader("charset", "utf-8");
				} else if (this.isStylesheet(resurl)) {
					LOG.debug("filetype: css");
					resp.setHeader("Content-Type", "text/css");
					resp.setHeader("charset", "utf-8");
				} else if (this.isTextFile(resurl)) {
					LOG.debug("filetype: text");
					resp.setHeader("Content-Type", "application/text");
					resp.setHeader("charset", "utf-8");
				} else if (this.isImageFile(resurl)) {
					LOG.debug("filetype: image");
					resp.setHeader("Content-Type", "image/*");
				} else if (this.ispdf(resurl)) {
					LOG.debug("filetype: pdf");
					resp.setHeader("Content-Type", "application/pdf");
				} else {
					LOG.debug("unknown file type request");
					resp.setStatus(404);
					return;
				}
				try (InputStream in = this.getClass().getResourceAsStream(p.toString())) {
					OutputStream out = resp.getOutputStream();
					byte[] buffer = new byte[1024];
					int len;
					while ((len = in.read(buffer)) != -1) {
						out.write(buffer, 0, len);
					}
					in.close();
					out.flush();
					out.close();
				}

			} else // resource file not found
			{
				LOG.debug("resource file not found");
				resp.setStatus(404);
			}
		}
	}

	private void doGetDataRequest(String uri, HttpServletRequest req, HttpServletResponse resp) {
		switch(uri)
		{
		case "log.download":
			try {
				this.writeFileStream(KARAFLOG_TARGZ, resp, "application/x-gzip",true);
			} catch (Exception e) {
				LOG.warn("problem reading " + KARAFLOG_TARGZ + ": " + e.getMessage());
				resp.setStatus(500);
			}
			break;
		}

	}

	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String uri = URLDecoder.decode(req.getRequestURI().substring(BASEURI.length()), "UTF-8");
		LOG.debug("handle get request for uri="+uri);
		if (uri.startsWith("/"))
			uri = uri.substring(1);
		if (uri.startsWith("api/")) {
			uri = uri.substring("api/".length());
			if (uri.startsWith("data/")) {
				uri = uri.substring("data/".length());
				this.doPostDataRequest(uri, req, resp);
			} else if (uri.startsWith("task/")) {
				uri = uri.substring("task/".length());
				this.doPostTaskRequest(uri, req, resp);
			} else {
				resp.setStatus(404);
			}

		} else
		{
			LOG.debug("unknown uri to handle");
			resp.setStatus(404);
		}
	}

	private void doPostTaskRequest(String uri, HttpServletRequest req, HttpServletResponse resp) {
		switch(uri)
		{
		case "dbbackup.create":
			try {
				resp.getOutputStream().write("not yet supported".getBytes());
			} catch (IOException e) {

			}
			break;
		case "dbbackup.restore":
			try {
				resp.getOutputStream().write("not yet supported".getBytes());
			} catch (IOException e) {

			}
			break;
		default:
			resp.setStatus(404);
			break;
		}

	}

	private void doPostDataRequest(String uri, HttpServletRequest req, HttpServletResponse resp) {
		String acceptFormat=req.getHeader("Accept");
		switch (uri) {
		case "akka.conf":
			try {
				this.writeFileStream(AKKACONF_FILENAME, resp);
			} catch (Exception e) {
				LOG.warn("problem reading " + AKKACONF_FILENAME + ": " + e.getMessage());
				resp.setStatus(500);
			}
			break;
		case "geo.conf":
			try {
				this.writeFileStream(GEOCONF_FILENAME, resp);
			} catch (Exception e) {
				LOG.warn("problem reading " + GEOCONF_FILENAME + ": " + e.getMessage());
				resp.setStatus(500);

			}
			break;
		case "devmgr.prop":
			try {
				this.writeFileStream(DEVMGRCONF_FILENAME, resp);
			} catch (Exception e) {
				LOG.warn("problem reading " + DEVMGRCONF_FILENAME + ": " + e.getMessage());
				resp.setStatus(500);

			}
			break;
		case "es.yml":
			try {
				this.writeFileStream(DATABASECONF_FILENAME, resp);
			} catch (Exception e) {
				LOG.warn("problem reading " + DATABASECONF_FILENAME + ": " + e.getMessage());
				resp.setStatus(500);

			}
			break;
		case "log.prop":
			try {
				this.writeFileStream(KARAFLOG_FILENAME, resp);
			} catch (Exception e) {
				LOG.warn("problem reading " + KARAFLOG_FILENAME + ": " + e.getMessage());
				resp.setStatus(500);

			}
			break;
		case "bundle.list":
			try
			{
				KarafBundleList list=new KarafBundleList(BUNDLE_FOLDER);
				list.scan();
				this.writeOutput(list.toJSON(),resp, "application/json");
			}
			catch(IOException e)
			{
				LOG.warn("problem reading bundlelist: " + e.getMessage());
				resp.setStatus(500);
			}
		case "log.download":
			try {
				this.createLogDownload(KARAFLOG_TARGZ);
				this.writeFileStream(KARAFLOG_TARGZ, resp, "application/x-gzip",true);
			} catch (Exception e) {
				LOG.warn("problem reading " + KARAFLOG_TARGZ + ": " + e.getMessage());
				resp.setStatus(500);
			}
			break;

		default:
			resp.setStatus(404);
			break;
		}
	}

	private void writeOutput(String str, HttpServletResponse resp) throws IOException
	{
		this.writeOutput(str,resp,"text/plain");
	}
	private void writeOutput(String str, HttpServletResponse resp, String contentType) throws IOException
	{
		this.writeOutput(str,resp,contentType,null);
	}
	private void writeOutput(String str, HttpServletResponse resp, String contentType,String asDownloadFilename) throws IOException{
		OutputStream out = resp.getOutputStream();
		if (contentType != null)
			resp.setHeader("Content-Type", contentType);
		if(asDownloadFilename!=null)
			resp.setHeader("Content-Disposition","inline; filename=\""+asDownloadFilename+"\"");
		byte[] buffer = new byte[1024];
		int len;
		out.write(str.getBytes(CHARSET));
		out.flush();
		out.close();
	}

	private void createLogDownload(String tarFilename) {
		LOG.debug("start creating tar file "+tarFilename);
		File f = new File(tarFilename);
		if (f.exists())
			f.delete();
		FileOutputStream fOut = null;
		BufferedOutputStream bOut = null;
		GzipCompressorOutputStream gzOut = null;
		TarArchiveOutputStream tOut = null;
		try {
		//	System.out.println(new File(".").getAbsolutePath());
			fOut = new FileOutputStream(new File(tarFilename));
			bOut = new BufferedOutputStream(fOut);
			gzOut = new GzipCompressorOutputStream(bOut);
			tOut = new TarArchiveOutputStream(gzOut);
			this.addFileToTarGz(tOut, KARAFLOG_FOLDER, "", ".log");
		} catch (IOException e) {
			LOG.warn("problem creating tar:" + e.getMessage());
		} finally {
			try {
				if (tOut != null) {
					tOut.finish();
					tOut.close();
				}
				if (gzOut != null)
					gzOut.close();
				if (bOut != null)
					bOut.close();
				if (fOut != null)
					fOut.close();
				LOG.debug("finished creating tar file");
			} catch (IOException e) {
				LOG.warn("problem closing streams:" + e.getMessage());
			}
		}

	}

	private void addFileToTarGz(TarArchiveOutputStream tOut, String path, String base, final String filter)
			throws IOException {
		File f = new File(path);
		String entryName = base + f.getName();
		TarArchiveEntry tarEntry = new TarArchiveEntry(f, entryName);
		tOut.putArchiveEntry(tarEntry);

		if (f.isFile())
		{
			if( f.getName().contains(filter)) {
				LOG.debug("adding to tar:"+f.getName());
				IOUtils.copy(new FileInputStream(f), tOut);
				tOut.closeArchiveEntry();
			}
			else
				LOG.debug("file "+f.getName()+" filtered out, filter="+filter);
		} else {
			tOut.closeArchiveEntry();
			File[] children = f.listFiles();
			if (children != null) {
				for (File child : children) {
					addFileToTarGz(tOut, child.getAbsolutePath(), entryName + "/", filter);
				}
			}
		}
	}

	private void writeFileStream(String filename, HttpServletResponse resp) throws IOException {
		this.writeFileStream(filename, resp, null);
	}
	private void writeFileStream(String filename, HttpServletResponse resp,String contentType) throws IOException {
		this.writeFileStream(filename, resp, contentType,false);
	}
	private void writeFileStream(String filename, HttpServletResponse resp, String contentType,boolean asDownload) throws IOException {
		File file=new File(filename);
		if(!file.exists())
		{
			LOG.debug("unable to write filestream to http. file not found: "+filename);
			resp.setStatus(404);
			return;
		}
		LOG.debug("write file "+filename+" to http with content-type "+contentType);
		InputStream in = new FileInputStream(file);
		OutputStream out = resp.getOutputStream();
		if (contentType != null)
			resp.setHeader("Content-Type", contentType);
		if(asDownload)
			resp.setHeader("Content-Disposition","inline; filename=\""+file.getName()+"\"");
		byte[] buffer = new byte[1024];
		int len;
		while ((len = in.read(buffer)) != -1) {
			out.write(buffer, 0, len);
		}
		in.close();
		out.flush();
		out.close();
	}

	private boolean isHTMLFile(URL url) {
		return url != null ? (url.toString().endsWith("html") || url.toString().endsWith("htm")) : false;
	}

	private boolean isTextFile(URL url) {
		return url != null ? this.isTextFile(url.toString()) : false;
	}

	private boolean ispdf(URL url) {
		return url != null ? this.ispdf(url.toString()) : false;
	}

	private boolean isImageFile(URL url) {
		return url != null ? this.isImageFile(url.toString()) : false;
	}

	private boolean ispdf(File f) {
		return f != null ? this.ispdf(f.getName()) : false;
	}

	private boolean ispdf(String name) {
		return name != null ? name.toLowerCase().endsWith("pdf") : false;
	}

	private boolean isImageFile(File f) {
		return f != null ? this.isImageFile(f.getName()) : false;
	}

	private boolean isImageFile(String name) {

		return name != null
				? (name.toLowerCase().endsWith("png") || name.toLowerCase().endsWith("jpg")
						|| name.toLowerCase().endsWith("jpeg") || name.toLowerCase().endsWith("svg")
						|| name.toLowerCase().endsWith("eps"))
				: false;
	}

	private boolean isTextFile(File f) {
		return f != null ? this.isTextFile(f.getName()) : false;

	}

	private boolean isJavascript(URL url) {
		return url != null ? url.toString().endsWith("js") : false;
	}

	private boolean isStylesheet(URL url) {
		return url != null ? url.toString().endsWith("css") : false;
	}

	private boolean isTextFile(String name) {
		return name != null
				? (name.toLowerCase().endsWith("md") || name.toLowerCase().endsWith("txt")
						|| name.toLowerCase().endsWith("map"))
				: false;
	}

}