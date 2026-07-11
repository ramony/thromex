import { create } from "zustand"

import ConfigLoad from '~/service/ConfigLoad';
import ContentParse from '~/service/ContentParse';
import DataService from '~/service/DataService';
import { toBigInt } from '~/utils/StringUtils';
import Unsafe from '~/utils/Unsafe';
// import { nanoid } from 'nanoid'


export const useDownloadStore = create<any>((set, get) => ({

  downloadList: [],

  logs: [],

  filterOutKeywords: [],

  loadConfig: async () => {
    let config = await ConfigLoad.loadDownloads();
    let { list = [], defaultRange = [1, 100], filterOutKeywords = [] } = config;
    let [from, to] = defaultRange;
    set({
      downloadList: list.map(item => ({ checked: false, from, to, skip: true, ...item }))
    })
    set({ filterOutKeywords })
  },

  startDownload: async () => {
    //start to download from remote server.
    const { downloadList, addLogs, filterListingData } = get()
    if (downloadList.length < 1) {
      addLogs(['Download list is required']);
      return;
    }
    let rules = await ConfigLoad.loadRules();
    let contentParse = new ContentParse(rules);
    addLogs("Start job");
    for (let item of downloadList) {
      if (!item.checked) {
        continue;
      }
      for (let i = item.from; i < item.to; i++) {
        let url = item.url.replace("{pageNo}", i);
        let { listingData = [] } = await contentParse.parse(url, false);
        listingData = filterListingData(listingData, i, contentParse, item.skipTitleKeyword);
        let insertCount = await DataService.createDetail(listingData, count => {
          addLogs(`Done ${url}, count=${count}`)
          // DataService.createList({ pageUrl: url });
        }, (errorMsg) => {
          get().addLogs(`Error to fetch ${url}, errorMsg: ${errorMsg}`)
        });
        if (insertCount === 0 && item.skip) {
          break;
        }
      }
    }
    addLogs("Done.")
  },

  filterListingData: (listingData, pageNo, contentParse, skipTitleKeyword) => {
    var result = [];
    for (let item of listingData) {
      let contentIds = contentParse.queryContentIds(item.url)
      if (!contentIds) {
        continue;
      }
      item.readFlag = 0;
      if (skipTitleKeyword && item.title.includes(skipTitleKeyword)) {
        console.log('skip ' + item.title);
        item.readFlag = 1;
      }
      let detailId = contentIds[0];
      item.detailType = contentIds[1];
      item.detailId = detailId
      //item.detailOrder = /^[0-9]+$/.test(detailId) ? detailId : hashCode(detailId);
      let detailOrder = toBigInt(detailId);
      item.detailOrder = detailOrder
      item.detailTitle = item.title
      item.detailUrl = item.url
      item.localFlag = 0;
      item.tagId = 0;
      item.pageNo = pageNo;
      item.keyword = Unsafe.getKeyword(item.title);
      result.push(item);
    };
    return result;
  },

  markAllReadWithSameKeyword: async () => {
    const { addLogs } = get()
    DataService.markAllReadWithSameKeyword(res => {
      addLogs('processCount:' + res.data);
    });
  },

  addLogs: (newLog) => {
    set(prev => ({
      logs: [...prev.logs, newLog]
    }))
  },

  changeText: (index, keyName, e) => {
    let value = e.target.value;
    get().downloadList[index][keyName] = value;
  },

  changeChecked: (index, keyName, e) => {
    let checked = e.target.checked;
    get().downloadList[index][keyName] = checked;
  }

}))