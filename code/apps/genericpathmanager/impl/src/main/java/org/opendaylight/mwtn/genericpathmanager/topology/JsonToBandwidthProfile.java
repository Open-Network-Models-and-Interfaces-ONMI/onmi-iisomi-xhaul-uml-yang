package org.opendaylight.mwtn.genericpathmanager.topology;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.BandwidthProfileType;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.CapacityUnit;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.bandwidth.profile.g.CommittedBurstSize;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.bandwidth.profile.g.CommittedBurstSizeBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.bandwidth.profile.g.CommittedInformationRate;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.bandwidth.profile.g.CommittedInformationRateBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.bandwidth.profile.g.PeakBurstSize;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.bandwidth.profile.g.PeakBurstSizeBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.bandwidth.profile.g.PeakInformationRate;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.bandwidth.profile.g.PeakInformationRateBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.capacity.g.BandwidthProfile;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.capacity.g.BandwidthProfileBuilder;

import com.google.gson.JsonObject;

/**
 * {@link JsonToBandwidthProfile} class which takes JsonObject as input and translates it into TAPI Node object.
 * 
 * @author <a href="mailto:hanif.kukkalli@highstreet-technologies.com">Hanif Kukkalli</a>
 * @since 01.06.2018
 */
public class JsonToBandwidthProfile {

	public BandwidthProfile getBandWidthProfile(JsonObject object) {
		BandwidthProfileBuilder _builder = new BandwidthProfileBuilder();
		_builder.setBwProfileType(BandwidthProfileType.valueOf(object.get("bw-profile-type").getAsString()));
		_builder.setCommittedInformationRate(getCommittedInformationRate(object.get("committed-information-rate").getAsJsonObject()));
		_builder.setCommittedBurstSize(getCommittedBurstSize(object.get("committed-burst-size").getAsJsonObject()));
		_builder.setPeakInformationRate(getPeakInformationRate(object.get("peak-information-rate").getAsJsonObject()));
		_builder.setPeakBurstSize(getPeakBurstSize(object.get("peak-burst-size").getAsJsonObject()));

		_builder.setColorAware(object.get("color-aware").getAsBoolean());
		_builder.setCouplingFlag(object.get("coupling-flag").getAsBoolean());
		return _builder.build();
	}

	private PeakBurstSize getPeakBurstSize(JsonObject asJsonObject) {
		PeakBurstSizeBuilder _builder = new PeakBurstSizeBuilder();
		_builder.setUnit(CapacityUnit.valueOf(asJsonObject.get("unit").getAsString()));
		_builder.setValue(asJsonObject.get("value").getAsBigInteger());
		return _builder.build();
	}

	private PeakInformationRate getPeakInformationRate(JsonObject asJsonObject) {
		PeakInformationRateBuilder _builder = new PeakInformationRateBuilder();
		_builder.setUnit(CapacityUnit.valueOf(asJsonObject.get("unit").getAsString()));
		_builder.setValue(asJsonObject.get("value").getAsBigInteger());
		return _builder.build();
	}

	private CommittedInformationRate getCommittedInformationRate(JsonObject object) {
		CommittedInformationRateBuilder _builder = new CommittedInformationRateBuilder();
		_builder.setUnit(CapacityUnit.valueOf(object.get("unit").getAsString()));
		_builder.setValue(object.get("value").getAsBigInteger());
		return _builder.build();
	}

	private CommittedBurstSize getCommittedBurstSize(JsonObject object) {
		CommittedBurstSizeBuilder _builder = new CommittedBurstSizeBuilder();
		_builder.setUnit(CapacityUnit.valueOf(object.get("unit").getAsString()));
		_builder.setValue(object.get("value").getAsBigInteger());
		return _builder.build();
	}
}
