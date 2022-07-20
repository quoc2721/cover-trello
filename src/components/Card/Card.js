import React from 'react';

import './Card.scss';

function Task(props) {
    const { card} = props
    return (
        <li className='card-item'>
            {card.cover && <img src={card.cover} className='card-cover'/>}
            {card.title}
        </li>
    )
}

export default Task