import fetch from 'node-fetch'
import { getError } from './rpc'
import { NextApiResponse } from 'next'
import { NOTION_TOKEN, API_ENDPOINT } from './server-constants'

export default async function getNotionAsset(
  res: NextApiResponse,
  assetUrl: string,
  blockId: string
): Promise<{
  signedUrls: string[]
}> {
  const requestURL = `${API_ENDPOINT}/getSignedFileUrls`
  const assetRes = await fetch(requestURL, {
    method: 'POST',
    headers: {
      cookie: `token_v2=${NOTION_TOKEN}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      urls: [
        {
          url: assetUrl,
          permissionRecord: {
            table: 'block',
            id: blockId,
          },
        },
      ],
    }),
  })

  if (assetRes.ok) {
    return assetRes.json()
  } else {
    console.log('bad request', assetRes.status)
    res.json({ status: 'error', message: 'failed to load Notion asset' })
    throw new Error(await getError(assetRes))
  }
}
