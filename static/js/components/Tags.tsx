import React from 'react'
import { Tag, VerifiedIcon, CommunityIcon, BinanceIcon, Text } from 'moondoge-uikit'
import styled from 'styled-components'

const StyledBox = styled.div`
  img{
    width:14px
  }
`;

const CoreTag = (props) => (
  <StyledBox>
    <Tag style={{ border: '1px solid #FFB000' }} outline startIcon={<VerifiedIcon color="secondary" />} {...props}>
      <Text color="orange" fontSize="12px" ml="6px">Core</Text>
    </Tag>
  </StyledBox>
)

const CommunityTag = (props) => (
  <Tag variant="primary" outline startIcon={<CommunityIcon color="secondary" />} {...props}>
    Community
  </Tag>
)

const BinanceTag = (props) => (
  <Tag variant="binance" outline startIcon={<BinanceIcon color="secondary" />} {...props}>
    Binance
  </Tag>
)

const DualTag = (props) => (
  <Tag variant="textSubtle" outline {...props}>
    Dual
  </Tag>
)

export { CoreTag, CommunityTag, BinanceTag, DualTag }
