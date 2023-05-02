import React, { useEffect, useRef } from "react";
import { Avatar, AvatarBadge, Divider, Flex, Text } from "@chakra-ui/react";
import { RiSpyFill, RiTeamFill, RiUserFill  } from 'react-icons/ri'
import Chat from "../Chat/Chat";


type GroupsType =  {
  name: string;
}

type FriendsType = {
  name: string;
}

type ListFriendsType = {
  groups: Array<GroupsType>,
  other_groups: Array<GroupsType>,
  friends: Array<FriendsType>,
  other_users: Array<FriendsType>
}
type Props = {
  list: ListFriendsType;
  addChat: (chat : React.ReactElement) => void;
  deleteChat: () => void; 
} 

const List = (props: Props) => {
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef<HTMLInputElement>(null);
        useEffect(() => {
            if( elementRef.current)
            elementRef.current.scrollIntoView()
        });
        return <div ref={elementRef} />;
  };

  

  return (
    <Flex w="100%" h="100%" overflowY="scroll" flexDirection="column" p="3">
      <Flex align={"center"} marginBottom={"2vh"} justify={"center"}>
        <RiTeamFill style={{color:"#805AD5", fontSize: "5vh"}}/>
        <Text color={"blue"} fontFamily={"sans-serif"} fontWeight={"bold"} marginLeft={"1vw"}>
          GRUPOS
        </Text>
      </Flex>
      {props.list.groups.map((element, index) => 
        <Flex key={"group" + index} w={"100%"} marginBottom={"1vh"} align={"center"} cursor={"pointer"} onClick={() =>  props.addChat(<Chat name={element.name} deleteChat={props.deleteChat}/>)}
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
      <Flex align={"center"} marginTop={"2vh"} marginBottom={"2vh"} justify={"center"}>
        <RiUserFill style={{color:"#805AD5", fontSize: "5vh"}}/>
        <Text color={"blue"} fontFamily={"sans-serif"} fontWeight={"bold"} marginLeft={"1vw"}>
          AMIGOS
        </Text>
      </Flex>
      {props.list.friends.map((element, index) => 
        <Flex key={"friend" + index} w={"100%"} marginBottom={"1vh"} align={"center"} cursor={"pointer"} onClick={() =>  props.addChat(<Chat name={element.name} deleteChat={props.deleteChat}/>)}
        _hover={{
          backgroundColor: "#805AD5",
          textColor: "white",
          borderRadius: "20px"
        }}>
           <Avatar size="sm" name={element.name} marginRight={"1vw"}>
            <AvatarBadge boxSize="1.25em" bg="green.500" />
          </Avatar>
          <Text fontSize={"15px"} fontWeight={"bold"}>
            {element.name}
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
        <Flex key={"other" + index} w={"100%"} marginBottom={"1vh"} align={"center"} cursor={"pointer"} onClick={() =>  props.addChat(<Chat name={element.name} deleteChat={props.deleteChat}/>)}
        _hover={{
          backgroundColor: "#805AD5",
          textColor: "white",
          borderRadius: "20px"
        }}>
          <Avatar size="sm" name={element.name} marginRight={"1vw"}>
            <AvatarBadge boxSize="1.25em" bg="green.500" />
          </Avatar>
          <Text fontSize={"15px"} fontWeight={"bold"}>
            {element.name}
          </Text>
        </Flex>
      )}
      <Divider/>
      <AlwaysScrollToBottom />
    </Flex>
  );
};

export default List;
