import { Flex, Box, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { CreateToastFnReturn } from "@chakra-ui/toast";
import { NavigateFunction } from "react-router";
import { Socket } from "socket.io-client";

interface Props {
  nickname: string;
  navigate: NavigateFunction;
  toast: CreateToastFnReturn;
  socketGame: Socket;
}

export const GameInviteToast = ({ nickname, navigate, toast, socketGame }: Props) => {

  function handleDeclineInvite() {
    socketGame.emit("declineInvite", nickname);
    setTimeout(() => toast.close(nickname), 1000);
  }

  function handleAcceptInvite() {
    if (window.location.pathname.includes('home/pong')) return;
    socketGame.emit("acceptInvite", nickname);

    setTimeout(() => {
      navigate("/home/pong", {
        state: {
          fromInvite: true
        }
      });
      toast.close(nickname);
    }, 1000);
  }

  return (
    <Flex color="white" p={3} bg="blue.500" borderRadius="10px">
      <Box mr="8px">
        <Text fontSize="18px" fontWeight="bold">
          Novo convite para jogo
        </Text>
        <Text>{nickname} quer jogar com você</Text>
      </Box>
      <Box>
        <Button
          backgroundColor="green"
          color="white"
          mr="5px"
          _hover={{
            backgroundColor: "white",
            textColor: "green",
            borderRadius: "16px",
          }}
          onClick={handleAcceptInvite}
        >
          Jogar
        </Button>
        <Button
          backgroundColor="red"
          color="white"
          mr="5px"
          _hover={{
            backgroundColor: "white",
            textColor: "red",
            borderRadius: "16px",
          }}
          onClick={handleDeclineInvite}
        >
          Negar
        </Button>
      </Box>
    </Flex>
  );
};
