import {Flex, Text, Box} from "@chakra-ui/react";
import RankingCard from "../../RankingCard/RankingCard";
import MatchCard from "../../MatchCard/MatchCard";
import {IApiMatchHistory, IApiRanking} from "../../../services/game-service";
import {IApiUserMe} from "../../../services/users-service";

interface IProfileContentProps {
    userRanking?: IApiRanking | undefined;
    me?: IApiUserMe | undefined;
    matchesList: IApiMatchHistory[];
}

const ProfileContent = ({userRanking, me, matchesList}: IProfileContentProps) => {
    return (
        <Flex
            width={"100%"}
            height="70vh"
            marginLeft={"1%"}
            border={"8px"}
            borderColor={"#805AD5"}
            flexDirection={"column"}
            borderRadius={"20px"}
        >
            <Text fontSize={"25px"} fontWeight={"bold"} textColor="white" textAlign="center">
                Status
            </Text>
            <RankingCard
                position={userRanking?.position || 0}
                nickname={me?.nickname || ""}
                matches={userRanking?.matches || 0}
                wins={userRanking?.wins || 0}
                losses={userRanking?.loses || 0}
                avatar={me?.avatar || ""}
                draws={userRanking?.draws || 0}
            />

            <Text fontSize={"25px"} fontWeight={"bold"} textColor="white" textAlign="center">
                Histórico de partidas
            </Text>
            <Box h="98%" w={"100%"} overflowY="scroll">
                <Box>
                    {matchesList.map((match) => {
                        return <MatchCard key={match.id} match={match}/>;
                    })}
                </Box>
            </Box>
        </Flex>
    );
};

export default ProfileContent;
