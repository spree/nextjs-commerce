import { useCallback } from 'react'
import type { GraphQLFetcherResult } from '@commerce/api'
import type { MutationHook } from '@commerce/utils/types'
import useSignup, { UseSignup } from '@commerce/auth/use-signup'
import type { SignupHook } from '@commerce/types/signup'
import { ValidationError } from '@commerce/utils/errors'
import type { IAccount } from '@spree/storefront-api-v2-sdk/types/interfaces/Account'
import useCustomer from '../customer/use-customer'
import useCart from '../cart/use-cart'
import login from '../utils/login'
import type { AuthTokenAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Authentication'

export default useSignup as UseSignup<typeof handler>

export const handler: MutationHook<SignupHook> = {
  // Provide fetchOptions for SWR cache key
  fetchOptions: {
    url: 'account',
    query: 'create',
  },
  async fetcher({ input, options, fetch }) {
    console.info(
      'useSignup fetcher called. Configuration: ',
      'input: ',
      input,
      'options: ',
      options
    )

    const { email, password } = input

    if (!email || !password) {
      throw new ValidationError({
        message: 'Email and password need to be provided.',
      })
    }

    // TODO: Replace any with specific type from Spree SDK
    // once it's added to the SDK.
    const createAccountParameters: any = {
      user: {
        email,
        password,
        // The stock NJC interface doesn't have a
        // password confirmation field, so just copy password.
        passwordConfirmation: password,
      },
    }

    // Create the user account.
    await fetch<GraphQLFetcherResult<IAccount>>({
      variables: {
        methodPath: 'account.create',
        arguments: [createAccountParameters],
      },
    })

    const getTokenParameters: AuthTokenAttr = {
      username: email,
      password,
    }

    // Login immediately after the account is created.
    await login(fetch, getTokenParameters, true)

    return null
  },
  useHook: ({ fetch }) => {
    const useWrappedHook: ReturnType<MutationHook<SignupHook>['useHook']> =
      () => {
        console.log('useSignup useHook called.')

        const customer = useCustomer()
        const cart = useCart()

        return useCallback(
          async (input) => {
            const data = await fetch({ input })

            await customer.revalidate()
            await cart.revalidate()

            return data
          },
          [customer, cart]
        )
      }

    return useWrappedHook
  },
}
