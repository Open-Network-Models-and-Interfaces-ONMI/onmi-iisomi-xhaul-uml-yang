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

/**
 * Element is a document in the ES database.
 */
public interface IsEsObject {

    /**
     * Set the ES Id
     * @param id Set the ID, created by ES for this Object
     */
    void setEsId( String id );

    /**
     * Get Id content as string that is used in ES
     * @return Related ID, that was specified by set command.
     */
    String getEsId();

}
