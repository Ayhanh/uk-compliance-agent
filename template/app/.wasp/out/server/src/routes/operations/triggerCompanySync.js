import { createAction } from '../../middleware/operations.js'
import triggerCompanySync from "../../actions/triggerCompanySync.js"

export default createAction(triggerCompanySync)
