'use client'
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Tabb } from '@/Interface/Template/interfaces';
import AllTabs from './Tabs';

interface TabPageProps { selectedPage: string; checkPage: string; }
const ModuleParentDiv=styled.div`display: 'flex'; flexDirection: 'column'; gap: '10px';`;
const TabPage = styled.div<TabPageProps>`
  visibility: ${props => (props.selectedPage === props.checkPage ? "visible" : "hidden")};
  opacity: ${props => (props.selectedPage === props.checkPage ? 1 : 0)};
  transition: opacity 0.3s ease;
  order: ${props => (props.selectedPage === props.checkPage ? 1 : 2)};
  overflow: hidden;
  max-height: ${props => (props.selectedPage === props.checkPage ? "100%" : "0")};
`;
interface Props{ tabs:Tabb[]; components:React.ReactNode[]; }
const PageSustainedTabs:React.FC<Props>=({tabs,components})=>{
    const [selectedPage, setSelectedPage] = useState<string>(tabs[0].value);
    const handleTabChange = (page: string) => {
      setSelectedPage(page);
    };
    return (
      <ModuleParentDiv>
      <AllTabs defaultTab={selectedPage} tabs={tabs} onTabChange={handleTabChange}/>
      {components.map((component,index)=>{
        return(<TabPage key={index} selectedPage={selectedPage} checkPage={tabs[index].value}>{component}</TabPage>)
      })}
      </ModuleParentDiv>
    )
}
export default PageSustainedTabs;