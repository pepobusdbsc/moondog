import React, { useState } from "react";
import styled from "styled-components";
import { Text } from 'moondoge-uikit'

// import { CopyIcon } from "../../components/Svg";

interface Props {
  toCopy: string;
}

const StyleButton = styled(Text).attrs({ role: "button" })`
  position: relative;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.publicColor};
`;

const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? "block" : "none")};
  position: absolute;
  bottom: -24px;
  right: 0;
  left: 0;
  text-align: center;
  // background-color: ${({ theme }) => theme.colors.publicColor};
  color: #FFCE69;
  border-radius: 16px;
  opacity: 0.7;
  width:44px;
  font-size:10px;
`;

const CopyToClipboard: React.FC<Props> = ({ toCopy, children, ...props }) => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

  return (
    <StyleButton
      small
      bold
      onClick={() => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(toCopy);
          setIsTooltipDisplayed(true);
          setTimeout(() => {
            setIsTooltipDisplayed(false);
          }, 1000);
        }
      }}
      {...props}
    >
      {children}
      {/* <CopyIcon width="20px" color="publicColor" ml="4px" /> */}
      <Tooltip isTooltipDisplayed={isTooltipDisplayed}>Copied</Tooltip>
    </StyleButton>
  );
};

export default CopyToClipboard;
