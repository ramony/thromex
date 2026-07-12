import Detail from './detail-mapper.js';
import { Op } from 'sequelize';

export async function queryApi(query, url) {
  if (query['maxId'] != null) {
    let maxId = query['maxId'];
    delete query['maxId'];
    query = { ...query, id: { [Op.lt]: maxId } }
  }
  if (query['readFlag'] == null) {
    query['readFlag'] = 0
  }
  console.log('query', query)
  const pageSize = 20;
  console.log('query', query)
  let { count, rows } = await Detail.findAndCountAll({
    where: query,
    limit: pageSize,              // 每页数量
    order: [['id', 'DESC']], // 排序（重要！确保分页顺序稳定）
  });
  let pageCount = Math.ceil(count / pageSize)
  let next = '';
  if (rows.length > 0) {
    let minId = rows.reduce((min, item) => {
      return Math.min(min, item.id);
    }, Number.MAX_SAFE_INTEGER);

    rows = rows.map(detail => {
      let item = detail.toJSON();
      return {
        title: '[' + item.pageNo + ']' + item.detailTitle,
        url: item.detailUrl
      }
    });
    //{ [Op.lt]: minId }
    // query = { ...query, maxId: minId };
    next = setMinIdUrl(url, minId)
  }

  let result = {
    success: true,
    data: {
      list: rows,
      next: next,
      totalPages: pageCount
    }
  }

  return JSON.stringify(result);
}

export async function markReadByDetailIdApi(detailType, detailId) {
  // 1. 查询记录
  const detail = await Detail.findOne({
    where: { detailType: detailType, detailId: detailId },
  });
  console.log(detailType, detailId, detail)

  // 2. 存在则更新
  if (detail) {
    await detail.update(
      { readFlag: 1 }
    );
  }
}

export async function markReadLaterByDetailIdApi(detailType, detailId) {
  // 1. 查询记录
  const detail = await Detail.findOne({
    where: { detailType: detailType, detailId: detailId },
  });
  console.log('markReadLaterByDetailIdApi', detailType, detailId, detail != null)
  // 2. 存在则更新
  if (detail) {
    await detail.update(
      { readFlag: 9 }
    );
  }
}


export async function createDetailApi(rdata) {
  let time = new Date();
  for (let data of rdata) {
    data.createDate = new Date();
    data.updateDate = new Date();
    if (!data.keyword) {
      data.keyword = ''
    }
    if (!data.score) {
      data.score = 0
    }

  }

  console.log('----------------------------')
  let successCount = 0
  for (let data of rdata) {
    try {
      const result = await Detail.create(data);
      successCount++;
      //console.log('成功:', result);
    } catch (error) {
      console.error('失败:', error);
    }

  }
  console.log('successCount', rdata.length, successCount)
  console.log('time', new Date() - time)
  return { success: true, data: successCount }
}

function setMinIdUrl(originUrl, newMaxId) {
  const urlObj = new URL(originUrl, "http://localhost:3003/");
  urlObj.searchParams.set('maxId', newMaxId);
  // 只返回 path + search，去掉临时域名
  return urlObj.pathname + urlObj.search;
}
