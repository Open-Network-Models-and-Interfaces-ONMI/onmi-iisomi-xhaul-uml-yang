import static org.junit.Assert.*;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.Test;

import com.highstreet.technologies.odlux.ResFilesServlet;
import com.opensymphony.xwork2.util.ClassLoaderUtil;

public class LoadResourcesTest {

	@Test
	public void test() {
		ResFilesServlet servlet = new ResFilesServlet();
		String indexhtml=null;
		indexhtml=servlet.loadFileContent("odlux/index.html");
		assertNotNull(indexhtml);
		final String regex = "require\\(\\[\"app\".*\\]";
		final Pattern pattern = Pattern.compile(regex,Pattern.MULTILINE);
		final Matcher matcher = pattern.matcher(indexhtml);
		System.out.println(indexhtml);
		assertTrue(matcher.find());
	}

}
