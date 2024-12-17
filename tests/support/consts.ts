import { WalletClient } from "viem";

import { SmartObjectContextType } from "@eveworld/contexts";
import { WalletContextType } from "@eveworld/contexts/wallet/types";
import { SmartAssemblyType, State } from "@eveworld/types";

const mockSmartAssembly = {
  id: "88915295938203702838615525106021023382860848756145302452389598048491468505235",
  itemId: 1000000014139,
  typeId: 83904,
  ownerId: "0x3d83a1ff0dccc56b9dba4e2413ff7162e83663b8" as `0x${string}`,
  ownerName: "",
  chainId: 3541000,
  name: "",
  description: "",
  dappUrl: "",
  image: "",
  isValid: true,
  isOnline: true,
  stateId: 3,
  state: State.ONLINE,
  anchoredAtTime: "1724255867",
  solarSystemId: 30000272,
  solarSystem: {
    solarSystemId: "30000272",
    solarSystemName: "Zarquis",
    solarSystemNameId: "0",
  },
  region: "",
  locationX: "293087155247",
  locationY: "1890783",
  locationZ: "2231247560973",
  floorPrice: "",
  fuel: {
    fuelAmount: BigInt(0),
    fuelConsumptionPerMin: BigInt(3600),
    fuelMaxCapacity: BigInt(100000000000),
    fuelUnitVolume: BigInt(100000000),
  },
};

const mockSmartCharacter = {
  address: "0x123456789" as `0x${string}`,
  id: "0",
  name: "name",
  isSmartCharacter: false,
  eveBalanceWei: Number(0),
  gasBalanceWei: Number(0),
  image: "name",
  smartAssemblies: [],
};

const mockSmartGate: SmartAssemblyType<"SmartGate"> = {
  ...mockSmartAssembly,
  assemblyType: "SmartGate",
  gateLink: {
    gatesInRange: [],
    isLinked: true,
    destinationGate: "0x987654abcdef",
  },
};

export const mockSmartGateContext = {
  smartAssembly: mockSmartGate,
  smartCharacter: mockSmartCharacter,
  loading: true,
} satisfies SmartObjectContextType;

const mockSmartStorageUnit: SmartAssemblyType<"SmartStorageUnit"> = {
  ...mockSmartAssembly,
  assemblyType: "SmartStorageUnit",
  inventory: {
    storageCapacity: BigInt(100000000000000),
    usedCapacity: BigInt(0),
    storageItems: [],
    ephemeralInventoryList: [],
  },
};

export const mockSmartStorageUnitContext = {
  smartAssembly: mockSmartStorageUnit,
  smartCharacter: mockSmartCharacter,
  loading: true,
} satisfies SmartObjectContextType;

export const mockWalletContext = {
  connectedProvider: {
    provider: null,
    connected: false,
  },
  gatewayConfig: {
    gatewayHttp: "",
    gatewayWs: "",
  },
  publicClient: null,
  walletClient: { account: undefined } as WalletClient,
  bundlerClient: null,
  handleConnect: () => {},
  handleDisconnect: () => {},
  isCurrentChain: false,
  availableWallets: [],
  defaultNetwork: {
    network: undefined,
    worldAddress: "0x",
    eveTokenAddress: "0x",
    erc2771ForwarderAddress: "0x",
    systemIds: {},
  },
} satisfies WalletContextType;
