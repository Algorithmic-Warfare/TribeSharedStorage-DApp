import React, { useMemo, useState } from "react";
import {
  AbiItem,
  BaseError,
  ContractFunctionRevertedError,
  encodeFunctionData,
  getAbiItem,
  getContract,
  GetContractReturnType,
  PublicClient,
  Client,
  UnionOmit,
  ReadContractParameters,
  Abi,
} from "viem";
import { SmartAssemblyType, type InventoryItem } from "@eveworld/types";
import {
  findOwnerByAddress,
  formatM3,
  getInventoryItemId,
  isOwner,
} from "@eveworld/utils";
import {
  EveLinearBar,
  EveScroll,
  EveButton,
  EveInput,
} from "@eveworld/ui-components";
import { useConnection, useNotification } from "@eveworld/contexts";
import { WalletClient } from "viem";
import { Severity } from "@eveworld/types";

import { useMUD } from "../MUDContext";

const ModifiedInventoryView = React.memo(
  ({
    smartAssembly,
    walletClient,
  }: {
    smartAssembly: SmartAssemblyType<"SmartStorageUnit">;
    walletClient: WalletClient;
  }): JSX.Element => {
    if (!smartAssembly) return <></>;
    const {
      storageItems,
      ephemeralInventoryList,
      storageCapacity,
      usedCapacity,
    } = smartAssembly.inventory;

    let isEntityOwner: boolean = isOwner(
      smartAssembly,
      walletClient?.account?.address
    );

    const { systemCalls } = useMUD();

    const playerInventory = ephemeralInventoryList.find((x) => {
      return x.ownerId == walletClient?.account?.address.toLowerCase();
    });

    // If owner, return persistent storage items
    // If player, return own ephemeral storage items
    const inventoryItems = storageItems?.map((item: any) => {
      return item;
    });

    const ephemeralInventoryItems =
      playerInventory?.ephemeralInventoryItems?.map((item) => {
        return item;
      });

    const ephemeralInventoryItemIds =
      playerInventory?.ephemeralInventoryItems?.map((item) => {
        return BigInt(item.itemId);
      }) || [];

    const storageCap = storageCapacity;

    const usedCap = usedCapacity;

    const handleWithdraw = async (
      inventoryItemId: bigint,
      inventoryItemAmount: bigint
    ) => {
      await systemCalls.withdraw(
        BigInt(smartAssembly.id),
        inventoryItemId,
        inventoryItemAmount
      );
    };

    return (
      <>
        <div className="Quantum-Container Title">{"Storage Inventory"}</div>
        <EveScroll maxHeight="260px" id="smartassembly-inventory">
          <div className="Quantum-Container text-xs flex flex-col !py-4 gap-2 min-h-full">
            {!inventoryItems || inventoryItems.length === 0 ? (
              <div>Empty</div>
            ) : (
              inventoryItems?.map((item, index) => (
                <div key={index}>
                  <InventoryItem
                    item={item}
                    isEntityOwner={isEntityOwner}
                    withdrawAction={handleWithdraw}
                  />
                </div>
              ))
            )}
          </div>
        </EveScroll>

        <div className="Quantum-Container Title">Inventory Capacity</div>
        <div
          className="Quantum-Container text-2xs font-bold py-2"
          id="smartassembly-invcapacity"
        >
          <EveLinearBar
            nominator={formatM3(usedCap ?? BigInt(0))}
            denominator={formatM3(storageCap ?? BigInt(0))}
            label={`m3`}
          />
        </div>
      </>
    );
  }
);

const InventoryItem = ({
  isEntityOwner,
  item,
  withdrawAction,
}: {
  isEntityOwner: boolean;
  item: InventoryItem;
  withdrawAction: (
    inventoryItemId: bigint,
    inventoryItemAmount: bigint
  ) => void;
}) => {
  const { typeId, name, quantity, itemId } = item;

  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);

  const handleWithdraw = () => {
    return withdrawAction(BigInt(itemId), BigInt(selectedQuantity));
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full justify-between font-bold">
        <span>{name ?? `Item Type ${typeId}`}</span>
        <span>{quantity}</span>
      </div>
      <span className="text-2xs">ID: {typeId}</span>
      {isEntityOwner ? (
        <></>
      ) : (
        <>
          <EveInput
            inputType="numerical"
            fieldName="Quantity"
            defaultValue={selectedQuantity}
            placeholder={`${selectedQuantity}`}
            onChange={(value) => {
              if (Number(value) <= quantity) {
                setSelectedQuantity(Number(value));
              } else {
                setSelectedQuantity(quantity);
              }
            }}
          />
          <EveButton typeClass="primary" onClick={handleWithdraw}>
            withdraw
          </EveButton>
        </>
      )}
    </div>
  );
};

export default ModifiedInventoryView;
