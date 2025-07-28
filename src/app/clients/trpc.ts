import {createTRPCProxyClient,httpBatchLink} from '@trpc/client'
import {approuter} from '../../../../mintCraft-backend/src/trpc/routers'
export const trpc=createTRPCProxyClient<typeof approuter>({
    links:[
        httpBatchLink({
            url:'http://localhost:3000/trpc'
        })
    ]
})
