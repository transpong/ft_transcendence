import { Box } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import RankingCard from "../../../components/RankingCard/RankingCard";

interface IRanking {
  position: number;
  nickname: string;
  matches: number;
  wins: number;
  losses: number;
}

export default function Ranking(){
  const [rankingList, setRankingList] = useState<IRanking[]>([]);

  useEffect(() =>
    setRankingList(
      [
        {
          position: 1,
          nickname: "Lucas",
          matches: 10,
          wins: 7,
          losses: 3,
        },
        {
          position: 3,
          nickname: "Gabriel",
          matches: 15,
          wins: 7,
          losses: 8,
        },
        {
          position: 2,
          nickname: "Yuri",
          matches: 12,
          wins: 7,
          losses: 5,
        },
        {
          position: 1,
          nickname: "Lucas",
          matches: 10,
          wins: 7,
          losses: 3,
        },
        {
          position: 3,
          nickname: "Gabriel",
          matches: 15,
          wins: 7,
          losses: 8,
        },
        {
          position: 2,
          nickname: "Yuri",
          matches: 12,
          wins: 7,
          losses: 5,
        },
        {
          position: 1,
          nickname: "Lucas",
          matches: 10,
          wins: 7,
          losses: 3,
        },
        {
          position: 3,
          nickname: "Gabriel",
          matches: 15,
          wins: 7,
          losses: 8,
        },
        {
          position: 2,
          nickname: "Yuri",
          matches: 12,
          wins: 7,
          losses: 5,
        },
      ].sort((a, b) => a.position - b.position)
    ), []
  );

  return (
    <Box h="98%" w={"100%"} overflowY="scroll">
      <Text
        fontSize={"25px"}
        fontWeight={"bold"}
        textColor="white"
        textAlign="center"
      >
        Ranking
      </Text>
      <Box>
        {rankingList.map((ranking) => {
          return (
            <RankingCard
              position={ranking.position}
              nickname={ranking.nickname}
              matches={ranking.matches}
              wins={ranking.wins}
              losses={ranking.losses}
            />
          );
        })}
      </Box>
    </Box>
  );
}