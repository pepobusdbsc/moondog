import React from 'react'
import styled from 'styled-components'
import { Box } from 'moondoge-uikit'
import Container from '../layout/Container'

const Outer = styled(Box) <{ background?: string }>`
  // background: ${({ theme, background }) => background || theme.colors.gradients.bubblegum};
  margin-bottom:27px;
  padding:0 10px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding:0
  }
`

const Inner = styled(Container) <{ innerBackgroundImg?: string }>`
  padding: 24px 30px;
  background: ${({ innerBackgroundImg }) => innerBackgroundImg ? `url(${innerBackgroundImg})` : ''};
  background-size:cover;
  box-shadow: 0px 6px 36px rgba(174, 140, 47, 0.24);
  opacity: 1;
  border-radius: 35px;
  min-height:159px;
`

const PageHeader: React.FC<{ background?: string, innerBackgroundImg?: string }> = ({ background, innerBackgroundImg, children, ...props }) => (
  <Outer background={background}  {...props}>
    <Inner innerBackgroundImg={innerBackgroundImg}>{children}</Inner>
  </Outer>
)

export default PageHeader
