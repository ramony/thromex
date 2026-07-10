import { useEffect } from 'react'
import { useContainerStore } from '~/store/containerStore';


import Detail from '~/components/Detail';
import DetailButtons from '~/components/DetailButtons';

import ActionButtons from '~/components/ActionButtons';
import Listing from '~/components/Listing';
import '~/style/Container.css';

function Container() {

  const loadConfig = useContainerStore((s: { loadConfig: any; }) => s.loadConfig)

  useEffect(() => {
    loadConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Container">
      <div className="Left-Box">
        <ActionButtons />
        <Listing />
      </div>
      <div className="Right-Box">
        <DetailButtons />
        <Detail />
      </div>
    </div>
  )

}

export default Container