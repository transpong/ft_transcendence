import { ButtonGroup, Button, Avatar, HStack, Text} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { IoExit } from "react-icons/io5";
import { useNavigate } from "react-router";

export default function NavBar() {
  const navigate = useNavigate();
  const logoff = () => navigate("/");

  return (
    <HStack h="14%" align="center" justify="space-between">
      <Button
        colorScheme={"purple"}
        marginLeft="20px"
        paddingLeft="70px"
        paddingRight="70px"
        onClick={() => navigate("/home")}
      >
        Transpong
      </Button>
      <ButtonGroup>
        <Button colorScheme={"purple"} onClick={() => navigate("/home")}>
          Jogar
        </Button>
        <Button colorScheme={"purple"} onClick={() => navigate("/home/matches")}>
          Lista de Jogos
        </Button>
        <Button colorScheme={"purple"} onClick={() => navigate("/home/ranking")}>
          Ranking
        </Button>
      </ButtonGroup>
      <HStack
        borderRadius={"0.375rem"}
        backgroundColor={"#805AD5"}
        minWidth={"2.5rem"}
      >
        <HStack marginRight={"1rem"} marginLeft={"1rem"}>
          <Avatar/>
          <Text fontSize={"1rem"} fontWeight={"bold"} color={"white"}>Nickname</Text>
          <SettingsIcon cursor={"pointer"} fontSize={"2rem"} fontWeight={"bold"} color={"white"} onClick={() => navigate("/home/me")}/>
          <IoExit cursor={"pointer"} fontSize={"2rem"} fontWeight={"bold"} color={"white"} onClick={() => logoff()}/>
        </HStack>
      </HStack>
    </HStack>
  );
}
