package com.highstreet.technologies.odlux;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RootServlet extends HttpServlet {

	
	/**
	 * 
	 */
	private static final long serialVersionUID = -2622614831559561459L;
	private static Logger LOG = LoggerFactory.getLogger(RootServlet.class);
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		
		LOG.debug("redirect to index2.html");
		resp.sendRedirect("index2.html");
		super.doGet(req, resp);
	}
}
