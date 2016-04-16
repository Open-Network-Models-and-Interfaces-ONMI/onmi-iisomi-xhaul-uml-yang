package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305;


/**
 * The enumeration built-in type represents values from a set of assigned names.
 *
 */
public enum ExtendedTerminationDirection {
    BIDIRECTIONAL(0),
    
    SINK(1),
    
    SOURCE(2),
    
    UNDEFINEDORUNKNOWN(3),
    
    CONTRADIRECTIONSINK(4),
    
    CONTRADIRECTIONSOURCE(5)
    ;


    int value;
    private static final java.util.Map<java.lang.Integer, ExtendedTerminationDirection> VALUE_MAP;

    static {
        final com.google.common.collect.ImmutableMap.Builder<java.lang.Integer, ExtendedTerminationDirection> b = com.google.common.collect.ImmutableMap.builder();
        for (ExtendedTerminationDirection enumItem : ExtendedTerminationDirection.values())
        {
            b.put(enumItem.value, enumItem);
        }

        VALUE_MAP = b.build();
    }

    private ExtendedTerminationDirection(int value) {
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
     * @return corresponding ExtendedTerminationDirection item
     */
    public static ExtendedTerminationDirection forValue(int valueArg) {
        return VALUE_MAP.get(valueArg);
    }
}
