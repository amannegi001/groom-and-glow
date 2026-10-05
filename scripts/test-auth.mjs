import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Helper to load .env.local if not already in process.env
function loadEnv() {
  const envPath = path.join(rootDir, '.env.local')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    content.split('\n').forEach((line) => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=')
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim()
          let val = trimmed.slice(eqIdx + 1).trim()
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1)
          }
          if (!process.env[key]) {
            process.env[key] = val
          }
        }
      }
    })
  }
}

loadEnv()

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3005'
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/groom_glow'
const VALID_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@groomandglow.in'
const VALID_PASSWORD = process.env.AUTH_TEST_PASSWORD

async function runTests() {
  console.log('=== Starting Real Admin Authentication Verification Tests ===\n')

  if (!VALID_PASSWORD) {
    console.error('[Error] AUTH_TEST_PASSWORD environment variable must be set to run authenticated tests.')
    process.exit(1)
  }

  let passedCount = 0
  let failedCount = 0

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`)
      passedCount++
    } else {
      console.error(`[FAIL] ${message}`)
      failedCount++
    }
  }

  // Test C: Login with invalid email
  console.log('--- Test C: Login with invalid email ---')
  const resC = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nonexistent@groomandglow.in', password: 'SomePassword123!' }),
  })
  const dataC = await resC.json()
  assert(resC.status === 401, `Status is 401 (got ${resC.status})`)
  assert(dataC.error === 'Invalid email or password.', `Generic error returned: "${dataC.error}"`)

  // Test B: Login with invalid password
  console.log('\n--- Test B: Login with invalid password ---')
  const resB = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: VALID_EMAIL, password: 'WrongPassword123!' }),
  })
  const dataB = await resB.json()
  assert(resB.status === 401, `Status is 401 (got ${resB.status})`)
  assert(dataB.error === 'Invalid email or password.', `Generic error returned: "${dataB.error}"`)

  // Test F: Appointment list API cannot be accessed while logged out
  console.log('\n--- Test F: Appointment list API while logged out ---')
  const resF = await fetch(`${BASE_URL}/api/appointments`)
  const dataF = await resF.json()
  assert(resF.status === 401, `GET /api/appointments rejected with 401 (got ${resF.status})`)
  assert(dataF.error?.includes('Unauthorized'), `Error message mentions Unauthorized: "${dataF.error}"`)

  // Test G: Appointment confirm/reject API cannot be called while logged out
  console.log('\n--- Test G: Appointment update API while logged out ---')
  const resG = await fetch(`${BASE_URL}/api/appointments/dummy-id`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'confirmed' }),
  })
  const dataG = await resG.json()
  assert(resG.status === 401, `PATCH /api/appointments/:id rejected with 401 (got ${resG.status})`)

  // Test D: Visiting /admin while logged out
  console.log('\n--- Test D: Visiting /admin while logged out ---')
  const resD = await fetch(`${BASE_URL}/admin`)
  const htmlD = await resD.text()
  assert(resD.status === 200, `Visiting /admin returns 200 (got ${resD.status})`)
  assert(htmlD.includes('Groom &amp; Glow Admin') || htmlD.includes('Groom & Glow Admin'), 'Login screen rendered')
  assert(!htmlD.includes('Dashboard'), 'No dashboard data exposed in unauthenticated HTML')

  // Test A: Login with valid admin credentials
  console.log('\n--- Test A: Login with valid admin credentials ---')
  const resA = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: VALID_EMAIL, password: VALID_PASSWORD }),
  })
  const dataA = await resA.json()
  const setCookieHeader = resA.headers.get('set-cookie') || ''
  assert(resA.status === 200, `Login returns 200 (got ${resA.status})`)
  assert(dataA.success === true, 'Response indicates success')
  assert(dataA.admin?.email === VALID_EMAIL, `Admin email matches (${dataA.admin?.email})`)
  assert(dataA.admin?.role === 'admin', `Admin role is admin (${dataA.admin?.role})`)
  assert(!dataA.admin?.passwordHash, 'Password hash is NOT exposed in response')
  assert(setCookieHeader.includes('admin_token='), 'HTTP-only admin_token cookie was set')
  assert(setCookieHeader.toLowerCase().includes('httponly'), 'Cookie has HttpOnly flag')
  assert(setCookieHeader.toLowerCase().includes('samesite=lax'), 'Cookie has SameSite=Lax')

  // Extract auth cookie for authenticated requests
  const cookieMatch = setCookieHeader.match(/admin_token=[^;]+/)
  const authCookie = cookieMatch ? cookieMatch[0] : ''

  // Test E: Authenticated requests
  console.log('\n--- Test E: Authenticated requests with valid cookie ---')
  const resMe = await fetch(`${BASE_URL}/api/admin/me`, {
    headers: { Cookie: authCookie },
  })
  const dataMe = await resMe.json()
  assert(resMe.status === 200, `GET /api/admin/me returns 200 (got ${resMe.status})`)
  assert(dataMe.authenticated === true, 'Admin is authenticated')

  const resList = await fetch(`${BASE_URL}/api/appointments`, {
    headers: { Cookie: authCookie },
  })
  const dataList = await resList.json()
  assert(resList.status === 200, `GET /api/appointments returns 200 for authenticated admin`)
  assert(Array.isArray(dataList.appointments), `Appointments array returned (${dataList.appointments.length} found)`)

  // Test I: Customer can still submit an appointment without logging in
  console.log('\n--- Test I: Customer booking without logging in ---')
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  const testCustomerBooking = {
    serviceId: 'anti-tan',
    appointmentDate: '2026-10-20',
    appointmentTime: `02:${randomSuffix % 60} PM`,
    customerName: 'Aarav Sharma',
    customerPhone: '9876543210',
    customerNote: 'Customer booking test for auth verification',
  }
  const resBooking = await fetch(`${BASE_URL}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testCustomerBooking),
  })
  const dataBooking = await resBooking.json()
  assert(resBooking.status === 201, `Customer appointment creation returns 201 (got ${resBooking.status})`)
  assert(dataBooking.success === true, 'Customer booking succeeded')
  const createdApptId = dataBooking.appointment?.appointmentId
  assert(!!createdApptId, `Appointment created with ID: ${createdApptId}`)

  // Test J: Verify appointment saved to groom_glow.appointments in MongoDB
  console.log('\n--- Test J: Verify appointment saved to groom_glow.appointments in MongoDB ---')
  const conn = await mongoose.connect(MONGODB_URI, { dbName: 'groom_glow' })
  const apptInDb = await conn.connection.db.collection('appointments').findOne({ appointmentId: createdApptId })
  assert(!!apptInDb, `Found appointment ${createdApptId} in groom_glow.appointments`)
  assert(apptInDb?.customerName === 'Aarav Sharma', `Customer name in DB is Aarav Sharma`)
  assert(apptInDb?.status === 'pending', `Appointment initial status is pending`)

  // Test Confirm/Reject with authenticated session
  console.log('\n--- Testing PATCH confirm on newly created appointment ---')
  const resConfirm = await fetch(`${BASE_URL}/api/appointments/${createdApptId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: authCookie,
    },
    body: JSON.stringify({ status: 'confirmed', adminNote: 'Confirmed by test suite' }),
  })
  const dataConfirm = await resConfirm.json()
  assert(resConfirm.status === 200, `PATCH /api/appointments/:id returns 200 with auth cookie`)
  assert(dataConfirm.appointment?.status === 'confirmed', 'Appointment status updated to confirmed')

  // Test H: Logout
  console.log('\n--- Test H: Logout and session invalidation ---')
  const resLogout = await fetch(`${BASE_URL}/api/admin/logout`, {
    method: 'POST',
    headers: { Cookie: authCookie },
  })
  const logoutCookie = resLogout.headers.get('set-cookie') || ''
  assert(resLogout.status === 200, `Logout returns 200`)
  assert(logoutCookie.includes('admin_token=;') || logoutCookie.includes('Max-Age=0'), 'Auth cookie expired on logout')

  // Calling appointments API with cleared cookie
  const resAfterLogout = await fetch(`${BASE_URL}/api/appointments`, {
    headers: { Cookie: 'admin_token=' },
  })
  assert(resAfterLogout.status === 401, `GET /api/appointments returns 401 after logout`)

  await mongoose.disconnect()

  console.log(`\n==========================================`)
  console.log(`Tests finished: ${passedCount} passed, ${failedCount} failed.`)
  if (failedCount === 0) {
    console.log('ALL VERIFICATION CRITERIA MET!')
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err)
  process.exit(1)
})
