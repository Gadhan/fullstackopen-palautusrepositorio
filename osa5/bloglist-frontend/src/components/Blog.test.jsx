import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
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
