/**
 * Implements a language selector list
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { IWalletDetails } from '../../../../core/API'
import { Currency } from '../../../../models/registry'
import Backdrop from '../../../Backdrop'
import styled from 'styled-components'
import { t } from 'ttag'
import { round, toString } from 'lodash'
import './WalletSelector.scss'
import { actionSetActiveWallet } from '../../../../actions/wallets'
import { formatCurrencyFn } from '../../../../core/currency'

const WalletBar = styled.div<any>`
  width: 100%;
  position: relative;
  line-height: 29.5px;
  font-size: 15px;
  letter-spacing: -0.22px;
  cursor: default;
  color: ${(props) => props.colors.secondaryText};
  height: 100%;

  .wallet-info-top {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    vertical-align: middle;
    width: 24px;
    height: 24px;
    margin-right: 5px;
  }

  span {
    padding-left: 10px;
    color: ${(props) => props.colors.primaryText};
  }
`
export const ListHolder = styled.div<any>`
    z-index: 81;
    position: absolute;
    padding: 10px;
    border-radius: 2px;
    box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
    background-color: ${(props) => props.colors.modalBackground};
    color: ${(props) => props.colors.secondaryText};
    right: 0;
    max-height: 300px;
    overflow: auto;
    ul li {
      padding: 8px 16px;
    }
}
`
interface IWalletSellectorProps {
  colors: any
  wallets: IWalletDetails[]
  activeWallet?: IWalletDetails
  availableCurrencies: {
    [props: string]: Currency
  }
  actionSetActiveWallet: (value: number) => void
}

const WalletSellector = (props: IWalletSellectorProps) => {
  const [picker, setPicker] = useState<boolean>(false)
  const activeCurrency: Currency =
    props.availableCurrencies[toString(props.activeWallet?.baseCurrency || '0')]

  const getWalletTypeName = (activeWallet: IWalletDetails | undefined) => {
    if (!activeWallet) return ''
    const { accountTypeLabel, challengeID } = activeWallet
    if (accountTypeLabel === 'Real Account') return t`Real`
    if (challengeID) return t`Challenge`
    return t`Practice`
  }

  return (
    <WalletBar colors={props.colors}>
      <div className="wallet-info-top" onClick={() => setPicker(true)}>
        <span
          style={{
            color: props.colors.primaryText,
            whiteSpace: 'nowrap',
          }}
        >
          {`${getWalletTypeName(props.activeWallet)}:`}
        </span>
        <span style={{ color: props.colors.secondaryText }}>
          #{props.activeWallet?.walletID}
        </span>
        <span
          style={{
            fontWeight: 'bold',
            color: props.colors.secondaryText,
            textTransform: 'uppercase',
          }}
        >
          {activeCurrency?.currencyName}
        </span>
        <span style={{ color: props.colors.secondaryText }}>▾</span>
      </div>
      {picker && (
        <>
          <Backdrop
            onClick={() => {
              setPicker(false)
            }}
          />
          <ListHolder colors={props.colors} className="scrollable">
            <table>
              <tbody>
                {props.wallets.map((wallet: IWalletDetails, i) => {
                  // const { title, url } = props.langs[key]
                  const currency: Currency =
                    props.availableCurrencies[
                      toString(wallet.baseCurrency || '0')
                    ]
                  return (
                    <tr
                      key={i}
                      onClick={() => {
                        props.actionSetActiveWallet(i)
                        setPicker(false)
                      }}
                      className="wallet-select-item"
                    >
                      <td
                        style={{ color: props.colors.accentDefault }}
                        className="wallet-type"
                      >
                        {getWalletTypeName(wallet)}:
                      </td>
                      <td
                        style={{
                          color: props.colors.secondaryText,
                        }}
                      >
                        #{wallet.walletID}
                      </td>
                      <td
                        style={{
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          color: props.colors.secondaryText,
                        }}
                      >
                        {currency.currencyName}
                      </td>
                      <td
                        style={{
                          fontWeight: 'bold',
                          color: props.colors.secondaryText,
                        }}
                      >
                        {formatCurrencyFn(wallet.availableCash || 0, {
                          currencySymbol: currency.currencySymbol,
                          precision: currency.precision,
                        } as any)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </ListHolder>
        </>
      )}
    </WalletBar>
  )
}

const mapStateToProps = (state: any) => ({
  wallets: state.wallets.wallets,
  colors: state.theme,
  activeWallet: state.wallets.activeWallet,
  availableCurrencies: state.registry.data.availableCurrencies,
})

export default connect(mapStateToProps, {
  actionSetActiveWallet,
})(WalletSellector)
