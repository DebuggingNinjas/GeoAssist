import React, { useState, useEffect } from "react";
import Item from "./Item";
import axios, { Axios } from "axios";

function App() {
  const [backendData, setBackendData] = useState({ employees: [] });
  const [newItems, setNewItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/employees")
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data);
      });
  }, []);

  const handleCreate = () => {
    const newItem = {
      name: "name",
      id: 1234,
      description: "description",
    };
    setNewItems((prevItems) => [...prevItems, newItem]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...newItems];
    updatedItems[index][field] = value;
    setNewItems(updatedItems);
  };

  const handleSave = (index) => {
    const itemToSave = newItems[index];

    if(itemToSave.name == "" || itemToSave.id == "") {
      alert("Ensure all text is filled out")
      return;
    }

    for (const employee of backendData.employees) {
      if (itemToSave.id == employee.id) {
        alert("Please use an original id");
        return; 
      }
    }


    setBackendData((prevData) => ({
      employees: [...prevData.employees, itemToSave],
    }));

    const updatedNewItems = [...newItems];
    updatedNewItems.splice(index, 1);
    setNewItems(updatedNewItems);

    console.log(itemToSave);

    axios.post("http://localhost:5050/create", itemToSave)
        .then(() => console.log("posted data"))
        .catch(err => {
            console.error(err);
        });
  };

  return (
    <>
      <div className="title">SDAA</div>
      <div className="main-area">
        {typeof backendData.employees === "undefined" ? (
          <div className="waiting">Loading...</div>
        ) : (
          backendData.employees.map((employee, index) => (
            <Item info={employee} key={index} />
          ))
        )}
        {newItems.map((item, index) => (
          <div className="item-wrap" key={index}>
            <input
              type="text"
              value={item.name}
              className="item-input-name"
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
            />
            <input
              type="number"
              value={item.id}
              className="item-input-id"
              onChange={(e) => handleInputChange(index, "id", e.target.value)}
            />
            <textarea
              value={item.description}
              className="item-input-desc"
              onChange={(e) =>
                handleInputChange(index, "description", e.target.value)
              }
            />
            <button
              className="item-save"
              onClick={() => handleSave(index)}
            >
              Save
            </button>
          </div>
        ))}
        <button className="create-btn" onClick={handleCreate}>
          Create
        </button>
      </div>
    </>
  );
}

export default App;
