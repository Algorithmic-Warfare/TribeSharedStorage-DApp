/// <reference types="jest" />

import { SmartAssembly } from "../../../shared/types";
import {
  abbreviateAddress,
  isOwner,
  setSmartObjectInfo,
  getCommonItems,
  removeTrailingZeros,
  findOwnerByAddress,
} from "../../../shared/utils";

describe("Utils tests", () => {
  it("Should correctly abbreviate the address or string", () => {
    expect(abbreviateAddress("0x1234567890abcdef", 2, false)).toBe("0x...ef");
    expect(abbreviateAddress("0x1234567890abcdef", 3, false)).toBe("0x1...def");
    expect(abbreviateAddress("0x1234567890abcdef", 5, false)).toBe(
      "0x123...bcdef",
    );
    expect(abbreviateAddress("0x1234567890abcdef", 10, false)).toBe(
      "0x1234567890abcdef",
    );
    expect(abbreviateAddress("0x1234567890abcdef", 5, true)).toBe(
      "0x1234567890abcdef",
    );
    expect(abbreviateAddress(undefined, 5, false)).toBe("");
  });
  it("Check if account address is the owner of a smart assembly or not", () => {
    const assembly = { ownerId: "0xABCDEF" } as Pick<SmartAssembly, "ownerId">;
    expect(
      isOwner(assembly as SmartAssemblyType<SmartAssemblies>, "0xabcdef"),
    ).toBe(true);
    expect(
      isOwner(assembly as SmartAssemblyType<SmartAssemblies>, "0xABcdEf"),
    ).toBe(true);
    expect(
      isOwner(assembly as SmartAssemblyType<SmartAssemblies>, "0x123456"),
    ).toBe(false);
    expect(isOwner(null, "0xabcdef")).toBe(false);
  });

  it("Only update information if string passed is not empty", () => {
    const setInfo = jest.fn();
    setSmartObjectInfo(setInfo, "test");
    expect(setInfo).toHaveBeenCalledWith("test");
    setSmartObjectInfo(setInfo, "");
    expect(setInfo).not.toHaveBeenCalledWith("");
  });

  it("Should return the common items between two arrays", () => {
    expect(getCommonItems([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    expect(getCommonItems([1, 2], [3, 4])).toEqual([]);
  });

  it("Should remove trailing zeros from a string", () => {
    expect(removeTrailingZeros("123.45000")).toBe("123.45");
    expect(removeTrailingZeros("123.000")).toBe("123");
    expect(removeTrailingZeros("1230.000")).toBe("1230");
  });

  it("Should return true if the owner address matches the provided address no matter the formatting", () => {
    expect(findOwnerByAddress("0xabcdef", "0xABCDEF")).toBe(true);
    expect(findOwnerByAddress("0xabcdef", "0xAbCdEf")).toBe(true);
    expect(findOwnerByAddress("0xabcdef", undefined)).toBe(false);
  });
});
