import React, { useState } from 'react'
import styled from 'styled-components'
import { BaseLayout } from 'moondoge-uikit'
import useI18n from 'hooks/useI18n';

const Container = styled(BaseLayout)`
  position: fixed;
  z-index: 999;
  bottom: 0;
  width: 100%;
  min-height: 81px;
  background-color: ${({ theme }) => theme.isDark ? '#2D2925' : '#F8F8F8'} ;
  color: #A56A46;
  padding: 12px 5.5%;
  font-size: 14px;
  & > .cookie-tip-text{
    grid-column: span 12;
    line-height: 16px;
  }
  & > .got-it{
    grid-column: span 12;
    text-align: right;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    & {
      padding: 24px 10.5%;
    }
    & > .cookie-tip-text {
      grid-column: span 9;
    }
    & > .got-it{
      grid-column: span 3;
    }
  }
`;
const GotitBtn = styled.span`
  display: inline-block;
  width: 100px;
  height: 32px;
  line-height: 31px;
  text-align: center;
  background: #A56A46;
  border-radius: 25px;
  color: #FFFFFF;
  font-size: 16px;
`
const CloseImg = styled.img<{src: string}>`
  width: 24px;
  height: 24px;
  margin-left: 50px;
`

const GACookieTip = () => {
  const TranslateString = useI18n()

  const [isGotIt, setIsGotIt] = useState(() => {
    const isGotItSetting = localStorage.getItem('isGotIt')
    return isGotItSetting ? JSON.parse(isGotItSetting) : false
  })
  return (<div>
    {
      !isGotIt ? <Container>
      <div className="cookie-tip-text">
        {TranslateString(1212, "We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of  our site with our social media ,advertising and analytics partbers.")}
          
      </div>
      <div className="got-it">
        <GotitBtn onClick={() => {
          localStorage.setItem('isGotIt', 'true')
          setIsGotIt(true)
        }}>Got It</GotitBtn>
        <CloseImg onClick={() => {
          setIsGotIt(true)
        }} src="/images/home/tip-close-dark.png" />
      </div>
    </Container> : null
    }
  </div>
    
  )
}

export default GACookieTip
