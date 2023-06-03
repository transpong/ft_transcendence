import { Flex, Box, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { CreateToastFnReturn } from "@chakra-ui/toast";
import { NavigateFunction } from "react-router";

interface Props {
  nickname: string;
  navigate: NavigateFunction;
  toast: CreateToastFnReturn;
}

export const GameInviteToast = ({ nickname, navigate, toast }: Props) => {
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
          onClick={() => {
            navigate("/home/pong/game");
            toast.close(nickname);
          }}
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
          onClick={() => toast.close(nickname)}
        >
          Negar
        </Button>
      </Box>
    </Flex>
  );
};
