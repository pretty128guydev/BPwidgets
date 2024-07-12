import styled from 'styled-components'

const AssetPanel = styled.div<{ colors: any }>`
  width: 100%;
  height: 100%;
  position: relative;
  padding: 8px 0 8px 8px;
  background-color: ${(props) => props.colors.backgroundHue1};
`

export { AssetPanel }
