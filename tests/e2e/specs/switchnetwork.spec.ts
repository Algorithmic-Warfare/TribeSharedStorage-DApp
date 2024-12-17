/// <reference types="cypress" />
/// <reference types="@synthetixio/synpress/support" />

// TODO: Rewrite this test suite as we now do one build per network

// const testnetSsuId =
//   "92746556585858858391093492263330029063373276436206271240136170368346859197031";
// const devnetSsuId =
//   "58788100223833007063819794666292722208569717888200674971205355402791523260963";

// describe("Devnet shows correct SSU", () => {
//   it("Connect to Devnet", () => {
//     cy.visit(`http://localhost:4173/?smartObjectId=${devnetSsuId}`);
//     cy.get("button#connect-metamask").click();
//     cy.get("#char-name-addr").should("contain", walletNameOrAddress);
//     cy.get("#chain-info").should("contain", "EVE DEVNET Game");
//   });

//   it("Correct SSU is rendered", () => {
//     // Should be correct chain, owner
//     cy.get("div#smartassembly-name").should("contain", "58788...60963");
//     cy.get("div#entity-about").should("contain", "3541000");
//   });
// });

// describe("Error messages", () => {
//   it("SSU Undefined", () => {
//     cy.visit(`http://localhost:4173/`);
//     cy.get("button#connect-metamask").click();
//     cy.get("#char-name-addr").should("contain", "Yuzuru Hanyu");
//     cy.get("#chain-info").should("contain", "EVE DEVNET Game");
//     // TODO: Add test for this after Blockchain gateway can differentiate between SSU undefined and SSU not found
//     // cy.get('#error-notice').should('contain', "Please define a smart assembly to search for.")
//   });

//   it("SSU Not found", () => {
//     cy.visit(`http://localhost:4173/?smartObjectId=${testnetSsuId}`);
//     cy.get("button#connect-metamask").click();
//     cy.get("#char-name-addr").should("contain", "Yuzuru Hanyu");
//     cy.get("#chain-info").should("contain", "EVE DEVNET Game");
//     cy.get("#error-notice").should("contain", "Smart storage unit not found");
//   });

//   it("Testnet network lockout", () => {
//     cy.visit(`http://localhost:4173/?smartObjectId=${testnetSsuId}`);

//     cy.switchToMetamaskWindow();
//     cy.addMetamaskNetwork({
//       networkName: "Testnet",
//       rpcUrl: "https://testnet-game-sync.nursery.reitnorf.com",
//       chainId: 4541000,
//       symbol: "GAS",
//       isTestnet: true,
//     });
//     cy.changeMetamaskNetwork("Testnet");

//     cy.switchToCypressWindow();
//     cy.get("button#connect-metamask").click();
//     cy.get("#header")
//       .should("contain", "Yuzuru Hanyu")
//       .should("contain", "Testnet");
//     // Should see error message showing that wrong network is connected to dapp
//     cy.get("#error-notice").should(
//       "contain",
//       "Please change networks to devnet to continue",
//     );
//   });
// });
