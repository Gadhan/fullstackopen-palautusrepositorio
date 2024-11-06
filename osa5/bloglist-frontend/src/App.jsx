import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [addBlogVisible, setAddBlogVisible] = useState(false)

  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBloglistUser')
    if(loggedUser){
      const user = JSON.parse(loggedUser)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
          'loggedBloglistUser', JSON.stringify((user))
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification('wrong credentials')
    }
  }

  const logOut = (event) => {
    event.preventDefault()
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBloglistUser')
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const body = {
      author: author,
      title: title,
      url: url
    }
    const response = await blogService.create(body)
    setBlogs(blogs.concat(response))
    setTitle('')
    setAuthor('')
    setUrl('')
    setAddBlogVisible(false)
    showNotification(`A new blog ${body.title} by ${body.author} added`)
  }

  const showNotification = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const loginForm = () => (
      <div>
        <h2>Login</h2>
        {errorMessage}
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
  )

  const addBlogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        author
        <input
        type="text"
        value={author}
        name="Author"
        onChange={({target}) => setAuthor(target.value)}
        />
      </div>
      <div>
        title
        <input
            type="text"
            value={title}
            name="Title"
            onChange={({target}) => setTitle(target.value)}
        />
      </div>
      <div>
        url
        <input
            type="text"
            value={url}
            name="URL"
            onChange={({target}) => setUrl(target.value)}
        />
      </div>
      <button type="submit">Add blog</button>
      <button onClick={() => setAddBlogVisible(false)}>Cancel</button>
    </form>
  )

  return (
    <div>
      {(user)
          ?
          <div>
            <h2>blogs</h2>
            <p>{errorMessage}</p>
            <div>{user.name} logged in. <button onClick={logOut}>log out</button></div>
            {(addBlogVisible)?
                addBlogForm()
            :
                <button onClick={() => setAddBlogVisible(true)}>Add blog</button>
            }
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
          </div>
          :
          loginForm()
      }
    </div>
  )
}

export default App
