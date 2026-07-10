import { useState } from "react"
import { useContainerStore } from '~/store/containerStore';

import { Switch } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddIcon from '@mui/icons-material/Add';
import Loading from '~/components/Loading';
import Download from '~/components/Download';
import '~/style/ActionButtons.css';

export default function ActionButtons() {

  const resetLink = useContainerStore((s: { resetLink: any; }) => s.resetLink)

  const openLink = useContainerStore((s: { openLink: any; }) => s.openLink)

  const handleNext = useContainerStore((s: { handleNext: any; }) => s.handleNext)

  const autoDisplay = useContainerStore((s: { autoDisplay: any; }) => s.autoDisplay)

  const setAutoDisplay = useContainerStore((s: { setAutoDisplay: any; }) => s.setAutoDisplay)

  const loading = useContainerStore((s: { loading: any; }) => s.loading)

  const totalPages = useContainerStore((s: { totalPages: any; }) => s.totalPages)

  const [open, setOpen] = useState(false);

  return (
    <div className='ActionButtons'>
      <div className='Action-Button-Box'>
        <HomeIcon onClick={resetLink} >Reset</HomeIcon>
        <AddIcon onClick={openLink}>Open</AddIcon>
        <NavigateNextIcon onClick={handleNext} >Next</NavigateNextIcon>
        <DownloadIcon onClick={() => setOpen(true)} >Download</DownloadIcon>
        <Switch checked={autoDisplay} onChange={(e) => setAutoDisplay(e.target.checked)} size="small" color="warning" />
        <div className="Listing-Tips">{totalPages}</div>
      </div>
      <Download setOpen={setOpen} open={open} />
      <Loading visible={loading} />
    </div>
  )

}
