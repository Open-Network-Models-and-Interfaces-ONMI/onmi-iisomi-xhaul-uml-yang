

import java.io.File;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class TestFileChangeNotification {
	/**
	 * Check every now and then that a certain file has not changed. If it has, then
	 * call the {@link #doOnChange} method.
	 *
	 * @author JunHo Yoon
	 * @since 3.1.1
	 */
	public static abstract class FileWatchdog extends Thread {

		private static final Logger LOGGER = LoggerFactory.getLogger(FileWatchdog.class);
		/**
		 * The default delay between every file modification check, set to 60
		 * seconds.
		 */
		public static final long DEFAULT_DELAY = 60000;
		/**
		 * The name of the file to observe for changes.
		 */
		private String filename;

		/**
		 * The delay to observe between every check. By default set
		 * {@link #DEFAULT_DELAY}.
		 */
		private long delay = DEFAULT_DELAY;

		private File file;
		private long lastModified = 0;
		private boolean warnedAlready = false;
		private boolean interrupted = false;

		protected  FileWatchdog(String filename) {
			this.filename = filename;
			file = new File(filename);
			setDaemon(true);
			checkAndConfigure();
		}

		/**
		 * Set the delay to observe between each check of the file changes.
		 *
		 * @param delay
		 *            the frequency of file watch.
		 */
		public  void setDelay(long delay) {
			this.delay = delay;
		}

		/**
		 * abstract method to be run when the file is changed.
		 */
		protected abstract void doOnChange();

		protected  void checkAndConfigure() {
			boolean fileExists;
			try {
				fileExists = file.exists();
			} catch (SecurityException e) {
				LOGGER.warn("Was not allowed to read check file existence, file:[" + filename + "].");
				interrupted = true; // there is no point in continuing
				return;
			}

			if (fileExists) {
				long l = file.lastModified(); // this can also throw a
				if (lastModified ==0) {
					lastModified = l; // is very unlikely.
				}
				if (l > lastModified) { // however, if we reached this point this
					lastModified = l; // is very unlikely.
					doOnChange();
					warnedAlready = false;
				}
			} else {
				if (!warnedAlready) {
					LOGGER.debug("[" + filename + "] does not exist.");
					warnedAlready = true;
				}
			}
		}

		@Override
		public  void run() {
			while (!interrupted && !isInterrupted()) {
				try {
					Thread.sleep(delay);
				} catch (InterruptedException e) {
				}
				checkAndConfigure();
			}
		}
	}

	public static class SomeWatchFile extends FileWatchdog{

	      protected SomeWatchFile(String filename) {
	            super(filename);
	            this.setDelay(1000);
	        }

	        @Override
	        protected void doOnChange() {
	            System.out.println("File has changed");
	        }
	}

    public static void main(String args[]) throws IOException {
	            SomeWatchFile someWatchFile = new SomeWatchFile ("watchedFile.txt");
	            someWatchFile.start();

	            String fileName = "watchedFile.txt";
	            File tempFile = new File(fileName);
	            tempFile.createNewFile();

	            System.out.println("1. Press F5 in eclipse to see and modify 2. Press enter to exit");
	            System.in.read();
	            System.out.println("Remove file "+fileName);
	            tempFile.delete();
	        }


}