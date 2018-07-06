package com.highstreet.technologies.helpserver.data;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;

import org.osgi.framework.Bundle;

/**
 * Extract subtree with resources from Opendaylight/Karaf/OSGi bundle into Karaf directory<br>
 *
 * Reference: Eclipsezone @see <a href="https://www.eclipsezone.com/eclipse/forums/t101557.html">https://www.eclipszone.com</a>
 * <br><br>
 * Example for resource and directory path from karaf log.
 *	 write resource: help/FAQ/0.4.0/README.md
 *   Create directories for: data/cache/com.highstreet.technologies.help/help/FAQ/0.4.0/README.md
 *   Open the file: data/cache/com.highstreet.technologies.help/help/FAQ/0.4.0/README.md
 *   Problem: Binary, JPG files => do not use buffer related functions
 *
 * Hint: Werify with file manager the content of the bundle.jar file to see the location of the resources.
 * There is no need to mark them via the classpath.
 */

public class ExtactBundleResource {

	/**
	 * Extract resources from Karaf/OSGi bundle into karaf directory structure.
	 * @param bundle Karaf/OSGi bundle with resources
	 * @param filePrefix prefix in karaf file system for destination e.g. "data/cache/com.highstreet.technologies."
	 * @param ressoureRoot root name of ressources, with leading "/". e.g. "/help"
	 * @throws IOException In case of problems.
	 */
	public static void copyBundleResoucesRecursively(Bundle bundle, String filePrefix, String ressoureRoot) throws IOException {
		 copyResourceTreeRecurse(bundle, filePrefix, bundle.getEntryPaths(ressoureRoot));
	}

	/**
	 * Delete a file or a directory and its children.
	 * @param file The directory to delete.
	 * @throws IOException Exception when problem occurs during deleting the directory.
	 */
	public static void deleteRecursively(File file) throws IOException {

		if (file.isDirectory()) {
			for (File childFile : file.listFiles()) {
				if (childFile.isDirectory()) {
					deleteRecursively(childFile);
				} else {
					if (!childFile.delete()) {
						throw new IOException();
					}
				}
			}
		}

		if (!file.delete()) {
			throw new IOException();
		}
	}

	// ------------- Private functions

	/**
	 * Recurse function to steps through the resource element tree
	 * @param b Bundle index for bundle with resourcs
	 * @param filePrefix
	 * @param resource
	 * @throws IOException
	 */
	private static void copyResourceTreeRecurse(Bundle b, String filePrefix, Enumeration<String> resource) throws IOException {
		while (resource.hasMoreElements()) {
			String name = resource.nextElement();
			Enumeration<String> list = b.getEntryPaths(name);
			if (list != null) {
				copyResourceTreeRecurse(b, filePrefix, list);
			} else {
				//Read
				InputStream in = b.getEntry(name).openStream();
				File targetFile = new File(filePrefix+name);
				targetFile.getParentFile().mkdirs();
				OutputStream outStream = new FileOutputStream(targetFile);
				int theInt;
				while ((theInt = in.read()) >= 0) {
					outStream.write(theInt);
				}
				in.close();
				outStream.flush();
				outStream.close();
			}
		}
	}
}