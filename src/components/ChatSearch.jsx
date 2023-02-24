import React, { useState } from "react";
import { Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./chatSearch.css";
import uuid from "react-uuid";

const ChatSearch = ({ user, socket, email, onCreateChat }) => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterState, setFilterState] = useState("");
  const room = uuid();
  const [chatroom, setChatroom] = useState([]);
  const [chatrooms, setChatrooms] = useState([]);

  const handleFilter = (e) => {
    const searchUser = e.target.value;
    setFilterState(searchUser);
    const newFilter = user.allUserData.filter((value) => {
      return value.email_address.includes(searchUser);
    });
    if (searchUser === "") {
      setFilteredUsers([]);
    } else {
      setFilteredUsers(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredUsers([]);
    setFilterState([]);
  };

  const handleCreateChat = (email_address) => {
    const chatroom = room;
    const existingChatroom = chatrooms.find(
      (c) => c.members.includes(email) && c.members.includes(email_address)
    );
    if (!existingChatroom) {
      socket.emit("join_room", { room, email, email_address });
      console.log("HANDLE CREATE CHAT", room, email, email_address, chatrooms);
      setChatrooms([
        ...chatrooms,
        { id: room, members: [email, email_address] },
      ]);
      onCreateChat(room);
      setFilteredUsers([]);
      setFilterState([]);
    } else {
      console.log("CHATROOM ALREADY EXISTS", existingChatroom);
      setChatroom(existingChatroom.id);
    }
  };

  return (
    <>
      <div className="search">
        <div className="searchInputs">
          <Input
            type="text"
            placeholder="Search for friends"
            value={filterState}
            onChange={handleFilter}
          />
          <div className="searchIcon">
            {filteredUsers.length === 0 ? null : (
              <CloseOutlined id="clearBtn" onClick={clearInput} />
            )}
          </div>
        </div>
      </div>
      {filteredUsers.length !== 0 && (
        <div className="searchResult">
          {filteredUsers.slice(0, 5).map((value) => {
            return (
              <div
                className="searchItem"
                key={value.id}
                onClick={() => handleCreateChat(value.email_address)}
              >
                <p>{value.email_address}</p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ChatSearch;
