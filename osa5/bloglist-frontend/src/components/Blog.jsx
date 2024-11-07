import { useState } from 'react'

const Blog = ({ blog }) => {
  const [show, setShow] = useState(false)
  return(
      <div style={{border: '1px solid'}}>
        {blog.title} by {blog.author} {show?
          <div>
            <button onClick={() => setShow(false)}>hide</button>
            <p style={{margin: '1px'}}>{blog.url}</p>
            {blog.votes} votes <button>like</button>
          </div>
          :<button onClick={() => setShow(true)}>show</button>}
      </div>
  )
}

export default Blog
