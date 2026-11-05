
import type { ParamsDictionary as ExpressParams, Query as ExpressQuery } from 'express-serve-static-core'

import type {
  _Company,
  _CompanySubscription,
  _ProcessedWebhookEvent,
  _User,
  AuthenticatedApi,
} from '../_types'


// PUBLIC API
export type DodoWebhook<
  P extends ExpressParams = ExpressParams,
  ResBody = any,
  ReqBody = any,
  ReqQuery extends ExpressQuery = ExpressQuery,
  Locals extends Record<string, any> = Record<string, any>
> =
  AuthenticatedApi<
    [
      _Company,
      _CompanySubscription,
      _ProcessedWebhookEvent,
    ],
    P,
    ResBody,
    ReqBody,
    ReqQuery,
    Locals
  >
export type PaymentsWebhook<
  P extends ExpressParams = ExpressParams,
  ResBody = any,
  ReqBody = any,
  ReqQuery extends ExpressQuery = ExpressQuery,
  Locals extends Record<string, any> = Record<string, any>
> =
  AuthenticatedApi<
    [
      _User,
      _ProcessedWebhookEvent,
    ],
    P,
    ResBody,
    ReqBody,
    ReqQuery,
    Locals
  >
