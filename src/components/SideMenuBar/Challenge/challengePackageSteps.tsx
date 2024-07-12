import React, { useState } from 'react'
import { t } from 'ttag'
import { IChallengeInfo } from '../../Dashboard/interfaces'

interface IChallengePackageStepsProps {
  steps: IChallengeInfo[]
  currencySymbol: string
  price: string
}

const ChallengePackageSteps = (props: IChallengePackageStepsProps) => {
  const { steps, currencySymbol, price } = props
  const [selected, setSelected] = useState<number>(0)

  const {
    initialBalance,
    maxDailyLossPct,
    maxTotalLossPct,
    profitGoalPct,
    minOverallTrades,
  } = steps[selected]

  return (
    <>
      <div className="wrapper">
        <div className="challenge-package-steps">
          {steps.map((step, index) => {
            return (
              <span
                key={`challenge-package-step-item-${index}`}
                className={`challenge-package-step-item ${
                  selected === index ? 'selected' : ''
                }`}
                onClick={() => setSelected(index)}
              >
                {`${index + 1} ${t`Step`}`}
              </span>
            )
          })}
        </div>
        <div className="section-middle" style={{ padding: 0 }}>
          <div className="section-middle-item profit-target">
            <div className="text">
              <span>{t`Profit Target`}</span>
            </div>
            <div className="number">
              {parseFloat(profitGoalPct || '0').toFixed()}
              {`% / ${currencySymbol}${(
                (parseFloat(initialBalance || '0') *
                  parseFloat(profitGoalPct || '0')) /
                100
              ).toFixed()}`}
            </div>
          </div>
          <div className="section-middle-item max-daily-loss">
            <div className="text">{t`Maximum Daily Loss`}</div>
            <div className="number">
              {parseFloat(maxDailyLossPct || '0').toFixed()}%
            </div>
          </div>
          <div className="section-middle-item max-account-balance">
            <div className="text">{t`Maximum Initial Account Balance Loss`}</div>
            <div className="number">
              {parseFloat(maxTotalLossPct || '0').toFixed()}%
            </div>
          </div>
          <div className="section-middle-item min-trading-days">
            <div className="text">{t`Minimum Trading Days`}</div>
            <div className="number">{minOverallTrades}</div>
          </div>
        </div>
      </div>
      <div className="section-middle">
        {/* <div className="section-middle-item trading-period">
          <div className="text">
            <TradingPeriodIcon color={colors.defaultText} />
            <span>{t`Trading Period`}</span>
          </div>
          <div className="number">
            {expiryDate
              ? moment(expiryDate).format('YYYY-MM-DD')
              : t`Unlimited Time`}
          </div>
        </div> */}
        <div className="section-middle-item one-time-payment">
          <div className="text">{t`For one-time payment of`}</div>
          <div className="number">
            {parseFloat(price) === 0
              ? t`Free`
              : `${currencySymbol}${parseFloat(price || '0').toFixed()}`}
          </div>
        </div>
      </div>
    </>
  )
}

export default ChallengePackageSteps
