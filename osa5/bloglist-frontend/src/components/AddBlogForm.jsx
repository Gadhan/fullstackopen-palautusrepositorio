import {useState} from 'react'

const AddBlogForm = ({
    createBlog
    /*
    handleSubmit,
    handleAuthorChange,
    handleTitleChange,
    handleUrlChange,
    author,
    title,
    url*/
}) => {
    const [author, setAuthor] = useState('')
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            author: author,
            title: title,
            url: url
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return(
    <form onSubmit={addBlog}>
        <div>
            author
            <input
                type="text"
                value={author}
                name="Author"
                onChange={event => setAuthor(event.target.value)}
            />
        </div>
        <div>
            title
            <input
                type="text"
                value={title}
                name="Title"
                onChange={event => setTitle(event.target.value)}
            />
        </div>
        <div>
            url
            <input
                type="text"
                value={url}
                name="URL"
                onChange={event => setUrl(event.target.value)}
            />
        </div>
        <button type="submit">Add blog</button>
    </form>)
}

export default AddBlogForm
