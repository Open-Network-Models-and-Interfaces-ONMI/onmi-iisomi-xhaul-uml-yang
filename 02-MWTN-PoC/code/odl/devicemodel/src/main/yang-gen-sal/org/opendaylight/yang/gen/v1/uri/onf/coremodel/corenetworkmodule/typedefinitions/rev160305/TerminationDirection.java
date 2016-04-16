package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305;


/**
 * The enumeration built-in type represents values from a set of assigned names.
 *
 */
public enum TerminationDirection {
    BIDIRECTIONAL(0),
    
    SINK(1),
    
    SOURCE(2),
    
    UNDEFINEDORUNKNOWN(3)
    ;


    int value;
    private static final java.util.Map<java.lang.Integer, TerminationDirection> VALUE_MAP;

    static {
        final com.google.common.collect.ImmutableMap.Builder<java.lang.Integer, TerminationDirection> b = com.google.common.collect.ImmutableMap.builder();
        for (TerminationDirection enumItem : TerminationDirection.values())
        {
            b.put(enumItem.value, enumItem);
        }

        VALUE_MAP = b.build();
    }

    private TerminationDirection(int value) {
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
     * @return corresponding TerminationDirection item
     */
    public static TerminationDirection forValue(int valueArg) {
        return VALUE_MAP.get(valueArg);
    }
}
