/// <reference types="@types/jest" />

import {
  ERROR_MESSAGES,
  parseErrorFromMessage,
  prepareChainConfig,
} from "@eveworld/utils";

describe("Chain config adapter", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let gatewayConfigResult: any;

  beforeEach(async () => {
    const configUrl = "https://blockchain-gateway.nursery.reitnorf.com/config";
    const result = await fetch(configUrl);
    gatewayConfigResult = await result.json();
  });

  it("Correct result should be parsed from fetch result", () => {
    const expectedResult = [
      {
        chainId: 3541000,
        name: "EVE Devnet Game",
        nativeCurrency: { decimals: 18, name: "Gas", symbol: "GAS" },
        contracts: {
          world: { address: "0x0bdb7e866c76335cb05dadba784e12ff42186d6f" },
          erc721: { address: "0x3642fd8F149664b0B4D492C95bc62aC61a39be7A" },
          erc1155: { address: "" },
          smartCharacter: {
            address: "0x4C4C6A3805a77001338E816A3dEB41c5b840Faf0",
          },
          eveToken: { address: "0xAAD661296d931f340608275a0B064F0E9EBcF956" },
          forwarder: { address: "0x5fbdb2315678afecb367f032d93f642f64180aa3" },
          lensSeller: { address: "0x035e9FE5Fd63271754F0080B49EF640Dfe75405D" },
        },
        rpcUrls: {
          default: {
            http: "https://devnet-game-sync.nursery.reitnorf.com",
            webSocket: "",
          },
          public: { http: "", webSocket: "" },
        },
        blockExplorerUrl: "https://devnet-game-blockscout.nursery.reitnorf.com",
        metadataApiUrl: "https://devnet-data-metadata.nursery.reitnorf.com",
        ipfsApiUrl: "https://devnet-data-ipfs-gateway.nursery.reitnorf.com",
        indexerUrl:
          "https://devnet-game-graphql.nursery.reitnorf.com/v1/graphql",
        systems: {
          createCharacter:
            "0x7379657665776f726c64000000000000536d6172744368617261637465720000",
          createAndAnchorSmartStorageUnit:
            "0x7379657665776f726c64000000000000536d61727453746f72616765556e6974",
          updateFuel:
            "0x7379657665776f726c64000000000000536d6172744465706c6f7961626c6500",
          destroyDeployable:
            "0x7379657665776f726c64000000000000536d6172744465706c6f7961626c6500",
          unanchor:
            "0x7379657665776f726c64000000000000536d6172744465706c6f7961626c6500",
          bringOnline:
            "0x7379657665776f726c64000000000000536d6172744465706c6f7961626c6500",
          bringOffline:
            "0x7379657665776f726c64000000000000536d6172744465706c6f7961626c6500",
          createAndDepositItemsToInventory:
            "0x7379657665776f726c64000000000000536d61727453746f72616765556e6974",
          createAndDepositItemsToEphemeralInventory:
            "0x7379657665776f726c64000000000000536d61727453746f72616765556e6974",
          withdrawFromInventory:
            "0x7379657665776f726c64000000000000496e76656e746f727900000000000000",
          withdrawFromEphemeralInventory:
            "0x7379657665776f726c64000000000000457068656d6572616c496e7600000000",
          depositFuel:
            "0x7379657665776f726c64000000000000536d6172744465706c6f7961626c6500",
          withdrawFuel:
            "0x7379657665776f726c64000000000000536d6172744465706c6f7961626c6500",
        },
        itemTypeIDs: { fuel: 83839 },
      },
    ];
    expect(gatewayConfigResult).toEqual(expectedResult);

    const parsedResult = prepareChainConfig(expectedResult[0], "devnet");
    expect(parsedResult).toStrictEqual({
      blockExplorers: {
        default: {
          name: "Blockscout",
          url: "https://devnet-game-blockscout.nursery.reitnorf.com",
        },
      },
      contracts: {
        ERC1155Proxy: { address: "" },
        ERC2771Forwarder: {
          address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        },
        ERC721Proxy: { address: "0x3642fd8F149664b0B4D492C95bc62aC61a39be7A" },
        EVEToken: { address: "0xAAD661296d931f340608275a0B064F0E9EBcF956" },
        LensSeller: { address: "0x035e9FE5Fd63271754F0080B49EF640Dfe75405D" },
        World: { address: "0x0bdb7e866c76335cb05dadba784e12ff42186d6f" },
      },
      fees: undefined,
      formatters: undefined,
      id: 3541000,
      name: "EVE Devnet Game",
      nativeCurrency: { decimals: 18, name: "Gas", symbol: "GAS" },
      network: "evedevnet1",
      rpcUrls: {
        default: {
          http: ["https://devnet-game-sync.nursery.reitnorf.com"],
          webSocket: [""],
        },
        public: {
          http: ["https://devnet-game-sync.nursery.reitnorf.com"],
          webSocket: [""],
        },
      },
      serializers: undefined,
      sourceId: 3541000,
    });
  });
});

describe("Error messages", () => {
  it("Should fetch error message for insufficient gas", () => {
    const parsedError = parseErrorFromMessage(
      "Viem message there is insufficient gas",
    );
    expect(parsedError.code).toBe(3001);

    const errorMessage = ERROR_MESSAGES[parsedError.code];
    expect(errorMessage).toStrictEqual("Insufficient funds for GAS.");
  });

  it("Should fetch error message for insufficient EVE", () => {
    const parsedError = parseErrorFromMessage(
      "TransactionExecutionError: User rejected the request.",
    );
    expect(parsedError.code).toBe(3003);

    const errorMessage = ERROR_MESSAGES[parsedError.code];
    expect(errorMessage).toStrictEqual("User rejected the transaction.");
  });
});
