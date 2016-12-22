/*
 * Copyright (c) 2016 highstreet technologies GmbH and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */

package com.highstreet.technologies.test.client.impl;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.AuthCache;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.auth.BasicScheme;
import org.apache.http.impl.client.BasicAuthCache;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import com.highstreet.technologies.test.client.api.Address;
import com.highstreet.technologies.test.client.api.Attribute;
import com.highstreet.technologies.test.client.api.Node;
import com.highstreet.technologies.test.client.api.RestConfServer;
import com.highstreet.technologies.test.client.api.Result;
import com.highstreet.technologies.test.client.api.Value;
import com.highstreet.technologies.test.client.builder.ResultBuilder;
import com.highstreet.technologies.test.client.builder.ValueBuilder;

public class TestClient implements com.highstreet.technologies.test.client.api.TestClient {

	private JSONObject getObject(Address address) {
		
		RestConfServer rcs = address.getRestConfServer();
        HttpHost target = new HttpHost(rcs.getIpAddress(), rcs.getPort(), rcs.getScheme().toString());
        
        CredentialsProvider credsProvider = new BasicCredentialsProvider();
        credsProvider.setCredentials(
                new AuthScope(target.getHostName(), target.getPort()),
                new UsernamePasswordCredentials(rcs.getUser(), rcs.getPassword()));
        CloseableHttpClient httpclient = HttpClients.custom()
                .setDefaultCredentialsProvider(credsProvider)
                .build();
        
		try {
            // Create AuthCache instance
            AuthCache authCache = new BasicAuthCache();
            // Generate BASIC scheme object and add it to the local
            // auth cache
            BasicScheme basicAuth = new BasicScheme();
            authCache.put(target, basicAuth);

            // Add AuthCache to the execution context
            HttpClientContext localContext = HttpClientContext.create();
            localContext.setAuthCache(authCache);
            
            Node node = address.getNode();
            Attribute attribute = address.getAttribute();
            String pathTemplate = "/restconf/operational/network-topology:network-topology/topology/topology-netconf/node/%1s/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:%2s/%3s/%4s";
            String path = String.format(pathTemplate, node.getNodeId(), attribute.getConditionalPackage(), attribute.getLayerProtocol(), attribute.getSubObjectClass());
        	
            URI uri = new URIBuilder(target.toURI())
            		.setPath(path)
            		.build();
            HttpGet httpget = new HttpGet(uri);
            httpget.setHeader("Content-Type", "application/json");
            httpget.setHeader("Accept", "application/json");

			// Create a custom response handler
			ResponseHandler<JSONObject> responseHandler = new ResponseHandler<JSONObject>() {

				@Override
				public JSONObject handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
					int status = response.getStatusLine().getStatusCode();
					if (status >= 200 && status < 300) {
						HttpEntity entity = response.getEntity();
						return new JSONObject(EntityUtils.toString(entity));
					} else {
						return new JSONObject();
					}
				}

			};
			return httpclient.execute(httpget, responseHandler);
			
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (URISyntaxException e) {
			e.printStackTrace();
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return null;
	}

	@Override
	public Result get(Address address) {
		
		RestConfServer rcs = address.getRestConfServer();
        HttpHost target = new HttpHost(rcs.getIpAddress(), rcs.getPort(), rcs.getScheme().toString());
        
        CredentialsProvider credsProvider = new BasicCredentialsProvider();
        credsProvider.setCredentials(
                new AuthScope(target.getHostName(), target.getPort()),
                new UsernamePasswordCredentials(rcs.getUser(), rcs.getPassword()));
        CloseableHttpClient httpclient = HttpClients.custom()
                .setDefaultCredentialsProvider(credsProvider)
                .build();
        
		try {
            // Create AuthCache instance
            AuthCache authCache = new BasicAuthCache();
            // Generate BASIC scheme object and add it to the local
            // auth cache
            BasicScheme basicAuth = new BasicScheme();
            authCache.put(target, basicAuth);

            // Add AuthCache to the execution context
            HttpClientContext localContext = HttpClientContext.create();
            localContext.setAuthCache(authCache);

            // LP-MWPS-ifIndex2
            // /restconf/operational/network-topology:network-topology/topology/topology-netconf/node/Ceragon-11/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:MW_AirInterface_Pac/LP-MWPS-ifIndex2/airInterfaceConfiguration
            
            Node node = address.getNode();
            Attribute attribute = address.getAttribute();
            String pathTemplate = "/restconf/operational/network-topology:network-topology/topology/topology-netconf/node/%1s/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:%2s/%3s/%4s";
            String path = String.format(pathTemplate, node.getNodeId(), attribute.getConditionalPackage(), attribute.getLayerProtocol(), attribute.getSubObjectClass());
        	
            URI uri = new URIBuilder(target.toURI())
            		.setPath("/restconf/operational/network-topology:network-topology/topology/topology-netconf/node/Ceragon-11")
            		.setPath("/restconf/operational/network-topology:network-topology/topology/topology-netconf/node/Ceragon-11/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement")
            		.setPath(path)
            		.build();
            HttpGet httpget = new HttpGet(uri);
            httpget.setHeader("Content-Type", "application/json");
            httpget.setHeader("Accept", "application/json");

			// Create a custom response handler
			ResponseHandler<Result> responseHandler = new ResponseHandler<Result>() {

				@Override
				public Result handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
					int status = response.getStatusLine().getStatusCode();
					if (status >= 200 && status < 300) {
						HttpEntity entity = response.getEntity();
						Value<?> value;
						if (entity != null) {
							value= new ValueBuilder(EntityUtils.toString(entity)).build();
						} else {
							value= new ValueBuilder(null).build();
						}
						return new ResultBuilder()
							.setStatus(status)
							.setMessage(response.getStatusLine().getReasonPhrase())
							.setValue(value)
							.build();
					} else {
						return new ResultBuilder()
							.setStatus(status)
							.setMessage(response.getStatusLine().getReasonPhrase())
							.build();
					}
				}

			};

			Result initResult = httpclient.execute(httpget, responseHandler);
			JSONObject json = new JSONObject(initResult.getValue().toJsonString());
			String jsonString = (String) json.get("value");
			JSONObject jsonResult = new JSONObject(jsonString);
			JSONObject subObject = jsonResult.getJSONObject(address.getAttribute().getSubObjectClass().toString());
			Object val = subObject.get(address.getAttribute().getAttribute());
			
			return new ResultBuilder(initResult)
					.setValue(new ValueBuilder(val).build())
					.build();
			
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (URISyntaxException e) {
			e.printStackTrace();
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return null;
	}

	@Override
	public Result set(Address address, Value<?> value) {
		
        Node node = address.getNode();
        Attribute attribute = address.getAttribute();
        
		JSONObject newValue = this.getObject(address);
		newValue.getJSONObject(attribute.getSubObjectClass().toString()).put(attribute.getAttribute(), value.getValue());
		
		
		RestConfServer rcs = address.getRestConfServer();
        HttpHost target = new HttpHost(rcs.getIpAddress(), rcs.getPort(), rcs.getScheme().toString());
        
        CredentialsProvider credsProvider = new BasicCredentialsProvider();
        credsProvider.setCredentials(
                new AuthScope(target.getHostName(), target.getPort()),
                new UsernamePasswordCredentials(rcs.getUser(), rcs.getPassword()));
        CloseableHttpClient httpclient = HttpClients.custom()
                .setDefaultCredentialsProvider(credsProvider)
                .build();
        
		try {
            // Create AuthCache instance
            AuthCache authCache = new BasicAuthCache();
            // Generate BASIC scheme object and add it to the local
            // auth cache
            BasicScheme basicAuth = new BasicScheme();
            authCache.put(target, basicAuth);

            // Add AuthCache to the execution context
            HttpClientContext localContext = HttpClientContext.create();
            localContext.setAuthCache(authCache);

            String pathTemplate = "/restconf/config/network-topology:network-topology/topology/topology-netconf/node/%1s/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:%2s/%3s/%4s";
            String path = String.format(pathTemplate, node.getNodeId(), attribute.getConditionalPackage(), attribute.getLayerProtocol(), attribute.getSubObjectClass());
        	
            URI uri = new URIBuilder(target.toURI())
            		.setPath(path)
            		.build();
            HttpPut  httpPut = new HttpPut(uri);
            httpPut.setHeader("Content-Type", "application/json");
            httpPut.setHeader("Accept", "application/json");
            StringEntity params = new StringEntity(newValue.toString(),"UTF-8");
            params.setContentType("application/json");
            httpPut.setEntity(params);
            
			// Create a custom response handler
			ResponseHandler<Result> responseHandler = new ResponseHandler<Result>() {

				@Override
				public Result handleResponse(final HttpResponse response) throws ClientProtocolException, IOException {
					int status = response.getStatusLine().getStatusCode();
					if (status >= 200 && status < 300) {
						HttpEntity entity = response.getEntity();
						Value<?> value;
						if (entity != null) {
							value= new ValueBuilder(EntityUtils.toString(entity)).build();
						} else {
							value= new ValueBuilder(null).build();
						}
						return new ResultBuilder()
							.setStatus(status)
							.setMessage(response.getStatusLine().getReasonPhrase())
							.setValue(value)
							.build();
					} else {
						return new ResultBuilder()
							.setStatus(status)
							.setMessage(response.getStatusLine().getReasonPhrase())
							.build();
					}
				}

			};

			return httpclient.execute(httpPut, responseHandler);
			
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (URISyntaxException e) {
			e.printStackTrace();
		} finally {
			try {
				httpclient.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return null;
	}

}
