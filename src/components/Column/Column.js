import React, { useEffect, useRef, useState } from 'react'

import '../Column/Column.scss'
import { cloneDeep } from 'lodash'
import Card from 'components/Card/Card'
import { mapOrder } from 'utilities/sorts'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form, Button } from 'react-bootstrap'
import { MODAL_ACTION_CONFIRM } from 'utilities/contants'
import ConfirmModel from 'components/Common/ConfirmModal'
import { createNewCard, updateColumn } from '../../actions/ApiCall/index'
import { saveContentAfterPressEnter, selectAllInlineText } from 'utilities/contentsEdittable'


function Column(props) {
  const { column, onCardDrop, onUpdateColumnState } = props
  const cards = mapOrder(column.cards, column.cardOrder, '_id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)

  const [columnTitle, setColumnTitle] = useState('')
  const handleColumnTitleChange = (e) => setColumnTitle(e.target.value)

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const newCardTextareaRef = useRef(null)

  const [newCardTitle, setNewCardTitle] = useState('')
  const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value)

  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

  useEffect(() => {
    if (newCardTextareaRef && newCardTextareaRef.current) {
      newCardTextareaRef.current.focus()
      newCardTextareaRef.current.select()

    }
  }, [openNewCardForm])

  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true
      }
      updateColumn(newColumn._id, newColumn).then(updatedColumn => {
        onUpdateColumnState(updatedColumn)

      })
    }
    toggleShowConfirmModal()
  }

  const handleColumnTitleBlur = () => {
    if (columnTitle !== column.title) {
      const newColumn = {
        ...column,
        title: columnTitle
      }
      updateColumn(newColumn._id, newColumn).then(updatedColumn => {
        updatedColumn.cards = newColumn.cards
        onUpdateColumnState(updatedColumn)

      })

    }
  }
  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextareaRef.current.focus()
      return
    }
    const newCardToAdd = {
      boardId: column.boardId,
      columnId: column._id,
      title: newCardTitle.trim()
    }
    createNewCard(newCardToAdd).then(card => {
      let newColumn = cloneDeep(column)
      newColumn.cards.push(card)
      newColumn.cardOrder.push(card._id)

      onUpdateColumnState(newColumn)
      setNewCardTitle('')
      toggleOpenNewCardForm()

    })
  }

  return (
    <div className='column'>
      <header className='column-drag-handle'>
        <div className='column-title'>
          <Form.Control
            size='sm'
            type='text'
            className='content-editable'
            value={columnTitle}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onKeyDown={saveContentAfterPressEnter}
            spellCheck='false'
            onClick={selectAllInlineText}
            onMouseDown={e => e.preventDefault()}
            // onKeyDown={ e => (e.key === 'Enter') && addNewColumn()}
          >
          </Form.Control>
        </div>
        <div className='column-dropdown-actions'>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" size='sm' className='dropdown-btn'/>

            <Dropdown.Menu>
              <Dropdown.Item onClick={toggleOpenNewCardForm}>Add card</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>Remove column</Dropdown.Item>
              <Dropdown.Item>Move all cards in this column</Dropdown.Item>
              <Dropdown.Item>Archive all card in this column</Dropdown.Item>

            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className='card-list'>
        <Container
          orientation='vertical'
          groupName='col'
          onDrop={dropResult => onCardDrop(column._id, dropResult)}
          getChildPayload={index => cards[index] }
          dragClass="card-ghost"
          dropClass='card-ghost-drop'
          // onDropReady={p => console.log('Drop realy:', p)}
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index} >
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
        {openNewCardForm &&
        <div className='add-new-card-area'>
          <Form.Control
            size='sm'
            as='textarea'
            rows='3'
            placeholder='Enter a title for this card...'
            className='texterea-enter-new-card'
            ref={newCardTextareaRef}
            value={newCardTitle}
            onChange={onNewCardTitleChange}
            onKeyDown={ e => (e.key === 'Enter') && addNewCard()}
          >
          </Form.Control>
        </div>
        }
      </div>
      <footer>
        {openNewCardForm &&
        <div className='add-new-card-actions'>
          <Button variant='success' size='sm' onClick={addNewCard}> Add card</Button>
          <span className='cancel-icon' onClick={toggleOpenNewCardForm}>
            <i className='fa fa-trash icon'> </i>
          </span>
        </div>
        }
        {!openNewCardForm &&
        <div className='footer-actions' onClick={toggleOpenNewCardForm}>
          <i className='fa fa-plus icon'/> Add another card
        </div>
        }
      </footer>
      <ConfirmModel
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title='Remove column'
        content={`Are you sure you want to remove ${column.title} ! All related cards will also be removed`}
      />
    </div>
  )
}

export default Column