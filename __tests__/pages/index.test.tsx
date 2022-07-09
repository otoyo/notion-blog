import { render, waitFor } from '@testing-library/react'
import RenderPage from '../../src/pages/index'

import { getAllBlocksByBlockId } from '../../src/lib/notion/client'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      asPath: '/',
      pathname: '/',
    }
  },
}))

describe('RenderPage', () => {
  it('renders the page unchanged', async () => {
    const blocks = await getAllBlocksByBlockId("")
    const { container } = render(<RenderPage blocks={blocks} />)
    await waitFor(() => {
      expect(container).toMatchSnapshot()
    })
  })
})
