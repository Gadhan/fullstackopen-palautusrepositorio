import {render, screen} from "@testing-library/react"
import AddBlogForm from "./AddBlogForm"
import userEvent from "@testing-library/user-event"


test('<AddBlogForm /> calls the callback function with correct data when a new blog is created'), async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    const { container } = render(<AddBlogForm createBlog={createBlog} />)

    const authorInput = container.querySelector(`input[name="Author"]`)
    const titleInput = container.querySelector(`input[name="Title"]`)
    const UrlInput = container.querySelector(`input[name="URL"]`)
    const saveButton = screen.getByText("Add blog")

    await user.type(authorInput, 'Matti Meikalainen')
    await user.type(titleInput, 'Testiblogi')
    await user.type(UrlInput, 'testi.com')
    await user.click(saveButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].content).toBe({
        input:'Matti Meikalainen',
        title:'Testiblogi',
        url:'testi.com'
    })
}
