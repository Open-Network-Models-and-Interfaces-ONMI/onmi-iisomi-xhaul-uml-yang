package org.opendaylight.mwtn.base.netconf.wrapperc;

import java.util.List;

import org.opendaylight.mwtn.base.netconf.ONFCOreNetworkElementCoreData;
import org.opendaylight.mwtn.base.netconf.container.ONFLayerProtocolName;
import org.opendaylight.mwtn.devicemanager.impl.xml.ProblemNotificationXml;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.UniversalId;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.logical.termination.point.g.Lp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.g._874._1.model.rev170320.OtnHistoryDataG;
import org.opendaylight.yangtools.yang.common.QName;

public interface OnfMicrowaveModel {

    public void setCoreData(ONFCOreNetworkElementCoreData coreData);

	public void readTheFaultsOfMicrowaveModel(ONFLayerProtocolName lpName, Class<?> lpClass, UniversalId uuid,
			List<ProblemNotificationXml> resultList);

	public List<? extends OtnHistoryDataG> readTheHistoricalPerformanceData(ONFLayerProtocolName lpName, Lp lp);

	public Class<?> getClassForLtpExtension(QName qName);

}
