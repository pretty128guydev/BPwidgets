import { t } from 'ttag'

export const getTranslatedTitle = (key: string) => {
  switch (key) {
    case 'Dashboard':
      return t`Dashboard`
    case 'My Profile':
      return t`My Profile`
    case 'Accounts':
      return t`Accounts`
    case 'Trading':
      return t`Trading`
    case 'Expiry Prices':
      return t`Expiry Prices`
    case 'Asset Index':
      return t`Asset Index`
    case 'Terms & Privacy':
      return t`Terms & Privacy`
    case 'Trading Accounts':
      return t`Trading Accounts`
    case 'Add Accounts':
      return t`Add Accounts`
    case 'Add Account':
      return t`Add Account`
    case 'Add Funds':
      return t`Add Funds`
    case 'Withdrawal':
      return t`Withdrawal`
    case 'Transfer Funds':
      return t`Transfer Funds`
    case 'Transactions':
      return t`Transactions`
    case 'Transaction':
      return t`Transaction`
    case 'Delete Account':
      return t`Delete Account`
    case 'Edit Profile':
      return t`Edit Profile`
    case 'Account Verification':
      return t`Account Verification`
    case 'Change Password':
      return t`Change Password`
    case 'Mobile Verification':
      return t`Mobile Verification`
    case 'Privacy Center':
      return t`Privacy Center`
    case 'Trading History':
      return t`Trading History`
    default:
      return key
  }
}
