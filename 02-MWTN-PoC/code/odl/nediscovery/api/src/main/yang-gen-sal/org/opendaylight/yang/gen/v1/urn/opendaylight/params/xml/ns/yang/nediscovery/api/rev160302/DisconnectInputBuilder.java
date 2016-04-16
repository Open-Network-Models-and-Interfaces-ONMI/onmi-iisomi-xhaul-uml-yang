package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput} instances.
 *
 * @see org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput
 *
 */
public class DisconnectInputBuilder implements Builder <org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput> {

    private java.lang.String _ip;
    private java.lang.String _name;
    private java.lang.String _password;
    private java.lang.String _port;
    private java.lang.String _username;
    private java.lang.Boolean _connected;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>> augmentation = Collections.emptyMap();

    public DisconnectInputBuilder() {
    }
    public DisconnectInputBuilder(org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.Ne arg) {
        this._name = arg.getName();
        this._ip = arg.getIp();
        this._port = arg.getPort();
        this._username = arg.getUsername();
        this._password = arg.getPassword();
        this._connected = arg.isConnected();
    }

    public DisconnectInputBuilder(DisconnectInput base) {
        this._ip = base.getIp();
        this._name = base.getName();
        this._password = base.getPassword();
        this._port = base.getPort();
        this._username = base.getUsername();
        this._connected = base.isConnected();
        if (base instanceof DisconnectInputImpl) {
            DisconnectInputImpl impl = (DisconnectInputImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }

    /**
     *Set fields from given grouping argument. Valid argument is instance of one of following types:
     * <ul>
     * <li>org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.Ne</li>
     * </ul>
     *
     * @param arg grouping object
     * @throws IllegalArgumentException if given argument is none of valid types
    */
    public void fieldsFrom(DataObject arg) {
        boolean isValidArg = false;
        if (arg instanceof org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.Ne) {
            this._name = ((org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.Ne)arg).getName();
            this._ip = ((org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.Ne)arg).getIp();
            this._port = ((org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.Ne)arg).getPort();
            this._username = ((org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.Ne)arg).getUsername();
            this._password = ((org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.Ne)arg).getPassword();
            this._connected = ((org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.Ne)arg).isConnected();
            isValidArg = true;
        }
        if (!isValidArg) {
            throw new IllegalArgumentException(
              "expected one of: [org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.Ne] \n" +
              "but was: " + arg
            );
        }
    }

    public java.lang.String getIp() {
        return _ip;
    }
    
    public java.lang.String getName() {
        return _name;
    }
    
    public java.lang.String getPassword() {
        return _password;
    }
    
    public java.lang.String getPort() {
        return _port;
    }
    
    public java.lang.String getUsername() {
        return _username;
    }
    
    public java.lang.Boolean isConnected() {
        return _connected;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public DisconnectInputBuilder setIp(java.lang.String value) {
        this._ip = value;
        return this;
    }
    
    public DisconnectInputBuilder setName(java.lang.String value) {
        this._name = value;
        return this;
    }
    
    public DisconnectInputBuilder setPassword(java.lang.String value) {
        this._password = value;
        return this;
    }
    
    public DisconnectInputBuilder setPort(java.lang.String value) {
        this._port = value;
        return this;
    }
    
    public DisconnectInputBuilder setUsername(java.lang.String value) {
        this._username = value;
        return this;
    }
    
    public DisconnectInputBuilder setConnected(java.lang.Boolean value) {
        this._connected = value;
        return this;
    }
    
    public DisconnectInputBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public DisconnectInputBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public DisconnectInput build() {
        return new DisconnectInputImpl(this);
    }

    private static final class DisconnectInputImpl implements DisconnectInput {

        public java.lang.Class<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput.class;
        }

        private final java.lang.String _ip;
        private final java.lang.String _name;
        private final java.lang.String _password;
        private final java.lang.String _port;
        private final java.lang.String _username;
        private final java.lang.Boolean _connected;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>> augmentation = Collections.emptyMap();

        private DisconnectInputImpl(DisconnectInputBuilder base) {
            this._ip = base.getIp();
            this._name = base.getName();
            this._password = base.getPassword();
            this._port = base.getPort();
            this._username = base.getUsername();
            this._connected = base.isConnected();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public java.lang.String getIp() {
            return _ip;
        }
        
        @Override
        public java.lang.String getName() {
            return _name;
        }
        
        @Override
        public java.lang.String getPassword() {
            return _password;
        }
        
        @Override
        public java.lang.String getPort() {
            return _port;
        }
        
        @Override
        public java.lang.String getUsername() {
            return _username;
        }
        
        @Override
        public java.lang.Boolean isConnected() {
            return _connected;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_ip == null) ? 0 : _ip.hashCode());
            result = prime * result + ((_name == null) ? 0 : _name.hashCode());
            result = prime * result + ((_password == null) ? 0 : _password.hashCode());
            result = prime * result + ((_port == null) ? 0 : _port.hashCode());
            result = prime * result + ((_username == null) ? 0 : _username.hashCode());
            result = prime * result + ((_connected == null) ? 0 : _connected.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput other = (org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput)obj;
            if (_ip == null) {
                if (other.getIp() != null) {
                    return false;
                }
            } else if(!_ip.equals(other.getIp())) {
                return false;
            }
            if (_name == null) {
                if (other.getName() != null) {
                    return false;
                }
            } else if(!_name.equals(other.getName())) {
                return false;
            }
            if (_password == null) {
                if (other.getPassword() != null) {
                    return false;
                }
            } else if(!_password.equals(other.getPassword())) {
                return false;
            }
            if (_port == null) {
                if (other.getPort() != null) {
                    return false;
                }
            } else if(!_port.equals(other.getPort())) {
                return false;
            }
            if (_username == null) {
                if (other.getUsername() != null) {
                    return false;
                }
            } else if(!_username.equals(other.getUsername())) {
                return false;
            }
            if (_connected == null) {
                if (other.isConnected() != null) {
                    return false;
                }
            } else if(!_connected.equals(other.isConnected())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                DisconnectInputImpl otherImpl = (DisconnectInputImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.nediscovery.api.rev160302.DisconnectInput>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("DisconnectInput [");
            boolean first = true;
        
            if (_ip != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_ip=");
                builder.append(_ip);
             }
            if (_name != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_name=");
                builder.append(_name);
             }
            if (_password != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_password=");
                builder.append(_password);
             }
            if (_port != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_port=");
                builder.append(_port);
             }
            if (_username != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_username=");
                builder.append(_username);
             }
            if (_connected != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_connected=");
                builder.append(_connected);
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
