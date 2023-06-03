import { Flex } from "@chakra-ui/react";
import NavBar from "../../../components/NavBar/NavBar";
import FriendsList from "../../../components/FriendsList/FriendsList";
import { ReactElement, useEffect, useRef, useState, useCallback } from "react";
import "./Home.css";
import { Outlet, useLocation } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { getCookie } from "../../../helpers/get-cookie";
import { useNavigate } from "react-router-dom";

export default function PageBase() {
  const [listChats, setListChats] = useState<ReactElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const addChatList = (newChat: ReactElement): void => {
    setListChats(newChat);
  };

  const deleteChatList = (): void => {
    setListChats(null);
  };

  useEffect(() => {
    const authCookie: string = getCookie("token");

    if (!authCookie) navigate("/");
  }, [navigate]);

  const path: string = useLocation().pathname;
  const [socketGame, setSocketGame] = useState<Socket | null>(null);
  const oldPath = useRef("");

  const emitEndgame = useCallback((): void => {
    if (socketGame) {
      socketGame.emit("endGame");
    }
  }, [socketGame]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, {
      extraHeaders: {
        Authorization: `Bearer ${getCookie("token")}`,
        Custom: "true",
      },
    });

    socket.on("connect", (): void => {
      console.log("Socket connected");
    });

    setSocketGame(socket);

    return (): void => {
      console.log("cleanup");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (oldPath.current.includes("/home/pong/game") && !path.includes("/home/pong/game")) {
      console.log("saiu da rota game");
      if (socketGame) {
        socketGame.removeListener("pong");
        socketGame.removeListener("giveUp");
        socketGame.removeListener("gameOver");
        socketGame.removeListener("toGame");
        socketGame.removeListener("message");
      }
      emitEndgame();
    }
    oldPath.current = path;
  }, [emitEndgame, path, socketGame]);

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
