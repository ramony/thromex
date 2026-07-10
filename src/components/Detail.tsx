import { useContainerStore } from '~/store/containerStore';

import ClearIcon from '@mui/icons-material/Clear';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';

import '~/style/Detail.css';

export default function Detail() {
  const contentData = useContainerStore((s: { contentData: any; }) => s.contentData)
  const markLaterContent = useContainerStore((s: { markLaterContent: any; }) => s.markLaterContent)
  const removeContent = useContainerStore((s: { removeContent: any; }) => s.removeContent)
  const likeContent = useContainerStore((s: { likeContent: any; }) => s.likeContent)


  // const { contentData, markLaterContent, removeContent, likeContent } = appStore;

  return (
    <div className="Content">
      {
        contentData.map((item, index) => {
          let actions = null;
          if (item.contentIdString) {
            actions =
              <div className="Content-Button-Box">
                <ClearIcon onClick={() => markLaterContent(index, item)} >Close {item.contentIdString}</ClearIcon>
                <DeleteForeverIcon onClick={() => removeContent(index, item)} >Delete {item.contentIdString}</DeleteForeverIcon>
                {item.downloaded ? <DownloadDoneIcon onClick={() => likeContent(index, item)}>Done</DownloadDoneIcon> : <></>}
                <span onClick={() => window.open(item.contentUrl)}>{item.contentIdString}</span>
              </div>
          }
          let extra = null;
          if (item.extraContent) {
            extra = <div className="Content-Extra" dangerouslySetInnerHTML={{ __html: item.extraContent }}></div>
          }
          return (
            <div className="Content-Item" key={item.key}>
              {actions}
              <div className="Content-Title">{item.title}</div>
              <div className="Content-Detail" dangerouslySetInnerHTML={{ __html: item.content }}></div>
              {extra}
              <div className="Content-Title">{item.title}</div>
              {actions}
            </div>)
        })
      }
    </div>
  )

}
