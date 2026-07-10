import { useContainerStore } from '~/store/containerStore';

import '~/style/Detail.css';

export default function DetailButtons() {

  const contentData = useContainerStore((s: { contentData: any; }) => s.contentData)
  const closeAllContent = useContainerStore((s: { closeAllContent: any; }) => s.closeAllContent)

  return (
    <div className="Content-Action">
      <div className="Content-Tips" onDoubleClick={closeAllContent}>{contentData.length}</div>
    </div>
  )

}
