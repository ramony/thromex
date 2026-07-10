import HttpClient from '~/utils/HttpClient';

const HttpAdaptor = {

  async getHtml(url, encoding): Promise<any> {
    let aUrl = url
    let result = await HttpClient.getHtml(aUrl, encoding);
    return result;
  }

}

export default HttpAdaptor;