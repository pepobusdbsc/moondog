import { MenuEntry } from 'moondoge-uikit';
import TwitterIcon from "./twitter"
import TelegramIcon from "./telegram"
import InstagramIcon from "./instagram"
import BlogIcon from "./blog"
import RedditIcon from "./reddit"
import BitCointalkIcon from "./bitcointalk"
import YouTubeIcon from "./youTuBe"
import GithubIcon from "./github"

const SWAP_URL = `${process.env.REACT_APP_SWAP}/${window.location.search}#/swap`;

const TestConfig: MenuEntry[] = [
  {
    label: 'Home',
    // icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Exchange',
    // icon: 'TradeIcon',
    href: SWAP_URL || 'https://moondogeswap.bkbos.space/#/swap',
    // href: '/exchange',
    // items: [
    //   {
    //     label: 'Exchange',
    //     href: 'https://exchange.pancakeswap.finance',
    //   },
    //   {
    //     label: 'Liquidity',
    //     href: 'https://exchange.pancakeswap.finance/#/pool',
    //   },
    // ],
  },
  {
    label: 'Yield',
    // icon: 'FarmIcon',
    href: '/yield',
  },
  {
    label: 'Stake',
    // icon: 'PoolIcon',
    href: '/stake',
  },
  {
    label: 'Raffle',
    // icon: 'TicketIcon',
    href: '/raffle',
    // status: {
    //   text: 'WIN',
    //   color: 'warning',
    // },
  },
  // {
  //   label: 'Collectibles',
  //   icon: 'NftIcon',
  //   href: '/collectibles',
  // },
  // {
  //   label: 'Team Battle',
  //   icon: 'TeamBattleIcon',
  //   href: '/competition',
  // },
  // {
  //   label: 'Teams & Profile',
  //   icon: 'GroupsIcon',
  //   items: [
  //     {
  //       label: 'Leaderboard',
  //       href: '/teams',
  //     },
  //     {
  //       label: 'Task Center',
  //       href: '/profile/tasks',
  //     },
  //     {
  //       label: 'Your Profile',
  //       href: '/profile',
  //     },
  //   ],
  // },
  {
    label: 'Analytics',
    // icon: 'InfoIcon',
    href: 'http://analytics.moondoge.com',
    // items: [
    //   {
    //     label: 'Overview',
    //     href: 'https://pancakeswap.info',
    //   },
    //   {
    //     label: 'Tokens',
    //     href: 'https://pancakeswap.info/tokens',
    //   },
    //   {
    //     label: 'Pairs',
    //     href: 'https://pancakeswap.info/pairs',
    //   },
    //   {
    //     label: 'Accounts',
    //     href: 'https://pancakeswap.info/accounts',
    //   },
    // ],
  },
  // {
  //   label: 'Community',
  //   icon: 'InfoIcon',
  //   href: '/community'
  // },
  // {
  //   label: 'IFO',
  //   icon: 'IfoIcon',
  //   href: '/ifo',
  // },
  {
    label: 'Docs',
    // icon: 'IfoIcon',
    href: 'https://docs.moondoge.com',
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    href: '/more',
    items: [
      {
        label: 'Twitter',
        href: 'https://twitter.com/MoonDogeswap',
        icon: TwitterIcon,
        openPageTarget: true
      },
      {
        label: 'Telegram',
        href: 'https://t.me/moondogeofficial',
        icon: TelegramIcon,
        openPageTarget: true
      },
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/moondogeswap/',
        icon: InstagramIcon,
        openPageTarget: true
      },
      {
        label: 'Blog',
        href: 'https://blog.moondoge.com/',
        icon: BlogIcon,
        openPageTarget: true
      },
      {
        label: 'Reddit',
        href: 'https://www.reddit.com/r/MoonDogeSwap/',
        icon: RedditIcon,
        openPageTarget: true
      },
      {
        label: 'Bitcointalk',
        href: 'https://bitcointalk.org/index.php?topic=5338592.new#new',
        icon: BitCointalkIcon,
        openPageTarget: true
      },
      {
        label: 'YouTube',
        href: 'https://www.youtube.com/channel/UCgo7YlM49POdsgNdKrCZLbA',
        icon: YouTubeIcon,
        openPageTarget: true
      },
      {
        label: 'GitHub',
        href: 'https://github.com/moondogeswap',
        icon: GithubIcon,
        openPageTarget: true
      }
    ],
  }
]

export default TestConfig
