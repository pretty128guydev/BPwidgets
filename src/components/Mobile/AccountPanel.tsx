/**
 * Render account data or sign / sign up button
 * Calls a parent component when user wants to open menu
 */
import React from 'react'
import { connect } from 'react-redux'
import { CircularProgress } from '@react-md/progress'
import styled, { css } from 'styled-components'
import { actionShowModal, ModalTypes } from '../../actions/modal'
import { isLoggedIn } from '../selectors/loggedIn'
import { IUserInfo } from '../../core/API'
import Avatar from '../Header/Avatar'
import AvatarFallbackIcon from '../Header/avatar_fallback.svg'
import ThemedIcon from '../ui/ThemedIcon'
import { isMobileLandscape } from '../../core/utils'

const AccountPanel = styled.div<{ isMobile: Boolean }>`
  ${(props) =>
    props.isMobile
      ? css`
          flex: 0 0 60px;
          padding-right: 10px;
          line-height: 64px;
          height: 64px;
          @media (orientation: landscape) {
            flex: 0 0 40px;
            padding-right: 7px;
            line-height: 40px;
            height: 40px;
          }
        `
      : css`
          flex: 0 0 60px;
          padding-right: 10px;
          line-height: 64px;
          height: 64px;
        `}
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.12px;
  color: #e0e1e2;
  display: flex;

  span {
    flex: 1 1 auto;
    display: inline-block;
  }
  img {
    ${(props) =>
      props.isMobile
        ? css`
            flex: 0 0 40px;
            @media (orientation: landscape) {
              flex: 0 0 30px;
            }
          `
        : css`
            flex: 0 0 40px;
          `}
    display: inline-block;
    margin-left: 5px;
    vertical-align: middle;
  }
  .avatar_fallback {
    background: url(${AvatarFallbackIcon}) no-repeat center;
    background-size: 40px 40px;
  }

  .themed_icon {
    margin: 10px;
  }

  .avatar-mobile {
    @media (orientation: landscape) {
      width: 30px !important;
      height: 30px !important;
      margin-top: 5px !important;
    }
  }
`
// const Button = styled.button<any>`
// 	display: block;
// 	cursor: pointer;
// 	width: 100px;
// 	height: 32px;
// 	line-height: 32px;

// 	margin: 16px auto;

// 	border: none;
// 	outline: none;
// 	text-align: center;
// 	border-radius: 4px;
// 	font-size: 14px;
// 	font-weight: 500;
// 	font-stretch: normal;
// 	font-style: normal;
// 	line-height: normal;
// 	text-transform: uppercase;
// 	letter-spacing: -0.08px;

// 	color: #031420;
// 	background-color: #75f986;
// `

interface IAccountProps {
  userInfo: IUserInfo | null
  isLoggedIn: Boolean
  isMobile: boolean
  actionShowModal: any
  onMenuClick: () => void
}
const Account = (props: IAccountProps) => {
  const { userInfo } = props

  if (props.isLoggedIn) {
    if (userInfo) {
      return (
        <AccountPanel isMobile={props.isMobile} onClick={props.onMenuClick}>
          <Avatar src={userInfo.userImage} isMobile={props.isMobile} />
        </AccountPanel>
      )
    }
    return (
      <AccountPanel isMobile={props.isMobile}>
        <CircularProgress id="account__loading" />
      </AccountPanel>
    )
  }

  const onSignInModal = () => props.actionShowModal(ModalTypes.SIGN_IN)
  return (
    <AccountPanel isMobile={props.isMobile} onClick={onSignInModal}>
      <ThemedIcon
        fill="#e0e1e2"
        width={isMobileLandscape(props.isMobile) ? 30 : 40}
        height={isMobileLandscape(props.isMobile) ? 30 : 40}
        type="avatar"
        src={`${process.env.PUBLIC_URL}/static/icons/avatar_fallback.svg`}
      />
    </AccountPanel>
  )
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedIn(state),
  userInfo: state.account.userInfo,
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps, { actionShowModal })(Account)
