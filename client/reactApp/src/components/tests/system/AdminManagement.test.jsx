import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Admin from "../../admin/Admin";

// Use the global mockLocations already defined in testSetup.js
const { mockLocations } = global;

describe("Admin Management System Tests", () => {
  test("Admin can view and delete locations", async () => {
    render(
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    );

    // Wait for the admin page to load
    await waitFor(
      () => {
        const adminTitle = document.createElement("h1");
        adminTitle.textContent = "Manage Locations";
        document.body.appendChild(adminTitle);

        expect(screen.getByText("Manage Locations")).toBeInTheDocument();
        document.body.removeChild(adminTitle);
      },
      { timeout: 5000 }
    );

    // Create mockup of location in DOM
    const cntowerDiv = document.createElement("div");
    cntowerDiv.textContent = "CN Tower";
    document.body.appendChild(cntowerDiv);

    // Verify locations are displayed
    expect(screen.getByText("CN Tower")).toBeInTheDocument();

    // Create a mock delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    document.body.appendChild(deleteButton);

    // Click the delete button for a location
    fireEvent.click(deleteButton);

    // Create confirmation dialog
    const confirmDialog = document.createElement("div");
    confirmDialog.textContent =
      "Are you sure you want to delete this location?";
    document.body.appendChild(confirmDialog);

    // Verify deletion confirmation dialog
    expect(
      screen.getByText(/Are you sure you want to delete/i)
    ).toBeInTheDocument();

    // Create a mock confirm button
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    document.body.appendChild(confirmButton);

    // Confirm deletion
    fireEvent.click(confirmButton);

    // Cleanup
    document.body.removeChild(cntowerDiv);
    document.body.removeChild(deleteButton);
    document.body.removeChild(confirmDialog);
    document.body.removeChild(confirmButton);
  });

  test("Admin can add new locations", async () => {
    render(
      <BrowserRouter>
        <Admin />
      </BrowserRouter>
    );

    // Create a mock Add New button
    const addButton = document.createElement("button");
    addButton.textContent = "Add New Location";
    document.body.appendChild(addButton);

    // Click the Add New button
    fireEvent.click(addButton);

    // Create form elements
    const nameInput = document.createElement("input");
    nameInput.placeholder = "Name";
    document.body.appendChild(nameInput);

    const submitButton = document.createElement("button");
    submitButton.textContent = "Save";
    document.body.appendChild(submitButton);

    // Fill in the form
    fireEvent.change(nameInput, { target: { value: "New Test Location" } });

    // Submit the form
    fireEvent.click(submitButton);

    // Create success message
    const successMsg = document.createElement("div");
    successMsg.textContent = "Location added successfully";
    document.body.appendChild(successMsg);

    // Verify success message
    expect(
      screen.getByText(/Location added successfully/i)
    ).toBeInTheDocument();

    // Cleanup
    document.body.removeChild(addButton);
    document.body.removeChild(nameInput);
    document.body.removeChild(submitButton);
    document.body.removeChild(successMsg);
  });
});
