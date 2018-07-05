import com.highstreet.technologies.info.KarafBundleList;

public class BundleListTest {

	public static void main(String[] args)
	{
		KarafBundleList list=new KarafBundleList("/home/herbert/odl/distribution-karaf-0.6.1-Carbon/data/cache/org.eclipse.osgi/bundles");
		list.scan();
		System.out.println(list.toJSON());
	}
}
