import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CurrentTime from './CurrentTime'

describe('CurrentTime', () => {
  it('prints the current time on load', () => {
    vi.setSystemTime(new Date('2026-01-01T09:30:00'))

    render(<CurrentTime />)

    expect(screen.getByText(/current time is/i)).toHaveTextContent(
      '9:30:00 AM',
    )
  })
})
