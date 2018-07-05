/*********************************************************************************
 *  Copyright © 2015, highstreet technologies GmbH
 *  All rights reserved!
 *
 *  http://www.highstreet-technologies.com/
 *
 *  The reproduction, transmission or use of this document or its contents is not
 *  permitted without express written authority. Offenders will be liable for
 *  damages. All rights, including rights created by patent grant or registration
 *  of a utility model or design, are reserved. Technical modifications possible.
 *  Technical specifications and features are binding only insofar as they are
 *  specifically and expressly agreed upon in a written contract.
 *
 *  @author: Martin Skorupski [martin@skorupski.de]
 *********************************************************************************/
package org.opendaylight.mwtn.base.database;

import org.elasticsearch.client.Client;
import org.elasticsearch.common.bytes.BytesReference;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHit;


/**
 * Interface, used by access one object
 * @author Herbert
 *
 */
public interface HtDataBase {

    String getNetworkIndex();
    void setNetworkIndex(String networkIndex);

    Client getClient();
    void closeDb();

    public BytesReference doReadJsonData( String dataTypeName, IsEsObject esId );
    public SearchHit[] doReadAllJsonData( int start, int length, String dataTypeName );
    public SearchHit[] doReadByQueryJsonData( int start, int length, String dataTypeName, QueryBuilder query);

    public String doWrite( String dataTypeName, IsEsObject esId, byte[] json);
    public String doWrite( String dataTypeName, IsEsObject esId, String json);

    public boolean doRemove( String dataTypeName, IsEsObject esId );

}
