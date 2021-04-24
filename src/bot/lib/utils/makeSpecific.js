export async function makeSpecific(channel, modifier) {
  const memoryKey = `${Math.random().toString(36).substring(2)}-${channel}-scoped-memory`

  return (...args) => (incommingMessage, previousCtx) => {
    if (previousCtx.channel === channel) {
      return {}
    }

    const previousMemory = previousCtx.memory || {}
    const previousChannelMemory = previousMemory[memoryKey] || {}

    const currentCtx = modifier(...args)(incommingMessage, {
      ...previousCtx,
      memory: previousChannelMemory,
    })

    const currentChannelMemory = currentCtx.memory || {}

    return {
      ...previousCtx,
      ...currentCtx,
      memory: {
        ...previousMemory,
        [memoryKey]: {
          ...previousChannelMemory,
          ...currentChannelMemory,
        },
      },
    }
  }
}
