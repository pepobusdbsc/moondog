import React from 'react'
import styled from 'styled-components'
import { Image, Button } from 'moondoge-uikit'
import { CommunityTag } from 'components/Tags'
import useI18n from 'hooks/useI18n'
import Card from './Card'
import CardTitle from './CardTitle'

const Balance = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 32px;
  font-weight: 600;
  text-align:center;
  margin-top:18px;
  line-height:1.1

`

const Label = styled.div`
  color: #CECECE;
  font-size: 12px;
  margin-bottom: 16px;
  font-weight: bold;
  text-align:center;
`

const DetailPlaceholder = styled.div`
  display: flex;
  font-size: 14px;
`
const Value = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: bold;
  margin-bottom:13px;
  display:inline-block;
`

const Footer = styled.div`
  // padding: 36px 0 0;
`
const CardBox = styled(Card)`
  border: 1px solid ${({ theme }) => theme.isDark ? '#1A191B' : '#FFE7D8'} ;
  background: ${({ theme }) => theme.isDark ? '#2D2925' : 'linear-gradient(180deg, #FFFFFF 0%, #FEF6E3 100%)'};
  border-radius: 25px;
  padding:20px 10px 10px;
  min-width:calc(100% - 20px);
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 280px;
  }
`

const StyledContentBox = styled.div`
  background: ${({ theme }) => theme.isDark ? '#201F1E' : '#fff'};
  border-radius: 25px;
  padding:13px 20px;
  a{
    font-size:16px;
  }
  ${({ theme }) => theme.mediaQueries.sm}{
    a{
      font-size:18px;
    }

  }

`
const Coming: React.FC = () => {
  const TranslateString = useI18n()

  return (
    <CardBox>
      <div style={{ width: '80px', height: '80px', margin: '0 auto' }}>
        <Image src="/images/pools/project.png" width={80} height={80} alt="Your project here" />
      </div>
      <CardTitle>
        {TranslateString(414, 'Your Project?')}{' '}
        {/* <span role="img" aria-label="eyes">
          👀
          </span> */}
      </CardTitle>
      <Balance>? ? ?</Balance>
      <Label>{TranslateString(416, 'Create a pool for your token')}</Label>
      <StyledContentBox>
        <Button
          variant="secondary"
          as="a"
          href="https://forms.gle/QTGzMP4N5gR9PMj38"
          external
          width="100%"
          mb="16px"
        >
          {TranslateString(418, 'Create a pool for your token')}
        </Button>
        <DetailPlaceholder>
          <Value style={{ flex: 1, marginTop: '12px' }}>{TranslateString(736, 'APR')}:</Value>
          <Value>-</Value>
        </DetailPlaceholder>
        <DetailPlaceholder>
          <div style={{ flex: 1, display: 'flex' }}>
            <img src="/images/pools/yourStake.png" alt="" width={18} height={18} style={{ marginRight: '6px', marginBottom: '13px' }} />
            {/* <span role="img" aria-label="syrup">
              🥞{' '}
            </span> */}
            <Value>{TranslateString(384, 'Your Stake')}:</Value>
          </div>
          <Value>??? Doge</Value>
        </DetailPlaceholder>
        <Footer>
          <CommunityTag />
        </Footer>
      </StyledContentBox>
    </CardBox>
  )
}

export default Coming
