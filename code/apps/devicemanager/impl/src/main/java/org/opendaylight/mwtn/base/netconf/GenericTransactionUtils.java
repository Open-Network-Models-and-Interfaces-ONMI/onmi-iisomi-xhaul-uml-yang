package org.opendaylight.mwtn.base.netconf;

import java.util.NoSuchElementException;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

import javax.annotation.Nullable;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.ReadOnlyTransaction;
import org.opendaylight.controller.md.sal.binding.api.WriteTransaction;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
import org.opendaylight.controller.md.sal.common.api.data.ReadFailedException;
import org.opendaylight.controller.md.sal.common.api.data.TransactionCommitFailedException;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.binding.InstanceIdentifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.base.Optional;
import com.google.common.base.Preconditions;
import com.google.common.util.concurrent.CheckedFuture;

public final class GenericTransactionUtils {
    static final Logger logger = LoggerFactory.getLogger(GenericTransactionUtils.class);

    public static <T extends DataObject> boolean writeData(DataBroker dataBroker, LogicalDatastoreType logicalDatastoreType,
            InstanceIdentifier<T> iid, T dataObject, boolean isAdd) {
        Preconditions.checkNotNull(dataBroker);
        WriteTransaction modification = dataBroker.newWriteOnlyTransaction();
        if (isAdd) {
            if (dataObject == null) {
                logger.warn("Invalid attempt to add a non-existent object to path {}", iid);
                return false;
            }
            modification.merge(logicalDatastoreType, iid, dataObject, true /*createMissingParents*/);
        }
        else {
            modification.delete(LogicalDatastoreType.CONFIGURATION, iid);
        }
        CheckedFuture<Void, TransactionCommitFailedException> commitFuture = modification.submit();
        try {
            commitFuture.checkedGet();
            logger.debug("Transaction success for {} of object {}", isAdd ? "add" : "delete", dataObject);
            return true;
        } catch (Exception e) {
            logger.warn("Transaction failed with error {} for {} of object {}", e.getMessage(), isAdd ? "add" : "delete", dataObject);
            modification.cancel();
            return false;
        }
    }

     /*
     /**
     * Deliver the data back or null
     * @param dataBroker for accessing data
     * @param dataStoreType to address datastore
     * @param iid id to access data
     * @return Optional for the data
     * /
    private static <T extends DataObject> Optional<T> readDataOptional(DataBroker dataBroker, LogicalDatastoreType dataStoreType, InstanceIdentifier<T> iid) {

        Preconditions.checkNotNull(dataBroker);
        ReadOnlyTransaction readTransaction = dataBroker.newReadOnlyTransaction();
        try {
            CheckedFuture<Optional<T>, ReadFailedException> od = readTransaction.read(dataStoreType, iid);
            Optional<T> optionalData = od.get();
            readTransaction.close();
            return optionalData;
        } catch (CancellationException | ExecutionException | InterruptedException | NoSuchElementException e) {
            logger.warn("Read transaction for identifier "+iid+" failed with error "+e.getMessage());
            readTransaction.close();
            return Optional.fromNullable(null);
        }
    } /**/

    /**
     * Deliver the data back or null. Warning
     * @param <T> SubType of the DataObject to be handled
     * @param dataBroker for accessing data
     * @param dataStoreType to address datastore
     * @param iid id to access data
     * @return null or object
     */
    @Nullable
    public static <T extends DataObject> T readData(DataBroker dataBroker, LogicalDatastoreType dataStoreType, InstanceIdentifier<T> iid) {
        //return readDataOptional(dataBroker, dataStoreType, iid).orNull();
        AtomicBoolean noErrorIndication = new AtomicBoolean();
        AtomicReference<String> statusText = new AtomicReference<>();

        T obj = readDataOptionalWithStatus(dataBroker, dataStoreType, iid, noErrorIndication, statusText);

        if (! noErrorIndication.get()) {
            logger.warn("Read transaction for identifier "+iid+" failed with error "+statusText.get());
        }

        return obj;
    }

    /**
     * Deliver the data back or null
     * @param <T> SubType of the DataObject to be handled
     * @param dataBroker for accessing data
     * @param dataStoreType to address datastore
     * @param iid id to access data
     * @param noErrorIndication (Output) true if data could be read and are available and is not null
     * @param statusIndicator (Output) String with status indications during the read.
     * @return null or object
     */
    @Nullable
    public static <T extends DataObject> T readDataOptionalWithStatus(DataBroker dataBroker, LogicalDatastoreType dataStoreType, InstanceIdentifier<T> iid, AtomicBoolean noErrorIndication, AtomicReference<String> statusIndicator) {

        T data = null;
        noErrorIndication.set(false);
        statusIndicator.set("Preconditions");
        Preconditions.checkNotNull(dataBroker);
        statusIndicator.set("Create Read Transaction");
        ReadOnlyTransaction readTransaction = dataBroker.newReadOnlyTransaction();

        try {
            CheckedFuture<Optional<T>, ReadFailedException> od = readTransaction.read(dataStoreType, iid);
            statusIndicator.set("Read done");
            if (od != null) {
                statusIndicator.set("Unwrap checkFuture done");
                Optional<T> optionalData = od.get();
                if (optionalData != null) {
                    statusIndicator.set("Unwrap optional done");
                  	data = optionalData.orNull();
              		statusIndicator.set("Read transaction done");
               		noErrorIndication.set(true);
                }
            }
        } catch (CancellationException | ExecutionException | InterruptedException | NoSuchElementException e) {
            statusIndicator.set("Read transaction for identifier "+iid+" failed with error "+e.getMessage());
        }

        readTransaction.close();
        return data;
    }


}
