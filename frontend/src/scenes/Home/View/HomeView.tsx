import { Flex } from "@chakra-ui/react";
// import NavBar from "../NavBar/NavBar";
import NavBar from "../../../components/NavBar/NavBar";
import FriendsList from "../../../components/FriendsList/FriendsList";
import { useEffect, useRef, useState } from "react";
import "./Home.css";
import { Outlet, useLocation } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { getCookie } from "../../../helpers/get-cookie";
import { useNavigate } from "react-router-dom";

export default function PageBase() {
  const [listChats, setListChats] = useState<React.ReactElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const addChatList = (newChat: React.ReactElement) => {
    setListChats(newChat);
  };

  const deleteChatList = () => {
    setListChats(null);
  };

  useEffect(() => {
    const authCookie = getCookie("token");

    if (!authCookie) navigate("/");
  }, []);

  const path = useLocation().pathname;
  const [socketGame, setSocketGame] = useState<Socket | null>(null);
  const pathA = useRef("");

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      extraHeaders: {
        Authorization: `Bearer ${getCookie("token")}`,
        Custom: "true",
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    setSocketGame(socket);

    return () => {
      console.log("cleanup");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (pathA.current === "/home/game" && path !== "/home/game") {
      console.log("saiu da rota game");
      emitEndgame();
    }
    pathA.current = path;
  }, [path, socketGame]);

  function emitEndgame() {
    console.log("emit endgame");
    if (socketGame) {
      socketGame.emit("endGame");
    }
  }

  return (
    <Flex className="MainBackground" h={"100vh"}>
      <NavBar></NavBar>
      <Flex h={"85%"} flexDirection={"row-reverse"}>
        <Flex position={"fixed"} align={"end"} bottom={"0px"}>
          {listChats}
          <FriendsList addChat={addChatList} deleteChat={deleteChatList} />
        </Flex>
        <Flex ref={ref} className="MainView">
          <Outlet context={{ ref, socketGame }} />
        </Flex>
      </Flex>
    </Flex>
  );
}
