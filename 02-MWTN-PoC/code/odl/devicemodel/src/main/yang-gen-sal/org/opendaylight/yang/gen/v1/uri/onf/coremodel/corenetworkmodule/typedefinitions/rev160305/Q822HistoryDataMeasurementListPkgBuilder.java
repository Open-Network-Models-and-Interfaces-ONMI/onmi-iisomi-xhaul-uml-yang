package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg
 *
 */
public class Q822HistoryDataMeasurementListPkgBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg> {

    private java.lang.String _cTPId;
    private Q822HistoryDataMeasurementListPkgKey _key;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>> augmentation = Collections.emptyMap();

    public Q822HistoryDataMeasurementListPkgBuilder() {
    }

    public Q822HistoryDataMeasurementListPkgBuilder(Q822HistoryDataMeasurementListPkg base) {
        if (base.getKey() == null) {
            this._key = new Q822HistoryDataMeasurementListPkgKey(
                base.getCTPId()
            );
            this._cTPId = base.getCTPId();
        } else {
            this._key = base.getKey();
            this._cTPId = _key.getCTPId();
        }
        if (base instanceof Q822HistoryDataMeasurementListPkgImpl) {
            Q822HistoryDataMeasurementListPkgImpl impl = (Q822HistoryDataMeasurementListPkgImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }


    public java.lang.String getCTPId() {
        return _cTPId;
    }
    
    public Q822HistoryDataMeasurementListPkgKey getKey() {
        return _key;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public Q822HistoryDataMeasurementListPkgBuilder setCTPId(java.lang.String value) {
        this._cTPId = value;
        return this;
    }
    
    public Q822HistoryDataMeasurementListPkgBuilder setKey(Q822HistoryDataMeasurementListPkgKey value) {
        this._key = value;
        return this;
    }
    
    public Q822HistoryDataMeasurementListPkgBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public Q822HistoryDataMeasurementListPkgBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public Q822HistoryDataMeasurementListPkg build() {
        return new Q822HistoryDataMeasurementListPkgImpl(this);
    }

    private static final class Q822HistoryDataMeasurementListPkgImpl implements Q822HistoryDataMeasurementListPkg {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg.class;
        }

        private final java.lang.String _cTPId;
        private final Q822HistoryDataMeasurementListPkgKey _key;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>> augmentation = Collections.emptyMap();

        private Q822HistoryDataMeasurementListPkgImpl(Q822HistoryDataMeasurementListPkgBuilder base) {
            if (base.getKey() == null) {
                this._key = new Q822HistoryDataMeasurementListPkgKey(
                    base.getCTPId()
                );
                this._cTPId = base.getCTPId();
            } else {
                this._key = base.getKey();
                this._cTPId = _key.getCTPId();
            }
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public java.lang.String getCTPId() {
            return _cTPId;
        }
        
        @Override
        public Q822HistoryDataMeasurementListPkgKey getKey() {
            return _key;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_cTPId == null) ? 0 : _cTPId.hashCode());
            result = prime * result + ((_key == null) ? 0 : _key.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg other = (org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg)obj;
            if (_cTPId == null) {
                if (other.getCTPId() != null) {
                    return false;
                }
            } else if(!_cTPId.equals(other.getCTPId())) {
                return false;
            }
            if (_key == null) {
                if (other.getKey() != null) {
                    return false;
                }
            } else if(!_key.equals(other.getKey())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                Q822HistoryDataMeasurementListPkgImpl otherImpl = (Q822HistoryDataMeasurementListPkgImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822HistoryDataMeasurementListPkg>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("Q822HistoryDataMeasurementListPkg [");
            boolean first = true;
        
            if (_cTPId != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_cTPId=");
                builder.append(_cTPId);
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
