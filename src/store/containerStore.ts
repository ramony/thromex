// store/userStore.js
import { create } from "zustand"

import ConfigLoad from '~/service/ConfigLoad';
// import DataService from '@/service/DataService';
import ContentParse from '~/service/ContentParse';
// import { nanoid } from 'nanoid'
import ApiHost from '~/utils/ApiHost';
import ThreadPool from '~/utils/ThreadPool'

let contentParse = null
const nextUrlVisitSet = new Set();
let threadPool = null;

export const useContainerStore = create<any>((set, get) => ({

  listingData: [],

  listingSelected: { index: -1 },

  contentData: [],

  loading: false,

  listingNext: null,

  autoDisplay: false,

  totalPages: null,

  loadConfig: async () => {
    console.log('loadConfig invoked');
    let rules = await ConfigLoad.loadRules()
    contentParse = new ContentParse(rules);
    threadPool = new ThreadPool(3, () => { set({ loading: true }) }, () => { set({ loading: false }) }, 1);
    await get().handleEntry();
  },

  handleEntry: async () => {
    var entryUrl = await ConfigLoad.loadEntryPath();
    get().handleUrl(entryUrl);
  },

  selectNextItem: async () => {
    let { index } = get().listingSelected;
    if (index >= 0) {
      get().handleItemSelected(index + 1);
    }
  },

  handleItemSelected: async (index) => {
    if (index >= get().listingData.length) {
      return;
    }
    let item = get().listingData[index];
    set({ listingSelected: { url: item.url, index } });
    get().handleUrl(item.urlFn || item.url);
  },

  handleUrls: async (urls: any, append = false) => {
    console.log('handleUrls invoked', urls);
    for (const url of urls) {
      await get().handleUrl(url, append)
    };
  },

  handleUrl: async (url: any, append: any = false) => {
    console.log('handleUrl invoked', url);
    await get().handleUrlInner(url, append);
  },

  handleNext: async () => {
    let url = get().listingNext;
    if (!url) {
      return;
    }
    if (nextUrlVisitSet.has(url)) {
      return;
    }
    nextUrlVisitSet.add(url);
    console.log('handleNext invoked, url:', url);

    get().handleUrl(url, true, true);
  },

  handleUrlInner: async (url, append) => {
    console.log('url', url)
    if (url) {
      url = url.replace('@apiHost@', ApiHost.GetAPIHost());
    }
    let result = await contentParse.parse(url, append);
    if (!result) {
      return;
    }
    if (result.unMatched) {
      console.log('No rule for url', url);
      return;
    }
    if (result.listFlag) {
      set({
        totalPages: result.totalPages,
        listingNext: result.listingNext
      })
      get().handleListingData(result, append);
      if (get().autoDisplay && result?.autoDisplayList) {
        console.log('auto display count:', result.listingData.length);
        const itemUrls = result.listingData.map((item: { url: any; }) => item.url);
        setTimeout(async () => get().handleUrls(itemUrls, true), 1)
      }
    } else {
      get().handleContentData(result, append)
      if (!append) {
        //if new content, reset scrollTop value.
        document.getElementsByClassName("Content")[0].scrollTop = 0;
      }
    }
  },

  handleListingData: (result, append) => {
    if (append) {
      set((prev: { listingData: any; }) => ({
        listingData: [...prev.listingData, ...result.listingData]
      }))
    } else {
      set({
        listingData: [...result.listingData],
        listingSelected: { index: -1 },
        contentData: []
      })
    }
  },

  handleContentData: (result, append) => {
    if (append) {
      set((prev: { contentData: any; }) => ({
        contentData: [...prev.contentData, ...result.contentData]
      }))
    } else {
      set({
        contentData: [...result.contentData]
      })
    }
  },

  openLink: () => {
    console.log('openLink invoked')
    let url = prompt('Open URL:')
    if (url) {
      get().handleUrl(url);
    }
  },

  resetLink: () => {
    console.log('resetLink invoked');
    //To reset base url so that we can reload local entry.json data.
    document.getElementsByTagName("base")[0].setAttribute('href', '')
    get().handleEntry();
  },

  setAutoDisplay: (value) => {
    set({ autoDisplay: value })
  },

  closeContent: (index) => {
    set({
      contentData: get().contentData.slice(index, 1)
    })
    if (get().contentData.length == 0) {
      get().selectNextItem();
    }
  },

  closeAllContent: () => {
    set({ contentData: [] })
  },

  removeContent: (index, item) => {
    let contentIds = item.contentIds;
    //  DataService.markReadByDetailId(contentIds[0], contentIds[1])
    get().closeContent(index);
  },

  markLaterContent: (index, item) => {
    let contentIds = item.contentIds;
    // DataService.markReadLater(contentIds[0], contentIds[1], 10)
    get().closeContent(index);
  }

}))