const channelToSubscription = new Map()

export function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscribeUID,
  lastDailyBar
) {
  const channelString = symbolInfo.full_name
  const handler = {
    id: subscribeUID,
    callback: onRealtimeCallback,
  }
  let subscriptionItem = channelToSubscription.get(channelString)
  if (subscriptionItem) {
    // already subscribed to the channel, use the existing subscription
    subscriptionItem.handlers.push(handler)
    return
  }
  subscriptionItem = {
    subscribeUID,
    resolution,
    lastDailyBar,
    handlers: [handler],
  }
  channelToSubscription.set(channelString, subscriptionItem)
}

export function unsubscribeFromStream(subscriberUID) {
  // find a subscription with id === subscriberUID
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString)
    const handlerIndex = subscriptionItem.handlers.findIndex(
      (handler) => handler.id === subscriberUID
    )

    if (handlerIndex !== -1) {
      // remove from handlers
      subscriptionItem.handlers.splice(handlerIndex, 1)

      if (subscriptionItem.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
        channelToSubscription.delete(channelString)
        break
      }
    }
  }
}
export function reRenderTradingChart(instrumentName, lastQuote) {
  if (typeof instrumentName === 'object' && typeof lastQuote === 'object') {
    if (instrumentName.length === 0 || lastQuote.length === 0) return
    instrumentName.forEach((instrument, index) => {
      if (lastQuote[index])
        subscriptionHandlers(instrument.name, lastQuote[index])
    })
    return
  }
  if (!instrumentName || !lastQuote) return

  subscriptionHandlers(instrumentName, lastQuote)
}

function subscriptionHandlers(instrumentName, lastQuote) {
  const channelString = instrumentName

  const subscriptionItem = channelToSubscription.get(channelString)

  if (subscriptionItem === undefined) {
    return
  }

  const { timestamp, open, low, high, last: close } = lastQuote
  if (!timestamp) return
  const bar = {
    time: timestamp,
    open,
    high,
    low,
    close,
  }

  subscriptionItem.lastDailyBar = bar

  subscriptionItem.handlers.forEach((handler) => handler.callback(bar))
}
