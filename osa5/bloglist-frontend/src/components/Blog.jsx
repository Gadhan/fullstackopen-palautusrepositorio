import { useState } from 'react'

const Blog = ({ blog, handleVote, loggedUser, handleDelete }) => {
  const [show, setShow] = useState(false)

  return(
      <div style={{border: '1px solid'}}>
        {blog.title} by {blog.author} {show?
          <div>
            <button onClick={() => setShow(false)}>hide</button>
            <p style={{margin: '1px'}}>{blog.url}</p>
            {blog.votes} votes <button onClick={() => handleVote(blog)}>like</button>
              {(blog.user.id === loggedUser.id) && <button onClick={() => handleDelete(blog.id)}>remove</button> /*backend muokattu niin että antaa myös id:n */}
          </div>
          :<button onClick={() => setShow(true)}>show</button>}
      </div>
  )
}

export default Blog
