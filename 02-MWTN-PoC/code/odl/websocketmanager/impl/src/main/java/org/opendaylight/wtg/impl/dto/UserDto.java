package org.opendaylight.wtg.impl.dto;

import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.opendaylight.wtg.impl.utils.Utils;

public class UserDto {
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
		hmScopes = new HashMap<String, Boolean>();
		for (int i = 0; jsonScopes != null && i < jsonScopes.length(); i++) {
			try {
				hmScopes.put(jsonScopes.getString(i), true);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
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
			e.printStackTrace();
		}
		return jsonResponse;
	}
}
