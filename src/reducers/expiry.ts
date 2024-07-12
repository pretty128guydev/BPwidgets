/**
 * Implements an expiry state
 */
import { SELECT_EXPIRY, UNSET_EXPIRY } from '../actions/expiry'

export interface IExpiryReducerState {
	selected: number | null
}

const expiryReducer = (
	state: IExpiryReducerState | null = {
		selected: null,
	},
	action: any
) => {
	switch (action.type) {
		case SELECT_EXPIRY:
			return {
				...state,
				selected: action.payload,
			}
		case UNSET_EXPIRY:
			return {
				selected: null,
			}
		default:
			return state
	}
}

export default expiryReducer
