import React, { useEffect } from "react";
import {
  isOwner,
} from "@eveworld/utils";
import {
  useSmartObject,
  useNotification,
  useConnection,
} from "@eveworld/contexts";
import { Severity, SmartAssemblyType } from "@eveworld/types";
import {
  SmartAssemblyInfo,
  EveLoadingAnimation,
  ClickToCopy,
  ErrorNotice,
  EveButton,
  ErrorNoticeTypes,
  InventoryView,
} from "@eveworld/ui-components";
import { abbreviateAddress } from "@eveworld/utils";
import { defaultDescriptions } from "@eveworld/utils/consts";

import EquippedModules from "./Modules";
import SmartAssemblyActions from "./SmartAssemblyActions";
import SmartGateImage from "../assets/smart-gate.png";
import SmartStorageUnitImage from "../assets/smart-storage-unit.png";
import SmartTurretImage from "../assets/smart-turret.png";
import { useMUD } from "../MUDContext";
import {ethers} from "ethers";

const EntityView = React.memo((): JSX.Element => {
  const { defaultNetwork, gatewayConfig, walletClient } = useConnection();
  const { smartAssembly, smartCharacter, loading } = useSmartObject();
  const { notify, handleClose } = useNotification();
  const { systemCalls } = useMUD();

  useEffect(() => {
    if (loading) {
      notify({ type: Severity.Info, message: "Loading..." });
    } else {
      handleClose();
    }
  }, [loading]);

  if ((!loading && !smartAssembly) || !smartAssembly?.isValid) {
    return <ErrorNotice type={ErrorNoticeTypes.SMART_ASSEMBLY} />;
  }

  let isEntityOwner: boolean = isOwner(
    smartAssembly,
    walletClient?.account?.address
  );

  const { ephemeralInventoryList } = (
    smartAssembly as SmartAssemblyType<"SmartStorageUnit">
  ).inventory;

  const playerInventory = ephemeralInventoryList.find((x) => {
    return (
      ethers.getAddress(x.ownerId) ==
      ethers.getAddress(walletClient?.account?.address as string)
    );
  });

  const ephemeralInventoryItemIds =
    playerInventory?.ephemeralInventoryItems?.map((item) => {
      return BigInt(item.itemId);
    }) || [];

  const defaultImages: Record<string, string> = {
    SmartStorageUnit: SmartStorageUnitImage,
    SmartTurret: SmartTurretImage,
    SmartGate: SmartGateImage,
  };

  const handlePing = async () => {
    await systemCalls.ping("hello");
  };
  const handleDeposit = async () => {
    if (ephemeralInventoryItemIds.length==0){
      notify({ type: Severity.Error, message: "No items to deposit" });
    } else {
      notify({ type: Severity.Info, message: "Depositing inventory items..." });
      await systemCalls.deposit(
        BigInt(smartAssembly.id),
         ephemeralInventoryItemIds
       );
       handleClose();
     };
    }
      


  return (
    <EveLoadingAnimation position="diagonal">
      <div className="grid border border-brightquantum bg-crude">
        <div
          className="flex flex-col align-center border border-brightquantum"
          id="smartassembly-name"
        >
          <div className="bg-brightquantum text-crude flex items-stretch justify-between px-2 py-1 font-semibold">
            <span className="uppercase">{smartAssembly?.name}</span>
            <span className="flex flex-row items-center">
              {abbreviateAddress(smartAssembly?.id)}
              <ClickToCopy
                text={smartAssembly?.id}
                className="text-crude"
              />{" "}
            </span>
          </div>
          <img
            src={defaultImages[smartAssembly.assemblyType]}
            id="smartassembly-image"
          />
          <SmartAssemblyActions />

          <div className="Quantum-Container Title">Description</div>
          <div
            className="Quantum-Container font-normal text-xs !py-4"
            id="smartassembly-description"
          >
            {smartAssembly.description
              ? smartAssembly.description
              : defaultDescriptions[smartAssembly.assemblyType]}
          </div>
        </div>

        <div className="grid grid-cols-2 mobile:grid-cols-1 bg-crude">
          <div>
            {isEntityOwner ? (
              <SmartAssemblyInfo
                smartAssembly={smartAssembly}
                smartCharacter={smartCharacter}
                defaultNetwork={defaultNetwork}
                gatewayConfig={gatewayConfig}
              />
            ) : (
              <InventoryView
                smartAssembly={
                  smartAssembly as SmartAssemblyType<"SmartStorageUnit">
                }
                walletClient={walletClient!}
              />
            )}
            {isEntityOwner ? (
              <>
                <div className="Quantum-Container">
                  <EveButton typeClass="primary" onClick={handlePing}>
                    ping
                  </EveButton>
                </div>
              </>
            ) : (
              <>
                <div className="Quantum-Container">
                  <EveButton typeClass="primary" onClick={handleDeposit}>
                    deposit all
                  </EveButton>
                </div>
              </>
            )}
          </div>
          <div>
            <EquippedModules />
          </div>
        </div>
      </div>
    </EveLoadingAnimation>
  );
});

export default React.memo(EntityView);
