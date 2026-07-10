const Unsafe = {
  getKeyword(title) {
    try {
      return (window as any).GetVideoKeyword(title)
    } catch (e) {
      return null;
    }
  },
  validateTitleIfExist(title) {
    try {
      return (window as any).ValidateTitleIfExist(title)
    } catch (e) {
      return null;
    }
  },
  fixExpiredUrl(url) {
    try {
      let newUrl = (window as any).fixExpiredUrl(url)
      console.log('newUrl', newUrl)
      return newUrl;
    } catch (e) {
      return url;
    }
  }
}
export default Unsafe;