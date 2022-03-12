/*
 * @Desc: 定时任务
 * @Author: lwp
 * @Date: 2020-05-09 17:03:09
 * @LastEditors: lwp
 * @LastEditTime: 2020-05-15 16:56:40
 */
const logger = require('../../util/logger')
const schedule = require('node-schedule')
const { Task } = require('../../models/task')
const { Group } = require('../../models/group')
let tasks = {}
/**
 * 初始化任务列表
 */
const init = async () => {
  logger.info('初始化任务...')
  const list = await Task.find({ status: 1, robotId: bot.id })
  for (let i = 0; i < list.length; i++) {
    await start(list[i])
  }
  logger.info(`已初始化${list.length}个任务`)
}
/**
 * 重启任务
 * @param {object} data 
 */
const restart = async (data) => {
  try {
    if (!global.bot) throw { message: '机器人已掉线，请重新登录' }
    const task = tasks[data._id]
    if (task) {
      stop(data._id)
      if (data.status == 0) logger.info(`${data.name} 定时任务已关闭------`); return
    }
    await start(data)
  } catch (err) { throw err }
}
/**
 * 开启任务
 * @param {object} data
 */
const start = async (data) => {
  try {
    let rule = {
      second: data.second
    }
    if (data.minute || data.minute == 0) rule.minute = data.minute
    if (data.hour || data.hour == 0) rule.hour = data.hour
    if (data.dayOfWeek) rule.dayOfWeek = data.dayOfWeek
    if (data.dayOfMonth) rule.dayOfMonth = data.dayOfMonth
    const sc = schedule.scheduleJob(rule, async () => {
      logger.info(`${data.name} 定时任务已启动------`)
      if (data.factor == 0) {
        const contact = await bot.Contact.find({ id: data.friendId })
        await contact.say(data.content)
      }
      if (data.factor == 1) {
        const room = await bot.Room.find({ id: data.roomId })
        await room.say(data.content)
      }
      if (data.factor == 2) {
        const groups = await Group.find({ control: true }, { id: 1 })
        for (let i = 0, len = groups.length; i < len; i++) {
          const room = await bot.Room.find({ id: groups[i].id })
          await room.say(data.content)
        }
      }
    })
    tasks[data._id] = sc
  } catch (err) {
    throw err
  }
}
/**
 * 停止任务
 * @param {string} id 
 */
const stop = async (id) => {
  try {
    tasks[id].cancel()
    delete tasks[id]
  } catch (err) {
    console.log(err)
  }
}
module.exports = {
  init, start, restart, stop
}