// ES6 import 替代 require
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { queryApi, markReadByDetailIdApi, markReadLaterByDetailIdApi, createDetailApi } from "./src/detail-dao.js"

// 使用箭头函数、解构、async/await
const start = async () => {
  // 实例化，开启日志
  const fastify = Fastify({ logger: true })

  // 注册跨域插件
  await fastify.register(cors)

  fastify.get('/', async () => ({ hello: 'fastify esm' }))
  // 根路由
  fastify.get('/api/v1/detail/query/:detailType', async (req) => {
    const { detailType } = req.params
    const query = { detailType, ...req.query };
    return await queryApi(query, req.url)
  })

  fastify.post('/api/v1/detail/markReadByDetailId', async (req) => {
    const { detailId, detailType } = req.body
    await markReadByDetailIdApi(detailType, detailId)
    return { "code": 0 }
  })

  fastify.post('/api/v1/detail/markReadLater', async (req) => {
    const { detailId, detailType } = req.body
    await markReadLaterByDetailIdApi(detailType, detailId)
    return { "code": 0 }
  })

  fastify.post('/api/v1/detail/createDetail', async (req) => {
    const detailList = req.body
    return await createDetailApi(detailList)
  });

  fastify.post('/api/v1/detail/markAllReadWithSameKeyword', async (req) => {
    // const detailList = req.body
    return { "code": "-1" }
  })

  // 启动服务
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// 执行启动函数
start()