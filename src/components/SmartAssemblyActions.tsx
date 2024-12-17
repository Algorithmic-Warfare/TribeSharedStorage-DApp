import { Modal } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import {
  AbiItem,
  BaseError,
  ContractFunctionRevertedError,
  encodeFunctionData,
  getAbiItem,
} from "viem";

import {
  useSmartObject,
  useConnection,
  useWorld,
  useNotification,
} from "@eveworld/contexts";
import { Actions, Severity, State } from "@eveworld/types";
import { EveInput, EveButton } from "@eveworld/ui-components";
import { Close } from "@eveworld/ui-components/assets";
import { SYSTEM_IDS, getDappUrl, getSystemId, isOwner } from "@eveworld/utils";

/**
 * Handles actions for a smart storage unit, such as editing unit details, bringing online/offline, and accessing dApp link.
 *
 * Renders buttons for editing unit details, bringing the unit online/offline, and accessing the dApp link. It also includes a modal for editing unit details.
 *
 * @returns JSX.Element
 */
const SmartAssemblyActions = React.memo(() => {
  const [showEditUnit, setShowEditUnit] = useState<boolean>(false);

  const { smartAssembly } = useSmartObject();
  const { walletClient, publicClient, isCurrentChain, defaultNetwork } =
    useConnection();
  const { world } = useWorld();
  const { handleSendTx, notify } = useNotification();

  if (smartAssembly === undefined || smartAssembly === null) return <></>;

  const isEntityOwner: boolean = isOwner(
    smartAssembly,
    walletClient?.account?.address
  );

  // If smart assembly has fuel, user is allowed to bring online
  const hasFuel: boolean = smartAssembly.fuel.fuelAmount > 0;
  // If smart assembly is online, user is allowed to bring offline
  const isOnline: boolean = smartAssembly.stateId === State.ONLINE;

  const handleAction = async (action: Actions) => {
    if (!world || !smartAssembly || !walletClient?.account || !publicClient)
      return;

    const getAction = async () => {
      if (!walletClient?.account) return;

      const offlineAbiItem: AbiItem | undefined = getAbiItem({
        abi: world.abi,
        name: "bringOffline",
      });
      const onlineAbiItem: AbiItem | undefined = getAbiItem({
        abi: world.abi,
        name: "bringOnline",
      });

      switch (action) {
        case Actions.BRING_OFFLINE:
          return encodeFunctionData({
            abi: [offlineAbiItem],
            functionName: "bringOffline",
            args: [BigInt(smartAssembly.id)],
          });
        case Actions.BRING_ONLINE:
          return encodeFunctionData({
            abi: [onlineAbiItem],
            functionName: "bringOnline",
            args: [BigInt(smartAssembly.id)],
          });
        default:
      }
    };

    let callData: `0x${string}` | undefined;

    try {
      callData = await getAction();
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError
        );

        if (revertError instanceof ContractFunctionRevertedError) {
          // const errorName = revertError.data?.errorName ?? "";
          notify({ type: Severity.Error, message: revertError.message });
        }
      }
    }
    const systemId = getSystemId(defaultNetwork.systemIds, SYSTEM_IDS.ONLINE);
    return (
      callData &&
      systemId &&
      handleSendTx({ encodedFunctionData: callData, systemId: systemId })
    );
  };

  return (
    <div
      className="Quantum-Container font-semibold grid grid-cols-3 gap-2"
      id="SmartObject-Actions"
    >
      <EveButton
        typeClass="primary"
        onClick={() => setShowEditUnit(!showEditUnit)}
        className="primary-sm"
        disabled={!isCurrentChain || !isEntityOwner}
        id="edit-unit"
      >
        Edit unit
      </EveButton>

      <EveButton
        typeClass="primary"
        onClick={() =>
          handleAction(isOnline ? Actions.BRING_OFFLINE : Actions.BRING_ONLINE)
        }
        className="primary-sm"
        disabled={!isCurrentChain || !isEntityOwner || !hasFuel}
        id="bring-online-offline"
      >
        {!hasFuel
          ? "FUEL TO ONLINE"
          : isOnline
            ? Actions.BRING_OFFLINE
            : Actions.BRING_ONLINE}
      </EveButton>
      <EveButton
        typeClass="primary"
        className="primary-sm"
        onClick={() => window.open(getDappUrl(smartAssembly))}
        disabled={!smartAssembly?.dappUrl}
        id="dapp-link"
      >
        dApp link
      </EveButton>

      <EditUnit
        visible={showEditUnit}
        handleClose={() => setShowEditUnit(false)}
      />
    </div>
  );
});

/**
 * EditUnit component for handling editing of Smart Assembly properties.
 *
 * This component renders a modal with fields to edit DApp URL, unit name, and unit description.
 * It provides functionality to save the edited values in one transaction.
 *
 * Props:
 * - visible: boolean - Flag to control the visibility of the modal.
 * - handleClose: () => void - Function to handle closing the modal.
 *
 * State:
 * - isEdited: boolean - Flag to track if any field has been edited.
 *
 * Dependencies:
 * - walletClient, publicClient: from useConnection hook.
 * - world: from useWorld hook.
 * - handleSendTx, notify: from useNotification hook.
 * - smartAssembly: from useSmartObject hook.
 *
 * Side Effects:
 * - Updates the edited values in the modal fields.
 * - Executes a transaction to set Smart Assembly metadata.
 */
const EditUnit = React.memo(
  ({ visible, handleClose }: { visible: boolean; handleClose: () => void }) => {
    const [isEdited, setIsEdited] = useState<boolean>(false);

    const { walletClient, publicClient, defaultNetwork } = useConnection();
    const { world } = useWorld();
    const { handleSendTx, notify } = useNotification();
    const { smartAssembly } = useSmartObject();

    // Every time the Edit Unit modal closes it should return to its default, unedited state
    useEffect(() => {
      setIsEdited(false);
    }, [visible]);

    const urlValueRef = useRef(smartAssembly?.dappUrl ?? "");
    const nameValueRef = useRef(smartAssembly?.name ?? "");
    const descriptionValueRef = useRef(smartAssembly?.description ?? "");

    const handleEdit = (
      refString: React.MutableRefObject<string | number>,
      eventString: string | number | null
    ): void => {
      if (eventString == null) return;
      setIsEdited(true);
      refString.current = eventString;
    };

    /** Async function that calls ´setEntityRecordOffchain´,
     * setting Smart Assembly URL, name, description in one transaction.
     **/
    const handleSave = async () => {
      if (!world || !smartAssembly || !walletClient?.account || !publicClient)
        return;

      const systemId = getSystemId(
        defaultNetwork.systemIds,
        SYSTEM_IDS.UPDATE_METADATA
      );
      if (!systemId) return;

      try {
        const setMetadataAbiItem: AbiItem | undefined = getAbiItem({
          abi: world.abi,
          name: "setDeployableMetadata",
        });

        const callData = encodeFunctionData({
          abi: [setMetadataAbiItem],
          functionName: "setDeployableMetadata",
          args: [
            BigInt(smartAssembly.id),
            nameValueRef.current,
            urlValueRef.current,
            descriptionValueRef.current,
          ],
        });

        handleSendTx({
          encodedFunctionData: callData,
          systemId,
          onClose: () => handleClose(),
        });
      } catch (e) {
        notify({
          type: Severity.Error,
          message: "Transaction failed to execute",
        });
        console.error(e);
      }
    };

    return (
      <Modal open={visible} onClose={() => handleClose()} id="Edit-Unit-Modal">
        <div className="Absolute-Center top-[25vh] w-[280px] bg-crude !p-0">
          <div className="flex justify-between bg-brightquantum text-crude items-center pl-2 text-sm font-bold">
            Edit Unit
            <EveButton
              typeClass="primary"
              className="border border-crude w-7 !p-0"
            >
              <Close className="text-crude" onClick={() => handleClose()} />
            </EveButton>
          </div>
          <div className="Quantum-Container !border-t-0 !py-4 grid gap-2">
            <EveInput
              inputType="string"
              defaultValue={smartAssembly?.dappUrl}
              onChange={(str) => handleEdit(urlValueRef, str)}
              fieldName="DApp URL"
            />
            <EveInput
              inputType="string"
              defaultValue={smartAssembly?.name}
              onChange={(str) => handleEdit(nameValueRef, str)}
              fieldName="Unit name"
            />
            <EveInput
              inputType="multiline"
              defaultValue={smartAssembly?.description}
              onChange={(str) => handleEdit(descriptionValueRef, str)}
              fieldName="Unit description"
            />
            <div className="mb-2" />
            <div className="grid grid-cols-4 gap-2">
              <EveButton
                typeClass="ghost"
                className="uppercase"
                onClick={() => handleClose()}
              >
                Cancel
              </EveButton>
              <EveButton
                typeClass="primary"
                className="primary-sm uppercase col-span-3"
                onClick={() => handleSave()}
                disabled={!isOwner || !isEdited}
                id="send-save-tx"
              >
                Save
              </EveButton>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
);

export default React.memo(SmartAssemblyActions);
