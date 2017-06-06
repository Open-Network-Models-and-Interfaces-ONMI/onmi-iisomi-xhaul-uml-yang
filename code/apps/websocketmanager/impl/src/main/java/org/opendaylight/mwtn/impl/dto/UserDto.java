/*
* Copyright (c) 2016 Wipro Ltd. and others. All rights reserved.
*
* This program and the accompanying materials are made available under the
* terms of the Eclipse Public License v1.0 which accompanies this distribution,
* and is available at http://www.eclipse.org/legal/epl-v10.html
*/

package org.opendaylight.mwtn.impl.dto;

import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.opendaylight.mwtn.impl.utils.Utils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserDto {
    private static final Logger LOG = LoggerFactory.getLogger(UserDto.class);

	private String userId;
	private HashMap<String, Boolean> hmScopes;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String sessionId) {
		this.userId = sessionId;
	}

	public HashMap<String, Boolean> getScopes() {
		return hmScopes;
	}

	public void setScopes(JSONArray jsonScopes) {
		hmScopes = new HashMap<>();
		for (int i = 0; jsonScopes != null && i < jsonScopes.length(); i++) {
			try {
				hmScopes.put(jsonScopes.getString(i), true);
			} catch (JSONException e) {
				LOG.warn("Something wrong: {}", e);
			}
		}
	}

	public JSONObject getScopedResponse(JSONObject jsonAllValue) {
		JSONObject jsonResponse = new JSONObject();
		try {
			JSONArray jsonArrayRes = new JSONArray();
			JSONArray jsonArray = jsonAllValue.getJSONArray(Utils.MSG_KEY_DATA);
			for (int i = 0; jsonArray != null && i < jsonArray.length(); i++) {
				JSONObject jsonObject = jsonArray.getJSONObject(i);
				String msgScope = jsonObject.getString(Utils.MSG_KEY_SCOPE);
				if (getScopes().get(msgScope) != null && getScopes().get(msgScope)) {
					jsonArrayRes.put(jsonObject);
				}
			}
			if (jsonArrayRes.length() == 0) {
				return null;
			}
			jsonResponse.put(Utils.MSG_KEY_DATA, jsonArrayRes);
		} catch (Exception e) {
			LOG.warn("Something wrong: {}", e);
		}
		return jsonResponse;
	}
}
