package org.opendaylight.mwtn.genericpathmanager.topology;

import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.CapacityUnit;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.capacity.g.TotalSize;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.capacity.g.TotalSizeBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.capacity.pac.g.AvailableCapacity;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.capacity.pac.g.AvailableCapacityBuilder;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.capacity.pac.g.TotalPotentialCapacity;
import org.opendaylight.yang.gen.v1.urn.onf.otcc.yang.tapi.common.rev180307.capacity.pac.g.TotalPotentialCapacityBuilder;

import com.google.gson.JsonObject;

/**
 * {@link JsonToCapacityParameters} class to which takes JsonObject as input and translates it into TAPI Capacity Parameters object.
 *  uses tapi-common:capacity-pac-g
 * 
 * @author <a href="mailto:hanif.kukkalli@highstreet-technologies.com">Hanif Kukkalli</a>
 * @since 05.06.2018
 */
public class JsonToCapacityParameters {
	/**
	 * Retrieve the Total Potential Capacity from Json
	 * @param tpcObject
	 * @return {@link TotalPotentialCapacity}
	 */
	public TotalPotentialCapacity setTotalPotentialCapacityFromJson(JsonObject tpcObject) {
		TotalPotentialCapacityBuilder _builder = new TotalPotentialCapacityBuilder();
		_builder.setTotalSize(this.getTotalSize(tpcObject));
		return _builder.build();
	}

	/**
	 * Retrieve the Available Capacity from Json
	 * @param availableCapObject
	 * @return {@link AvailableCapacity}
	 */
	public AvailableCapacity setAvailableCapacityFromJson(JsonObject availableCapObject) {
		AvailableCapacityBuilder _builder = new AvailableCapacityBuilder();
		_builder.setTotalSize(this.getTotalSize(availableCapObject));
		return _builder.build();
	}

	/**
	 * Build Total Size Object
	 * @param totalSizeObject
	 * @return
	 */
	private TotalSize getTotalSize(JsonObject totalSizeObject) {
		TotalSizeBuilder _sizeBuilder = new TotalSizeBuilder();
		// Set Total Size
		JsonObject _totalSize = totalSizeObject.getAsJsonObject("total-size");
		_sizeBuilder.setValue(_totalSize.get("value").getAsBigInteger());
		_sizeBuilder.setUnit(CapacityUnit.valueOf(_totalSize.get("unit").getAsString()));
		return _sizeBuilder.build();
	}
}
