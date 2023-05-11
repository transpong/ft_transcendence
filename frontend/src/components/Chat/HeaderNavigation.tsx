import { SettingsIcon, ChatIcon } from "@chakra-ui/icons";
import { Button, Box } from "@chakra-ui/react";
import { useState } from "react";
import { ScreensObject } from "./Chat";

type Props = {
  type: "group" | "individual";
  screenNavigation: number;
  setScreenNavigation: React.Dispatch<
    React.SetStateAction<keyof ScreensObject>
  >;
};

const HeaderNavgation = (props: Props) => {
  const [isBlocked, setIsBlocked] = useState(false);

  const blockUser = async () => {
    setIsBlocked(true);
  }

  const unblockUser = async () => {
    setIsBlocked(false);
  };

  return (
    <Box mr="3px">
     { props.type == 'individual' ?
      (
        isBlocked ?
        <Button size="7px" fontSize="12px" borderRadius="3px" padding="2px" onClick={unblockUser}>Unblock</Button> :
        <Button size="7px" fontSize="12px" borderRadius="3px" padding="2px" onClick={blockUser} >Block</Button>
      )
     : ( props.screenNavigation == 1 ?
          <SettingsIcon onClick={() => props.setScreenNavigation(2)} cursor="pointer" mr="3px" /> :
          (props.screenNavigation == 5 ? null : <ChatIcon onClick={() => props.setScreenNavigation(1)} cursor="pointer" mr="3px" /> )
        )
    }
    </Box>
  );
};

export default HeaderNavgation;
