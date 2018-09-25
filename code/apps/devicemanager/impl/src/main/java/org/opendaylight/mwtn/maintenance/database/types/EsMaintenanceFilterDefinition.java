package org.opendaylight.mwtn.maintenance.database.types;

import java.util.Collections;
import java.util.Map;

import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.devicemanager.api.rev170317.maintenance.mode.g.filter.Definition;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.DataContainer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class EsMaintenanceFilterDefinition implements Definition {

    private static final Logger LOG = LoggerFactory.getLogger(EsMaintenanceFilterDefinition.class);
	private static final String ALL = "";

    //yang tools
    @JsonIgnore
    private Map<java.lang.Class<? extends Augmentation<Definition>>, Augmentation<Definition>> augmentation = Collections.emptyMap();

    private String objectIdRef = ALL;
    private String problem = ALL;

	public EsMaintenanceFilterDefinition() {
    }

	public EsMaintenanceFilterDefinition(Definition definition) {
		objectIdRef = definition.getObjectIdRef();
		problem = definition.getProblem();
	}

	@JsonProperty("object-id-ref")
    public String getObjectIdRef() {
		return objectIdRef;
	}

	@JsonProperty("object-id-ref")
	public void setObjectIdRef(String objectIdRef) {
		this.objectIdRef = objectIdRef == null ? ALL : objectIdRef;
	}

    @JsonProperty("problem")
	public String getProblem() {
		return problem;
	}

    @JsonProperty("problem")
	public void setProblem(String problem) {
		this.problem = problem == null ? ALL : problem;
	}

	public boolean appliesToObjectReference(String objectIdRef, String problem) {
		boolean res = (objectIdRef.isEmpty() || objectIdRef.contains(objectIdRef)) && (problem.isEmpty() || problem.contains(problem));
		LOG.debug("Check result applies {}: {} {} against: {}",res, objectIdRef, problem, this);
		return res;
	}

	@Override
	public String toString() {
		return "EsMaintenanceFilterDefinition [objectIdRef=" + objectIdRef + ", problem=" + problem + "]";
	}

	@Override
	public Class<? extends DataContainer> getImplementedInterface() {
        return Definition.class;
	}

	@SuppressWarnings("unchecked")
	@Override
	public <E extends Augmentation<Definition>> E getAugmentation(Class<E> augmentationType) {
		return (E) augmentation.get(augmentationType);
	}



}
