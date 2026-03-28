"use client";
import React from "react";
import { IconUsersGroup, IconUserStar } from "@tabler/icons-react";
import EmailBox from "../components/Admin/AllEmail/EmailBox";
import User from "../components/Admin/UserMange/User";
import PageSustainedTabs from "../components/Template/PageSustainedTabs";
import CardContainer from "../components/Template/CardContainer";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
export default function EmailPage() {
  const tabs = [
    {
      value: "Email",
      icon: <EmailIcon width={20} height={20} />,
      label: "Email",
      disabled: false,
    },
    {
      value: "User List",
      icon: <GroupIcon width={20} height={20} />,
      label: "User List",
      disabled: false,
    },
  ];

return (
  <CardContainer>
  <PageSustainedTabs
    tabs={tabs}
    components={[<EmailBox key="email-box" />, <User key="user" />]}
  /></CardContainer>
);
}
