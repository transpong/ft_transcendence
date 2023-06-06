import { Avatar, Divider, Flex, Text, IconButton } from "@chakra-ui/react";
import { RiSpyFill, RiTeamFill, RiUserFill  } from 'react-icons/ri'
import Chat from "../Chat/Chat";
import { useNavigate } from "react-router";
import { IChatList } from "../../services/chat-service";
import { avatarUrl } from "../../helpers/avatar-url";
import UserBadageStatus from "../UserStatus/UserBadgeStatus";
import ChannelTypeIcon from "../ChannelTypeIcon/ChannelTypeIcon";
import { Icon } from "@chakra-ui/icons";
import { GiGamepad } from "react-icons/gi";
import { Socket } from "socket.io-client";

type Props = {
  list: IChatList;
  addChat: (chat: React.ReactElement) => void;
  deleteChat: () => void;
  socketGame?: Socket | null;
};

const List = (props: Props) => {
  const navigate = useNavigate();

  async function handleGameInvite(nickname: string) {
    props.socketGame?.emit("invite", nickname)
  }

  return (
    <Flex w="100%" h="100%" overflowY="scroll" flexDirection="column" p="3">
      <Flex align={"center"} marginBottom={"2vh"} justify={"center"}>
        <RiTeamFill style={{color:"#805AD5", fontSize: "5vh"}}/>
        <Text color={"blue"} fontFamily={"sans-serif"} fontWeight={"bold"} marginLeft={"1vw"}>
          GRUPOS
        </Text>
      </Flex>
      {props.list.channels.map((element, index) =>
        <Flex key={"group" + index} w={"100%"} marginBottom={"1vh"} align={"center"} cursor={"pointer"} onClick={() =>  props.addChat(<Chat name={element.name} key={element.id} group_type={element.type} user_access_type={element.user_access_type} type='group' deleteChat={props.deleteChat} channelInfo={element}/>)}
        _hover={{
          backgroundColor: "#805AD5",
          textColor: "white",
          borderRadius: "20px"
        }}>
          <Avatar size="sm" name={element.name} key={element.name} marginRight={"1vw"} w="15%"/>
          <Text fontSize={"15px"} fontWeight={"bold"} w="70%">
            {element.name}
          </Text>
          <ChannelTypeIcon type={element.type} />
        </Flex>
      )}
      <Divider/>
      <Flex align={"center"} marginTop={"2vh"} marginBottom={"2vh"} justify={"center"}>
        <RiUserFill style={{color:"#805AD5", fontSize: "5vh"}}/>
        <Text color={"blue"} fontFamily={"sans-serif"} fontWeight={"bold"} marginLeft={"1vw"}>
          AMIGOS
        </Text>
      </Flex>
      {props.list.friends.map((element, index) =>
        <Flex key={"friend" + index}>
          <Flex w={"100%"} marginBottom={"1vh"} align={"center"} cursor={"pointer"} onClick={() =>  props.addChat(<Chat name={element.nickname} key={element.nickname} type='individual' deleteChat={props.deleteChat} directInfo={element}/>)}
          _hover={{
            backgroundColor: "#805AD5",
            textColor: "white",
            borderRadius: "20px"
          }}>
            <Avatar size="sm" src={avatarUrl(element.avatar)} marginRight={"1vw"}>
              <UserBadageStatus status={element.status} />
            </Avatar>
            <Text fontSize={"15px"} fontWeight={"bold"}>
              {element.nickname}
            </Text>
          </Flex>
          <IconButton
            cursor="pointer"
            icon={<Icon boxSize="2em" as={GiGamepad} />}
            onClick={() => handleGameInvite(element.nickname)}
            borderRadius="10px"
            _hover={{
              backgroundColor: "#805AD5",
              textColor: "white",
              borderRadius: "20px"
            }}
            aria-label="Game Invite"
            size="sm"
            title="Game Invite"
            color="#805AD5"
          />
        </Flex>
      )}
      <Divider/>
      <Flex align={"center"}  marginTop={"2vh"} marginBottom={"2vh"} justify={"center"}>
        <RiSpyFill style={{color:"#805AD5", fontSize: "5vh"}}/>
        <Text color={"blue"} fontFamily={"sans-serif"} fontWeight={"bold"} marginLeft={"1vw"}>
          OUTROS
        </Text>
      </Flex>
      {props.list.other_users.map((element,  index) =>
        <Flex key={"other" + index}>
          <Flex w={"100%"} marginBottom={"1vh"} align={"center"} cursor={"pointer"} onClick={() => navigate(`/home/profile/${element.nickname}`)}
          _hover={{
            backgroundColor: "#805AD5",
            textColor: "white",
            borderRadius: "20px"
          }}>
            <Avatar size="sm" src={avatarUrl(element.avatar)} marginRight={"1vw"}/>
            <Text fontSize={"15px"} fontWeight={"bold"}>
              {element.nickname}
            </Text>
          </Flex>
          <IconButton
            cursor="pointer"
            icon={<Icon boxSize="2em" as={GiGamepad}/>}
            onClick={() => handleGameInvite(element.nickname)}
            borderRadius="10px"
            _hover={{
              backgroundColor: "#805AD5",
              textColor: "white",
              borderRadius: "20px"
            }}
            aria-label="Game Invite"
            size="sm"
            title="Game Invite"
            color="#805AD5"
          />
        </Flex>
      )}
      <Divider/>
      <Divider/>
      <Flex align={"center"}  marginTop={"2vh"} marginBottom={"2vh"} justify={"center"}>
        <RiSpyFill style={{color:"#805AD5", fontSize: "5vh"}}/>
        <Text color={"blue"} fontFamily={"sans-serif"} fontWeight={"bold"} marginLeft={"1vw"}>
          OUTROS GRUPOS
        </Text>
      </Flex>
      {props.list.other_channels.map((element,  index) =>
        <Flex key={"otherGrouops" + index} w={"100%"} marginBottom={"1vh"} align={"center"} cursor={"pointer"} onClick={() =>  props.addChat(<Chat name={element.name} key={element.id} type='group' group_type={element.type} deleteChat={props.deleteChat} channelInfo={element}/>)}
        _hover={{
          backgroundColor: "#805AD5",
          textColor: "white",
          borderRadius: "20px"
        }}>
          <Avatar size="sm" name={element.name} marginRight={"1vw"}  w="15%"/>
          <Text fontSize={"15px"} fontWeight={"bold"} w="70%" >
            {element.name}
          </Text>
          <ChannelTypeIcon type={element.type} />
        </Flex>
      )}
      <Divider/>
    </Flex>
  );
};

export default List;
