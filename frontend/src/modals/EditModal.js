import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const EditModal = (props) => {
  return (
    <Modal
      isOpen={props.editModalIsOpen}
      onRequestClose={props.closeEditModal}
      style={{
        overlay: {
          backgroundColor: "rgba(55, 55, 55, 0.8)",
        },
        content: {
          top: "12rem",
          width: "22rem",
          height: "13rem",
          margin: "0 auto",
          borderRadius: "3%",
          padding: "0",
          border: "none",
        },
      }}
    >
      <div>
        <div className="edit-modal-change-photo">Change Profile Photo</div>
        <div className="edit-modal-file-input-div">
          <input
            className="edit-modal-file-input"
            type="file"
            name="file"
            id="file"
            onChange={props.updateProfilePic}
          />
          <label htmlFor="file">Upload Photo</label>
        </div>
        <div
          className="edit-modal-remove-photo"
          onClick={props.deleteProfilePic}
        >
          Remove Current Photo
        </div>
        <div className="edit-modal-cancel" onClick={props.closeEditModal}>
          Cancel
        </div>
      </div>
    </Modal>
  );
};

export default EditModal;
