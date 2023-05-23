import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { RiSpyFill, RiTeamFill, RiUserFill  } from 'react-icons/ri'
import Chat from "../Chat/Chat";
import { useNavigate } from "react-router";
import { IChatList } from "../../services/chat-service";
import { avatarUrl } from "../../helpers/avatar-url";
import UserBadageStatus from "../UserStatus/UserBadgeStatus";


type Props = {
  list: IChatList;
  addChat: (chat : React.ReactElement) => void;
  deleteChat: () => void;
}

const List = (props: Props) => {
  const navigate = useNavigate();

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
          <Avatar size="sm" name={element.name} key={element.name} marginRight={"1vw"}/>
          <Text fontSize={"15px"} fontWeight={"bold"}>
            {element.name}
          </Text>
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
        <Flex key={"friend" + index} w={"100%"} marginBottom={"1vh"} align={"center"} cursor={"pointer"} onClick={() =>  props.addChat(<Chat name={element.nickname} key={element.nickname} type='individual' deleteChat={props.deleteChat} directInfo={element}/>)}
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
      )}
      <Divider/>
      <Flex align={"center"}  marginTop={"2vh"} marginBottom={"2vh"} justify={"center"}>
        <RiSpyFill style={{color:"#805AD5", fontSize: "5vh"}}/>
        <Text color={"blue"} fontFamily={"sans-serif"} fontWeight={"bold"} marginLeft={"1vw"}>
          OUTROS
        </Text>
      </Flex>
      {props.list.other_users.map((element,  index) =>
        <Flex key={"other" + index} w={"100%"} marginBottom={"1vh"} align={"center"} cursor={"pointer"} onClick={() => navigate(`/home/profile/${element.nickname}`)}
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
        <Flex key={"other" + index} w={"100%"} marginBottom={"1vh"} align={"center"} cursor={"pointer"} onClick={() =>  props.addChat(<Chat name={element.name} key={element.id} type='group' group_type={element.type} deleteChat={props.deleteChat} channelInfo={element}/>)}
        _hover={{
          backgroundColor: "#805AD5",
          textColor: "white",
          borderRadius: "20px"
        }}>
          <Avatar size="sm" name={element.name} marginRight={"1vw"}/>
          <Text fontSize={"15px"} fontWeight={"bold"}>
            {element.name}
          </Text>
        </Flex>
      )}
      <Divider/>
    </Flex>
  );
};

export default List;
