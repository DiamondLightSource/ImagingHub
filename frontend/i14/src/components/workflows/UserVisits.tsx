import { TypedDocumentNode, gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useAuth } from "@diamondlightsource/sci-react-ui";
import { useEffect } from "react";
import type { FC } from "react";
import type { SelectChangeEvent } from "@mui/material/Select";

import OptionSelect from "./OptionSelect";
import { proposalToOptions } from "../../data/utils";

import type {
  UserVisitsQuery,
  UserVisitsQueryVariables,
} from "./__generated__/UserVisits.generated";
import type { Option } from "../../types/workflowFields";

const GET_USER_VISITS: TypedDocumentNode<
  UserVisitsQuery,
  UserVisitsQueryVariables
> = gql`
  query userVisits($username: String!) {
    account(username: $username) {
      instrumentSessionRoles {
        edges {
          node {
            instrumentSession {
              proposal {
                proposalNumber
                proposalCategory
                title
              }
              instrumentSessionNumber
              startTime
              endTime
            }
          }
        }
      }
    }
  }
`;

function getFedid(): string {
  const token = useAuth().getToken();
  const parse_token = JSON.parse(atob(token.split(".")[1]));
  return parse_token.fedid;
}

type Props = {
  value: string;
  onChange: (e: SelectChangeEvent<string>) => void;
  onInitialValue: (value: string) => void;
};

const UserVisits: FC<Props> = ({ value, onChange, onInitialValue }) => {
  const username = getFedid();
  const { data, loading, error } = useQuery<
    UserVisitsQuery,
    UserVisitsQueryVariables
  >(GET_USER_VISITS, {
    variables: { username },
  });
  const visitOptions: Option[] = data ? proposalToOptions(data) : [];

  useEffect(() => {
    if (!value && visitOptions.length > 0) {
      onInitialValue(visitOptions[0].value);
    }
  }, [value, visitOptions, onInitialValue]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <OptionSelect
      label="Visit"
      value={value}
      options={visitOptions}
      onChange={onChange}
    />
  );
};

export default UserVisits;
