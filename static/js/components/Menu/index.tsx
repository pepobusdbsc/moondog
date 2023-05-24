import React, { useContext, useEffect } from 'react'
// import { Menu as UikitMenu } from 'moondoge-uikit'
import { Menu as UikitMenu, useMatchBreakpoints } from 'moondoge-uikit'
import { useWeb3React } from '@web3-react/core'
import { allLanguages } from 'config/localisation/languageCodes'
import { LanguageContext } from 'contexts/Localisation/languageContext'
import useTheme from 'hooks/useTheme'
// import useI18n from 'hooks/useI18n'
import useAuth from 'hooks/useAuth'
import {
  usePriceCakeBusd,
  //  useProfile
} from 'state/hooks'
import { BURYING_POINT_CONNECT_WALLET } from 'config'
import { buriedPoint } from 'utils'
import VideoInfo from 'views/Home/VideoInfo'
import config from './config'

const Menu = (props) => {
  // const TranslateString = useI18n();
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl;
  const isConnect = localStorage.getItem("isConnect")
  // const { profile } = useProfile();
  // const currentCheckLanguage = allLanguages.filter(language => ["en", "zh-CN", "ko", "vn"].includes(language.code))
  // const currentCheckLanguage = allLanguages.filter(language => ["en"].includes(language.code))
  useEffect(() => {
    const postPoint = async () => {
      const response = await buriedPoint(account, BURYING_POINT_CONNECT_WALLET)
      if (response && response.ok) {
        localStorage.setItem("isConnect", '1')
      }
    }
    if (account && !isConnect) {
      postPoint()
    } else if (!account && isConnect) {
      localStorage.removeItem("isConnect")
    }
  }, [account, isConnect])

  useEffect(() => {
    if (!isMobile) return
    // 移动端第一次白屏 手动刷新
    const firstMobileCome = sessionStorage.getItem("firstMobileCome");
    if (!firstMobileCome) {
      sessionStorage.setItem("firstMobileCome", '1');
      window.location.reload();
    }
  }, [isMobile])

  //  第一次登陆网站展示引导视频页
  const isShowGuideVideo = localStorage.getItem("isShowGuideVideo");
  if (isShowGuideVideo) {
    return (
      <VideoInfo />
    )
  }
  localStorage.removeItem("isShowGuideVideo")
  // localStorage.setItem("videoAutoPlay", "1")

  return (
    <UikitMenu
      account={account}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage && selectedLanguage.code}
      // langs={allLanguages}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      cakePriceUsd={cakePriceUsd.toNumber()}
      links={config}
      // profile={{
      //   username: profile?.username,
      //   image: profile?.nft ? `/images/nfts/${profile.nft?.images.sm}` : undefined,
      //   profileLink: '/profile',
      //   noProfileLink: '/profile',
      //   showPip: !profile?.username,
      // }}
      {...props}
    />
  )
}

export default Menu
