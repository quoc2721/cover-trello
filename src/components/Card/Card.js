import React from 'react'

import './Card.scss'

function Task(props) {
  const { card } = props
  return (
    <div className='card-item'>
      {card.cover && <img src={card.cover} className='card-cover'  onMouseDown={e => e.preventDefault}/>}
      {card.title}
    </div>
  )
}

export default Task