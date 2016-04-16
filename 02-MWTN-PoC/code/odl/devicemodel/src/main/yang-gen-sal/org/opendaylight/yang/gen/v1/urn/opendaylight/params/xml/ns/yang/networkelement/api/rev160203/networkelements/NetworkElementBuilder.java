package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement} instances.
 *
 * @see org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement
 *
 */
public class NetworkElementBuilder implements Builder <org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement> {

    private java.lang.String _ip;
    private NetworkElementKey _key;
    private java.lang.String _name;
    private java.lang.String _password;
    private java.lang.String _port;
    private java.lang.String _username;
    private java.lang.Boolean _connected;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>> augmentation = Collections.emptyMap();

    public NetworkElementBuilder() {
    }
    public NetworkElementBuilder(org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.Ne arg) {
        this._name = arg.getName();
        this._ip = arg.getIp();
        this._port = arg.getPort();
        this._username = arg.getUsername();
        this._password = arg.getPassword();
        this._connected = arg.isConnected();
    }

    public NetworkElementBuilder(NetworkElement base) {
        if (base.getKey() == null) {
            this._key = new NetworkElementKey(
                base.getName()
            );
            this._name = base.getName();
        } else {
            this._key = base.getKey();
            this._name = _key.getName();
        }
        this._ip = base.getIp();
        this._password = base.getPassword();
        this._port = base.getPort();
        this._username = base.getUsername();
        this._connected = base.isConnected();
        if (base instanceof NetworkElementImpl) {
            NetworkElementImpl impl = (NetworkElementImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>) base;
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
    
    public NetworkElementKey getKey() {
        return _key;
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
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public NetworkElementBuilder setIp(java.lang.String value) {
        this._ip = value;
        return this;
    }
    
    public NetworkElementBuilder setKey(NetworkElementKey value) {
        this._key = value;
        return this;
    }
    
    public NetworkElementBuilder setName(java.lang.String value) {
        this._name = value;
        return this;
    }
    
    public NetworkElementBuilder setPassword(java.lang.String value) {
        this._password = value;
        return this;
    }
    
    public NetworkElementBuilder setPort(java.lang.String value) {
        this._port = value;
        return this;
    }
    
    public NetworkElementBuilder setUsername(java.lang.String value) {
        this._username = value;
        return this;
    }
    
    public NetworkElementBuilder setConnected(java.lang.Boolean value) {
        this._connected = value;
        return this;
    }
    
    public NetworkElementBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public NetworkElementBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public NetworkElement build() {
        return new NetworkElementImpl(this);
    }

    private static final class NetworkElementImpl implements NetworkElement {

        public java.lang.Class<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement.class;
        }

        private final java.lang.String _ip;
        private final NetworkElementKey _key;
        private final java.lang.String _name;
        private final java.lang.String _password;
        private final java.lang.String _port;
        private final java.lang.String _username;
        private final java.lang.Boolean _connected;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>> augmentation = Collections.emptyMap();

        private NetworkElementImpl(NetworkElementBuilder base) {
            if (base.getKey() == null) {
                this._key = new NetworkElementKey(
                    base.getName()
                );
                this._name = base.getName();
            } else {
                this._key = base.getKey();
                this._name = _key.getName();
            }
            this._ip = base.getIp();
            this._password = base.getPassword();
            this._port = base.getPort();
            this._username = base.getUsername();
            this._connected = base.isConnected();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>>singletonMap(e.getKey(), e.getValue());
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
        public NetworkElementKey getKey() {
            return _key;
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
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_key == null) ? 0 : _key.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement other = (org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement)obj;
            if (_ip == null) {
                if (other.getIp() != null) {
                    return false;
                }
            } else if(!_ip.equals(other.getIp())) {
                return false;
            }
            if (_key == null) {
                if (other.getKey() != null) {
                    return false;
                }
            } else if(!_key.equals(other.getKey())) {
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
                NetworkElementImpl otherImpl = (NetworkElementImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.networkelement.api.rev160203.networkelements.NetworkElement>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("NetworkElement [");
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
            if (_key != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_key=");
                builder.append(_key);
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
