import { Flex } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import Divider from "./Divider";
import Header from "./Header";
import List from "./List";

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
  addChat: (chat : React.ReactElement) => void;
  deleteChat: () => void;
}



const FriendsList = (props: Props) => {
  const contacts : ListFriendsType = {
    groups: [{name: "Só para contrariar"}, {name: "Turma do pagode"}, {name: "Revelação"}],
    other_groups: [{name: "Pixote"}, {name: "Unidos da Alergia"}, {name: "Caneta azul"}],
    friends: [{name: "Ronaldinho Gaucho"}, {name: "Ronaldo Fenomeno"}, {name: "Rogerio Ceni"},  {name: "Lucas Yuri"}],
    other_users: [{name: "Davi Silva"}, {name: "Jhony Bravo"}, {name: "Almir Guineto"}, {name: "Flavio Campos"}]
  };
  const [isMinimized, setMinimized] = useState(false);

  const minimize = () => setMinimized(!isMinimized);
  const getStatusMinimized = () => isMinimized;

  return (
    <Flex justify="end" backgroundColor={"white"} marginLeft={"2vh"} borderTopRadius={"30px"}>
      <Flex minWidth={"250px"} w={"15vw"} maxH={"80vh"} flexDir="column" borderTopRadius={"30px"}>
        <Header  minimized={minimize} getStatusMinimized={getStatusMinimized}/>
        {isMinimized ? (
          <Fragment>
          <List list={contacts} addChat={props.addChat} deleteChat={props.deleteChat}/>
          <Divider />
          </Fragment>
        ): null}
      </Flex>
    </Flex>
  );
};

export default FriendsList;