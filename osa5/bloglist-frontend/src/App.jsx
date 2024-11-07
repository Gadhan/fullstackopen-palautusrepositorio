import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import AddBlogForm from "./components/AddBlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [addBlogVisible, setAddBlogVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>{
      blogs.sort((a, b) => b.votes - a.votes)
      setBlogs( blogs )}
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

  const addBlog = (blogObject) => {
    blogService
        .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          showNotification(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        })
        .catch(error => {
          if(error.status === 400)
            showNotification("Session expired, please log out and log in")
        })
    setAddBlogVisible(false)
  }

  const voteBlog = (votedBlog) => {
    votedBlog.votes += 1
    delete votedBlog.user //Vaikka tehtävässä 5.8 sanotaan että operaatio korvaa koko blogin, niin näin ei käy minulla. Vanhentunutta tietoa?
    blogService
        .update(votedBlog)
        .then(returnedBlog => {
          setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
          blog.id === returnedBlog.id ? {...blog, votes: returnedBlog.votes} : blog))
        })
  }

  const deleteBlog = (id) => {
    if(window.confirm("Are you sure you want to delete the blog?")){
      blogService
          .del(id)
          .then(response => {
            console.log(response)
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id))
          })
    }
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

  return (
    <div>
      {(user)
          ?
          <div>
            <h2>blogs</h2>
            <p>{errorMessage}</p>
            <div>{user.name} logged in. <button onClick={logOut}>log out</button></div>
            {(addBlogVisible)?
                <div>
                  <AddBlogForm createBlog={addBlog}/>
                  <button onClick={() => setAddBlogVisible(false)}>Cancel</button>
                </div>
            :
                <button onClick={() => setAddBlogVisible(true)}>Add blog</button>
            }
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} handleVote={voteBlog} loggedUser={user} handleDelete={deleteBlog}/>
            )}
          </div>
          :
          loginForm()
      }
    </div>
  )
}

export default App
