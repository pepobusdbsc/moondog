import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'

import { Link } from 'react-router-dom'

interface ButtonProps {
  children?: React.ReactNode
  disabled?: boolean
  href?: string
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  text?: string
  to?: string
  variant?: 'default' | 'secondary' | 'tertiary'
}

const Button: React.FC<ButtonProps> = ({ children, disabled, href, onClick, size, text, to }) => {
  const { colors, spacing } = useContext(ThemeContext)
  const buttonColor = colors.background

  let boxShadow: string
  let buttonSize: number
  let buttonPadding: number
  let fontSize: number
  switch (size) {
    case 'sm':
      buttonPadding = spacing[3]
      buttonSize = 36
      fontSize = 14
      break
    case 'lg':
      buttonPadding = spacing[4]
      buttonSize = 72
      fontSize = 16
      break
    case 'md':
    default:
      buttonPadding = spacing[4]
      buttonSize = 56
      fontSize = 16
  }

  const ButtonChild = useMemo(() => {
    if (to) {
      return <StyledLink to={to}>{text}</StyledLink>
    }
    if (href) {
      return (
        <StyledExternalLink href={href} target="__blank">
          {text}
        </StyledExternalLink>
      )
    }
    return text
  }, [href, text, to])

  return (
    <StyledButton
      boxShadow={boxShadow}
      color={buttonColor}
      disabled={disabled}
      fontSize={fontSize}
      onClick={onClick}
      padding={buttonPadding}
      size={buttonSize}
    >
      {children}
      {ButtonChild}
    </StyledButton>
  )
}

interface StyledButtonProps {
  boxShadow: string
  color: string
  disabled?: boolean
  fontSize: number
  padding: number
  size: number
}

const StyledButton = styled.button<StyledButtonProps>`
  align-items: center;
  background: ${(props) => (!props.disabled ? props.theme.card.background : `#ddd`)};
  border: 0;
  border-radius: 12px;
  color: ${(props) => (!props.disabled ? `#A56A46` : `#B8B8B8`)};
  cursor: pointer;
  display: flex;
  font-size: ${(props) => props.fontSize}px;
  font-weight: 700;
  height: ${(props) => props.size}px;
  justify-content: center;
  outline: none;
  padding-left: ${(props) => props.padding}px;
  padding-right: ${(props) => props.padding}px;
  pointer-events: ${(props) => (!props.disabled ? undefined : 'none')};
  width: 100%;
  // border: 2px solid ${(props) => (!props.disabled ? `#A56A46` : `#eee`)};
  // width: 100px;
  height: 40px;
  font-size: 14px;
  padding: 0px;
  position: relative;
  background: ${(props) => (!props.disabled ? `linear-gradient(180deg, #FEF6E3 0%, #FEC23D 100%)` : `linear-gradient(180deg, #E9E8E4 0%, #D9D9D9 100%);`)} ;
  box-shadow: 0px 3px 6px rgba(178, 178, 178, 0.31);
  border-radius: 44px;
  flex:1;
  &:before{
    content:"";
    width:19px;
    height:19px;
    background: #FFFFFF;
    border: 4px solid ${(props) => (!props.disabled ? `#A56A46` : `#C8C8C8`)};
    border-radius: 50%;
    margin-right:10px;
    position: absolute;
    left: 7px;
  }

`

const StyledLink = styled(Link)`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${(props) => props.theme.spacing[4]}px;
  text-decoration: none;
`

const StyledExternalLink = styled.a`
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1;
  height: 56px;
  justify-content: center;
  margin: 0 ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${(props) => props.theme.spacing[4]}px;
  text-decoration: none;
`

export default Button
