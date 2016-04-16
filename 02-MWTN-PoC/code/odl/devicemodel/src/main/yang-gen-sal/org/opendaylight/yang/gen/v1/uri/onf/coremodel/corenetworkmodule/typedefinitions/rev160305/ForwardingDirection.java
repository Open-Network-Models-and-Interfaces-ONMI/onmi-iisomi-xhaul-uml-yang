package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305;


/**
 * The enumeration built-in type represents values from a set of assigned names.
 *
 */
public enum ForwardingDirection {
    BIDIRECTIONAL(0),
    
    UNIDIRECTIONAL(1),
    
    UNDEFINEDORUNKNOWN(2)
    ;


    int value;
    private static final java.util.Map<java.lang.Integer, ForwardingDirection> VALUE_MAP;

    static {
        final com.google.common.collect.ImmutableMap.Builder<java.lang.Integer, ForwardingDirection> b = com.google.common.collect.ImmutableMap.builder();
        for (ForwardingDirection enumItem : ForwardingDirection.values())
        {
            b.put(enumItem.value, enumItem);
        }

        VALUE_MAP = b.build();
    }

    private ForwardingDirection(int value) {
        this.value = value;
    }

    /**
     * @return integer value
     */
    public int getIntValue() {
        return value;
    }

    /**
     * @param valueArg
     * @return corresponding ForwardingDirection item
     */
    public static ForwardingDirection forValue(int valueArg) {
        return VALUE_MAP.get(valueArg);
    }
}
