import styled from 'styled-components'

const AssetPanel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 3;
`

const AssetPanelSideMode = styled.div<{ colors: any }>`
  width: 270px;
  height: 100%;
  position: relative;
  padding: 5px 0 8px 8px;
  border-right: 1px solid ${(props) => props.colors.backgroundHue3};
  background-color: ${(props) => props.colors.backgroundHue1};
`

const AssetsWrapper = styled.div<{
  colors: any
}>`
  position: relative;
  overflow: auto;
  width: 100%;
  height: calc(100% - 40px);
  padding: 20px 35px 20px 20px;
  background-color: ${(props) => props.colors.backgroundHue1};
`

export { AssetPanel, AssetPanelSideMode, AssetsWrapper }
