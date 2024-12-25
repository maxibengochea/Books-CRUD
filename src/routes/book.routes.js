import express from 'express'
import { Book } from '../models/book.model.js'

export const router = express.Router()

//middleware
const getBook = async (req, res, next) => {
  let book
  const { id } = req.params

  if (!id.match(/^[0-9a-fA-F]{24}/))
    return res.status(404).json({ message: 'Invalid id' })

  try{
    book = await Book.findById(id)

    if (!book)
      return res.status(404).json({ message: 'Not found' })
  }
  
  catch (error){
    res.status(500).json({ message: error.message })
  }

  res.book = book
  next()
}

//obtener los libros
router.get('/', async (req, res) => {
  try{
    const books = await Book.find()
    console.log('GET', books)

    if (books.length == 0)
      return res.status(204).json([])

    res.json(books)
  }

  catch (error){
    res.status(500).json({ message: error.message })
  }
})

//obtener un libro individual
router.get('/:id', getBook, async (req, res) => {
  res.json(res.book)
}) 

//crear un libro
router.post('/', async (req, res) => {
  const { title, author, genre, publication_date } = req?.body

  if (!(title && author && genre && publication_date))
    return res.status(400).json({ message: `'title', 'author', 'genre' and 'publication_date' fields are all required` })

  const book = new Book({
    title,
    author,
    genre,
    publication_date
  })

  try{
    const newBook = await book.save()
    console.log('NEW BOOK', newBook)
    res.status(201).json(newBook)
  }

  catch (error){
    res.status(400).json({ message: error.message })
  }
})

//actualizar un libro
router.put('/:id', getBook, async (req, res) => {
  try{
    const book = res.book
    book.title = req.body.title ?? book.title
    book.author = req.body.author ?? book.author
    book.genre = req.body.genre ?? book.genre
    book.publication_date = req.body.publication_date ?? book.publication_date
    const updatedBook = await book.save()
    res.json(updatedBook)
  } 
  
  catch (error){
    res.status(400).json({ message: error.message })
  }
})

//manejar el patch
router.put('/:id', getBook, async (req, res) => {
  if (!(req.body.title || req.body.author || req.body.genre || req.body.publication_date))
    return res.status(400).json({ message: `Should submit one of the following fields: 'title', 'author', 'genre', 'publication_date'`})

  try {
    const book = res.book
    book.title = req.body.title ?? book.title
    book.author = req.body.author ?? book.author
    book.genre = req.body.genre ?? book.genre
    book.publication_date = req.body.publication_date ?? book.publication_date
    const updatedBook = await book.save()
    res.json(updatedBook)
  } 
  
  catch (error){
    res.status(400).json({ message: error.message })
  }
})

//borrar un libro
router.delete('/:id', getBook, async (req, res) => {
  try{
    const book = res.book
    book.deleteOne({ _id: book._id })
    res.json({ message: 'Book deleted succesfully' })
  }

  catch (error){
    res.status(400).json({ message: error.message })
  }
})