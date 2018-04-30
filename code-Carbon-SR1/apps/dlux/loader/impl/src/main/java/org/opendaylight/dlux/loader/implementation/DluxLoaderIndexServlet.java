/**
 * Copyright (c) 2014 Inocybe Technologies, and others. All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package org.opendaylight.dlux.loader.implementation;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Preconditions;
import org.opendaylight.dlux.loader.Module;
import org.opendaylight.dlux.loader.exception.DluxLoaderException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class DluxLoaderIndexServlet extends HttpServlet{

    private static final long serialVersionUID = 1L;
    private static Logger logger = LoggerFactory.getLogger(DluxLoaderIndexServlet.class);

    private String DEFINEJS_PROPERTY = "defineJS";

    private String REQUIREJS_PROPERTY = "requireJS";

    private String ANGULARJS_PROPERTY = "angularJS";

    private final String DEFINEJS_START = "var module = [";

    private final String REQUIREJS_START = "var deps = [";

    private final String ANGULARJS_START = "var e = [";

    private final String end = "];";

    private final String COMMA_QUOTE = ",\'";

    private final String QUOTE = "\'";

    private final String NEWLINE = "\n";

    private final DluxLoader loader;

    private final String UTF_CHARSET = "UTF-8";

    private final String JAVASCRIPT_REPLACE_PROPERTY = "javascriptReplaceString";

    private final String CSS_REPLACE_PROPERTY = "cssReplaceString";

    private final String INDEX_HTML_LOC = "index/index.html";

    private final String RESPONSE_CONTENT_TYPE = "text/html";

    private final String CSS_LINK_START = "<link rel=\"stylesheet\" href=\"";

    private final String CSS_LINK_END = "\" />";

    private final Properties prop;

    private final List<String> indexHTML;

    public DluxLoaderIndexServlet(final DluxLoader loader) throws DluxLoaderException {
        Preconditions.checkNotNull(loader, "Loader service can not be null");
        this.loader = loader;
        this.prop = loadProperties();
        this.indexHTML = loadStaticHTML();
    }

    private Properties loadProperties() throws DluxLoaderException {

        Properties prop = new Properties();

        try(InputStream inputStream = DluxLoaderIndexServlet.class.getClassLoader().getResourceAsStream("CommonAppModules.properties")){
            Preconditions.checkNotNull(inputStream, "Could not load the module properties file");
            prop.load(inputStream);

        } catch (IOException e) {
            logger.error("Could not load properties from input stream", e);
            throw new DluxLoaderException("Dlux Loader Servlet initialization failed. ", e);
        }
        return prop;
    }

    private List<String> loadStaticHTML() throws DluxLoaderException{
        List<String> indexHTMLContent = new ArrayList<>();
        try(InputStream indexHTMLStream = DluxLoaderIndexServlet.class.getClassLoader().getResourceAsStream(INDEX_HTML_LOC);
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(indexHTMLStream, UTF_CHARSET))) {
            String line = bufferedReader.readLine();
            while(line != null) {
                indexHTMLContent.add(line);
                line = bufferedReader.readLine();
            }

        } catch (IOException e) {
            logger.error("Could not load index html from input stream", e);
            throw new DluxLoaderException("Dlux Loader Servlet initialization failed. ", e);
        }
        return indexHTMLContent;
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException  {
        String jsReplace = prop.getProperty(JAVASCRIPT_REPLACE_PROPERTY);
        String cssReplace = prop.getProperty(CSS_REPLACE_PROPERTY);
        Preconditions.checkNotNull(jsReplace, "Global requireJS replace string should be present in properties file");
        Preconditions.checkNotNull(cssReplace, "Global css replace string should be present in properties file");
        Preconditions.checkArgument(indexHTML.size() > 0, "HTML file was not loaded properly at servlet initialization");

        StringBuilder inputStringBuilder = new StringBuilder();
        for (String line : this.indexHTML) {
            // add global variables
            if(line.contains(jsReplace)) {
                inputStringBuilder.append(getModulesString());
                inputStringBuilder.append(NEWLINE);
            }

            if(line.contains(cssReplace)) {
                inputStringBuilder.append(getCSSString());
                inputStringBuilder.append(NEWLINE);
            }
            inputStringBuilder.append(line);
            inputStringBuilder.append(NEWLINE);

        }
        response.setContentType(RESPONSE_CONTENT_TYPE);
        PrintWriter out = response.getWriter();
        out.print(inputStringBuilder.toString());
    }

    private String getModulesString() {
        StringBuilder defineJsBuilder = new StringBuilder();
        StringBuilder requireJsBuilder = new StringBuilder();
        StringBuilder angularBuilder = new StringBuilder();
        defineJsBuilder.append(DEFINEJS_START).append(prop.getProperty(DEFINEJS_PROPERTY));
        requireJsBuilder.append(REQUIREJS_START).append(prop.getProperty(REQUIREJS_PROPERTY));
        angularBuilder.append(ANGULARJS_START).append(prop.getProperty(ANGULARJS_PROPERTY));
        for (Module module: loader.getModules()){
            requireJsBuilder.append(COMMA_QUOTE).append(module.getRequireJs()).append(QUOTE);
            angularBuilder.append(COMMA_QUOTE).append(module.getAngularJs()).append(QUOTE);
        }
        defineJsBuilder.append(end).append(NEWLINE);
        requireJsBuilder.append(end).append(NEWLINE);
        angularBuilder.append(end);

        return defineJsBuilder.toString() + requireJsBuilder.toString() + angularBuilder.toString();
    }

    private String getCSSString() {
        StringBuilder cssBuilder = new StringBuilder();
        for(Module module : loader.getModules()) {
            if(module.getCssDependencies() == null) {
                continue;
            }
            for(String cssDependency : module.getCssDependencies()) {
                cssBuilder.append(CSS_LINK_START).append(cssDependency).append(CSS_LINK_END).append(NEWLINE);
            }
        }

        return cssBuilder.toString();
    }

    @VisibleForTesting
    public Properties getProp() {
        return this.prop;
    }

    @VisibleForTesting
    public List<String> getIndexHTML() {
        return indexHTML;
    }
}
