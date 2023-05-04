import { Box } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MatchCard from "../../../components/MatchCard/MatchCard";

interface IPlayerMatch {
  points: number;
  nickname: string;
  avatar?: string;
}

interface IMatches {
  winner: IPlayerMatch;
  loser: IPlayerMatch;
}

export default function MachesHistory(){
  const [matchesList, setMatchesList] = useState<IMatches[]>([]);

  useEffect(
    () =>
      setMatchesList([
        {
          winner: {
            nickname: "Lucas",
            points: 10,
          },
          loser: {
            nickname: "Yuri",
            points: 10,
          },
        },
        {
          winner: {
            nickname: "Lucas",
            points: 10,
            avatar: "https://bit.ly/dan-abramov",
          },
          loser: {
            nickname: "Yuri",
            points: 10,
          },
        },
        {
          winner: {
            nickname: "Lucas",
            points: 10,
          },
          loser: {
            nickname: "Yuri",
            points: 10,
          },
        },
        {
          winner: {
            nickname: "Lucas",
            points: 10,
            avatar: "https://bit.ly/dan-abramov",
          },
          loser: {
            nickname: "Yuri",
            points: 10,
          },
        },
        {
          winner: {
            nickname: "Lucas",
            points: 10,
          },
          loser: {
            nickname: "Yuri",
            points: 10,
          },
        },
        {
          winner: {
            nickname: "Lucas",
            points: 10,
            avatar: "https://bit.ly/dan-abramov",
          },
          loser: {
            nickname: "Yuri",
            points: 10,
          },
        },
        {
          winner: {
            nickname: "Lucas",
            points: 10,
          },
          loser: {
            nickname: "Yuri",
            points: 10,
          },
        },
        {
          winner: {
            nickname: "Lucas",
            points: 10,
          },
          loser: {
            nickname: "Yuri",
            points: 10,
          },
        },
        {
          winner: {
            nickname: "Lucas",
            points: 10,
          },
          loser: {
            nickname: "Yuri",
            points: 10,
          },
        },
      ]),
    []
  );

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
          return <MatchCard winner={match.winner} loser={match.loser} />;
        })}
      </Box>
    </Box>
  )
}