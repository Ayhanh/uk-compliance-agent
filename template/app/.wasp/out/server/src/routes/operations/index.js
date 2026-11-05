import express from 'express'

import auth from 'wasp/server/core/auth'

import updateIsUserAdminById from "./updateIsUserAdminById.js"
import addCompany from "./addCompany.js"
import triggerCompanySync from "./triggerCompanySync.js"
import createCompanyCheckout from "./createCompanyCheckout.js"
import generateGptResponse from "./generateGptResponse.js"
import createTask from "./createTask.js"
import updateTask from "./updateTask.js"
import deleteTask from "./deleteTask.js"
import generateCheckoutSession from "./generateCheckoutSession.js"
import addFileToDb from "./addFileToDb.js"
import createFileUploadUrl from "./createFileUploadUrl.js"
import deleteFile from "./deleteFile.js"
import getPaginatedUsers from "./getPaginatedUsers.js"
import getMyCompanies from "./getMyCompanies.js"
import getCompanyDetail from "./getCompanyDetail.js"
import getGptResponses from "./getGptResponses.js"
import getAllTasksByUser from "./getAllTasksByUser.js"
import getCustomerPortalUrl from "./getCustomerPortalUrl.js"
import getAllFilesByUser from "./getAllFilesByUser.js"
import getDownloadFileSignedURL from "./getDownloadFileSignedURL.js"
import getDailyStats from "./getDailyStats.js"

const router = express.Router()

router.post('/update-is-user-admin-by-id', auth, updateIsUserAdminById)
router.post('/add-company', auth, addCompany)
router.post('/trigger-company-sync', auth, triggerCompanySync)
router.post('/create-company-checkout', auth, createCompanyCheckout)
router.post('/generate-gpt-response', auth, generateGptResponse)
router.post('/create-task', auth, createTask)
router.post('/update-task', auth, updateTask)
router.post('/delete-task', auth, deleteTask)
router.post('/generate-checkout-session', auth, generateCheckoutSession)
router.post('/add-file-to-db', auth, addFileToDb)
router.post('/create-file-upload-url', auth, createFileUploadUrl)
router.post('/delete-file', auth, deleteFile)
router.post('/get-paginated-users', auth, getPaginatedUsers)
router.post('/get-my-companies', auth, getMyCompanies)
router.post('/get-company-detail', auth, getCompanyDetail)
router.post('/get-gpt-responses', auth, getGptResponses)
router.post('/get-all-tasks-by-user', auth, getAllTasksByUser)
router.post('/get-customer-portal-url', auth, getCustomerPortalUrl)
router.post('/get-all-files-by-user', auth, getAllFilesByUser)
router.post('/get-download-file-signed-url', auth, getDownloadFileSignedURL)
router.post('/get-daily-stats', auth, getDailyStats)

export default router
