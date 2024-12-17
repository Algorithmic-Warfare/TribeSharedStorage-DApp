import React, { useState } from "react";
import { AbiItem, encodeFunctionData, getAbiItem } from "viem";

import {
  useConnection,
  useNotification,
  useSmartObject,
  useWorld,
} from "@eveworld/contexts";
import { SmartAssemblies, SmartAssemblyType } from "@eveworld/types";
import { GateView } from "@eveworld/ui-components";
import { getSystemId, SYSTEM_IDS } from "@eveworld/utils";
import ModifiedInventoryView from "./ModifiedInventoryView";

const EquippedModules = React.memo((): JSX.Element => {
  const [selectedSmartGate, setSelectedSmartGate] = useState<
    string | undefined
  >(undefined);

  const { walletClient, defaultNetwork } = useConnection();
  const { smartAssembly } = useSmartObject();
  const { world } = useWorld();
  const { handleSendTx } = useNotification();

  if (!smartAssembly || !walletClient)
    return <div className="Eve-Module"></div>;
  /**
   * From indexer, check to see what the category is for this smart assembly
   * render the appropriate module view for each category
   * **/

  const renderAttachedModule = (
    item: SmartAssemblyType<SmartAssemblies>
  ): JSX.Element => {
    /** SELECTED SMART GATE */
    const setLinkGate = (smartGateId: string) => {
      setSelectedSmartGate(smartGateId);
    };

    /** SMART GATE LINK FUNCTION */
    const linkFunction = () => {
      if (!world || !selectedSmartGate) return;
      const linkAbiItem: AbiItem | undefined = getAbiItem({
        abi: world.abi,
        name: "eveworld__linkSmartGates",
      });

      const callData = encodeFunctionData({
        abi: [linkAbiItem],
        functionName: "eveworld__linkSmartGates",
        args: [BigInt(smartAssembly.id), BigInt(selectedSmartGate)],
      });

      const systemId = getSystemId(
        defaultNetwork.systemIds,
        SYSTEM_IDS.LINK_GATE
      );

      return (
        callData &&
        systemId &&
        handleSendTx({ encodedFunctionData: callData, systemId })
      );
    };

    /** SMART GATE UNLINK FUNCTION */
    const unlinkFunction = () => {
      if (!world || !selectedSmartGate) return;
      const linkAbiItem: AbiItem | undefined = getAbiItem({
        abi: world.abi,
        name: "eveworld__unlinkSmartGates",
      });

      const callData = encodeFunctionData({
        abi: [linkAbiItem],
        functionName: "eveworld__unlinkSmartGates",
        args: [BigInt(smartAssembly.id), BigInt(selectedSmartGate)],
      });

      const systemId = getSystemId(
        defaultNetwork.systemIds,
        SYSTEM_IDS.UNLINK_GATE
      );

      return (
        callData &&
        systemId &&
        handleSendTx({ encodedFunctionData: callData, systemId })
      );
    };

    switch (item.assemblyType) {
      case "SmartStorageUnit":
        return (
          <ModifiedInventoryView
            smartAssembly={
              smartAssembly as SmartAssemblyType<"SmartStorageUnit">
            }
            walletClient={walletClient}
          />
        );
      case "SmartGate":
        return (
          <GateView
            smartAssembly={smartAssembly as SmartAssemblyType<"SmartGate">}
            walletClient={walletClient}
            setSelectGate={setLinkGate}
            linkFunction={linkFunction}
            unlinkFunction={unlinkFunction}
          />
        );
      case "SmartTurret":
        return <></>;
      default:
        return <></>;
    }
  };

  return (
    <div className="contents" id="Eve-Assembly-Module">
      {renderAttachedModule(smartAssembly)}
    </div>
  );
});

export default EquippedModules;
