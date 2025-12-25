/**
 * 矿脉储量逻辑
 * 处理星球矿脉储量的生成、消耗和效率计算
 */

import type { Planet, OreDeposits } from '@/types/game'
import { ORE_DEPOSIT_CONFIG } from '@/config/gameConfig'

/**
 * 根据星球位置生成初始矿脉储量
 */
export const generateOreDeposits = (position: { galaxy: number; system: number; position: number }): OreDeposits => {
  const { BASE_DEPOSITS, POSITION_MULTIPLIERS, GALAXY_MULTIPLIER, RANDOM_VARIANCE } = ORE_DEPOSIT_CONFIG

  // 位置索引 (0-14)
  const posIndex = Math.max(0, Math.min(14, position.position - 1))

  // 银河系加成 (银河系1为基础，每增加1个银河系增加5%)
  const galaxyBonus = 1 + (position.galaxy - 1) * GALAXY_MULTIPLIER

  // 计算每种资源的储量
  const calculateDeposit = (baseAmount: number, positionMultiplier: number): number => {
    // 基础储量 × 位置系数 × 银河系加成
    const baseDeposit = baseAmount * positionMultiplier * galaxyBonus

    // 添加随机浮动 (±RANDOM_VARIANCE)
    const variance = 1 + (Math.random() * 2 - 1) * RANDOM_VARIANCE
    return Math.floor(baseDeposit * variance)
  }

  const metalDeposit = calculateDeposit(BASE_DEPOSITS.metal, POSITION_MULTIPLIERS.metal[posIndex] ?? 1)
  const crystalDeposit = calculateDeposit(BASE_DEPOSITS.crystal, POSITION_MULTIPLIERS.crystal[posIndex] ?? 1)
  const deuteriumDeposit = calculateDeposit(BASE_DEPOSITS.deuterium, POSITION_MULTIPLIERS.deuterium[posIndex] ?? 1)

  return {
    metal: metalDeposit,
    crystal: crystalDeposit,
    deuterium: deuteriumDeposit,
    initialMetal: metalDeposit,
    initialCrystal: crystalDeposit,
    initialDeuterium: deuteriumDeposit
  }
}

/**
 * 计算矿脉储量对产量的效率系数
 * 当储量低于衰减阈值时，产量会线性下降
 * @returns 0-1 之间的效率系数
 */
export const calculateDepositEfficiency = (deposits: OreDeposits | undefined, resourceType: 'metal' | 'crystal' | 'deuterium'): number => {
  if (!deposits) return 1 // 没有储量数据时返回满效率（向后兼容）

  const { DECAY_START_THRESHOLD } = ORE_DEPOSIT_CONFIG

  const currentDeposit = deposits[resourceType]
  const initialDeposit =
    resourceType === 'metal' ? deposits.initialMetal : resourceType === 'crystal' ? deposits.initialCrystal : deposits.initialDeuterium

  // 如果初始储量为0，返回0（避免除以0）
  if (initialDeposit <= 0) return 0

  // 计算剩余百分比
  const remainingPercentage = currentDeposit / initialDeposit

  // 如果已耗尽，返回0
  if (currentDeposit <= 0) return 0

  // 如果高于衰减阈值，返回满效率
  if (remainingPercentage >= DECAY_START_THRESHOLD) return 1

  // 在衰减阈值以下，线性衰减
  // 从 DECAY_START_THRESHOLD 到 0，效率从 1 降到 0
  return remainingPercentage / DECAY_START_THRESHOLD
}

/**
 * 消耗矿脉储量
 * @param deposits 矿脉储量对象
 * @param resourceType 资源类型
 * @param amount 要消耗的量
 * @returns 实际消耗的量（不会超过剩余储量）
 */
export const consumeDeposit = (deposits: OreDeposits, resourceType: 'metal' | 'crystal' | 'deuterium', amount: number): number => {
  const currentDeposit = deposits[resourceType]
  const actualConsumption = Math.min(currentDeposit, amount)

  deposits[resourceType] = Math.max(0, currentDeposit - actualConsumption)

  return actualConsumption
}

/**
 * 获取矿脉剩余百分比
 */
export const getDepositPercentage = (deposits: OreDeposits | undefined, resourceType: 'metal' | 'crystal' | 'deuterium'): number => {
  if (!deposits) return 100

  const currentDeposit = deposits[resourceType]
  const initialDeposit =
    resourceType === 'metal' ? deposits.initialMetal : resourceType === 'crystal' ? deposits.initialCrystal : deposits.initialDeuterium

  if (initialDeposit <= 0) return 0

  return (currentDeposit / initialDeposit) * 100
}

/**
 * 检查矿脉是否处于警告状态（低于警告阈值）
 */
export const isDepositWarning = (deposits: OreDeposits | undefined, resourceType: 'metal' | 'crystal' | 'deuterium'): boolean => {
  if (!deposits) return false

  const percentage = getDepositPercentage(deposits, resourceType)
  return percentage < ORE_DEPOSIT_CONFIG.WARNING_THRESHOLD * 100 && percentage > 0
}

/**
 * 检查矿脉是否已耗尽
 */
export const isDepositDepleted = (deposits: OreDeposits | undefined, resourceType: 'metal' | 'crystal' | 'deuterium'): boolean => {
  if (!deposits) return false
  return deposits[resourceType] <= 0
}

/**
 * 为现有星球迁移/初始化矿脉储量
 * 如果星球没有矿脉数据，则生成新的储量
 */
export const migrateOreDeposits = (planet: Planet): void => {
  // 月球不需要矿脉（没有采矿建筑）
  if (planet.isMoon) return

  if (!planet.oreDeposits) {
    planet.oreDeposits = generateOreDeposits(planet.position)
  }
}

/**
 * 计算预计耗尽时间（小时）
 * @param deposits 矿脉储量
 * @param resourceType 资源类型
 * @param productionPerHour 每小时产量
 * @returns 预计耗尽时间（小时），如果产量为0则返回Infinity
 */
export const calculateDepletionTime = (
  deposits: OreDeposits | undefined,
  resourceType: 'metal' | 'crystal' | 'deuterium',
  productionPerHour: number
): number => {
  if (!deposits || productionPerHour <= 0) return Infinity

  const currentDeposit = deposits[resourceType]
  if (currentDeposit <= 0) return 0

  return currentDeposit / productionPerHour
}

/**
 * 格式化耗尽时间为可读字符串
 */
export const formatDepletionTime = (hours: number): string => {
  if (!isFinite(hours) || hours < 0) return '∞'
  if (hours === 0) return '0'

  const days = Math.floor(hours / 24)
  const remainingHours = Math.floor(hours % 24)

  if (days > 365) {
    const years = Math.floor(days / 365)
    return `${years}y+`
  }

  if (days > 0) {
    return `${days}d ${remainingHours}h`
  }

  if (hours < 1) {
    const minutes = Math.floor(hours * 60)
    return `${minutes}m`
  }

  return `${remainingHours}h`
}
