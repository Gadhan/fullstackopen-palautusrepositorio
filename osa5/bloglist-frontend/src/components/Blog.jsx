import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleVote, loggedUser, handleDelete }) => {
    Blog.propTypes = {
        blog: PropTypes.object.isRequired,
        handleVote: PropTypes.func.isRequired,
        loggedUser: PropTypes.object.isRequired,
        handleDelete: PropTypes.func.isRequired
    }

  const [show, setShow] = useState(false)

  return(
      <div className='blog' style={{border: '1px solid'}}>
        {blog.title} by {blog.author} {show?
          <div>
            <button onClick={() => setShow(false)}>hide</button>
            <p style={{margin: '1px'}}>{blog.url}</p>
            {blog.votes} votes <button onClick={() => handleVote(blog)}>like</button>
              <p style={{margin: '1px'}}>{blog.user.name}</p>
              {(blog.user.id === loggedUser.id) && <button onClick={() => handleDelete(blog.id)}>remove</button> /*backend muokattu niin että antaa myös id:n */}
          </div>
          :<button onClick={() => setShow(true)}>show</button>}
      </div>
  )
}

export default Blog
