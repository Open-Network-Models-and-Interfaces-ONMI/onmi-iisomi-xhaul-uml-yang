import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;
import org.apache.commons.compress.compressors.gzip.GzipCompressorOutputStream;
import org.apache.commons.compress.utils.IOUtils;

public class CompressionTest {

	final static String KARAFLOG_FOLDER="/home/herbert/odl/distribution-karaf-0.6.1-Carbon/data/log/";
	public static void main(String[] args)
	{
		createLogDownload("log.tar.gz");
	}
	private static void createLogDownload(String tarFilename) {
		System.out.println("start creating tar file "+tarFilename);
		File f = new File(tarFilename);
		if (f.exists())
			f.delete();
		FileOutputStream fOut = null;
		BufferedOutputStream bOut = null;
		GzipCompressorOutputStream gzOut = null;
		TarArchiveOutputStream tOut = null;
		try {
			System.out.println(new File(".").getAbsolutePath());
			fOut = new FileOutputStream(new File(tarFilename));
			bOut = new BufferedOutputStream(fOut);
			gzOut = new GzipCompressorOutputStream(bOut);
			tOut = new TarArchiveOutputStream(gzOut);
			addFileToTarGz(tOut, KARAFLOG_FOLDER, "", ".log");
		} catch (IOException e) {
			System.out.println("problem creating tar:" + e.getMessage());
		} finally {
			try {
				if (tOut != null) {
					tOut.finish();
					tOut.close();
				}
				if (gzOut != null)
					gzOut.close();
				if (bOut != null)
					bOut.close();
				if (fOut != null)
					fOut.close();
				System.out.println("finished creating tar file");
			} catch (IOException e) {
				System.out.println("problem closing streams:" + e.getMessage());
			}
		}

	}

	private static void addFileToTarGz(TarArchiveOutputStream tOut, String path, String base, final String filter)
			throws IOException {
		File f = new File(path);
		String entryName = base + f.getName();
		TarArchiveEntry tarEntry = new TarArchiveEntry(f, entryName);
		tOut.putArchiveEntry(tarEntry);

		if (f.isFile())
		{
			if( f.getName().contains(filter)) {
				System.out.println("adding to tar:"+f.getName());
				IOUtils.copy(new FileInputStream(f), tOut);
				tOut.closeArchiveEntry();
			}
			else
				System.out.println("file "+f.getName()+" filtered out, filter="+filter);
		} else {
			tOut.closeArchiveEntry();
			File[] children = f.listFiles();
			if (children != null) {
				for (File child : children) {
					System.out.println(child.getName());
					addFileToTarGz(tOut, child.getAbsolutePath(), entryName + "/", filter);
				}
			}
		}
	}
}
