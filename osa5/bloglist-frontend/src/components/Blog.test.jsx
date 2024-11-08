import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders only author and title', () => {
    const blog = {
        author: 'Matti Meikalainen',
        title: 'Matin testi blogi',
        url: 'MattiTest.com',
        votes: 0
    }

    const { container } = render(<Blog blog={blog} />)

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('Matin testi blogi by Matti Meikalainen')
    const urlText = screen.queryByText('MattiTest.com')
    expect(urlText).toBeNull()
    const  votesText = screen.queryByText('0 votes')
    expect(votesText).toBeNull()
})

test('renders rest of content when show button is pressed', async () => {
    const blog = {
        author: 'Matti Meikalainen',
        title: 'Matin testi blogi',
        url: 'MattiTest.com',
        votes: 0,
        user: {
            name: 'Matti Meikalainen',
            id: 12345
        }
    }

    const loggedUser = {
        id: 12345
    }

    const { container } = render(<Blog blog={blog} loggedUser={loggedUser} />)

    const user = userEvent.setup()
    const showButton = screen.getByText('show')
    await user.click(showButton)

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('Matin testi blogi by Matti Meikalainen')
    expect(div).toHaveTextContent('Matti Meikalainen')
    expect(div).toHaveTextContent('MattiTest.com')
    expect(div).toHaveTextContent('0 votes')
})
