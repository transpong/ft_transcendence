import { Flex } from "@chakra-ui/layout";
import {
  Text,
  Avatar,
  Button,
  Box,
  Input,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import RankingCard from "../../../../components/RankingCard/RankingCard";
import MatchCard from "../../../../components/MatchCard/MatchCard";
import { useNavigate, useOutlet, Outlet } from "react-router-dom";
import { IApiUserMe, userService } from "../../../../services/users-service";
import { avatarUrl } from "../../../../helpers/avatar-url";

export default function Me(){
  const position = 7;
  const [isUploading, setIsUploading] = useState(false);
  const [me, setMe] = useState<IApiUserMe>();
  const navigate = useNavigate();
  let hiddenInput: HTMLInputElement | null = null;

  useMemo(async () => {
    const myData = await userService.getMe();

    setMe(myData);
  }, []);

  const teste = [
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
  ];

  async function handlePhotoSelect(file: File | null) {
    setIsUploading(true);

    if (!file) return;

    const photoFormData = new FormData();

    photoFormData.append("file", file);

    await userService.uploadAvatar(photoFormData);

    setIsUploading(false);
  }

  async function handleMfaActivation() {
    const data = await userService.activateMfa();

    navigate(`/home/me/mfa`, {
      state: {
        qr_code: data.qr_code_url,
      }
    });
  }

  async function handleMfadeactivation() {
    await userService.disableMfa();
  }

  return useOutlet() ? (
    <Outlet />
  ) : (
    <>
      <Flex h="100%" w={"100%"} borderRadius={"20px"} align={"center"}>
        <Flex
          backgroundColor={"white"}
          width={"30%"}
          height={"90%"}
          marginLeft={"1%"}
          border={"8px"}
          borderColor={"#805AD5"}
          align={"center"}
          justify={"center"}
          flexDirection={"column"}
          borderRadius={"20px"}
        >
          <Avatar
            size={"2xl"}
            marginBottom={"55px"}
            src={avatarUrl(me?.avatar)}
          />
          <Input
            hidden
            type="file"
            ref={(el) => (hiddenInput = el)}
            onChange={(e) =>
              handlePhotoSelect(e.target.files && e.target.files[0])
            }
          />
          <Button
            colorScheme={"purple"}
            marginBottom={"15px"}
            isLoading={isUploading}
            onClick={() => hiddenInput?.click()}
          >
            Upload Avatar
          </Button>
          <Text fontSize={"35px"} fontWeight={"bold"} marginBottom={"15px"}>
            {me?.nickname}
          </Text>
          {!me?.is_mfa_enabled ? (
            <Button
              size={"lg"}
              colorScheme={"purple"}
              onClick={handleMfaActivation}
            >
              Ativar MFA
            </Button>
          ) : (
            <Button
              size={"lg"}
              colorScheme={"purple"}
              onClick={handleMfadeactivation}
            >
              Desativar MFA
            </Button>
          )}
        </Flex>
        <Flex
          width={"100%"}
          height={"90%"}
          marginLeft={"1%"}
          border={"8px"}
          borderColor={"#805AD5"}
          flexDirection={"column"}
          borderRadius={"20px"}
        >
          <Text
            fontSize={"25px"}
            fontWeight={"bold"}
            textColor="white"
            textAlign="center"
          >
            Status
          </Text>
          <RankingCard
            position={position}
            nickname={me?.nickname || ""}
            matches={10}
            wins={7}
            losses={3}
          />

          <Text
            fontSize={"25px"}
            fontWeight={"bold"}
            textColor="white"
            textAlign="center"
          >
            Histórico de partidas
          </Text>
          <Box h="98%" w={"100%"} overflowY="scroll">
            <Box>
              {teste.map((match) => {
                return <MatchCard winner={match.winner} loser={match.loser} />;
              })}
            </Box>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}