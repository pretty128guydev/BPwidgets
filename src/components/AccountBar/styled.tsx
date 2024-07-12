import styled from 'styled-components'

const AccountBarContainer = styled.div<any>`
  display: flex;
  box-sizing: border-box;

  padding-left: 20px;
  padding-right: 20px;

  background-color: ${(props) => props.colors.backgroundHue2};
  border: 1px solid ${(props) => props.colors.backgroundHue3};
  border-bottom: none;

  .information-group {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    padding-right: 30px;
    border-right: 1px solid ${(props) => props.colors.backgroundHue3};
  }
`
const TextGroup = styled.div<any>`
  // flex: 1 1 auto;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: -0.17px;
  margin-right: 30px;
  position: relative;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:last-child {
    margin-right: 0;
  }
`
const Caption = styled.span<any>`
  text-transform: uppercase;
  color: ${(props) => props.colors.defaultText};
  white-space: nowrap;
`

const Value = styled.span<{ color: any }>`
  display: inline-block;
  font-size: 15px;
  margin-top: 5px;
  color: ${(props) => props.color};
  line-height: 15px;
  white-space: nowrap;
`

const Oval = styled.div<any>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
  background-color: ${(props) => props.colors.accentDefault};
`

export { AccountBarContainer, TextGroup, Caption, Value, Oval }
