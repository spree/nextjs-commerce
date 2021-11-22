import { useCallback } from 'react'
import type { MutationHook } from '@commerce/utils/types'
import useRemoveItem from '@commerce/wishlist/use-remove-item'
import type { UseRemoveItem } from '@commerce/wishlist/use-remove-item'
import useWishlist from './use-wishlist'
import type { ExplicitWishlistRemoveItemHook } from '../types'
import isLoggedIn from '@framework/utils/tokens/is-logged-in'
import ensureIToken from '@framework/utils/tokens/ensure-itoken'
import type { IToken } from '@spree/storefront-api-v2-sdk/types/interfaces/Token'
import type { GraphQLFetcherResult } from '@commerce/api'
import type { WishedItem } from '@spree/storefront-api-v2-sdk/types/interfaces/WishedItem'

export default useRemoveItem as UseRemoveItem<typeof handler>

export const handler: MutationHook<ExplicitWishlistRemoveItemHook> = {
  fetchOptions: {
    url: 'wishlists',
    query: 'removeWishedItem',
  },
  async fetcher({ input, options, fetch }) {
    console.info(
      'useRemoveItem (wishlist) fetcher called. Configuration: ',
      'input: ',
      input,
      'options: ',
      options
    )

    const { itemId, wishlistToken } = input

    if (!isLoggedIn() || !wishlistToken) {
      return null
    }

    let token: IToken | undefined = ensureIToken()

    await fetch<GraphQLFetcherResult<WishedItem>>({
      variables: {
        methodPath: 'wishlists.removeWishedItem',
        arguments: [token, wishlistToken, itemId],
      },
    })

    return null
  },
  useHook: ({ fetch }) => {
    const useWrappedHook: ReturnType<
      MutationHook<ExplicitWishlistRemoveItemHook>['useHook']
    > = () => {
      const wishlist = useWishlist()

      return useCallback(
        async (input) => {
          if (!wishlist.data) {
            return null
          }

          const data = await fetch({
            input: {
              itemId: `${input.id}`,
              wishlistToken: wishlist.data.token,
            },
          })

          await wishlist.revalidate()

          return data
        },
        [wishlist]
      )
    }

    return useWrappedHook
  },
}
