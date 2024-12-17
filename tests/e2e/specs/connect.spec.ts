/// <reference types="cypress" />
/// <reference types="@synthetixio/synpress/support" />

const otherSsuId =
  "60081784194474965756608655912430942258044042001037801924195170060789840107314";
const ownSsuId =
  "88254714909502559732383392194178442662639945799586651058152775316093599272674";
const walletNameOrAddress = "0xad8...05588";

describe("Connect to wallet spec", () => {
  it("Connect to network", () => {
    cy.visit(`http://localhost:4173/?smartObjectId=${otherSsuId}`);
    cy.get("button#connect-metamask").click();
    cy.acceptMetamaskAccess().should("be.true");
    cy.switchToCypressWindow().should("be.true");
    cy.get("#char-name-addr").should("contain", walletNameOrAddress);
    cy.get("#chain-info").should("contain", "EVE DEVNET Game");
  });

  it("Correct SSU is rendered", () => {
    // Should be correct chain, owner
    cy.get("div#smartassembly-name").should("contain", "60081...07314");
    cy.get("div#entity-about").should("contain", "3541000");
  });
});

describe("See own SSU", () => {
  it("Should be able to interact with own SSU", () => {
    cy.visit(`http://localhost:4173/?smartObjectId=${ownSsuId}`);
    cy.get("button#connect-metamask").click();
    cy.get("#char-name-addr").should("contain", walletNameOrAddress);
    cy.get("#chain-info").should("contain", "EVE DEVNET Game");
    cy.get("button#edit-unit").should("not.be.disabled");
    cy.get("button#bring-online-offline").should("not.be.disabled");
  });

  it("Type into and call SSU actions", () => {
    cy.get("button#edit-unit").click();
    cy.get("div.TextField#edit-DAppURL").within(() => {
      cy.get("div.MuiInputBase-root")
        .click()
        .should("have.class", "Mui-focused")
        .should("have.css", "border-color", "rgb(229, 231, 235)");
      cy.get("input").type("www.google.com");
    });
    cy.get("div#edit-Unitname").within(() => {
      cy.get("div.MuiInputBase-root")
        .click()
        .should("have.class", "Mui-focused")
        .should("have.css", "border-color", "rgb(229, 231, 235)");
      cy.get("input").type("Test name input");
    });
    cy.get("div#edit-Unitdescription")
      .click()
      .within(() => {
        cy.get("div.MuiInputBase-root")
          .click()
          .should("have.class", "Mui-focused")
          .should("have.css", "border-color", "rgb(229, 231, 235)");
        cy.get("textarea")
          .first()
          .clear()
          .type(
            "Lorem ipsum dolor sit amet. Aut veritatis deserunt qui adipisci reiciendis nam omnis nesciunt ut rerum corporis sed dignissimos molestias a omnis reprehenderit id dignissimos fugiat.",
          );
      });
    cy.get("button#send-save-tx").click();
    cy.get(".MuiAlert-message").should("contain", "Transaction in progress...");
  });

  it("Should reject transaction and close edit modal", () => {
    cy.rejectMetamaskSignatureRequest();
    cy.get(".MuiAlert-message").should(
      "contain",
      "User rejected the transaction.",
    );
    cy.get(".MuiAlert-message svg.Close").click();
    cy.get(".MuiAlert-message").should("not.exist");
    cy.get(".MuiBackdrop-root").click({ force: true });
    cy.get("#Edit-Unit-Modal").should("not.exist");
  });

  it("Should add dApp URL with metatxn", () => {
    // DAPP URL should be clickable
    cy.get("button#edit-unit").click();
    cy.get("div.TextField#edit-DAppURL").within(() => {
      cy.get("div.MuiInputBase-root")
        .click()
        .should("have.class", "Mui-focused")
        .should("have.css", "border-color", "rgb(229, 231, 235)");
      cy.get("input").clear().type("www.google.com");
    });
    cy.get("button#send-save-tx")
      .should("contain", "Save")
      .should("not.be.disabled");
    cy.get("button#send-save-tx").click();
    cy.get(".MuiAlert-message").should("contain", "Transaction in progress...");
    cy.confirmMetamaskSignatureRequest();

    cy.get(".MuiAlert-message")
      .invoke("prop", "innerHTML")
      .should("include", "Metatransaction sent successfully.");

    cy.get("#SmartObject-Actions #dapp-link").should("not.be.disabled");
  });
  it("Should offline SSU with metatxn", () => {
    cy.get("button#bring-online-offline")
      .should("contain", "Offline unit")
      .click();
    cy.get(".MuiAlert-message")
      .invoke("prop", "innerHTML")
      .should("include", "Transaction in progress...");
    cy.confirmMetamaskSignatureRequest();

    cy.get(".MuiAlert-message")
      .invoke("prop", "innerHTML")
      .should("include", "Metatransaction sent successfully.");
  });
  it("Should online SSU with metatxn", () => {
    cy.get("button#bring-online-offline")
      .should("contain", "Online unit")
      .click();
    cy.get(".MuiAlert-message")
      .invoke("prop", "innerHTML")
      .should("contain", "Transaction in progress...");
    cy.confirmMetamaskSignatureRequest();

    cy.get(".MuiAlert-message")
      .invoke("prop", "innerHTML")
      .should("include", "Metatransaction sent successfully.");
  });
});
