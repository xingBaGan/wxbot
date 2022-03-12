
const router = require('koa-router')()
const getUser = require('../middleware/getUser')
const sysCtrl = require('../controller/sys')
const botLogin = require('../middleware/botLogin')
const robotCtrl = require('../controller/robot')
router.prefix('/api')
//登录
router.post('/auth/login', sysCtrl.login)
router.get('/auth/user', getUser(), sysCtrl.getUser)
router.post('/auth/logout', async (ctx) => {
  ctx.body = null
})
router.get('/admin/robot/:id', sysCtrl.getRobot)
router.post('/admin/robot', getUser(), sysCtrl.addRobot)
router.put('/admin/robot/:id', sysCtrl.updateRobot)
router.get('/admin/group', sysCtrl.getGroups)
router.put('/admin/group/:id', sysCtrl.updateGroup)
router.get('/admin/friend', sysCtrl.getFriends)
router.get('/admin/reply', sysCtrl.getReplys)
router.post('/admin/reply', sysCtrl.addReply)
router.put('/admin/reply/:id', sysCtrl.updateReply)
router.delete('/admin/reply', sysCtrl.deleteReply)
router.get('/admin/task', sysCtrl.getTasks)
router.post('/admin/task', sysCtrl.addTask)
router.put('/admin/task/:id', sysCtrl.updateTask)
router.delete('/admin/task', sysCtrl.deleteTask)



router.post('/robot/login', robotCtrl.login)
router.post('/robot/loginOut', robotCtrl.loginOut)

router.post('/robot/friend/say', botLogin(), robotCtrl.friendSay)
router.post('/robot/room/say', botLogin(), robotCtrl.roomSay)
router.get('/robot/room/:id', botLogin(), robotCtrl.getRoom)
router.put('/robot/room/:id', botLogin(), robotCtrl.updateRoom)
router.post('/robot/room/quit', botLogin(), robotCtrl.roomQuit)


module.exports = router