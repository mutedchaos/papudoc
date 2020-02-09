import React, { ReactNode } from "react";
import Description from "./Description";

interface Member {
  name: string
  required: boolean
  type: ReactNode
  description?: string

}

interface Props {

  members: Member[]
}

export default function MemberTable({ members }: Props) {
  return <table>
    <tr>
      <th>Name</th>
      <th>Required</th>
      <th>Type</th>
    </tr>
    {members.map((member, i) => <React.Fragment key={i}><tr>
      <td>{member.name}</td>
      <td>{member.required ? 'Yes' : 'No'}</td>
      <td>{member.type}</td>
    </tr>
      {member.description && <tr><td colSpan={3}><Description>{member.description}</Description></td></tr>}
    </React.Fragment>
    )}
  </table>
}