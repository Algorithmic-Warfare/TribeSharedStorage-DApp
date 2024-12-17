/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */

import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  /*
   * The parameter list informs TypeScript that:
   *
   * - The first parameter is expected to be a
   *   SetupNetworkResult, as defined in setupNetwork.ts
   *
   *   Out of this parameter, we care about the following fields:
   *   - worldContract (which comes from getContract, see
   *     https://github.com/latticexyz/mud/blob/main/templates/react/packages/client/src/mud/setupNetwork.ts#L63-L69).
   *
   *   - useStore
   *   - tables
   */
  { worldContract }: SetupNetworkResult
) {
  const deposit = async (
    smartStorageUnitId: bigint,
    ephemeralInventoryItemIds: bigint[]
  ) => {
    //@ts-ignore
    await worldContract.write.AWAR__deposit([
      smartStorageUnitId,
      ephemeralInventoryItemIds,
    ]);
  };

  const withdraw = async (
    smartStorageUnitId: bigint,
    inventoryItemId: bigint,
    inventoryItemAmount: bigint
  ) => {
    console.log(smartStorageUnitId);
    console.log(inventoryItemId);
    console.log(inventoryItemAmount);
    //@ts-ignore
    await worldContract.write.AWAR__withdraw([
      smartStorageUnitId,
      inventoryItemId,
      inventoryItemAmount,
    ]);
  };

  const ping = async (pingText: string) => {
    //@ts-ignore
    await worldContract.write.AWAR__ping([pingText]);
  };
  return {
    deposit,
    withdraw,
    ping,
  };
}
