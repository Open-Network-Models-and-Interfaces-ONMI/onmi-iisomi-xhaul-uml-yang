package com.highstreet.technologies.odl.app.spectrum.impl.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.highstreet.technologies.odl.app.spectrum.impl.meta.Result;

/**
 * Created by olinchy on 3/18/15 for mosjava.
 */
public interface Executor<T>
{
    JsonNode exec() throws Exception;

    Result<T> post(JsonNode result, DataAgent service) throws Exception;

    <T> Result<T> postException(Throwable throwable, DataAgent service);
}
