package org.opendaylight.mwtn.index.impl;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import org.opendaylight.mwtn.base.database.HtDatabaseNode;
import org.opendaylight.mwtn.base.database.HtDatabaseUpdateFile;
import org.opendaylight.mwtn.base.database.HtDatabaseUpdateFile.EsUpdateObject;
import org.opendaylight.mwtn.base.database.HtDatabaseUpdateFile.FileReadCallback;
import org.opendaylight.mwtn.base.database.HtDatabaseWebAPIClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class IndexUpdateService implements AutoCloseable {

	private static final Logger LOG = LoggerFactory.getLogger(IndexUpdateService.class);

	protected static final String FILENAME = "etc/elasticsearch_update.zip";

	private final HtDatabaseWebAPIClient webClient;

	private final boolean autoremove=true;

	@SuppressWarnings("unused")
    private ScheduledFuture<?> taskHandle;
	private final ScheduledExecutorService scheduler;
	private final HtDatabaseNode database;

	private final FileReadCallback onReadUpdateFile = new FileReadCallback()
	{
		@Override
		public void read(EsUpdateObject obj,String filename) {
			try {
				IndexUpdateService.this.webClient.sendRequest(obj.Uri, obj.Method, obj.Body);
				LOG.info("run database update file "+filename);
			} catch (IOException e) {
				LOG.warn("problem for request "+obj.Uri);
			}
		}

		@Override
		public void onerror(String filename,IOException e) {
			LOG.warn("problem reading content file "+filename+ " :"+e.getMessage());
		}

	};
	private final Runnable checkForUpdateTask = new Runnable() {

		@Override
		public void run() {
			File f=new File(FILENAME);
			if(f.exists())
			{
				LOG.debug("found update file "+f.getAbsolutePath());
				try {
					HtDatabaseUpdateFile updateFile=new HtDatabaseUpdateFile(FILENAME);
					if(updateFile.readFiles(onReadUpdateFile))
					{
						LOG.info("update successful");
					}
					updateFile.close();
					if(IndexUpdateService.this.autoremove)
					{
						LOG.debug("autodelete updatefile");
						f.delete();
					}

				} catch (IOException e) {
					LOG.warn("problem with update file:"+e.getMessage());
				}
			}
		}

	};



	public IndexUpdateService(HtDatabaseNode database, String esNodeserverName, String esClusterName, String esNodeName) {
		this.database = database;
		this.webClient = new HtDatabaseWebAPIClient();
		this.scheduler = Executors.newSingleThreadScheduledExecutor();
	}
	public void start()
	{
		this.taskHandle = this.scheduler.scheduleAtFixedRate(checkForUpdateTask, 0, 120, TimeUnit.SECONDS);
	}
	public void stop()
	{
		this.scheduler.shutdown();
	}
	@Override
	public void close() throws Exception {
		stop();
	}
}
