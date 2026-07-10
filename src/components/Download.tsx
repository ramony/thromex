import { useState, useEffect } from "react"

import { useDownloadStore } from '~/store/downloadStore';

import { DialogTitle, Dialog, Button, ButtonGroup, Switch, TextField, Checkbox } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import '~/style/Download.css';

export default function Download(props) {

  const loadConfig = useDownloadStore((s: { loadConfig: any; }) => s.loadConfig)

  const downloadList = useDownloadStore((s: { downloadList: any; }) => s.downloadList)

  const logs = useDownloadStore((s: { logs: any; }) => s.logs)
  const startDownload = useDownloadStore((s: { startDownload: any; }) => s.startDownload)
  const changeChecked = useDownloadStore((s: { changeChecked: any; }) => s.changeChecked)
  const changeText = useDownloadStore((s: { changeText: any; }) => s.changeText)
  const markAllReadWithSameKeyword = useDownloadStore((s: { markAllReadWithSameKeyword: any; }) => s.markAllReadWithSameKeyword)

  const SmallText = { width: "80px" };

  useEffect(() => {
    loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { open, setOpen } = props;
  console.log('render download');

  return (
    <Dialog open={open} fullScreen={false}>
      <DialogTitle>Download It!</DialogTitle>
      <TableContainer component={Paper}>
        <Table aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell>Checked</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Skip</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {downloadList.map((row, index) => (
              <TableRow
                key={row.title}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Checkbox defaultChecked={row.checked} onChange={(e) => changeChecked(index, 'checked', e)} />
                </TableCell>
                <TableCell>{row.url}</TableCell>
                <TableCell>
                  <TextField defaultValue={row.from} onChange={(e) => changeText(index, 'from', e)} size="small" sx={SmallText} variant="outlined" />
                </TableCell>
                <TableCell>
                  <TextField defaultValue={row.to} onChange={(e) => changeText(index, 'to', e)} size="small" sx={SmallText} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Switch defaultChecked={row.skip} onChange={(e) => changeChecked(index, 'skip', e)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className='console'>
        {
          logs.map((item) => {
            return <div key={item}>{item}</div>
          })
        }
      </div>
      <div className='center'>
        <ButtonGroup variant="contained">
          <Button onClick={() => startDownload()} >Download</Button>
          <Button onClick={() => markAllReadWithSameKeyword()} >Sync</Button>
          <Button onClick={() => setOpen(false)} >Close</Button>
        </ButtonGroup>
      </div>
    </Dialog>
  )

}