import { IApiMatchHistory, MatchStatus } from "../../services/game-service";
import MatchFinishedCard from "./MatchFinishedCard";
import MatchLiveCard from "./MatchLiveCard";

interface Props {
  match: IApiMatchHistory;
}

export default function MatchCard(props: Props) {
  const { match } = props;

  return (
    match.status === MatchStatus.FINISHED ?
      <MatchFinishedCard match={match} /> :
      (match.status === MatchStatus.IS_PLAYING ?
        <MatchLiveCard match={match} /> : null)
  );
}
