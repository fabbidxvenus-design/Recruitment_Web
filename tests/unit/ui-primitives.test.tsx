import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { StatusChip } from '@/components/ui/StatusChip'

describe('shared UI primitives', () => {
  test('AC-03 renders accessible button variants', () => {
    render(<Button variant="primary">Apply now</Button>)

    expect(screen.getByRole('button', { name: 'Apply now' })).toHaveClass('ui-button--primary')
  })

  test('AC-03 associates invalid input with error text', () => {
    render(<Input label="Email" name="email" error="Email is required" />)

    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Email is required')).toHaveAttribute('id')
  })

  test('AC-03 renders semantic feedback primitives', () => {
    render(
      <>
        <Card aria-label="Card title">Content</Card>
        <Badge>Remote</Badge>
        <StatusChip status="published">Published</StatusChip>
        <Alert variant="error">Something failed</Alert>
        <EmptyState title="No jobs" description="Try another keyword" />
      </>
    )

    expect(screen.getByLabelText('Card title')).toBeInTheDocument()
    expect(screen.getByText('Remote')).toBeInTheDocument()
    expect(screen.getByText('Published')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Something failed')
    expect(screen.getByRole('status')).toHaveTextContent('No jobs')
  })
})
