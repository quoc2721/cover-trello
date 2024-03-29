import React, { useEffect, useRef, useState } from 'react'
import { isEmpty, cloneDeep } from 'lodash'
import { Container, Draggable } from 'react-smooth-dnd'
import { Container as ContainerBoostrap, Row, Col, Form, Button } from 'react-bootstrap'


import '../BoardContent/BoardContent.scss'
import Column from 'components/Column/Column'
import { mapOrder } from 'utilities/sorts'
import { applyDrag } from 'utilities/drapDrop'
import {
  fetchBoardDetails,
  createNewColumn,
  updateBoard,
  updateColumn,
  updateCard
} from '../.././actions/ApiCall/index'


function BoardContent() {
  const [board, setBoard] = useState({})
  const [columns, setColumns] = useState([])
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const newColumnInputRef = useRef(null)

  const [newColumnTitle, setNewColumnTitle] = useState('')
  const onNewColumnTitleChange = (e) => setNewColumnTitle(e.target.value)

  useEffect(() => {
    const boardId = '62e1390ff9854c72f312a212'
    fetchBoardDetails(boardId).then(board => {
      setBoard(board)
      setColumns(mapOrder(board.columns, board.columnOrder, '_id'))
    })

  }, [])
  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()

    }
  }, [openNewColumnForm])

  if (isEmpty(board)) {
    return <div className='not-found' style={{ 'padding': '10px', 'color': 'white' }}>Board not found</div>
  }

  const onColumnDrop = (dropResult) => {
    let newColumns = cloneDeep(columns)
    newColumns = applyDrag(newColumns, dropResult)

    let newBoard = cloneDeep(board)
    newBoard.columnOrder = newColumns.map( c => c._id)
    newBoard.columns = newColumns

    setColumns(newColumns)
    setBoard(newBoard)
    updateBoard(newBoard._id, newBoard).catch(() => {
      setColumns(columns)
      setBoard(board)

    })


  }
  const onCardDrop = ( columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = cloneDeep(columns)

      let currentColumn = newColumns.find( c => c._id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map(i => i._id)
      setColumns(newColumns)
      if (dropResult.removedIndex !== null && dropResult.addedIndex !== null ) {
        updateColumn(currentColumn._id, currentColumn).catch(() => setColumns(columns))
      } else {
        updateColumn(currentColumn._id, currentColumn).catch(() => setColumns(columns))

        if (dropResult.addedIndex !== null) {
          let currentCard = cloneDeep(dropResult.payload)
          currentCard.columnId = currentColumn._id
          updateCard(currentCard._id, currentCard)
        }
      }
    }
  }

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus()
      return
    }
    const newColumnToAdd = {
      boardId: board._id,
      title: newColumnTitle.trim()
    }
    createNewColumn(newColumnToAdd).then(column => {

      let newColumns = [...columns]
      newColumns.push(column)

      let newBoard = { ...board }
      newBoard.columnOrder = newColumns.map( c => c._id)
      newBoard.columns = newColumns

      setColumns(newColumns)
      setBoard(newBoard)
      setNewColumnTitle('')
      toggleOpenNewColumnForm()

    })

  }

  const onUpdateColumnState = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate._id

    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex(i => i._id === columnIdToUpdate)
    if (newColumnToUpdate._destroy) {

      newColumns.splice(columnIndexToUpdate, 1)
    } else {
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
    }

    let newBoard = { ...board }
    newBoard.columnOrder = newColumns.map( c => c._id)
    newBoard.columns = newColumns
    setColumns(newColumns)
    setBoard(newBoard)
  }
  return (
    <div className='board-content'>
      <Container
        orientation='horizontal'
        onDrop={onColumnDrop}
        getChildPayload={index => columns[index]}
        dragHandleSelector='.column-drag-handle'
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'column-drop-preview'
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateColumnState={onUpdateColumnState}/>
          </Draggable>
        ))}

      </Container>
      <ContainerBoostrap className='trello-container'>
        {!openNewColumnForm &&
        <Row>
          <Col className='add-new-column' onClick={toggleOpenNewColumnForm}>
            <i className='fa fa-plus icon'> Add another column</i>
          </Col>
        </Row>
        }
        {openNewColumnForm &&
        <Row>
          <Col className='enter-new-column'>
            <Form.Control
              size='sm'
              type='text'
              placeholder='Enter column title'
              className='input-enter-new-column'
              ref={newColumnInputRef}
              value={newColumnTitle}
              onChange={onNewColumnTitleChange}
              onKeyDown={ e => (e.key === 'Enter') && addNewColumn()}
            >
            </Form.Control>
            <Button
              variant='success'
              size='sm'
              onClick={addNewColumn}

            > Add column</Button>
            <span className='cancel-icon'>
              <i className='fa fa-trash icon' onClick={toggleOpenNewColumnForm}> </i>
            </span>
          </Col>
        </Row>
        }
      </ContainerBoostrap>
    </div>

  )
}

export default BoardContent
