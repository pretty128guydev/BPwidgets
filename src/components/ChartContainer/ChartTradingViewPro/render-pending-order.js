let idPending

export const renderPendingOrder = ({
  colors,
  selectedDirection,
  widget,
  pendingOrder: pdOrder,
  lastQuote,
  loadedChart,
  tradeIfReachPending,
  precision,
  t,
}) => {
  removePendingOrderShape(widget)

  try {
    if (!loadedChart) return null

    const pendingOrder = parseFloat(Number(pdOrder).toFixed(precision))

    if (widget) {
      if (selectedDirection === 1) {
        const pendingOrderBuyColor = colors?.primaryDefault

        if (pendingOrder) {
          idPending = widget
            .chart()
            .createShape({ price: pendingOrder }, { shape: 'horizontal_line' })

          setShapChartProperties(widget, idPending, {
            linecolor: pendingOrderBuyColor,
            linestyle: 2,
            linewidth: 2,
            showLabel: true,
            text: t`Pending Order`,
            horzLabelsAlign: 'right',
            textcolor: pendingOrderBuyColor,
          })
        }
      } else {
        const pendingOrderSellColor = colors?.primaryDefault

        if (pendingOrder) {
          idPending = widget
            .chart()
            .createShape({ price: pendingOrder }, { shape: 'horizontal_line' })

          setShapChartProperties(widget, idPending, {
            linecolor: pendingOrderSellColor,
            linestyle: 2,
            linewidth: 2,
            showLabel: true,
            text: t`Pending Order`,
            horzLabelsAlign: 'right',
            textcolor: pendingOrderSellColor,
          })
        }
      }

      return idPending
    }
    return null
  } catch (error) {
    console.log('Debug ~ file: render-pending-order.js:70 ~ error:', error)
  }
}

const setShapChartProperties = (widget, id, properties) => {
  if (!widget) return

  const shape = widget.chart().getShapeById(id)

  if (shape) {
    shape.setProperties(properties)
  }
}

const removePendingOrderShape = (widget) => {
  if (!widget) return

  if (idPending) {
    widget.chart().removeEntity(idPending)
    idPending = undefined
  }
}
