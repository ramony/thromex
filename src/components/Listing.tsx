import { useState, useContext } from "react"
import { useContainerStore } from '~/store/containerStore';


import '~/style/Listing.css';

export default function Listing() {
  const [hover, setHover] = useState({});
  const handleItemSelected = useContainerStore((s: { handleItemSelected: any; }) => s.handleItemSelected)
  const handleNext = useContainerStore((s: { handleNext: any; }) => s.handleNext)
  const listingSelected = useContainerStore((s: { listingSelected: any; }) => s.listingSelected)
  const listingData = useContainerStore((s: { listingData: any; }) => s.listingData)


  function mouseOver(index) {
    setHover({ [index]: '1' })
  }

  function mouseOut(index) {
    setHover({ [index]: '' })
  }

  function itemClick(index) {
    handleItemSelected(index);
  }

  function scroll(e) {
    let element = e.target;
    let top = element.scrollTop;
    let height = element.clientHeight;
    let scrollHeight = element.scrollHeight;
    if (top + height >= scrollHeight - 400) {
      //this.props.onScrollToBottom()
      handleNext()
    }
  }

  function calcClassName(index, item) {
    let classes = ['Listing-Round-Angle Listing-Item']
    if (index % 2 === 0) {
      classes.push('Listing-Item-Even');
    }
    if (hover[index]) {
      classes.push('Listing-Item-Hover')
    }
    if (listingSelected.url + listingSelected.index === item.url + index) {
      classes.push('Listing-Item-Click')
    }
    return classes.join(' ')
  }

  function openUrl(e, url) {
    e.preventDefault()
    console.log(url)
    window.open(url, '_blank');
  }

  return (
    <div className="Listing" onScroll={(e) => scroll(e)}>
      {
        listingData.map((item, index) => {
          let className = calcClassName(index, item)
          return <div className={className} key={item.key}
            onMouseOver={() => mouseOver(index)} onMouseOut={() => mouseOut(index)}
            onClick={() => itemClick(index)} onContextMenu={(e) => openUrl(e, item.url)}>{item.title}</div>
        })
      }
    </div>
  )

}