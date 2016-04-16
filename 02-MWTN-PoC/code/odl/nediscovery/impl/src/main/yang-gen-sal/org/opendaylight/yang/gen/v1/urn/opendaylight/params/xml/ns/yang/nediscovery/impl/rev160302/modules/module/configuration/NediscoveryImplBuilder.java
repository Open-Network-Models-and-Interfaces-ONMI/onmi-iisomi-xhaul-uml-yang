package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.nediscovery.impl.Broker;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import java.util.Collections;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.nediscovery.impl.NetconfconnectorService;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl} instances.
 *
 * @see org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl
 *
 */
public class NediscoveryImplBuilder implements Builder <org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl> {

    private Broker _broker;
    private NetconfconnectorService _netconfconnectorService;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>> augmentation = Collections.emptyMap();

    public NediscoveryImplBuilder() {
    }

    public NediscoveryImplBuilder(NediscoveryImpl base) {
        this._broker = base.getBroker();
        this._netconfconnectorService = base.getNetconfconnectorService();
        if (base instanceof NediscoveryImplImpl) {
            NediscoveryImplImpl impl = (NediscoveryImplImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }


    public Broker getBroker() {
        return _broker;
    }
    
    public NetconfconnectorService getNetconfconnectorService() {
        return _netconfconnectorService;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public NediscoveryImplBuilder setBroker(Broker value) {
        this._broker = value;
        return this;
    }
    
    public NediscoveryImplBuilder setNetconfconnectorService(NetconfconnectorService value) {
        this._netconfconnectorService = value;
        return this;
    }
    
    public NediscoveryImplBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public NediscoveryImplBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public NediscoveryImpl build() {
        return new NediscoveryImplImpl(this);
    }

    private static final class NediscoveryImplImpl implements NediscoveryImpl {

        public java.lang.Class<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl.class;
        }

        private final Broker _broker;
        private final NetconfconnectorService _netconfconnectorService;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>> augmentation = Collections.emptyMap();

        private NediscoveryImplImpl(NediscoveryImplBuilder base) {
            this._broker = base.getBroker();
            this._netconfconnectorService = base.getNetconfconnectorService();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public Broker getBroker() {
            return _broker;
        }
        
        @Override
        public NetconfconnectorService getNetconfconnectorService() {
            return _netconfconnectorService;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_broker == null) ? 0 : _broker.hashCode());
            result = prime * result + ((_netconfconnectorService == null) ? 0 : _netconfconnectorService.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl other = (org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl)obj;
            if (_broker == null) {
                if (other.getBroker() != null) {
                    return false;
                }
            } else if(!_broker.equals(other.getBroker())) {
                return false;
            }
            if (_netconfconnectorService == null) {
                if (other.getNetconfconnectorService() != null) {
                    return false;
                }
            } else if(!_netconfconnectorService.equals(other.getNetconfconnectorService())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                NediscoveryImplImpl otherImpl = (NediscoveryImplImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.impl.rev160302.modules.module.configuration.NediscoveryImpl>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("NediscoveryImpl [");
            boolean first = true;
        
            if (_broker != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_broker=");
                builder.append(_broker);
             }
            if (_netconfconnectorService != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_netconfconnectorService=");
                builder.append(_netconfconnectorService);
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
