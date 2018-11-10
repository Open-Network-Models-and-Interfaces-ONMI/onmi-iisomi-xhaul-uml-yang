package org.opendaylight.mwtn.base.netconf;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;

public class NotificationWorker<T> implements AutoCloseable {

	private final BlockingQueue<T> workQueue;
	private final ExecutorService service;
	private final NotificationActor<T> actor;

	public NotificationWorker(int numWorkers, int workQueueSize, NotificationActor<T> actorObject) {
		workQueue = new LinkedBlockingQueue<T>(workQueueSize);
		service = Executors.newFixedThreadPool(numWorkers);
		actor = actorObject;

		for (int i=0; i < numWorkers; i++) {
			service.submit(new Worker<T>(workQueue, actor));
		}
	}

	public void put(T item) {
		try {
			workQueue.put(item);
		} catch (InterruptedException ex) {
			Thread.currentThread().interrupt();
		}
	}

	@Override
	public void close() throws Exception {
		// TODO Auto-generated method stub
	}

	private static class Worker<T> implements Runnable {
        private final BlockingQueue<T> workQueue;
		private final NotificationActor<T> actor;


        public Worker(BlockingQueue<T> workQueue, NotificationActor<T> actor) {
            this.workQueue = workQueue;
            this.actor = actor;
        }

		@Override
		public void run() {
			while (!Thread.currentThread().isInterrupted()) {
				try {
					T item = workQueue.take();
					actor.notificationActor(item);
					// Process item
				} catch (InterruptedException ex) {
					Thread.currentThread().interrupt();
					break;
				}
			}
		}
	}



}
