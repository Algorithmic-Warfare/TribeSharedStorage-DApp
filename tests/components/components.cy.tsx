import React from "react";

import { SmartObjectContext } from "@eveworld/contexts";
import { WalletContext } from "@eveworld/contexts/wallet/WalletContext";
import { EveScroll, EveLinearBar } from "@eveworld/ui-components";

import EntityView from "../../src/components/EntityView";
import {
  mockSmartGateContext,
  mockSmartStorageUnitContext,
  mockWalletContext,
} from "../support/consts";

describe("Scrollbar tests", () => {
  const inventoryData = [
    { typeId: 1, name: "Item A", quantity: 10 },
    { typeId: 2, name: "Item B", quantity: 5 },
    { typeId: 3, name: "Item C", quantity: 12 },
    { typeId: 4, name: "Item D", quantity: 8 },
    { typeId: 5, name: "Item E", quantity: 20 },
    { typeId: 6, name: "Item F", quantity: 3 },
    { typeId: 7, name: "Item G", quantity: 6 },
    { typeId: 8, name: "Item H", quantity: 27 },
    { typeId: 9, name: "Item I", quantity: 10 },
  ];

  beforeEach(() => {
    cy.mount(
      <EveScroll maxHeight="260px">
        <div className="Quantum-Container text-xs flex flex-col !py-4 gap-2 min-h-full">
          {!inventoryData || inventoryData.length === 0 ? (
            <div>Empty</div>
          ) : (
            inventoryData?.map((item, index) => (
              <div key={index}>
                <div className="flex flex-col w-full">
                  <div className="flex w-full justify-between font-bold">
                    <span>{item.name ?? `Item Type ${item.typeId}`}</span>
                    <span>{item.quantity}</span>
                  </div>
                  <span className="text-2xs">ID: {item.typeId}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </EveScroll>,
    );
  });

  it("Scrollbar renders with expected colours", () => {
    cy.get("div.Eve-Scroll-Content").then(($el) => {
      const contentHeight = $el[0].scrollHeight;
      expect(contentHeight).to.be.greaterThan(260);

      // Check CSS for Quantum-Container, which is imported from @eveworld/ui-components
      cy.get("div.Eve-Scroll-Container")
        .find("div.Quantum-Container")
        .should("exist")
        .and("have.css", "border-width", "1px")
        .and("have.css", "border-color", "rgb(239, 136, 57)");

      cy.get("div.Eve-Scroll-Container")
        .find("div.Eve-Scrollbar")
        .should("exist")
        .and("have.css", "border-width", "1px");

      cy.get("div.Eve-Scroll-Container")
        .find("div.Eve-Scroll-Thumb")
        .should("exist")
        .and("have.css", "background-color", "rgb(239, 136, 57)");
    });
  });

  it("Inventory list should be partially obscured by scrollbox container", () => {
    cy.get("div.Quantum-Container").then(($el) => {
      // Check if the element is visible
      const isVisible = Cypress.dom.isVisible($el[0]);

      // Get the bounding box of the element
      const boundingBox = $el[0].getBoundingClientRect();

      // Get the element dimensions
      const elementWidth = $el[0].clientWidth;
      const elementHeight = $el[0].clientHeight;

      // Check if the element is partially out of the viewport
      const isPartiallyOut =
        boundingBox.top < 0 ||
        boundingBox.left < 0 ||
        boundingBox.bottom > elementHeight ||
        boundingBox.right > elementWidth;

      // Assert that the element is either not fully visible or partially out of the viewport
      expect(isVisible && isPartiallyOut).to.be.true;
    });
  });
});

describe("Linear Progress tests", () => {
  beforeEach(() => {
    cy.mount(
      <EveLinearBar nominator={0} denominator={0} label="Linear Bar Test" />,
    );
  });

  it("Division by 0 should be empty", () => {
    cy.get("div.Quantum-Container#progress-bar").then(($el) => {
      expect($el[0].clientHeight).to.equal(8);
      expect($el[0].clientWidth).to.equal(0);
    });
  });
});

describe("Assembly View modules tests", () => {
  it("Smart Gate should render correct image, default description, module", () => {
    cy.mount(
      <WalletContext.Provider value={mockWalletContext}>
        <SmartObjectContext.Provider value={mockSmartGateContext}>
          <EntityView />,
        </SmartObjectContext.Provider>
      </WalletContext.Provider>,
    );

    /**
     * - Checks if the image with id 'smartassembly-image' has the expected source containing 'smart-gate.png'.
     * - Verifies that the description element with id 'smartassembly-description' contains the text 'SmartGate'.
     * - Clicks on the element with id 'smartassembly-gate' containing the text 'Assembly Gamma'.
     * - Asserts the existence of link and unlink buttons within the 'smartassembly-gate' element.
     * - Validates the styling of the active element with class 'Eve-Select-Active', ensuring specific background color and text color.
     */
    cy.get("img#smartassembly-image")
      .should("have.attr", "src")
      .should("include", "smart-gate.png");
    cy.get("div#smartassembly-description").should("contain", "SmartGate");

    cy.get("div#smartassembly-gate").contains("Assembly Gamma").click();

    cy.get("div#smartassembly-gate").then(($el) => {
      const linkButton = $el.find("#smartassembly-linkgate");
      expect(linkButton).to.exist;
      const unlinkButton = $el.find("#smartassembly-unlinkgate");
      expect(unlinkButton).to.exist;
      const activeElement = $el.find(".Eve-Select-Active");
      expect(activeElement)
        .to.have.css("background-color", "rgb(239, 136, 57)")
        .and.have.css("color", "rgb(21, 10, 4)");
    });
  });
  it("Smart Storage Unit should render correct image, default description, module", () => {
    cy.mount(
      <WalletContext.Provider value={mockWalletContext}>
        <SmartObjectContext.Provider value={mockSmartStorageUnitContext}>
          <EntityView />,
        </SmartObjectContext.Provider>
      </WalletContext.Provider>,
    );

    cy.get("img#smartassembly-image")
      .should("have.attr", "src")
      .should("include", "smart-storage-unit.png");

    cy.get("div#smartassembly-description").should(
      "contain",
      "Automated depots are a staple of frontier infrastructure.",
    );

    cy.get("div#smartassembly-inventory");
    cy.get("div#smartassembly-invcapacity").find("#progress-bar");
  });
});
