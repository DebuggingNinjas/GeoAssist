import React, { useState } from 'react';
import Axios from 'axios'
import axios from 'axios';

function Item({info}) {
    const id_copy = info.id;
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(info.name); 
    const [id, setId] = useState(info.id);
    const [description, setDescription] = useState(info.description);
  
    const handleSave = () => {
      if(name == "" || id == "" || !(typeof id === 'number')) {
        alert("Ensure all text is filled out properly");
        setId(id_copy);
        return;
      }
        setIsEditing(false);
        console.log('Saved:', { name, id, description });
        
        const obj = {
            id_copy,
            name, 
            id, 
            description
        }

        axios.post("http://localhost:5050/save", obj)
        .then(() => console.log("posted data"))
        .catch(err => {
            console.error(err);
        });
    };

    return (
        <div className="item-wrap">
          {isEditing ? (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="item-input-name"
              />
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="item-input-id"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="item-input-desc"
              />
              <button className="item-save" onClick={handleSave}>
                Save
              </button>
            </>
          ) : (
            <>
              <div className="item-name">{name}</div>
              <div className="item-id">{"ID: " + id}</div>
              <div className="item-desc">{description}</div>
              <button className="item-edit" onClick={() => setIsEditing(true)}>
                Edit
              </button>
            </>
          )}
        </div>
    );
}

export default Item