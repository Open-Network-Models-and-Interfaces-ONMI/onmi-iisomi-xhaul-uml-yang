package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.name.NameList;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.AdministrativeControl;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.AdministrativeState;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.LifecycleState;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.TerminationDirection;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.OperationalState;
import java.util.List;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.globalclass.LocalIdList;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList
 *
 */
public class LtpRefListBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList> {

    private AdministrativeControl _administrativeControl;
    private AdministrativeState _adminsatratveState;
    private List<UniversalId> _clientLtpRefList;
    private LtpRefListKey _key;
    private LifecycleState _lifecycleState;
    private List<LocalIdList> _localIdList;
    private List<LpList> _lpList;
    private TerminationDirection _ltpDirection;
    private List<UniversalId> _ltpRefList;
    private List<NameList> _nameList;
    private OperationalState _operationalState;
    private List<java.lang.String> _physicalPortReference;
    private List<UniversalId> _serverLtpRefList;
    private UniversalId _uuid;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>> augmentation = Collections.emptyMap();

    public LtpRefListBuilder() {
    }
    public LtpRefListBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LogicalTerminationPoint arg) {
        this._serverLtpRefList = arg.getServerLtpRefList();
        this._clientLtpRefList = arg.getClientLtpRefList();
        this._lpList = arg.getLpList();
        this._physicalPortReference = arg.getPhysicalPortReference();
        this._ltpRefList = arg.getLtpRefList();
        this._ltpDirection = arg.getLtpDirection();
        this._localIdList = arg.getLocalIdList();
        this._uuid = arg.getUuid();
        this._operationalState = arg.getOperationalState();
        this._administrativeControl = arg.getAdministrativeControl();
        this._adminsatratveState = arg.getAdminsatratveState();
        this._lifecycleState = arg.getLifecycleState();
        this._nameList = arg.getNameList();
    }
    public LtpRefListBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.GlobalClass arg) {
        this._localIdList = arg.getLocalIdList();
        this._uuid = arg.getUuid();
        this._operationalState = arg.getOperationalState();
        this._administrativeControl = arg.getAdministrativeControl();
        this._adminsatratveState = arg.getAdminsatratveState();
        this._lifecycleState = arg.getLifecycleState();
        this._nameList = arg.getNameList();
    }
    public LtpRefListBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac arg) {
        this._operationalState = arg.getOperationalState();
        this._administrativeControl = arg.getAdministrativeControl();
        this._adminsatratveState = arg.getAdminsatratveState();
        this._lifecycleState = arg.getLifecycleState();
    }
    public LtpRefListBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name arg) {
        this._nameList = arg.getNameList();
    }

    public LtpRefListBuilder(LtpRefList base) {
        if (base.getKey() == null) {
            this._key = new LtpRefListKey(
                base.getUuid()
            );
            this._uuid = base.getUuid();
        } else {
            this._key = base.getKey();
            this._uuid = _key.getUuid();
        }
        this._administrativeControl = base.getAdministrativeControl();
        this._adminsatratveState = base.getAdminsatratveState();
        this._clientLtpRefList = base.getClientLtpRefList();
        this._lifecycleState = base.getLifecycleState();
        this._localIdList = base.getLocalIdList();
        this._lpList = base.getLpList();
        this._ltpDirection = base.getLtpDirection();
        this._ltpRefList = base.getLtpRefList();
        this._nameList = base.getNameList();
        this._operationalState = base.getOperationalState();
        this._physicalPortReference = base.getPhysicalPortReference();
        this._serverLtpRefList = base.getServerLtpRefList();
        if (base instanceof LtpRefListImpl) {
            LtpRefListImpl impl = (LtpRefListImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }

    /**
     *Set fields from given grouping argument. Valid argument is instance of one of following types:
     * <ul>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac</li>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LogicalTerminationPoint</li>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.GlobalClass</li>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name</li>
     * </ul>
     *
     * @param arg grouping object
     * @throws IllegalArgumentException if given argument is none of valid types
    */
    public void fieldsFrom(DataObject arg) {
        boolean isValidArg = false;
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac) {
            this._operationalState = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac)arg).getOperationalState();
            this._administrativeControl = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac)arg).getAdministrativeControl();
            this._adminsatratveState = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac)arg).getAdminsatratveState();
            this._lifecycleState = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac)arg).getLifecycleState();
            isValidArg = true;
        }
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LogicalTerminationPoint) {
            this._serverLtpRefList = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LogicalTerminationPoint)arg).getServerLtpRefList();
            this._clientLtpRefList = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LogicalTerminationPoint)arg).getClientLtpRefList();
            this._lpList = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LogicalTerminationPoint)arg).getLpList();
            this._physicalPortReference = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LogicalTerminationPoint)arg).getPhysicalPortReference();
            this._ltpRefList = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LogicalTerminationPoint)arg).getLtpRefList();
            this._ltpDirection = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LogicalTerminationPoint)arg).getLtpDirection();
            isValidArg = true;
        }
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.GlobalClass) {
            this._localIdList = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.GlobalClass)arg).getLocalIdList();
            this._uuid = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.GlobalClass)arg).getUuid();
            isValidArg = true;
        }
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name) {
            this._nameList = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name)arg).getNameList();
            isValidArg = true;
        }
        if (!isValidArg) {
            throw new IllegalArgumentException(
              "expected one of: [org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac, org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LogicalTerminationPoint, org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.GlobalClass, org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name] \n" +
              "but was: " + arg
            );
        }
    }

    public AdministrativeControl getAdministrativeControl() {
        return _administrativeControl;
    }
    
    public AdministrativeState getAdminsatratveState() {
        return _adminsatratveState;
    }
    
    public List<UniversalId> getClientLtpRefList() {
        return _clientLtpRefList;
    }
    
    public LtpRefListKey getKey() {
        return _key;
    }
    
    public LifecycleState getLifecycleState() {
        return _lifecycleState;
    }
    
    public List<LocalIdList> getLocalIdList() {
        return _localIdList;
    }
    
    public List<LpList> getLpList() {
        return _lpList;
    }
    
    public TerminationDirection getLtpDirection() {
        return _ltpDirection;
    }
    
    public List<UniversalId> getLtpRefList() {
        return _ltpRefList;
    }
    
    public List<NameList> getNameList() {
        return _nameList;
    }
    
    public OperationalState getOperationalState() {
        return _operationalState;
    }
    
    public List<java.lang.String> getPhysicalPortReference() {
        return _physicalPortReference;
    }
    
    public List<UniversalId> getServerLtpRefList() {
        return _serverLtpRefList;
    }
    
    public UniversalId getUuid() {
        return _uuid;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public LtpRefListBuilder setAdministrativeControl(AdministrativeControl value) {
        this._administrativeControl = value;
        return this;
    }
    
    public LtpRefListBuilder setAdminsatratveState(AdministrativeState value) {
        this._adminsatratveState = value;
        return this;
    }
    
    public LtpRefListBuilder setClientLtpRefList(List<UniversalId> value) {
        this._clientLtpRefList = value;
        return this;
    }
    
    public LtpRefListBuilder setKey(LtpRefListKey value) {
        this._key = value;
        return this;
    }
    
    public LtpRefListBuilder setLifecycleState(LifecycleState value) {
        this._lifecycleState = value;
        return this;
    }
    
    public LtpRefListBuilder setLocalIdList(List<LocalIdList> value) {
        this._localIdList = value;
        return this;
    }
    
    public LtpRefListBuilder setLpList(List<LpList> value) {
        this._lpList = value;
        return this;
    }
    
    public LtpRefListBuilder setLtpDirection(TerminationDirection value) {
        this._ltpDirection = value;
        return this;
    }
    
    public LtpRefListBuilder setLtpRefList(List<UniversalId> value) {
        this._ltpRefList = value;
        return this;
    }
    
    public LtpRefListBuilder setNameList(List<NameList> value) {
        this._nameList = value;
        return this;
    }
    
    public LtpRefListBuilder setOperationalState(OperationalState value) {
        this._operationalState = value;
        return this;
    }
    
    public LtpRefListBuilder setPhysicalPortReference(List<java.lang.String> value) {
        this._physicalPortReference = value;
        return this;
    }
    
    public LtpRefListBuilder setServerLtpRefList(List<UniversalId> value) {
        this._serverLtpRefList = value;
        return this;
    }
    
    public LtpRefListBuilder setUuid(UniversalId value) {
        if (value != null) {
        }
        this._uuid = value;
        return this;
    }
    
    public LtpRefListBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public LtpRefListBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public LtpRefList build() {
        return new LtpRefListImpl(this);
    }

    private static final class LtpRefListImpl implements LtpRefList {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList.class;
        }

        private final AdministrativeControl _administrativeControl;
        private final AdministrativeState _adminsatratveState;
        private final List<UniversalId> _clientLtpRefList;
        private final LtpRefListKey _key;
        private final LifecycleState _lifecycleState;
        private final List<LocalIdList> _localIdList;
        private final List<LpList> _lpList;
        private final TerminationDirection _ltpDirection;
        private final List<UniversalId> _ltpRefList;
        private final List<NameList> _nameList;
        private final OperationalState _operationalState;
        private final List<java.lang.String> _physicalPortReference;
        private final List<UniversalId> _serverLtpRefList;
        private final UniversalId _uuid;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>> augmentation = Collections.emptyMap();

        private LtpRefListImpl(LtpRefListBuilder base) {
            if (base.getKey() == null) {
                this._key = new LtpRefListKey(
                    base.getUuid()
                );
                this._uuid = base.getUuid();
            } else {
                this._key = base.getKey();
                this._uuid = _key.getUuid();
            }
            this._administrativeControl = base.getAdministrativeControl();
            this._adminsatratveState = base.getAdminsatratveState();
            this._clientLtpRefList = base.getClientLtpRefList();
            this._lifecycleState = base.getLifecycleState();
            this._localIdList = base.getLocalIdList();
            this._lpList = base.getLpList();
            this._ltpDirection = base.getLtpDirection();
            this._ltpRefList = base.getLtpRefList();
            this._nameList = base.getNameList();
            this._operationalState = base.getOperationalState();
            this._physicalPortReference = base.getPhysicalPortReference();
            this._serverLtpRefList = base.getServerLtpRefList();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public AdministrativeControl getAdministrativeControl() {
            return _administrativeControl;
        }
        
        @Override
        public AdministrativeState getAdminsatratveState() {
            return _adminsatratveState;
        }
        
        @Override
        public List<UniversalId> getClientLtpRefList() {
            return _clientLtpRefList;
        }
        
        @Override
        public LtpRefListKey getKey() {
            return _key;
        }
        
        @Override
        public LifecycleState getLifecycleState() {
            return _lifecycleState;
        }
        
        @Override
        public List<LocalIdList> getLocalIdList() {
            return _localIdList;
        }
        
        @Override
        public List<LpList> getLpList() {
            return _lpList;
        }
        
        @Override
        public TerminationDirection getLtpDirection() {
            return _ltpDirection;
        }
        
        @Override
        public List<UniversalId> getLtpRefList() {
            return _ltpRefList;
        }
        
        @Override
        public List<NameList> getNameList() {
            return _nameList;
        }
        
        @Override
        public OperationalState getOperationalState() {
            return _operationalState;
        }
        
        @Override
        public List<java.lang.String> getPhysicalPortReference() {
            return _physicalPortReference;
        }
        
        @Override
        public List<UniversalId> getServerLtpRefList() {
            return _serverLtpRefList;
        }
        
        @Override
        public UniversalId getUuid() {
            return _uuid;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>> E getAugmentation(java.lang.Class<E> augmentationType) {
            if (augmentationType == null) {
                throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
            }
            return (E) augmentation.get(augmentationType);
        }

        private int hash = 0;
        private volatile boolean hashValid = false;
        
        @Override
        public int hashCode() {
            if (hashValid) {
                return hash;
            }
        
            final int prime = 31;
            int result = 1;
            result = prime * result + ((_administrativeControl == null) ? 0 : _administrativeControl.hashCode());
            result = prime * result + ((_adminsatratveState == null) ? 0 : _adminsatratveState.hashCode());
            result = prime * result + ((_clientLtpRefList == null) ? 0 : _clientLtpRefList.hashCode());
            result = prime * result + ((_key == null) ? 0 : _key.hashCode());
            result = prime * result + ((_lifecycleState == null) ? 0 : _lifecycleState.hashCode());
            result = prime * result + ((_localIdList == null) ? 0 : _localIdList.hashCode());
            result = prime * result + ((_lpList == null) ? 0 : _lpList.hashCode());
            result = prime * result + ((_ltpDirection == null) ? 0 : _ltpDirection.hashCode());
            result = prime * result + ((_ltpRefList == null) ? 0 : _ltpRefList.hashCode());
            result = prime * result + ((_nameList == null) ? 0 : _nameList.hashCode());
            result = prime * result + ((_operationalState == null) ? 0 : _operationalState.hashCode());
            result = prime * result + ((_physicalPortReference == null) ? 0 : _physicalPortReference.hashCode());
            result = prime * result + ((_serverLtpRefList == null) ? 0 : _serverLtpRefList.hashCode());
            result = prime * result + ((_uuid == null) ? 0 : _uuid.hashCode());
            result = prime * result + ((augmentation == null) ? 0 : augmentation.hashCode());
        
            hash = result;
            hashValid = true;
            return result;
        }

        @Override
        public boolean equals(java.lang.Object obj) {
            if (this == obj) {
                return true;
            }
            if (!(obj instanceof DataObject)) {
                return false;
            }
            if (!org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList other = (org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList)obj;
            if (_administrativeControl == null) {
                if (other.getAdministrativeControl() != null) {
                    return false;
                }
            } else if(!_administrativeControl.equals(other.getAdministrativeControl())) {
                return false;
            }
            if (_adminsatratveState == null) {
                if (other.getAdminsatratveState() != null) {
                    return false;
                }
            } else if(!_adminsatratveState.equals(other.getAdminsatratveState())) {
                return false;
            }
            if (_clientLtpRefList == null) {
                if (other.getClientLtpRefList() != null) {
                    return false;
                }
            } else if(!_clientLtpRefList.equals(other.getClientLtpRefList())) {
                return false;
            }
            if (_key == null) {
                if (other.getKey() != null) {
                    return false;
                }
            } else if(!_key.equals(other.getKey())) {
                return false;
            }
            if (_lifecycleState == null) {
                if (other.getLifecycleState() != null) {
                    return false;
                }
            } else if(!_lifecycleState.equals(other.getLifecycleState())) {
                return false;
            }
            if (_localIdList == null) {
                if (other.getLocalIdList() != null) {
                    return false;
                }
            } else if(!_localIdList.equals(other.getLocalIdList())) {
                return false;
            }
            if (_lpList == null) {
                if (other.getLpList() != null) {
                    return false;
                }
            } else if(!_lpList.equals(other.getLpList())) {
                return false;
            }
            if (_ltpDirection == null) {
                if (other.getLtpDirection() != null) {
                    return false;
                }
            } else if(!_ltpDirection.equals(other.getLtpDirection())) {
                return false;
            }
            if (_ltpRefList == null) {
                if (other.getLtpRefList() != null) {
                    return false;
                }
            } else if(!_ltpRefList.equals(other.getLtpRefList())) {
                return false;
            }
            if (_nameList == null) {
                if (other.getNameList() != null) {
                    return false;
                }
            } else if(!_nameList.equals(other.getNameList())) {
                return false;
            }
            if (_operationalState == null) {
                if (other.getOperationalState() != null) {
                    return false;
                }
            } else if(!_operationalState.equals(other.getOperationalState())) {
                return false;
            }
            if (_physicalPortReference == null) {
                if (other.getPhysicalPortReference() != null) {
                    return false;
                }
            } else if(!_physicalPortReference.equals(other.getPhysicalPortReference())) {
                return false;
            }
            if (_serverLtpRefList == null) {
                if (other.getServerLtpRefList() != null) {
                    return false;
                }
            } else if(!_serverLtpRefList.equals(other.getServerLtpRefList())) {
                return false;
            }
            if (_uuid == null) {
                if (other.getUuid() != null) {
                    return false;
                }
            } else if(!_uuid.equals(other.getUuid())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                LtpRefListImpl otherImpl = (LtpRefListImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList>> e : augmentation.entrySet()) {
                    if (!e.getValue().equals(other.getAugmentation(e.getKey()))) {
                        return false;
                    }
                }
                // .. and give the other one the chance to do the same
                if (!obj.equals(this)) {
                    return false;
                }
            }
            return true;
        }

        @Override
        public java.lang.String toString() {
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("LtpRefList [");
            boolean first = true;
        
            if (_administrativeControl != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_administrativeControl=");
                builder.append(_administrativeControl);
             }
            if (_adminsatratveState != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_adminsatratveState=");
                builder.append(_adminsatratveState);
             }
            if (_clientLtpRefList != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_clientLtpRefList=");
                builder.append(_clientLtpRefList);
             }
            if (_key != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_key=");
                builder.append(_key);
             }
            if (_lifecycleState != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_lifecycleState=");
                builder.append(_lifecycleState);
             }
            if (_localIdList != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_localIdList=");
                builder.append(_localIdList);
             }
            if (_lpList != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_lpList=");
                builder.append(_lpList);
             }
            if (_ltpDirection != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_ltpDirection=");
                builder.append(_ltpDirection);
             }
            if (_ltpRefList != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_ltpRefList=");
                builder.append(_ltpRefList);
             }
            if (_nameList != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_nameList=");
                builder.append(_nameList);
             }
            if (_operationalState != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_operationalState=");
                builder.append(_operationalState);
             }
            if (_physicalPortReference != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_physicalPortReference=");
                builder.append(_physicalPortReference);
             }
            if (_serverLtpRefList != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_serverLtpRefList=");
                builder.append(_serverLtpRefList);
             }
            if (_uuid != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_uuid=");
                builder.append(_uuid);
             }
            if (first) {
                first = false;
            } else {
                builder.append(", ");
            }
            builder.append("augmentation=");
            builder.append(augmentation.values());
            return builder.append(']').toString();
        }
    }

}
