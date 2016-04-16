package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac;
import org.opendaylight.yangtools.yang.binding.ChildOf;
import org.opendaylight.yangtools.yang.common.QName;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCurrentProblem;
import org.opendaylight.yangtools.yang.binding.Augmentable;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * container airInterfaceCurrentProblemList {
 *     leaf-list problemList {
 *         type string;
 *     }
 *     uses AirInterfaceCurrentProblem;
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/MW_AirInterface_Pac/airInterfaceCurrentProblemList&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCurrentProblemListBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCurrentProblemListBuilder
 *
 */
public interface AirInterfaceCurrentProblemList
    extends
    ChildOf<MWAirInterfacePac>,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCurrentProblemList>,
    AirInterfaceCurrentProblem
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","airInterfaceCurrentProblemList"));


}

