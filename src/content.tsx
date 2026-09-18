import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import ReactDOM from 'react-dom/client';

import ConfigLoad from "~service/ConfigLoad"
import ContentParse from "~service/ContentParse"

import Home from "~tabs/index"
import HttpClient from "~utils/HttpClient";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// const PlasmoOverlay = () => {
//   return <Home />;
// }

async function loadConfig() {
  const rules = await HttpClient.getYaml("/assets/configData/ruleConfig.yaml");
  console.log('rules data', rules)
  let contentParse = new ContentParse()
  contentParse.addRules(rules.data)
  let { href } = window.location;
  if (href.includes("localhost")) {
    return;
  }
  if (!href.includes("chrome-extension") && !href.includes("localhost")) {
    if (!contentParse.matchContent(href)) {
      console.log('not matched')
      return;
    }
  }
  let rootEle = document.getElementById('root');
  if (!rootEle) {
    rootEle = document.getElementsByTagName('body')[0];
    rootEle.style.padding = "10px"
  }
  document.getElementsByTagName('body')[0].classList.add("thromeClazz");
  console.log('matched', rootEle)
  const root = ReactDOM.createRoot(rootEle);
  root.render(
    <Home />
  );
}

loadConfig()

// export default PlasmoOverlay
