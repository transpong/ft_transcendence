import {Box} from "@chakra-ui/layout";
import {Text} from "@chakra-ui/react";
import {useMemo, useState} from "react";
import RankingCard from "../../../components/RankingCard/RankingCard";
import {gameService, IApiRanking} from "../../../services/game-service";

export default function Ranking() {
    const [rankingList, setRankingList] = useState<IApiRanking[]>([]);

    useMemo(async () => {
        const ranking = await gameService.getRanking()

        setRankingList(ranking)
    }, [])

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
                {rankingList.map((ranking, index) => {
                    return (
                        <RankingCard
                            key={index}
                            position={ranking.position}
                            nickname={ranking.nickname}
                            matches={ranking.matches}
                            wins={ranking.wins}
                            losses={ranking.loses}
                            avatar={ranking.avatar}
                            draws={ranking.draws}
                        />
                    );
                })}
            </Box>
        </Box>
    );
}
