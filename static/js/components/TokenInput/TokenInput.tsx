import React from 'react'
import styled from 'styled-components'
import { Box, Button, Flex, Text, Input, InputProps } from 'moondoge-uikit'
import useI18n from 'hooks/useI18n'

interface TokenInputProps extends InputProps {
  max: number | string
  symbol: string
  value: string
  onSelectMax?: () => void
  onChange: (evt: React.FormEvent<HTMLInputElement>) => void
}
const StyledFlex = styled(Flex)`
  input{
    width: 183px;
    height: 44px;
    background: ${({ theme }) => theme.isDark ? '#2D2925' : '#FBFAF6'} ;
    border: 2px solid #A56A46;
    opacity: 1;
    border-radius: 10px;
  }

`;

const TokenInput: React.FC<TokenInputProps> = ({ max, symbol, onChange, onSelectMax, value }) => {
  const TranslateString = useI18n()

  return (
    <Box>
      <Flex justifyContent="flex-end" minHeight="21px" mb="8px">
        <Text color="primary" fontSize="14px" mb="16px">
          {max.toLocaleString()} {symbol} {TranslateString(526, 'Available')}
        </Text>
      </Flex>
      <StyledFlex alignItems="center">
        <Input onChange={onChange} placeholder="0" value={value} />
        <Flex alignItems="center">
          <Text bold textTransform="uppercase" mx="8px" mr="12px" fontSize="16px">
            {symbol}
          </Text>
          <div>
            <Button scale="sm" onClick={onSelectMax} variant="max">
              {TranslateString(452, 'Max')}
            </Button>
          </div>
        </Flex>
      </StyledFlex>
    </Box>
  )
}

export default TokenInput
