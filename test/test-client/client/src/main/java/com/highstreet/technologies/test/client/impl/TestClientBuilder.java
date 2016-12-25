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

import javax.ws.rs.core.MultivaluedHashMap;
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
import org.json.JSONArray;
import org.json.JSONObject;

import com.highstreet.technologies.test.client.api.Attribute;
import com.highstreet.technologies.test.client.api.Builder;
import com.highstreet.technologies.test.client.api.Node;
import com.highstreet.technologies.test.client.api.RestConfServer;
import com.highstreet.technologies.test.client.api.Result;
import com.highstreet.technologies.test.client.api.TestClient;
import com.highstreet.technologies.test.client.api.Value;
import com.highstreet.technologies.test.client.enums.Layer;

public class TestClientBuilder implements Builder<TestClient> {

	private final RestConfServer restConfServer; // required
	private final Node node; // required

	public TestClientBuilder(RestConfServer restConfServer, Node node) {
		this.restConfServer = restConfServer;
		this.node = node;
	}

	public TestClientBuilder(TestClient testClient) {
		this.restConfServer = testClient.getRestConfServer();
		this.node = testClient.getNode();
	}

	private void validateTestClientObject(TestClientImpl testClient) {
		// Do some basic validations to check
		// if TestClient object does not break any assumption of system
		if (testClient.getRestConfServer() == null) {
			throw new IllegalStateException("RestConfServer must be set.");
		}
		if (testClient.getNode() == null) {
			throw new IllegalStateException("Node must be set.");
		}
	}

	@Override
	public TestClient build() {
		TestClientImpl testClient = new TestClientImpl(this);
		validateTestClientObject(testClient);
		return testClient;
	}
	
	private static final class TestClientImpl implements TestClient {

    	// All final attributes
		private final RestConfServer restConfServer; // required
		private final Node node; // required
		

    	private TestClientImpl(TestClientBuilder builder) {
    		this.restConfServer = builder.restConfServer;
    		this.node = builder.node;
    	}

    	private HttpHost getTarget(RestConfServer server) {
            return new HttpHost(server.getIpAddress(), server.getPort(), server.getScheme().toString());
    	}
    	
    	private CloseableHttpClient getRestConfClient(RestConfServer server) {
            HttpHost target = getTarget(server);
            
            CredentialsProvider credsProvider = new BasicCredentialsProvider();
            credsProvider.setCredentials(
                    new AuthScope(target.getHostName(), target.getPort()),
                    new UsernamePasswordCredentials(server.getUser(), server.getPassword()));

            // Create AuthCache instance
            AuthCache authCache = new BasicAuthCache();
            // Generate BASIC scheme object and add it to the local
            // auth cache
            BasicScheme basicAuth = new BasicScheme();
            authCache.put(this.getTarget(server), basicAuth);

            // Add AuthCache to the execution context
            HttpClientContext localContext = HttpClientContext.create();
            localContext.setAuthCache(authCache);

            return HttpClients.custom()
                    .setDefaultCredentialsProvider(credsProvider)
                    .build();
    		
    	}

    	private JSONObject getObject(Attribute attribute) {

    		CloseableHttpClient httpclient = this.getRestConfClient(this.restConfServer);

    		try {

                String pathTemplate = "/restconf/operational/network-topology:network-topology/topology/topology-netconf/node/%1s/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:%2s/%3s/%4s";
                String path = String.format(pathTemplate, this.node.getNodeId(), attribute.getConditionalPackage(), attribute.getLayerProtocol(), attribute.getSubObjectClass());
            	
                URI uri = new URIBuilder(getTarget(this.restConfServer).toURI())
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
		public Result get(Attribute attribute) {

    		CloseableHttpClient httpclient = this.getRestConfClient(this.restConfServer);

    		String pathTemplate = "/restconf/operational/network-topology:network-topology/topology/topology-netconf/node/%1s/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:%2s/%3s/%4s";
            String path = String.format(pathTemplate, node.getNodeId(), attribute.getConditionalPackage(), attribute.getLayerProtocol(), attribute.getSubObjectClass());
            
            try {
            	
                URI uri = new URIBuilder(this.getTarget(this.restConfServer).toURI())
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
    			JSONObject subObject = jsonResult.getJSONObject(attribute.getSubObjectClass().toString());
    			Object val = subObject.get(attribute.getAttribute());
    			
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
		public Result set(Attribute attribute, Value<?> value) {
			
    		CloseableHttpClient httpclient = this.getRestConfClient(this.restConfServer);

    		JSONObject newValue = this.getObject(attribute);
			newValue.getJSONObject(attribute.getSubObjectClass().toString()).put(attribute.getAttribute(), value.getValue());
			
			String pathTemplate = "/restconf/config/network-topology:network-topology/topology/topology-netconf/node/%1s/yang-ext:mount/MicrowaveModel-ObjectClasses-AirInterface:%2s/%3s/%4s";
            String path = String.format(pathTemplate, this.node.getNodeId(), attribute.getConditionalPackage(), attribute.getLayerProtocol(), attribute.getSubObjectClass());
	        
			try {
	        	
	            URI uri = new URIBuilder(this.getTarget(this.restConfServer).toURI())
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

		@Override
		public RestConfServer getRestConfServer() {
			return this.restConfServer;
		}

		@Override
		public Node getNode() {
			return this.node;
		}

		@Override
		public MultivaluedHashMap<Layer, String> getLayerProtocolIds() {
			CloseableHttpClient httpclient = this.getRestConfClient(this.restConfServer);
	        
			try {
	            String pathTemplate = "/restconf/operational/network-topology:network-topology/topology/topology-netconf/node/%1s/yang-ext:mount/CoreModel-CoreNetworkModule-ObjectClasses:NetworkElement";
	            String path = String.format(pathTemplate, node.getNodeId());
	        	
	            URI uri = new URIBuilder(this.getTarget(this.restConfServer).toURI())
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
				JSONObject onfNetworkElement = httpclient.execute(httpget, responseHandler);
				JSONArray ltpLists = onfNetworkElement
						.getJSONObject("NetworkElement")
						.getJSONArray("_ltpRefList");
				
				MultivaluedHashMap<Layer, String> result = new MultivaluedHashMap<Layer, String>();
				for (int i = 0; i < ltpLists.length(); i++) {
				    JSONObject item = ltpLists
				    		.getJSONObject(i)
				    		.getJSONArray("_lpList")
				    		.getJSONObject(0);
					Layer layer = Layer.AIRINTERFACE;
					switch (item.get("layerProtocolName").toString()) {
					case "MWPS": layer = Layer.AIRINTERFACE; break;
					case "MWS": layer = Layer.STRUCTURE; break;
					case "ETH-CTP": layer = Layer.CONTAINER; break;
					}
					result.add(layer, item.get("uuid").toString());				
				}
				return result;
				
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
}
