import { Box } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import MatchCard from "../../../components/MatchCard/MatchCard";
import { gameService, IApiMatchHistory } from "../../../services/game-service";

export default function MachesHistory(){
  const [matchesList, setMatchesList] = useState<IApiMatchHistory[]>([]);


  useMemo(async () => {
    const matches = await gameService.getMatchesHistory();

    setMatchesList(matches);
  }, []);

  return (
    <Box h="98%" w={"100%"} overflowY="scroll">
      <Text
        fontSize={"25px"}
        fontWeight={"bold"}
        textColor="white"
        textAlign="center"
      >
        Lista de Jogos
      </Text>
      <Box>
        {matchesList.map((match) => {
          return <MatchCard match={match} />;
        })}
      </Box>
    </Box>
  )
}