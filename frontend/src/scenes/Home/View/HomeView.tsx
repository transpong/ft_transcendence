import { Flex } from "@chakra-ui/react";
// import NavBar from "../NavBar/NavBar";
import NavBar from "../../../components/NavBar/NavBar";
import FriendsList from "../../../components/FriendsList/FriendsList";
import { useEffect, useRef, useState } from "react";
import './Home.css'
import { Outlet } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { getCookie } from "../../../helpers/get-cookie";
import { useNavigate } from 'react-router-dom'


export default function PageBase() {
  const [listChats, setListChats] = useState<React.ReactElement | null>(null);
  const ref = useRef<HTMLDivElement>(null)
    const [socketGame] = useState<Socket>(io('http://localhost:3001', {
      extraHeaders: {
        Authorization: `Bearer ${getCookie("token")}`,
        Custom: 'true',
      },
    }))

  const navigate = useNavigate();

  const addChatList = (newChat: React.ReactElement) => {
    setListChats(newChat);
  };

  const deleteChatList = () => {
    setListChats(null);
  };

  useEffect(() => {
    const authCookie = getCookie("token");

    if (!authCookie)
      navigate("/");
  }, [])

  return (
    <Flex className="MainBackground" h={"100vh"}>
      <NavBar></NavBar>
      <Flex h={"85%"} flexDirection={"row-reverse"}>
        <Flex position={"fixed"} align={"end"} bottom={"0px"}>
          {listChats}
        <FriendsList addChat={addChatList} deleteChat={deleteChatList} />
        </Flex>
        <Flex ref={ref} className="MainView">
          <Outlet context={{ref, socketGame}}/>
        </Flex>
      </Flex>
    </Flex>
  );
}