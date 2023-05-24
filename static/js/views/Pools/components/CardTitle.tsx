import styled from 'styled-components'

interface StyledTitleProps {
  isFinished?: boolean
}

const CardTitle = styled.div<StyledTitleProps>`
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'stepMenuColor']};
  font-weight:bold;
  font-size: 16px;
  line-height: 1.1;
  text-align: center;
  margin:8px 0 0;
`

export default CardTitle
