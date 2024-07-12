/**
 * Implements a header bar containing brand logo, time, language picker, user sign in & menu
 */
import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'
import Account from './Account'
import Time from './Time'
import LanguageSelect from './LanguageSelect'
import { IRegistry } from '../../core/API'
import { isLoggedIn } from '../selectors/loggedIn'
import { actionGuestDemoRequest } from '../../actions/account'
import { ThemeContextConsumer } from '../ThemeContext'
import { BrandData, DepositButton, GuestDemoButton, Panel } from './styled'
import { t } from 'ttag'
import { IPlatformMenu } from '../../reducers/container'
import { filter, find, isArray, orderBy } from 'lodash'

interface IHeaderProps {
  data: IRegistry
  signedIn: boolean
  actionGuestDemoRequest: () => void
  showTopMenu: boolean
  topMenuItems: IPlatformMenu[]
  setShowMenuContent: ({ show, link }: { show: boolean; link: string }) => void
  setShowOtherPlatform: ({
    show,
    link,
  }: {
    show: boolean
    link: string
  }) => void
}

const Header = (props: IHeaderProps) => {
  const {
    data,
    signedIn,
    showTopMenu,
    topMenuItems,
    setShowMenuContent,
    setShowOtherPlatform,
    actionGuestDemoRequest,
  } = props
  const { partnerConfig, alias } = data

  const {
    allowDemo,
    logoUrl,
    depositLink,
    depositButton,
    defaultTheme,
    logoUrlPrimary,
    logoUrlSecondary,
  } = partnerConfig
  const guestDemoBtn = allowDemo && !signedIn

  const menuItems = useCallback(() => {
    return orderBy(
      filter(topMenuItems, ({ show }: IPlatformMenu) => !!show).map(
        (item: IPlatformMenu) => {
          return item
        }
      ),
      'order'
    )
  }, [topMenuItems])

  const [activeItem, setActiveItem] = useState<string>(
    find(menuItems(), ({ platform }) => platform === 'fx')?.label || ''
  )

  const depositBtn = isArray(depositButton) ? depositButton[0] : depositButton

  return (
    <ThemeContextConsumer>
      {(colors: any) => (
        <Panel colors={colors}>
          <BrandData colors={colors}>
            <a className="brand-logo" href={logoUrl}>
              <img
                height="42"
                src={
                  defaultTheme === 'themeSecondary'
                    ? logoUrlSecondary
                    : logoUrlPrimary
                }
                alt={alias}
              />
            </a>
            {showTopMenu &&
              (menuItems() as IPlatformMenu[]).map(
                ({ label, link, platform }) => (
                  <div
                    key={label}
                    className={`menu-item ${
                      activeItem === label ? 'item-active' : ''
                    }`}
                    onClick={() => {
                      activeItem !== label && setActiveItem(label)
                      setShowOtherPlatform({
                        show: platform === 'options6',
                        link,
                      })
                    }}
                  >
                    <span>{label}</span>
                  </div>
                )
              )}
            {depositBtn?.show &&
              ((depositBtn?.afterLoginOnly && signedIn) ||
                !depositBtn?.afterLoginOnly) && (
                <div className="menu-item">
                  <DepositButton
                    colors={colors}
                    onClick={() =>
                      setShowMenuContent({
                        show: true,
                        link: depositBtn?.link || depositLink,
                      })
                    }
                  >
                    {depositBtn?.label || t`Deposit`}
                  </DepositButton>
                </div>
              )}
          </BrandData>
          {guestDemoBtn && (
            <GuestDemoButton
              colors={colors}
              onClick={actionGuestDemoRequest}
            >{t`Guest demo`}</GuestDemoButton>
          )}
          <Time colors={colors} />
          <LanguageSelect colors={colors} />
          <Account
            colors={colors}
            setShowOtherPlatform={setShowOtherPlatform}
          />
        </Panel>
      )}
    </ThemeContextConsumer>
  )
}

const mapStateToProps = (state: any) => ({
  data: state.registry.data,
  signedIn: isLoggedIn(state),
  showTopMenu: state.container.showTopMenu,
  topMenuItems: state.container.topMenuItems,
})

export default connect(mapStateToProps, { actionGuestDemoRequest })(Header)
