// store/userStore.js
import { create } from "zustand"

import ConfigLoad from '~/service/ConfigLoad';
import DataService from '~/service/DataService';
import ContentParse from '~/service/ContentParse';
// import { nanoid } from 'nanoid'
import ApiHost from '~/utils/ApiHost';
import ThreadPool from '~/utils/ThreadPool'

const contentParse = new ContentParse();
const nextUrlVisitSet = new Set();
const threadPool = new ThreadPool(3, 100);

export const useContainerStore = create<any>((set, get) => ({

  listingData: [],

  listingSelected: { index: -1 },

  contentData: [],

  loading: false,

  listingNext: null,

  autoDisplay: false,

  totalPages: null,

  init: async () => {
    console.log('loadConfig invoked');
    let rules = await ConfigLoad.loadRules()
    contentParse.addRules(rules);
    const loadingFn = (loading: boolean) => {
      return () => set({ loading })
    }
    threadPool.subscribe(loadingFn(true), loadingFn(false));
  },

  handleEntry: async () => {
    var entryUrl = await ConfigLoad.loadEntryPath();
    get().handleUrl(entryUrl);
  },

  selectNextItem: async () => {
    const { listingSelected, handleItemSelected } = get();
    if (listingSelected >= 0) {
      handleItemSelected(listingSelected + 1);
    }
  },

  handleItemSelected: async (index) => {
    const { listingData, handleUrl } = get();
    if (index >= listingData.length) {
      return;
    }
    let item = listingData[index];
    set({ listingSelected: { url: item.url, index } });
    handleUrl(item.url);
  },

  handleUrls: async (urls: any, append = false, priority = false) => {
    console.log('handleUrls invoked', urls);
    const { handleUrl } = get();
    for (const url of urls) {
      await handleUrl(url, append, priority)
    };
  },

  handleUrl: async (url: any, append: any = false, priority: any = false) => {
    console.log('handleUrl invoked', url);
    const { handleUrlInner } = get();
    threadPool.submit(async () => {
      await handleUrlInner(url, append);
    }, priority)
  },

  handleNext: async () => {
    const { listingNext, handleUrl } = get();
    if (!listingNext) {
      return;
    }
    if (nextUrlVisitSet.has(listingNext)) {
      return;
    }
    nextUrlVisitSet.add(listingNext);
    console.log('handleNext invoked, url:', listingNext);
    handleUrl(listingNext, true, true);
  },

  handleUrlInner: async (url, append) => {
    console.log('url', url)
    if (url) {
      url = url.replace('@apiHost@', ApiHost.GetAPIHost());
    }
    let result = await contentParse.parse(url);
    if (!result) {
      return;
    }
    if (result.unMatched) {
      console.log('No rule for url', url);
      return;
    }
    const { autoDisplay, handleListingData, handleUrls, handleContentData } = get();

    if (result.listFlag) {
      handleListingData(result, append);
      if (autoDisplay && result?.autoDisplayList) {
        console.log('auto display count:', result.listingData.length);
        const itemUrls = result.listingData.map((item: { url: any; }) => item.url);
        setTimeout(async () => handleUrls(itemUrls, true), 1)
      }
    } else {
      handleContentData(result, append)
      if (!append) {
        //if new content, reset scrollTop value.
        document.getElementsByClassName("Content")[0].scrollTop = 0;
      }
    }
  },

  handleListingData: (result, append) => {
    if (append) {
      set((prev: { listingData: any; }) => ({
        listingData: [...prev.listingData, ...result.listingData],
        totalPages: result.totalPages,
        listingNext: result.listingNext
      }))
    } else {
      set({
        listingData: [...result.listingData],
        listingSelected: { index: -1 },
        contentData: [],
        totalPages: result.totalPages,
        listingNext: result.listingNext
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
      contentData: get().contentData.filter((_: any, i: any) => index != i)
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
    DataService.markReadByDetailId(contentIds[0], contentIds[1])
    get().closeContent(index);
  },

  markLaterContent: (index, item) => {
    let contentIds = item.contentIds;
    DataService.markReadLater(contentIds[0], contentIds[1], 10)
    get().closeContent(index);
  }

}))