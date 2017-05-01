package org.opendaylight.mwtn.base.netconf;

import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;

import org.opendaylight.controller.md.sal.binding.api.DataBroker;
import org.opendaylight.controller.md.sal.binding.api.ReadOnlyTransaction;
import org.opendaylight.controller.md.sal.binding.api.WriteTransaction;
import org.opendaylight.controller.md.sal.common.api.data.LogicalDatastoreType;
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
            logger.error("Transaction failed with error {} for {} of object {}", e.getMessage(), isAdd ? "add" : "delete", dataObject);
            modification.cancel();
            return false;
        }
    }

    public static <T extends DataObject> Optional<T> readDataOptional(DataBroker dataBroker, LogicalDatastoreType dataStoreType, InstanceIdentifier<T> iid) {
        Preconditions.checkNotNull(dataBroker);
        ReadOnlyTransaction readTransaction = dataBroker.newReadOnlyTransaction();
        try {
            Optional<T> optionalData = readTransaction.read(dataStoreType, iid).get();
            return optionalData;
        } catch (CancellationException | ExecutionException | InterruptedException e) {
            logger.error("Read transaction for identifier {} failed with error {}", iid, e.getMessage());
            readTransaction.close();
        }
        return Optional.fromNullable(null);
    }


    public static <T extends DataObject> T readData(DataBroker dataBroker, LogicalDatastoreType dataStoreType, InstanceIdentifier<T> iid) {
        return readDataOptional(dataBroker, dataStoreType, iid).orNull();

    }
}
