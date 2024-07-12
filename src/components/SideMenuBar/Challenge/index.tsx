import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import ChallengeIcon from './challengeIcon'
import HelpIcon from '../icons/helpIcon'
import { t } from 'ttag'
import { Container, StartChallengeButton } from './styled'
import { api } from '../../../core/createAPI'
import { IChallengePackageInfo } from '../../Dashboard/interfaces'
import { getWalletCurrencySymbol } from '../../selectors/currency'
import GlobalLoader from '../../ui/GlobalLoader'
import { actionSetActiveWallet } from '../../../actions/wallets'
import { actionSetWallets } from '../../../actions/wallets'
import { actionSetShowChallenge } from '../../../actions/container'
import { IWalletDetails } from '../../../core/API'
import { actionShowModal, ModalTypes } from '../../../actions/modal'
import { pick, sortBy } from 'lodash'
import ChallengePackageSteps from './challengePackageSteps'
import UserStorage from '../../../core/UserStorage'

const fetchActiveChallengesInfo = async (): Promise<any> => {
  return await api.getActiveChallengesInfo()
}

interface IChallengeProps {
  colors: any
  currencySymbol: string
  isMobile: boolean
  onClose: () => void
  actionSetActiveWallet: (value: number) => void
  actionSetWallets: (
    wallets: IWalletDetails[],
    setActiveWallet?: number
  ) => void
  appReady: boolean
  showChallenge: boolean
  actionSetShowChallenge: (showChallenge: boolean) => void
  actionShowModal: (modalType: ModalTypes, args: any) => void
  challengesPayments: string[]
}

const Challenge = (props: IChallengeProps) => {
  const {
    colors,
    currencySymbol,
    isMobile,
    onClose,
    actionSetWallets,
    appReady,
    showChallenge,
    actionSetShowChallenge,
    actionShowModal,
    challengesPayments,
  } = props

  const [loading, setLoading] = useState<boolean>(false)
  const [challengeInfo, setChallengeInfo] = useState<any>([])
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    const accountBar = document.getElementById('account-bar')
    if (accountBar) accountBar.style.display = 'none'
    if (showChallenge) actionSetShowChallenge(false)

    if (appReady) setLoading(true)
    fetchActiveChallengesInfo().then((res) => {
      try {
        const { success, activeChallengePackagesInfo } = res
        if (success) {
          let packagesInfo: any = {}
          activeChallengePackagesInfo.map((info: IChallengePackageInfo) => {
            if (info.enabled === '1') {
              const stepsInitialBalance = parseFloat(
                info.stepsInitialBalance
              ).toFixed()
              if (packagesInfo[stepsInitialBalance]) {
                packagesInfo[stepsInitialBalance] = [
                  ...packagesInfo[stepsInitialBalance],
                  info,
                ]
              } else {
                packagesInfo[stepsInitialBalance] = [info]
              }
            }
            return true
          })
          const sortedKeys = sortBy(Object.keys(packagesInfo), (info) =>
            parseFloat(info)
          )
          setChallengeInfo(pick(packagesInfo, sortedKeys))
          setSelected(sortedKeys[0])
        }
      } catch (error) {
        console.log('Debug ~ fetchActiveChallengesInfo ~ error:', error)
      } finally {
        setLoading(false)
      }
    })

    return () => {
      if (accountBar) accountBar.style.display = 'flex'
    }
  }, [])

  const onClickStartChallenge = (packageConfigID: string, price: number) => {
    if (price === 0) {
      if (appReady) setLoading(true)

      api.addChallengeToUser(packageConfigID).then((data) => {
        const { success, challenge } = data

        if (success) {
          const { state } = challenge

          api.fetchWalletDetails().then((wls: IWalletDetails[]) => {
            const wallets = wls.reverse()
            const walletsFilter = wallets.filter(
              (wallet) =>
                !wallet.challengeID ||
                (wallet.challengeID &&
                  ![5, 6].includes(wallet.challengeStatus || 0))
            )

            const walletIndex = walletsFilter.findIndex(
              ({ walletID }) => walletID === state.walletID
            )

            actionSetWallets(walletsFilter, walletIndex)
            setLoading(false)
            actionShowModal(ModalTypes.CREATE_CHALLENGE_SUCCESS, {
              challenge: state,
              isMobile,
            })
            onClose()
          })
        }
      })
    } else {
      if (challengesPayments.length > 1) {
        actionShowModal(ModalTypes.PAYMENT_LINK, {
          packageConfigID,
          price,
        })
      } else if (
        challengesPayments.includes('stripe') ||
        challengesPayments.includes('coinspaid')
      ) {
        if (appReady) setLoading(true)

        api.addChallengeToUser(packageConfigID).then((data) => {
          const { success, challenge } = data

          if (success) {
            const { state } = challenge
            const { packageID } = state

            api.fetchWalletDetails().then((wls: IWalletDetails[]) => {
              const wallets = wls.reverse()
              const walletsFilter = wallets.filter(
                (wallet) =>
                  !wallet.challengeID ||
                  (wallet.challengeID &&
                    ![5, 6].includes(wallet.challengeStatus || 0))
              )

              const walletIndex = walletsFilter.findIndex(
                ({ walletID }) => walletID === state.walletID
              )

              actionSetWallets(walletsFilter, walletIndex)

              if (challengesPayments.includes('stripe')) {
                api
                  .getChallengePaymentLink(packageID, price, state.walletID)
                  .then((data) => {
                    setLoading(false)
                    const { success, link } = data
                    if (success && link) {
                      UserStorage.setChallengeWallet(JSON.stringify(state))
                      window.open(link, '_blank')
                    }
                  })
              } else if (challengesPayments.includes('coinspaid')) {
                api
                  .getChallengeCryptoPaymentLink(
                    packageID,
                    price,
                    state.walletID
                  )
                  .then((data) => {
                    setLoading(false)
                    const { success, link } = data
                    if (success && link) {
                      UserStorage.setChallengeWallet(JSON.stringify(state))
                      window.open(link, '_blank')
                    }
                  })
              }
            })
          }
        })
      }
    }
  }

  return (
    <Container
      className="scrollable"
      colors={colors}
      isMobile={isMobile}
      challengeLength={challengeInfo[selected]?.length || 0}
    >
      {loading && <GlobalLoader />}
      <div className="header">
        <div className="header-left">
          <ChallengeIcon color={colors.accentDefault} />
          <span>{t`Trading Challenge Packages`}</span>
        </div>
        <div className="header-right">
          <HelpIcon color={colors.accentHue1} />
          <span>{t`Account Rules`}</span>
        </div>
      </div>
      <div className="content">
        <div className="top-section">
          {Object.keys(challengeInfo)?.map((info) => {
            return (
              <span
                key={`top-section-item-${info}`}
                className={`top-section-item ${
                  selected === info ? 'selected' : ''
                }`}
                onClick={() => setSelected(info)}
              >
                {`${currencySymbol}${info}`}
              </span>
            )
          })}
        </div>
        <div className="bottom-section">
          {challengeInfo[selected]?.map((info: IChallengePackageInfo) => {
            const { title, profitSharePct, packageConfigID, steps, price } =
              info

            return (
              <div className="section" key={title}>
                <div className="section-top">
                  <div className="section-top-left">
                    <div className="number">{title}</div>
                  </div>
                  <div className="section-top-right">
                    <div className="text">{t`Profit Share`}</div>
                    <div className="number">
                      {parseFloat(profitSharePct || '0').toFixed()}%
                    </div>
                  </div>
                </div>
                <ChallengePackageSteps
                  steps={steps}
                  currencySymbol={currencySymbol}
                  price={price}
                />
                <div className="section-bottom">
                  <StartChallengeButton
                    colors={colors}
                    onClick={() =>
                      onClickStartChallenge(packageConfigID, Number(price))
                    }
                  >{t`Start Challenge`}</StartChallengeButton>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Container>
  )
}
const mapStateToProps = (state: any) => ({
  colors: state.theme,
  currencySymbol: getWalletCurrencySymbol(state),
  isMobile: state.registry.isMobile,
  appReady: state.registry.appReady,
  showChallenge: state.container.showChallenge,
  challengesPayments: state.registry.data.partnerConfig.challengesPayments,
})

export default connect(mapStateToProps, {
  actionSetActiveWallet,
  actionSetWallets,
  actionSetShowChallenge,
  actionShowModal,
})(Challenge)
