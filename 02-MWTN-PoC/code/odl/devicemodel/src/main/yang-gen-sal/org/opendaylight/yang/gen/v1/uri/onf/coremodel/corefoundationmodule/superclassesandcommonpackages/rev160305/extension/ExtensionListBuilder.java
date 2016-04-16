package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList
 *
 */
public class ExtensionListBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList> {

    private ExtensionListKey _key;
    private java.lang.String _value;
    private java.lang.String _valueName;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>> augmentation = Collections.emptyMap();

    public ExtensionListBuilder() {
    }
    public ExtensionListBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.NameAndValue arg) {
        this._valueName = arg.getValueName();
        this._value = arg.getValue();
    }

    public ExtensionListBuilder(ExtensionList base) {
        if (base.getKey() == null) {
            this._key = new ExtensionListKey(
                base.getValueName()
            );
            this._valueName = base.getValueName();
        } else {
            this._key = base.getKey();
            this._valueName = _key.getValueName();
        }
        this._value = base.getValue();
        if (base instanceof ExtensionListImpl) {
            ExtensionListImpl impl = (ExtensionListImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }

    /**
     *Set fields from given grouping argument. Valid argument is instance of one of following types:
     * <ul>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.NameAndValue</li>
     * </ul>
     *
     * @param arg grouping object
     * @throws IllegalArgumentException if given argument is none of valid types
    */
    public void fieldsFrom(DataObject arg) {
        boolean isValidArg = false;
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.NameAndValue) {
            this._valueName = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.NameAndValue)arg).getValueName();
            this._value = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.NameAndValue)arg).getValue();
            isValidArg = true;
        }
        if (!isValidArg) {
            throw new IllegalArgumentException(
              "expected one of: [org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.NameAndValue] \n" +
              "but was: " + arg
            );
        }
    }

    public ExtensionListKey getKey() {
        return _key;
    }
    
    public java.lang.String getValue() {
        return _value;
    }
    
    public java.lang.String getValueName() {
        return _valueName;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public ExtensionListBuilder setKey(ExtensionListKey value) {
        this._key = value;
        return this;
    }
    
    public ExtensionListBuilder setValue(java.lang.String value) {
        this._value = value;
        return this;
    }
    
    public ExtensionListBuilder setValueName(java.lang.String value) {
        this._valueName = value;
        return this;
    }
    
    public ExtensionListBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public ExtensionListBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public ExtensionList build() {
        return new ExtensionListImpl(this);
    }

    private static final class ExtensionListImpl implements ExtensionList {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList.class;
        }

        private final ExtensionListKey _key;
        private final java.lang.String _value;
        private final java.lang.String _valueName;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>> augmentation = Collections.emptyMap();

        private ExtensionListImpl(ExtensionListBuilder base) {
            if (base.getKey() == null) {
                this._key = new ExtensionListKey(
                    base.getValueName()
                );
                this._valueName = base.getValueName();
            } else {
                this._key = base.getKey();
                this._valueName = _key.getValueName();
            }
            this._value = base.getValue();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public ExtensionListKey getKey() {
            return _key;
        }
        
        @Override
        public java.lang.String getValue() {
            return _value;
        }
        
        @Override
        public java.lang.String getValueName() {
            return _valueName;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_key == null) ? 0 : _key.hashCode());
            result = prime * result + ((_value == null) ? 0 : _value.hashCode());
            result = prime * result + ((_valueName == null) ? 0 : _valueName.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList other = (org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList)obj;
            if (_key == null) {
                if (other.getKey() != null) {
                    return false;
                }
            } else if(!_key.equals(other.getKey())) {
                return false;
            }
            if (_value == null) {
                if (other.getValue() != null) {
                    return false;
                }
            } else if(!_value.equals(other.getValue())) {
                return false;
            }
            if (_valueName == null) {
                if (other.getValueName() != null) {
                    return false;
                }
            } else if(!_valueName.equals(other.getValueName())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                ExtensionListImpl otherImpl = (ExtensionListImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.extension.ExtensionList>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("ExtensionList [");
            boolean first = true;
        
            if (_key != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_key=");
                builder.append(_key);
             }
            if (_value != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_value=");
                builder.append(_value);
             }
            if (_valueName != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_valueName=");
                builder.append(_valueName);
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
