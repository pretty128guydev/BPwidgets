/**
 * This is entry component
 * Mobile, Desktop are lazy-loaded bundles
 */
import React, { Suspense, useEffect } from 'react'
import { connect } from 'react-redux'
import { ThemeContextConsumer } from './components/ThemeContext'
import { isLoggedIn } from './components/selectors/loggedIn'
import GlobalLoader from './components/ui/GlobalLoader/index'
import './core/i18n'
import { SidebarState } from './reducers/sidebar'
import { actionSetSidebar } from './actions/sidebar'
import DesktopApp from './DesktopApp'
import MobileApp from './MobileApp'

export const Background = ({ children, isMobile }: any) => (
  <ThemeContextConsumer>
    {(context) => {
      return (
        <div
          className="column_container hide_scroll_bar"
          style={{
            backgroundColor: isMobile
              ? context.panelBackground
              : context.background,
          }}
        >
          {children}
        </div>
      )
    }}
  </ThemeContextConsumer>
)

/**
 * Hide header:
 * a) if xprops are defined
 * b) Hide header if noheader present in search
 * @returns
 */
const shouldShowHeader = () => {
  const { xprops } = window as any

  if (xprops && !xprops.header) {
    return false
  }
  // Hide header for EM
  if (window.location.search.includes('noheader')) {
    return false
  }
  return true
}

const App = ({
  isMobile,
  loading,
  appReady,
  isLoggedIn,
  theme,
  themeReady,
  actionSetSidebar,
}: any) => {
  const showHeader = shouldShowHeader()

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (event.data === 'refresh-page') window.location.reload()
    })

    return () => {
      window.removeEventListener('message', () => {})
    }
  }, [])

  if (!themeReady) {
    return <Background />
  }

  // if (loading) {
  //   return <GlobalLoader />
  // }
  if (isMobile) {
    return (
      <>
        {!appReady && <GlobalLoader />}
        {!loading && (
          <MobileApp
            colors={theme}
            showHeader={showHeader}
            onHidePositionsPanel={() => actionSetSidebar(SidebarState.none)}
            isLoggedIn={isLoggedIn}
          />
        )}
      </>
    )
  }

  return (
    <>
      {!appReady && <GlobalLoader />}
      {!loading && (
        <DesktopApp
          showHeader={showHeader}
          theme={theme}
          isLoggedIn={isLoggedIn}
        />
      )}
    </>
  )
}

const mapStateToProps = (state: any) => ({
  isLoggedIn: isLoggedIn(state),
  loading: state.registry.loading,
  isMobile: state.registry.isMobile,
  theme: state.theme,
  themeReady: state.registry.themeReady,
  appReady: state.registry.appReady,
})

export default connect(mapStateToProps, { actionSetSidebar })(App)
