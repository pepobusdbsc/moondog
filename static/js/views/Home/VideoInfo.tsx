import React from 'react'
import styled, { keyframes } from 'styled-components';
import { debounce } from "lodash"
import { Spinner } from 'moondoge-uikit'

const VideoContainer = styled.div<{ isLoading: boolean }>`
  padding:0;
  margin:0;
  position: relative;
  width: 100vw;
  height: 100vh;
  opacity:${({ isLoading }) => isLoading ? 1 : 0};
  video{
    display:inline-block;
    width: 100%;
    height: 100vh;
    &::-webkit-media-controls-fullscreen-button {
      display: none;
    }
  }
`;

const SkipButBox = styled.div`
  position: absolute;
  right:10px;
  top:320px;
  display:flex;
  align-items:center;
  ${({ theme }) => theme.mediaQueries.sm} {
    right:62px;
    top:39px;
  }
`;

const StyledImg = styled.img`
  margin-left: 25px;
  width:100px;
  object-fit:cover;
  cursor: pointer;
  ${({ theme }) => theme.mediaQueries.sm} {
    width:153px;
    margin-left: 43px;
 }
`;
const animationOpacity = keyframes`
  0%{ opacity: 0.5;}
  50%{opacity: 0.8;}
  100%{opacity: 1;}
`;

const StyledLevelImg = styled.img`
  width:150px;
  cursor: pointer;
  position: absolute;
  top:65px;
  left:0;
  bottom:0;
  right:0;
  margin:auto;
  animation: ${animationOpacity} 5s linear infinite;
  ${({ theme }) => theme.mediaQueries.sm} {
    width:300px;
    top:120px;
 }
`;

const DogeButBox = styled.div`
  width:50%;
  position: absolute;
  top:120px;
  left:0;
  bottom:0;
  right:0;
  margin:auto;
  animation: ${animationOpacity} 5s linear infinite;
  display:flex;
  align-items:center;
  justify-content: space-between;
  ${({ theme }) => theme.mediaQueries.sm} {
    top:280px;
    width:30%;
 }
`;

const StyledDogeImg = styled.img`
  width:80px;
  object-fit:cover;
  cursor: pointer;
  ${({ theme }) => theme.mediaQueries.sm} {
    width:160px;
 }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align:center;
  padding:60px 0;
`
class VideoInfo extends React.Component<any, any> {

  playerRef = React.createRef<any>()

  constructor(props) {
    super(props);
    this.state = {
      // showSkipButton: true,
      showNextLevelButton: false,
      showDogeButton: false,
      uploading: false,
      playAgain: false
    };
  }

  componentDidMount() {
    const { playAgain } = this.state;
    const video: any = document.getElementById('video');
    // 获取视频总时间
    video.addEventListener("loadedmetadata", this.loadDuration);

    video.addEventListener("timeupdate", () => {
      let timeDisplay: any = "";
      // let duration: any = "";
      timeDisplay = Math.floor(video.currentTime);
      // duration = Math.floor(video.duration);
      // console.log('总时长', duration)
      // console.log('当前播放的时长', timeDisplay)
      // if (timeDisplay >= 1.5) {
      //   this.setState({
      //     showSkipButton: false
      //   })
      // } else {
      //   this.setState({
      //     showSkipButton: true
      //   })
      // }
      if ([44, 45].includes(timeDisplay)) {
        this.setState({
          showNextLevelButton: true
        })
      } else {
        this.setState({
          showNextLevelButton: false
        })
      }
      if ([70, 71, 72, 73].includes(timeDisplay)) {
        this.setState({
          showDogeButton: true
        })
      } else {
        this.setState({
          showDogeButton: false
        })
      }
    }, false);

    video.addEventListener("ended", () => {
      if (!playAgain) {
        this.handleClickSkip();
      }
    }, false);
  }

  // 视频加载完毕后才能获取到时长 否则为NAN
  loadDuration = (e) => {
    // if (!localStorage.getItem("videoAutoPlay")) e.target.autoplay = true;
    const uploading = e.target.duration && true
    this.setState({
      // duration: e.target.duration,
      uploading,
    })
  }

  handleClickSkip = () => {
    localStorage.removeItem("isShowGuideVideo");
    window.history.replaceState(null, null, window.location.href)
  }

  handleClickSwappy = () => {
    localStorage.removeItem("isShowGuideVideo");
    window.open(process.env.REACT_APP_SWAP, '_self')
  }

  handleClickTrade = () => {
    localStorage.removeItem("isShowGuideVideo");
    window.open(process.env.REACT_APP_SWAP, '_self')
  }

  handleClickAgain = () => {
    this.setState({
      playAgain: true
    })
    setTimeout(() => {
      this.setState({
        playAgain: false
      })
    }, 4000)
  }

  handleClickPool = () => {
    localStorage.removeItem("isShowGuideVideo");
    window.open('https://www.moondoge.com/#/stake', '_target')
  }

  render() {
    const { showNextLevelButton, showDogeButton, uploading, playAgain } = this.state;
    return (
      <>
        {
          !uploading && <Wrapper>
            <Spinner />
          </Wrapper>
        }
        <VideoContainer isLoading={uploading}>
          {/* <video src="/video/videoDemo.mp4" controls preload="auto" id="video" autoPlay loop={playAgain} ref={this.playerRef} controlsList="nodownload" disablePictureInPicture /> */}
          <video src="https://moondoge-h5.s3.ap-southeast-1.amazonaws.com/video/videoDemo.mp4" controls preload="auto" id="video" autoPlay loop={playAgain} ref={this.playerRef} disablePictureInPicture />
          <SkipButBox>
            <StyledImg src="/images/skippy.png" alt="" onClick={debounce(this.handleClickSkip, 500)} />
            <StyledImg src="/images/swappy.png" alt="" onClick={debounce(this.handleClickSwappy, 500)} />
          </SkipButBox>
          {
            showNextLevelButton && <StyledLevelImg src="/images/nextLevel.png" alt="" />
          }
          {
            showDogeButton && <DogeButBox>
              <StyledDogeImg src="/images/tradeDoge.png" alt="" onClick={debounce(this.handleClickTrade, 500)} />
              <StyledDogeImg src="/images/playAgain.png" alt="" onClick={debounce(this.handleClickAgain, 500)} />
              {/* <StyledDogeImg src="/images/dogePool.png" alt="" onClick={debounce(this.handleClickPool, 500)} /> */}
            </DogeButBox>
          }
        </VideoContainer>
      </>
    );
  }

}
export default VideoInfo
