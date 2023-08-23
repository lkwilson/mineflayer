const assert = require('assert')

module.exports = () => async (bot) => {
  // don't continue unless this version supports elytra
  if (!bot.supportFeature('hasElytraFlying')) return
  const supportsFireworkRockets = bot.supportFeature("fireworkNamePlural") || bot.supportFeature("fireworkNameSingular")

  const Item = require('prismarine-item')(bot.registry)

  await bot.test.setInventorySlot(6, new Item(bot.registry.itemsByName.elytra.id, 1))
  if (supportsFireworkRockets) {
    const fireworkItem = bot.registry.itemsArray.find(item => item.displayName === 'Firework Rocket')
    assert.ok(fireworkItem !== undefined)
    await bot.test.setInventorySlot(36, new Item(fireworkItem.id, 64))
  }
  await bot.test.teleport(bot.entity.position.offset(0, 100, 0))
  await bot.test.becomeSurvival()
  await bot.creative.stopFlying()

  await bot.look(bot.entity.yaw, 0)
  await bot.waitForTicks(5)
  console.error('Flying')
  await assert.doesNotReject(bot.elytraFly())
  await bot.waitForTicks(20) // wait for server to accept
  assert.ok(bot.entity.elytraFlying)

  if (!supportsFireworkRockets) return

  // use rocket
  for (let i = 0; i < 20; i++) {
    assert.ok(bot.entity.elytraFlying)
    bot.activateItem()
    await bot.waitForTicks(1)
  }
  assert.ok(bot.fireworkRocketDuration > 0)
  for (let i = bot.fireworkRocketDuration; i > 0; --i) {
    await bot.waitForTicks(1)
    assert.ok(bot.entity.elytraFlying)
  }
  assert.ok(bot.fireworkRocketDuration === 0)
}
