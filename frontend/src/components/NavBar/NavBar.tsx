import { ButtonGroup, Button, Avatar, HStack} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <HStack h="65px" align="center" justify="space-between">
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
        <Button colorScheme={"purple"} onClick={() => navigate("/matches")}>
          Jogos ao vivo
        </Button>
        <Button colorScheme={"purple"} onClick={() => navigate("/home/ranking")}>
          Ranking
        </Button>
      </ButtonGroup>
      <Button
        colorScheme={"purple"}
        leftIcon={<Avatar />}
        rightIcon={<SettingsIcon />}
        size="lg"
        onClick={() => navigate("/home/user/me")}
      >
        Nickname
      </Button>
    </HStack>
  );
}
