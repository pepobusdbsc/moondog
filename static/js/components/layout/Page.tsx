import React from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'
import { customMeta, DEFAULT_META } from 'config/constants/meta'
import { usePriceCakeBusd } from 'state/hooks'
import Container from './Container'

const StyledPage = styled(Container)`
  min-height: calc(100vh - 64px);
  padding-top: 16px;
  padding-bottom: 16px;
  box-shadow: 0px 4px 12px rgba(59, 41, 9, 0.08);
  border-radius: 20px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`

const PageMeta = () => {
  const { pathname } = useLocation()
  const cakePriceUsd = usePriceCakeBusd()
  const cakePriceUsdDisplay = cakePriceUsd.eq(0)
    ? ''
    : `$${cakePriceUsd.toNumber().toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })}`
  const pageMeta = customMeta[pathname] || {}
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta }
  const pageTitle = cakePriceUsdDisplay ? [title, cakePriceUsdDisplay].join(' - ') : title

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* <meta property="og:image" content={image} /> */}
    </Helmet>
  )
}

const Page: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <>
      <PageMeta />
      <StyledPage {...props}>{children}</StyledPage>
    </>
  )
}

export default Page
