import { getDateStr } from '../../lib/blog-helpers'

describe('getDateStr', () => {
  it('returns str when date has time', async () => {
    const got = getDateStr('2022-12-30T00:09:00.000+09:00')
    expect(got).toEqual('2022-12-30')
  })

  it('returns str when date has no time', async () => {
    const got = getDateStr('2022-12-30')
    expect(got).toEqual('2022-12-30')
  })

  it('returns local time str considering timezone', async () => {
    const got = getDateStr('2022-12-30T00:00:00.000+09:00')
    expect(got).toEqual('2022-12-30')
  })
})
